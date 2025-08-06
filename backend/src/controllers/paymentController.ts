import { Request, Response } from 'express';
import { SimulatedPaymentService, SimulatedCardData } from '../services/simulatedPaymentService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PaymentController {
  // Initialize test cards (for development)
  static async initializeTestCards(req: Request, res: Response) {
    try {
      await SimulatedPaymentService.initializeTestCards();
      res.json({ 
        success: true, 
        message: 'Test cards initialized successfully' 
      });
    } catch (error) {
      console.error('Error initializing test cards:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to initialize test cards' 
      });
    }
  }

  // Get available test cards (for development/testing)
  static async getTestCards(req: Request, res: Response) {
    try {
      const cards = await SimulatedPaymentService.getTestCards();
      // Mask card numbers for security
      const maskedCards = cards.map(card => ({
        ...card,
        cardNumber: `****-****-****-${card.cardNumber.slice(-4)}`,
        cvv: '***' // Never return CVV
      }));
      
      res.json({ success: true, cards: maskedCards });
    } catch (error) {
      console.error('Error fetching test cards:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch test cards' 
      });
    }
  }

  // Process subscription payment
  static async processSubscriptionPayment(req: Request, res: Response) {
    try {
      const { cardId, subscriptionId, amount, description } = req.body;

      if (!cardId || !subscriptionId || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: cardId, subscriptionId, amount'
        });
      }

      // Simulate processing delay
      const result = await SimulatedPaymentService.processPayment(
        cardId,
        amount,
        'subscription',
        description || 'Subscription payment',
        subscriptionId
      );

      // Update subscription status based on payment result
      if (result.success) {
        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: { 
            status: 'active',
            updatedAt: new Date()
          }
        });
      }

      // Simulate realistic processing time
      setTimeout(() => {
        res.json({
          success: result.success,
          paymentId: result.paymentId,
          error: result.error,
          message: result.success 
            ? 'Payment processed successfully' 
            : `Payment failed: ${result.error}`
        });
      }, result.simulatedDelay * 1000);

    } catch (error) {
      console.error('Error processing subscription payment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Payment processing failed' 
      });
    }
  }

  // Process gear order payment
  static async processGearPayment(req: Request, res: Response) {
    try {
      const { cardId, gearOrderId, amount, description } = req.body;

      if (!cardId || !gearOrderId || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: cardId, gearOrderId, amount'
        });
      }

      const result = await SimulatedPaymentService.processPayment(
        cardId,
        amount,
        'gear',
        description || 'Equipment purchase',
        undefined,
        gearOrderId
      );

      // Update gear order status based on payment result
      if (result.success) {
        await prisma.gearOrder.update({
          where: { id: gearOrderId },
          data: { 
            status: 'paid',
            updatedAt: new Date()
          }
        });
      }

      // Simulate realistic processing time
      setTimeout(() => {
        res.json({
          success: result.success,
          paymentId: result.paymentId,
          error: result.error,
          message: result.success 
            ? 'Payment processed successfully' 
            : `Payment failed: ${result.error}`
        });
      }, result.simulatedDelay * 1000);

    } catch (error) {
      console.error('Error processing gear payment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Payment processing failed' 
      });
    }
  }

  // Validate card details
  static async validateCard(req: Request, res: Response) {
    try {
      const cardData: SimulatedCardData = req.body;
      
      const validation = SimulatedPaymentService.validateCard(cardData);
      
      res.json({
        success: validation.valid,
        error: validation.error
      });
    } catch (error) {
      console.error('Error validating card:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Card validation failed' 
      });
    }
  }

  // Get payment details
  static async getPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      
      const payment = await SimulatedPaymentService.getPayment(parseInt(paymentId));
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found'
        });
      }

      // Mask sensitive card details
      const maskedPayment = {
        ...payment,
        card: {
          ...payment.card,
          cardNumber: `****-****-****-${payment.card.cardNumber.slice(-4)}`
        }
      };

      res.json({ success: true, payment: maskedPayment });
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch payment details' 
      });
    }
  }

  // Get payments for an order
  static async getOrderPayments(req: Request, res: Response) {
    try {
      const { subscriptionId, gearOrderId } = req.query;
      
      const payments = await SimulatedPaymentService.getPaymentsForOrder(
        subscriptionId ? parseInt(subscriptionId as string) : undefined,
        gearOrderId ? parseInt(gearOrderId as string) : undefined
      );

      // Mask sensitive card details
      const maskedPayments = payments.map(payment => ({
        ...payment,
        card: {
          ...payment.card,
          cardNumber: `****-****-****-${payment.card.cardNumber.slice(-4)}`
        }
      }));

      res.json({ success: true, payments: maskedPayments });
    } catch (error) {
      console.error('Error fetching order payments:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch payment history' 
      });
    }
  }

  // Process refund
  static async processRefund(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;
      
      const result = await SimulatedPaymentService.refundPayment(
        parseInt(paymentId),
        amount
      );

      // Simulate realistic processing time
      setTimeout(() => {
        res.json({
          success: result.success,
          refundId: result.paymentId,
          error: result.error,
          message: result.success 
            ? 'Refund processed successfully' 
            : `Refund failed: ${result.error}`
        });
      }, result.simulatedDelay * 1000);

    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Refund processing failed' 
      });
    }
  }

  // Get payment statistics (for admin dashboard)
  static async getPaymentStatistics(req: Request, res: Response) {
    try {
      const stats = await prisma.simulatedPayment.groupBy({
        by: ['status', 'paymentType'],
        _count: {
          id: true
        },
        _sum: {
          amount: true
        }
      });

      const totalTransactions = await prisma.simulatedPayment.count();
      const totalRevenue = await prisma.simulatedPayment.aggregate({
        _sum: {
          amount: true
        },
        where: {
          status: 'succeeded',
          amount: {
            gt: 0 // Exclude refunds
          }
        }
      });

      res.json({
        success: true,
        statistics: {
          totalTransactions,
          totalRevenue: totalRevenue._sum.amount || 0,
          breakdown: stats
        }
      });
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch payment statistics' 
      });
    }
  }
}
