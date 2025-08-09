import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { TransactionService } from '../services/transactionService';
import { AuthenticatedRequest } from '../types/express';

const prisma = new PrismaClient();

export class SubscriptionController {
  // Get all available packages
  static async getPackages(req: AuthenticatedRequest, res: Response) {
    try {
      const packages = await prisma.package.findMany({
        where: { isActive: true },
        include: {
          packageClasses: {
            include: {
              class: true
            }
          }
        },
        orderBy: { priority: 'desc' }
      });

      res.json({ success: true, packages });
    } catch (error) {
      console.error('Error fetching packages:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch packages' });
    }
  }

  // Get user's current subscription
  static async getUserSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: {
          package: {
            include: {
              packageClasses: {
                include: {
                  class: true
                }
              }
            }
          }
        }
      });

      // Always return a response, even if subscription is null
      res.json({ 
        success: true, 
        subscription: subscription || null,
        hasActiveSubscription: subscription?.status === 'active' || false
      });
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch subscription',
        subscription: null,
        hasActiveSubscription: false 
      });
    }
  }

  // Create new subscription
  static async createSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { packageId, proteinSupplement = false } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      if (!packageId) {
        return res.status(400).json({ success: false, message: 'Package ID is required' });
      }

      // Validate package exists and is active
      const package_ = await prisma.package.findFirst({
        where: { 
          id: packageId,
          isActive: true
        },
        include: {
          packageClasses: {
            include: {
              class: true
            }
          }
        }
      });

      if (!package_) {
        return res
          .status(404)
          .json({ success: false, message: "Package not found or inactive" });
      }

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Check if user already has active subscription
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (existingSubscription && existingSubscription.status === "active") {
        return res.status(400).json({
          success: false,
          message:
            "User already has an active subscription. Use switch package instead.",
          existingSubscription,
        });
      }

      // Calculate total amount
      let totalAmount = package_.price;
      if (proteinSupplement) {
        totalAmount += 50; // £50 for protein supplement
      }

      // Create subscription record (payment will be processed separately)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30); // 30-day period

      let subscription;

      if (existingSubscription && existingSubscription.status !== "active") {
        // Update existing non-active subscription
        subscription = await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            packageId,
            status: "pending",
            startDate,
            endDate,
            proteinSupplement,
            proteinSupplementPrice: proteinSupplement ? 50 : 0,
            updatedAt: new Date(),
          },
          include: {
            package: {
              include: {
                packageClasses: {
                  include: {
                    class: true,
                  },
                },
              },
            },
          },
        });
      } else {
        // Create new subscription
        subscription = await prisma.subscription.create({
          data: {
            userId,
            packageId,
            status: "pending", // Will be updated when payment is processed
            startDate,
            endDate,
            proteinSupplement,
            proteinSupplementPrice: proteinSupplement ? 50 : 0,
          },
          include: {
            package: {
              include: {
                packageClasses: {
                  include: {
                    class: true,
                  },
                },
              },
            },
          },
        });
      }

      // Log transaction
      await TransactionService.logTransaction({
        userId,
        type: 'subscription',
        amount: totalAmount,
        status: 'pending',
        description: `New subscription: ${package_.name} Package${proteinSupplement ? ' + Protein Supplements' : ''}`,
        relatedId: subscription.id,
        relatedType: 'subscription'
      });

      // Log activity
      await TransactionService.logActivity({
        userId,
        action: 'subscription_created',
        description: `Created subscription for ${package_.name} package`,
        metadata: { packageId, proteinSupplement, amount: totalAmount }
      });

      res.json({
        success: true,
        subscription,
        amount: totalAmount,
        message: 'Subscription created successfully. Proceed to payment.'
      });

    } catch (error) {
      console.error('Error creating subscription:', error);
      
      // Provide more specific error messaging
      if (error instanceof Error) {
        if (error.message.includes('Unique constraint')) {
          return res.status(409).json({ 
            success: false, 
            message: 'A subscription already exists for this user. Please refresh and try again.',
            code: 'DUPLICATE_SUBSCRIPTION'
          });
        }
        if (error.message.includes('Foreign key constraint')) {
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid package or user reference.',
            code: 'INVALID_REFERENCE'
          });
        }
      }

      res.status(500).json({ 
        success: false, 
        message: 'Failed to create subscription. Please try again.',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  // Switch package (upgrade/downgrade)
  static async switchPackage(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { packageId, proteinSupplement } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      // Get current subscription
      const currentSubscription = await prisma.subscription.findUnique({
        where: { userId },
        include: { package: true }
      });

      if (!currentSubscription) {
        return res.status(404).json({ success: false, message: 'No active subscription found' });
      }

      // Get new package details
      const newPackage = await prisma.package.findUnique({
        where: { id: packageId }
      });

      if (!newPackage) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }

      // Calculate price difference for proration
      const currentPrice = currentSubscription.package.price + 
        (currentSubscription.proteinSupplement ? 50 : 0);
      const newPrice = newPackage.price + (proteinSupplement ? 50 : 0);
      const priceDifference = newPrice - currentPrice;

      // If there's a price difference, require payment processing
      if (priceDifference > 0) {
        // Update subscription but keep status as pending until payment
        const updatedSubscription = await prisma.subscription.update({
          where: { id: currentSubscription.id },
          data: {
            packageId,
            proteinSupplement: proteinSupplement ?? currentSubscription.proteinSupplement,
            proteinSupplementPrice: proteinSupplement ? 50 : 0,
            status: 'pending' // Will be activated after payment
          },
          include: { package: true }
        });

        return res.json({
          success: true,
          subscription: updatedSubscription,
          upgradeAmount: priceDifference,
          requiresPayment: true,
          message: 'Package updated. Additional payment required for upgrade.'
        });
      } else {
        // No additional payment needed (downgrade or same price)
        const updatedSubscription = await prisma.subscription.update({
          where: { id: currentSubscription.id },
          data: {
            packageId,
            proteinSupplement: proteinSupplement ?? currentSubscription.proteinSupplement,
            proteinSupplementPrice: proteinSupplement ? 50 : 0
          },
          include: { package: true }
        });

        res.json({
          success: true,
          subscription: updatedSubscription,
          refundAmount: Math.abs(priceDifference)
        });
      }

    } catch (error) {
      console.error('Error switching package:', error);
      res.status(500).json({ success: false, message: 'Failed to switch package' });
    }
  }

  // Cancel subscription
  static async cancelSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { userId }
      });

      if (!subscription) {
        return res.status(404).json({ success: false, message: 'No subscription found' });
      }

      // Update subscription status
      const updatedSubscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'cancelled',
          isAutoRenew: false
        }
      });

      res.json({ success: true, subscription: updatedSubscription });

    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({ success: false, message: 'Failed to cancel subscription' });
    }
  }
}
