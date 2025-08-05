import { StripeService } from './src/services/stripeService';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testStripeConnection() {
  console.log('🧪 Testing Stripe Connection...\n');

  try {
    // Test 1: Check environment variables
    console.log('📋 Environment Variables:');
    console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
    console.log('STRIPE_PUBLISHABLE_KEY:', process.env.STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing');
    console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');
    console.log('');

    // Test 2: Create a test customer
    console.log('👤 Testing Customer Creation...');
    const customer = await StripeService.createCustomer(
      'test@pentagon-gym.com',
      'Test User'
    );
    console.log('✅ Customer created:', customer.id);
    console.log('');

    // Test 3: Create a test product and price
    console.log('💰 Testing Product Creation...');
    const price = await StripeService.createPrice(50, 'Test Basic Package');
    console.log('✅ Price created:', price.id);
    console.log('');

    // Test 4: Create a payment intent
    console.log('💳 Testing Payment Intent...');
    const paymentIntent = await StripeService.createPaymentIntent(
      30, // £30 for gear
      customer.id,
      'Test Gear Order'
    );
    console.log('✅ Payment Intent created:', paymentIntent.id);
    console.log('');

    console.log('🎉 All Stripe tests passed! Your integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Stripe test failed:', error);
    process.exit(1);
  }
}

// Run the test
testStripeConnection();
