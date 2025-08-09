import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SimulatedCardData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardType: 'visa' | 'mastercard' | 'amex';
}

export interface PaymentResult {
  success: boolean;
  paymentId?: number;
  error?: string;
  simulatedDelay: number;
}

export class SimulatedPaymentService {
  // Pre-populate comprehensive test cards
  static async initializeTestCards() {
    try {
      const existingCards = await prisma.simulatedCard.count();
      if (existingCards > 0) {
        console.log('✅ Test cards already initialized');
        return;
      }

      const testCards = [
        {
          cardNumber: '4111111111111111', // Visa - Always succeeds
          cardholderName: 'John Doe',
          expiryMonth: 12,
          expiryYear: 2027,
          cvv: '123',
          cardType: 'visa',
          isValid: true,
          balance: 10000.0
        },
        {
          cardNumber: '5555555555554444', // Mastercard - Always succeeds
          cardholderName: 'Jane Smith',
          expiryMonth: 6,
          expiryYear: 2026,
          cvv: '456',
          cardType: 'mastercard',
          isValid: true,
          balance: 5000.0
        },
        {
          cardNumber: '378282246310005', // Amex - Always succeeds
          cardholderName: 'Charlie Wilson',
          expiryMonth: 11,
          expiryYear: 2028,
          cvv: '1234',
          cardType: 'amex',
          isValid: true,
          balance: 15000.0
        },
        {
          cardNumber: '4000000000000002', // Visa - Always declined
          cardholderName: 'Bob Johnson',
          expiryMonth: 3,
          expiryYear: 2025,
          cvv: '789',
          cardType: 'visa',
          isValid: false,
          balance: 100.0
        },
        {
          cardNumber: '4000000000000119', // Visa - Insufficient funds (low balance)
          cardholderName: 'Alice Brown',
          expiryMonth: 9,
          expiryYear: 2026,
          cvv: '321',
          cardType: 'visa',
          isValid: true,
          balance: 25.0 // Low balance for testing
        },
        {
          cardNumber: '4000000000000127', // Visa - Expired card
          cardholderName: 'David Miller',
          expiryMonth: 5,
          expiryYear: 2023, // Expired
          cvv: '654',
          cardType: 'visa',
          isValid: true,
          balance: 1000.0
        },
        {
          cardNumber: '5555555555554477', // Mastercard - Intermittent failures
          cardholderName: 'Emma Davis',
          expiryMonth: 8,
          expiryYear: 2027,
          cvv: '987',
          cardType: 'mastercard',
          isValid: true,
          balance: 2000.0
        },
        {
          cardNumber: '4242424242424242', // Visa - Test card (succeeds)
          cardholderName: 'Test User',
          expiryMonth: 4,
          expiryYear: 2029,
          cvv: '424',
          cardType: 'visa',
          isValid: true,
          balance: 50000.0
        }
      ];

      for (const card of testCards) {
        await prisma.simulatedCard.create({ data: card });
      }

      console.log('✅ Initialized test payment cards successfully');
    } catch (error) {
      console.error('❌ Error initializing test cards:', error);
      throw error;
    }
  }

  // Get all available test cards (for development/testing)
  static async getTestCards() {
    try {
      return await prisma.simulatedCard.findMany({
        select: {
          id: true,
          cardNumber: true,
          cardholderName: true,
          expiryMonth: true,
          expiryYear: true,
          cardType: true,
          isValid: true,
          balance: true
        },
        orderBy: { id: 'asc' }
      });
    } catch (error) {
      console.error('❌ Error fetching test cards:', error);
      throw error;
    }
  }

  // Enhanced card validation
  static validateCard(cardData: SimulatedCardData): { valid: boolean; error?: string } {
    // Basic validation
    if (!cardData.cardNumber || cardData.cardNumber.length < 13) {
      return { valid: false, error: 'Invalid card number length' };
    }

    // Remove spaces and validate numeric
    const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cleanCardNumber)) {
      return { valid: false, error: 'Card number must contain only digits' };
    }

    if (!cardData.cardholderName || cardData.cardholderName.trim().length < 2) {
      return { valid: false, error: 'Invalid cardholder name' };
    }

    if (cardData.expiryMonth < 1 || cardData.expiryMonth > 12) {
      return { valid: false, error: 'Invalid expiry month (1-12)' };
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    if (cardData.expiryYear < currentYear) {
      return { valid: false, error: 'Card has expired (year)' };
    }
    
    if (cardData.expiryYear === currentYear && cardData.expiryMonth < currentMonth) {
      return { valid: false, error: 'Card has expired (month)' };
    }

    if (!cardData.cvv || cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      return { valid: false, error: 'Invalid CVV (3-4 digits)' };
    }

    return { valid: true };
  }

  // Enhanced payment processing with better error simulation
  static async processPayment(
    cardId: number,
    amount: number,
    paymentType: 'subscription' | 'gear' | 'upgrade',
    description: string,
    subscriptionId?: number,
    gearOrderId?: number
  ): Promise<PaymentResult> {
    try {
      console.log(`🔄 Processing payment: Card ${cardId}, Amount £${amount}, Type: ${paymentType}`);

      // Get card details
      const card = await prisma.simulatedCard.findUnique({
        where: { id: cardId }
      });

      if (!card) {
        console.log(`❌ Card not found: ${cardId}`);
        return {
          success: false,
          error: 'card_not_found',
          simulatedDelay: 1
        };
      }

      console.log(`💳 Found card: ${card.cardNumber.slice(-4)} (${card.cardType}), Balance: £${card.balance}`);

      // Simulate realistic processing delay
      const simulatedDelay = Math.floor(Math.random() * 2) + 1; // 1-2 seconds
      
      // Determine payment outcome based on card characteristics
      let status = 'succeeded';
      let failureReason: string | undefined;

      // Check various failure conditions
      if (!card.isValid) {
        status = 'declined';
        failureReason = 'card_declined';
        console.log(`❌ Card declined: Card marked as invalid`);
      } else if (card.balance < amount) {
        status = 'declined';
        failureReason = 'insufficient_funds';
        console.log(`❌ Insufficient funds: Balance £${card.balance} < Required £${amount}`);
      } else {
        // Check expiry
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        if (card.expiryYear < currentYear || 
           (card.expiryYear === currentYear && card.expiryMonth < currentMonth)) {
          status = 'declined';
          failureReason = 'expired_card';
          console.log(`❌ Card expired: ${card.expiryMonth}/${card.expiryYear}`);
        } else {
          // Simulate network/processing errors for certain cards (5% chance)
          if (card.cardNumber === '5555555555554477' && Math.random() < 0.3) {
            status = 'declined';
            failureReason = 'processing_error';
            console.log(`❌ Simulated processing error`);
          } else {
            console.log(`✅ Payment should succeed`);
          }
        }
      }

      // Create payment record
      const payment = await prisma.simulatedPayment.create({
        data: {
          cardId,
          subscriptionId,
          gearOrderId,
          amount,
          status,
          paymentType,
          description,
          failureReason,
          simulatedDelay
        }
      });

      console.log(`💾 Payment record created: ID ${payment.id}, Status: ${status}`);

      // If successful, deduct from card balance
      if (status === 'succeeded') {
        await prisma.simulatedCard.update({
          where: { id: cardId },
          data: {
            balance: {
              decrement: amount
            }
          }
        });
        console.log(`💰 Deducted £${amount} from card balance`);
      }

      const result = {
        success: status === 'succeeded',
        paymentId: payment.id,
        error: failureReason,
        simulatedDelay
      };

      console.log(`🎯 Payment result:`, result);
      return result;

    } catch (error) {
      console.error('💥 Payment processing error:', error);
      return {
        success: false,
        error: 'payment_processing_failed',
        simulatedDelay: 1
      };
    }
  }

  // Get payment details
  static async getPayment(paymentId: number) {
    try {
      return await prisma.simulatedPayment.findUnique({
        where: { id: paymentId },
        include: {
          card: {
            select: {
              cardNumber: true,
              cardholderName: true,
              cardType: true
            }
          }
        }
      });
    } catch (error) {
      console.error('❌ Error fetching payment:', error);
      throw error;
    }
  }

  // Get payments for a subscription or gear order
  static async getPaymentsForOrder(subscriptionId?: number, gearOrderId?: number) {
    try {
      const whereClause: any = {};
      
      if (subscriptionId) {
        whereClause.subscriptionId = subscriptionId;
      }
      
      if (gearOrderId) {
        whereClause.gearOrderId = gearOrderId;
      }

      return await prisma.simulatedPayment.findMany({
        where: whereClause,
        include: {
          card: {
            select: {
              cardNumber: true,
              cardholderName: true,
              cardType: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('❌ Error fetching order payments:', error);
      throw error;
    }
  }

  // Enhanced refund processing
  static async refundPayment(paymentId: number, amount?: number): Promise<PaymentResult> {
    try {
      console.log(`🔄 Processing refund for payment ${paymentId}, amount: ${amount || 'full'}`);

      const payment = await prisma.simulatedPayment.findUnique({
        where: { id: paymentId },
        include: { card: true }
      });

      if (!payment) {
        console.log(`❌ Payment not found: ${paymentId}`);
        return {
          success: false,
          error: 'payment_not_found',
          simulatedDelay: 1
        };
      }

      if (payment.status !== 'succeeded') {
        console.log(`❌ Payment not refundable: Status is ${payment.status}`);
        return {
          success: false,
          error: 'payment_not_refundable',
          simulatedDelay: 1
        };
      }

      const refundAmount = amount || payment.amount;

      if (refundAmount > payment.amount) {
        console.log(`❌ Refund amount £${refundAmount} exceeds original payment £${payment.amount}`);
        return {
          success: false,
          error: 'refund_amount_exceeds_payment',
          simulatedDelay: 1
        };
      }

      // Create refund record
      const refund = await prisma.simulatedPayment.create({
        data: {
          cardId: payment.cardId,
          subscriptionId: payment.subscriptionId,
          gearOrderId: payment.gearOrderId,
          amount: -refundAmount, // Negative amount for refund
          status: 'succeeded',
          paymentType: payment.paymentType,
          description: `Refund for: ${payment.description}`,
          simulatedDelay: 2
        }
      });

      // Add back to card balance
      await prisma.simulatedCard.update({
        where: { id: payment.cardId },
        data: {
          balance: {
            increment: refundAmount
          }
        }
      });

      console.log(`✅ Refund processed: £${refundAmount} refunded to card ending in ${payment.card.cardNumber.slice(-4)}`);

      return {
        success: true,
        paymentId: refund.id,
        simulatedDelay: 2
      };

    } catch (error) {
      console.error('💥 Refund processing error:', error);
      return {
        success: false,
        error: 'refund_processing_failed',
        simulatedDelay: 1
      };
    }
  }

  // Get payment statistics for admin dashboard
  static async getPaymentStatistics() {
    try {
      const totalPayments = await prisma.simulatedPayment.count();
      
      const successfulPayments = await prisma.simulatedPayment.count({
        where: { status: 'succeeded', amount: { gt: 0 } }
      });

      const totalRevenue = await prisma.simulatedPayment.aggregate({
        _sum: { amount: true },
        where: { status: 'succeeded', amount: { gt: 0 } }
      });

      const failedPayments = await prisma.simulatedPayment.count({
        where: { status: 'declined' }
      });

      const paymentsByType = await prisma.simulatedPayment.groupBy({
        by: ['paymentType'],
        _count: { id: true },
        _sum: { amount: true },
        where: { status: 'succeeded', amount: { gt: 0 } }
      });

      return {
        totalPayments,
        successfulPayments,
        failedPayments,
        successRate: totalPayments > 0 ? (successfulPayments / totalPayments * 100).toFixed(2) : 0,
        totalRevenue: totalRevenue._sum.amount || 0,
        paymentsByType
      };
    } catch (error) {
      console.error('❌ Error fetching payment statistics:', error);
      throw error;
    }
  }

  // Test card balances (for debugging)
  static async getCardBalances() {
    try {
      return await prisma.simulatedCard.findMany({
        select: {
          id: true,
          cardNumber: true,
          cardholderName: true,
          balance: true,
          isValid: true
        },
        orderBy: { id: 'asc' }
      });
    } catch (error) {
      console.error('❌ Error fetching card balances:', error);
      throw error;
    }
  }

  // Reset test card balances (for testing)
  static async resetCardBalances() {
    try {
      const resetData = [
        { cardNumber: '4111111111111111', balance: 10000.0 },
        { cardNumber: '5555555555554444', balance: 5000.0 },
        { cardNumber: '378282246310005', balance: 15000.0 },
        { cardNumber: '4000000000000002', balance: 100.0 },
        { cardNumber: '4000000000000119', balance: 25.0 },
        { cardNumber: '4000000000000127', balance: 1000.0 },
        { cardNumber: '5555555555554477', balance: 2000.0 },
        { cardNumber: '4242424242424242', balance: 50000.0 }
      ];

      for (const reset of resetData) {
        await prisma.simulatedCard.updateMany({
          where: { cardNumber: reset.cardNumber },
          data: { balance: reset.balance }
        });
      }

      console.log('✅ Card balances reset successfully');
    } catch (error) {
      console.error('❌ Error resetting card balances:', error);
      throw error;
    }
  }
}
