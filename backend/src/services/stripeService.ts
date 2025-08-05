import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

export class StripeService {
  // Create a customer
  static async createCustomer(email: string, name: string) {
    return await stripe.customers.create({
      email,
      name,
    });
  }

  // Create a subscription for gym packages
  static async createSubscription(customerId: string, priceId: string) {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  }

  // Create a one-time payment for gear
  static async createPaymentIntent(amount: number, customerId: string, description: string) {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence
      currency: 'gbp',
      customer: customerId,
      description,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  // Update subscription (for package switching)
  static async updateSubscription(subscriptionId: string, newPriceId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    return await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'always_invoice',
    });
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  // Create price for packages (to be run once during setup)
  static async createPrice(amount: number, productName: string) {
    // First create product
    const product = await stripe.products.create({
      name: productName,
    });

    // Then create recurring price
    return await stripe.prices.create({
      unit_amount: Math.round(amount * 100), // Convert to pence
      currency: 'gbp',
      recurring: {
        interval: 'month',
        interval_count: 1, // Every 30 days
      },
      product: product.id,
    });
  }

  // Webhook signature verification
  static constructEvent(payload: string, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is required');
    }
    
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
