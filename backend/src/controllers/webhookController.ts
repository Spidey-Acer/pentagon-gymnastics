import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StripeService } from '../services/stripeService';

const prisma = new PrismaClient();

export class WebhookController {
  // Handle Stripe webhooks
  static async handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      return res.status(400).send('Missing stripe-signature header');
    }

    try {
      // Verify webhook signature
      const event = StripeService.constructEvent(
        req.body, // Raw body needed for signature verification
        sig
      );

      console.log('📥 Received Stripe webhook:', event.type);

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSucceeded(event.data.object);
          break;
          
        case 'payment_intent.payment_failed':
          await handlePaymentFailed(event.data.object);
          break;
          
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object);
          break;
          
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;
          
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;
          
        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object);
          break;
          
        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object);
          break;

        default:
          console.log(`🤷‍♂️ Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return res.status(400).send('Webhook signature verification failed');
    }
  }
}

// Helper functions for different webhook events

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    // Update payment record in database
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'succeeded' }
    });

    // Check if this is for a subscription
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
      include: { subscription: true, gearOrder: true }
    });

    if (payment?.subscription) {
      // Activate subscription
      await prisma.subscription.update({
        where: { id: payment.subscription.id },
        data: { status: 'active' }
      });
      console.log('✅ Subscription activated:', payment.subscription.id);
    }

    if (payment?.gearOrder) {
      // Update gear order status
      await prisma.gearOrder.update({
        where: { id: payment.gearOrder.id },
        data: { status: 'paid' }
      });
      console.log('✅ Gear order paid:', payment.gearOrder.id);
    }

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    // Update payment record
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'failed' }
    });

    // Update related subscription/order status
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
      include: { subscription: true, gearOrder: true }
    });

    if (payment?.subscription) {
      await prisma.subscription.update({
        where: { id: payment.subscription.id },
        data: { status: 'past_due' }
      });
    }

    if (payment?.gearOrder) {
      await prisma.gearOrder.update({
        where: { id: payment.gearOrder.id },
        data: { status: 'pending' }
      });
    }

    console.log('❌ Payment failed for:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log('🆕 Subscription created:', subscription.id);
    // Additional logic for subscription creation
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log('🔄 Subscription updated:', subscription.id);
    // Handle subscription updates (plan changes, etc.)
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    // Find and update subscription in database
    const dbSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (dbSubscription) {
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: { status: 'cancelled' }
      });
    }

    console.log('🗑️ Subscription cancelled:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    console.log('💰 Invoice payment succeeded:', invoice.id);
    // Handle successful recurring payments
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  try {
    console.log('❌ Invoice payment failed:', invoice.id);
    // Handle failed recurring payments
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}
