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
      // Return cards with better formatting for frontend
      const formattedCards = cards.map(card => ({
        id: card.id,
        cardNumber: card.cardNumber, // Show full number for testing
        maskedNumber: `****-****-****-${card.cardNumber.slice(-4)}`,
        cardholderName: card.cardholderName,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        cardType: card.cardType,
        isValid: card.isValid,
        balance: card.balance,
        // Add test scenarios description
        testScenario: this.getTestScenario(card.cardNumber, card.isValid, card.balance)
      }));
      
      res.json({ success: true, cards: formattedCards });
    } catch (error) {
      console.error('Error fetching test cards:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch test cards' 
      });
    }
  }

  // Helper method to describe test scenarios
  private static getTestScenario(cardNumber: string, isValid: boolean, balance: number): string {
    if (!isValid) return 'Declined Card - Will always be declined';
    if (balance < 100) return 'Insufficient Funds - Will decline for amounts over balance';
    if (cardNumber === '4111111111111111') return 'Success Card - Always processes successfully';
    if (cardNumber === '5555555555554444') return 'Success Card - Always processes successfully';
    if (cardNumber === '378282246310005') return 'Success Card - High balance AMEX';
    return 'Standard Test Card';
  }

  // Process subscription payment with better error handling
  static async processSubscriptionPayment(req: Request, res: Response) {
    try {
      const { cardId, subscriptionId, amount, description } = req.body;

      // Validation
      if (!cardId || !subscriptionId || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: cardId, subscriptionId, amount'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }

      // Check if card exists
      const card = await prisma.simulatedCard.findUnique({
        where: { id: parseInt(cardId) }
      });

      if (!card) {
        return res.status(404).json({
          success: false,
          error: 'Payment card not found'
        });
      }

      // Check if subscription exists
      const subscription = await prisma.subscription.findUnique({
        where: { id: parseInt(subscriptionId) }
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'Subscription not found'
        });
      }

      console.log(`Processing payment: Card ${cardId}, Amount ${amount}, Subscription ${subscriptionId}`);

      // Process payment
      const result = await SimulatedPaymentService.processPayment(
        parseInt(cardId),
        parseFloat(amount),
        'subscription',
        description || 'Subscription payment',
        parseInt(subscriptionId)
      );

      console.log('Payment result:', result);

      // Update subscription status based on payment result
      if (result.success && result.paymentId) {
        await prisma.subscription.update({
          where: { id: parseInt(subscriptionId) },
          data: { 
            status: 'active',
            updatedAt: new Date()
          }
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId: subscription.userId,
            type: 'subscription',
            amount: parseFloat(amount),
            currency: 'gbp',
            status: 'completed',
            description: description || 'Subscription payment',
            relatedId: parseInt(subscriptionId),
            relatedType: 'subscription'
          }
        });
      }

      // Return immediate response (no artificial delay for better UX)
      res.json({
        success: result.success,
        paymentId: result.paymentId,
        error: result.error,
        message: result.success 
          ? 'Payment processed successfully' 
          : `Payment failed: ${result.error}`,
        cardInfo: {
          last4: card.cardNumber.slice(-4),
          cardType: card.cardType,
          cardholderName: card.cardholderName
        }
      });

    } catch (error) {
      console.error('Error processing subscription payment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Payment processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Process gear order payment with better error handling
  static async processGearPayment(req: Request, res: Response) {
    try {
      const { cardId, gearOrderId, amount, description } = req.body;

      if (!cardId || !gearOrderId || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: cardId, gearOrderId, amount'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }

      // Check if card exists
      const card = await prisma.simulatedCard.findUnique({
        where: { id: parseInt(cardId) }
      });

      if (!card) {
        return res.status(404).json({
          success: false,
          error: 'Payment card not found'
        });
      }

      // Check if gear order exists
      const gearOrder = await prisma.gearOrder.findUnique({
        where: { id: parseInt(gearOrderId) }
      });

      if (!gearOrder) {
        return res.status(404).json({
          success: false,
          error: 'Gear order not found'
        });
      }

      console.log(`Processing gear payment: Card ${cardId}, Amount ${amount}, Order ${gearOrderId}`);

      const result = await SimulatedPaymentService.processPayment(
        parseInt(cardId),
        parseFloat(amount),
        'gear',
        description || 'Equipment purchase',
        undefined,
        parseInt(gearOrderId)
      );

      console.log('Gear payment result:', result);

      // Update gear order status based on payment result
      if (result.success && result.paymentId) {
        await prisma.gearOrder.update({
          where: { id: parseInt(gearOrderId) },
          data: { 
            status: 'paid',
            updatedAt: new Date()
          }
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId: gearOrder.userId,
            type: 'gear',
            amount: parseFloat(amount),
            currency: 'gbp',
            status: 'completed',
            description: description || 'Equipment purchase',
            relatedId: parseInt(gearOrderId),
            relatedType: 'gear_order'
          }
        });
      }

      res.json({
        success: result.success,
        paymentId: result.paymentId,
        error: result.error,
        message: result.success 
          ? 'Payment processed successfully' 
          : `Payment failed: ${result.error}`,
        cardInfo: {
          last4: card.cardNumber.slice(-4),
          cardType: card.cardType,
          cardholderName: card.cardholderName
        }
      });

    } catch (error) {
      console.error('Error processing gear payment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Payment processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Validate card details before processing
  static async validateCard(req: Request, res: Response) {
    try {
      const { cardId } = req.body;
      
      if (!cardId) {
        return res.status(400).json({
          success: false,
          error: 'Card ID is required'
        });
      }

      const card = await prisma.simulatedCard.findUnique({
        where: { id: parseInt(cardId) }
      });

      if (!card) {
        return res.json({
          success: false,
          error: 'Card not found'
        });
      }

      // Check if card is expired
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const isExpired = card.expiryYear < currentYear || 
                      (card.expiryYear === currentYear && card.expiryMonth < currentMonth);

      res.json({
        success: card.isValid && !isExpired,
        card: {
          id: card.id,
          last4: card.cardNumber.slice(-4),
          cardType: card.cardType,
          cardholderName: card.cardholderName,
          expiryMonth: card.expiryMonth,
          expiryYear: card.expiryYear,
          isValid: card.isValid,
          isExpired: isExpired,
          balance: card.balance
        },
        error: !card.isValid 
          ? 'Card is marked as invalid'
          : isExpired 
          ? 'Card has expired'
          : undefined
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
      
      if (!paymentId || isNaN(parseInt(paymentId))) {
        return res.status(400).json({
          success: false,
          error: 'Valid payment ID is required'
        });
      }

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
      
      if (!paymentId || isNaN(parseInt(paymentId))) {
        return res.status(400).json({
          success: false,
          error: 'Valid payment ID is required'
        });
      }

      const result = await SimulatedPaymentService.refundPayment(
        parseInt(paymentId),
        amount ? parseFloat(amount) : undefined
      );

      res.json({
        success: result.success,
        refundId: result.paymentId,
        error: result.error,
        message: result.success 
          ? 'Refund processed successfully' 
          : `Refund failed: ${result.error}`
      });

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

      // Get recent transactions
      const recentTransactions = await prisma.simulatedPayment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          card: {
            select: {
              cardNumber: true,
              cardType: true,
              cardholderName: true
            }
          }
        }
      });

      res.json({
        success: true,
        statistics: {
          totalTransactions,
          totalRevenue: totalRevenue._sum.amount || 0,
          breakdown: stats,
          recentTransactions: recentTransactions.map(tx => ({
            ...tx,
            card: {
              ...tx.card,
              cardNumber: `****-****-****-${tx.card.cardNumber.slice(-4)}`
            }
          }))
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

  // Test endpoint to simulate different payment scenarios
  static async testPaymentScenarios(req: Request, res: Response) {
    try {
      const scenarios = [
        {
          name: 'Successful Payment',
          cardNumber: '4111111111111111',
          description: 'Always succeeds'
        },
        {
          name: 'Declined Card',
          cardNumber: '4000000000000002',
          description: 'Always declined'
        },
        {
          name: 'Insufficient Funds',
          cardNumber: '4000000000000119',
          description: 'Declines for high amounts'
        },
        {
          name: 'Mastercard Success',
          cardNumber: '5555555555554444',
          description: 'Mastercard that succeeds'
        },
        {
          name: 'Amex Success',
          cardNumber: '378282246310005',
          description: 'American Express that succeeds'
        }
      ];

      res.json({
        success: true,
        message: 'Payment test scenarios available',
        scenarios: scenarios,
        instructions: {
          setup: 'Call POST /api/payments/init-test-cards to initialize',
          testing: 'Use the card IDs from GET /api/payments/test-cards',
          amounts: {
            low: 'Use amounts under £50 for all cards',
            high: 'Use amounts over £100 to test insufficient funds',
            subscription: 'Typical subscription amounts: £29.99, £49.99, £79.99'
          }
        }
      });
    } catch (error) {
      console.error('Error getting test scenarios:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get test scenarios' 
      });
    }
  }
}
