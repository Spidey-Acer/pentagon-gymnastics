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
  // Pre-populate some test cards
  static async initializeTestCards() {
    const existingCards = await prisma.simulatedCard.count();
    if (existingCards > 0) return; // Already initialized

    const testCards = [
      {
        cardNumber: '4111111111111111', // Visa - Valid
        cardholderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: 2027,
        cvv: '123',
        cardType: 'visa',
        isValid: true,
        balance: 10000.0
      },
      {
        cardNumber: '5555555555554444', // Mastercard - Valid
        cardholderName: 'Jane Smith',
        expiryMonth: 6,
        expiryYear: 2026,
        cvv: '456',
        cardType: 'mastercard',
        isValid: true,
        balance: 5000.0
      },
      {
        cardNumber: '4000000000000002', // Visa - Declined
        cardholderName: 'Bob Johnson',
        expiryMonth: 3,
        expiryYear: 2025,
        cvv: '789',
        cardType: 'visa',
        isValid: false,
        balance: 100.0
      },
      {
        cardNumber: '4000000000000119', // Visa - Insufficient funds
        cardholderName: 'Alice Brown',
        expiryMonth: 9,
        expiryYear: 2026,
        cvv: '321',
        cardType: 'visa',
        isValid: true,
        balance: 10.0
      },
      {
        cardNumber: '378282246310005', // Amex - Valid
        cardholderName: 'Charlie Wilson',
        expiryMonth: 11,
        expiryYear: 2028,
        cvv: '1234',
        cardType: 'amex',
        isValid: true,
        balance: 15000.0
      }
    ];

    for (const card of testCards) {
      await prisma.simulatedCard.create({ data: card });
    }

    console.log('✅ Initialized test payment cards');
  }

  // Get all available test cards (for development/testing)
  static async getTestCards() {
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
      }
    });
  }

  // Validate card details
  static validateCard(cardData: SimulatedCardData): { valid: boolean; error?: string } {
    // Basic validation
    if (!cardData.cardNumber || cardData.cardNumber.length < 13) {
      return { valid: false, error: 'Invalid card number' };
    }

    if (!cardData.cardholderName || cardData.cardholderName.trim().length < 2) {
      return { valid: false, error: 'Invalid cardholder name' };
    }

    if (cardData.expiryMonth < 1 || cardData.expiryMonth > 12) {
      return { valid: false, error: 'Invalid expiry month' };
    }

    const currentYear = new Date().getFullYear();
    if (cardData.expiryYear < currentYear) {
      return { valid: false, error: 'Card has expired' };
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      return { valid: false, error: 'Invalid CVV' };
    }

    return { valid: true };
  }

  // Process a payment (simulated)
  static async processPayment(
    cardId: number,
    amount: number,
    paymentType: 'subscription' | 'gear' | 'upgrade',
    description: string,
    subscriptionId?: number,
    gearOrderId?: number
  ): Promise<PaymentResult> {
    try {
      // Get card details
      const card = await prisma.simulatedCard.findUnique({
        where: { id: cardId }
      });

      if (!card) {
        return {
          success: false,
          error: 'Card not found',
          simulatedDelay: 1
        };
      }

      // Simulate processing delay
      const simulatedDelay = Math.floor(Math.random() * 3) + 1; // 1-3 seconds
      
      // Simulate various failure scenarios
      let status = 'succeeded';
      let failureReason: string | undefined;

      if (!card.isValid) {
        status = 'declined';
        failureReason = 'card_declined';
      } else if (card.balance < amount) {
        status = 'declined';
        failureReason = 'insufficient_funds';
      } else if (card.expiryYear < new Date().getFullYear()) {
        status = 'declined';
        failureReason = 'expired_card';
      } else {
        // Random 5% chance of decline for testing
        if (Math.random() < 0.05) {
          status = 'declined';
          failureReason = 'processing_error';
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
      }

      return {
        success: status === 'succeeded',
        paymentId: payment.id,
        error: failureReason,
        simulatedDelay
      };

    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'payment_processing_failed',
        simulatedDelay: 1
      };
    }
  }

  // Get payment details
  static async getPayment(paymentId: number) {
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
  }

  // Get payments for a subscription or gear order
  static async getPaymentsForOrder(subscriptionId?: number, gearOrderId?: number) {
    return await prisma.simulatedPayment.findMany({
      where: {
        OR: [
          subscriptionId ? { subscriptionId } : {},
          gearOrderId ? { gearOrderId } : {}
        ]
      },
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
  }

  // Refund a payment (simulated)
  static async refundPayment(paymentId: number, amount?: number): Promise<PaymentResult> {
    try {
      const payment = await prisma.simulatedPayment.findUnique({
        where: { id: paymentId },
        include: { card: true }
      });

      if (!payment) {
        return {
          success: false,
          error: 'payment_not_found',
          simulatedDelay: 1
        };
      }

      if (payment.status !== 'succeeded') {
        return {
          success: false,
          error: 'payment_not_refundable',
          simulatedDelay: 1
        };
      }

      const refundAmount = amount || payment.amount;

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

      return {
        success: true,
        paymentId: refund.id,
        simulatedDelay: 2
      };

    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        error: 'refund_processing_failed',
        simulatedDelay: 1
      };
    }
  }
}
