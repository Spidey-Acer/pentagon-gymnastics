import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StripeService } from '../services/stripeService';
import { AuthenticatedRequest } from '../types/express';

const prisma = new PrismaClient();

export class GearController {
  // Get all available gear items
  static async getGearItems(req: AuthenticatedRequest, res: Response) {
    try {
      const gearItems = await prisma.gearItem.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      res.json({ success: true, gearItems });
    } catch (error) {
      console.error('Error fetching gear items:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch gear items' });
    }
  }

  // Create gear order
  static async createGearOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { items, shippingAddress, customerName } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Items are required' });
      }

      // Validate and calculate total
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        const gearItem = await prisma.gearItem.findUnique({
          where: { id: item.gearItemId }
        });

        if (!gearItem) {
          return res.status(400).json({ 
            success: false, 
            message: `Gear item with ID ${item.gearItemId} not found` 
          });
        }

        const itemTotal = gearItem.price * item.quantity;
        totalAmount += itemTotal;

        validatedItems.push({
          gearItemId: item.gearItemId,
          size: item.size,
          quantity: item.quantity,
          unitPrice: gearItem.price,
          customText: customerName || `${req.user?.email}` // Default to email if no custom name
        });
      }

      // Get user details for Stripe
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await StripeService.createCustomer(
          user.email,
          `${user.forename} ${user.surname}`
        );
        stripeCustomerId = customer.id;

        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId }
        });
      }

      // Create payment intent
      const paymentIntent = await StripeService.createPaymentIntent(
        totalAmount,
        stripeCustomerId,
        `Pentagon Gymnastics Gear Order - ${validatedItems.length} items`
      );

      // Create gear order
      const gearOrder = await prisma.gearOrder.create({
        data: {
          userId,
          totalAmount,
          status: 'pending',
          customerName: customerName || `${user.forename} ${user.surname}`,
          shippingAddress,
          stripePaymentIntentId: paymentIntent.id,
          items: {
            create: validatedItems
          }
        },
        include: {
          items: {
            include: {
              gearItem: true
            }
          }
        }
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          gearOrderId: gearOrder.id,
          stripePaymentIntentId: paymentIntent.id,
          amount: totalAmount,
          status: 'pending',
          paymentType: 'gear',
          description: `Gear order #${gearOrder.id}`
        }
      });

      res.json({
        success: true,
        gearOrder,
        clientSecret: paymentIntent.client_secret,
        totalAmount
      });

    } catch (error) {
      console.error('Error creating gear order:', error);
      res.status(500).json({ success: false, message: 'Failed to create gear order' });
    }
  }

  // Get user's gear orders
  static async getUserOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const orders = await prisma.gearOrder.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              gearItem: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ success: true, orders });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
  }

  // Get order by ID
  static async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { orderId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const order = await prisma.gearOrder.findFirst({
        where: { 
          id: parseInt(orderId),
          userId // Ensure user can only access their own orders
        },
        include: {
          items: {
            include: {
              gearItem: true
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      res.json({ success: true, order });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch order' });
    }
  }
}
