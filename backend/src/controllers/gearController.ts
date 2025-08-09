import { Response } from 'express';
import { prisma } from "../lib/prisma";
import { SimulatedPaymentService } from '../services/simulatedPaymentService';
import { AuthenticatedRequest } from '../types/express';

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

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Create gear order
      const gearOrder = await prisma.gearOrder.create({
        data: {
          userId,
          totalAmount,
          status: 'pending',
          customerName: customerName || `${user.forename} ${user.surname}`,
          shippingAddress,
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

      res.json({
        success: true,
        gearOrder,
        totalAmount,
        message: 'Gear order created successfully. Proceed to payment.'
      });

    } catch (error) {
      console.error('Error creating gear order:', error);
      res.status(500).json({ success: false, message: 'Failed to create gear order' });
    }
  }

  // Process gear order payment
  static async processGearOrderPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { orderId, cardId } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      if (!orderId || !cardId) {
        return res.status(400).json({ success: false, message: 'Order ID and card ID are required' });
      }

      // Get the order
      const gearOrder = await prisma.gearOrder.findFirst({
        where: { 
          id: parseInt(orderId),
          userId,
          status: 'pending'
        },
        include: {
          items: {
            include: {
              gearItem: true
            }
          }
        }
      });

      if (!gearOrder) {
        return res.status(404).json({ success: false, message: 'Order not found or already processed' });
      }

      // Process payment using simulated payment service
      const paymentResult = await SimulatedPaymentService.processPayment(
        parseInt(cardId),
        gearOrder.totalAmount,
        'gear',
        `Gear order #${gearOrder.id}`,
        undefined,
        gearOrder.id
      );

      if (paymentResult.success) {
        // Update gear order status
        await prisma.gearOrder.update({
          where: { id: gearOrder.id },
          data: { status: 'paid' }
        });

        res.json({
          success: true,
          message: 'Payment processed successfully',
          gearOrder: { ...gearOrder, status: 'paid' },
          paymentResult
        });
      } else {
        res.status(400).json({
          success: false,
          message: paymentResult.error || 'Payment failed',
          paymentResult
        });
      }

    } catch (error) {
      console.error('Error processing gear order payment:', error);
      res.status(500).json({ success: false, message: 'Failed to process payment' });
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
