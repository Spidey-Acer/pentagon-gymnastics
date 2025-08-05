# Stripe Integration Setup Guide

## 🔑 Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret Key** (starts with `sk_test_...`)
3. Copy your **Publishable Key** (starts with `pk_test_...`)

Update your `backend/.env` file:
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## 🪝 Step 2: Configure Webhooks

### 2.1 Create Webhook Endpoint
1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://your-backend-domain.com/api/webhooks/stripe`
   - For local testing: `https://ngrok-url.ngrok.io/api/webhooks/stripe`
   - For production: `https://your-render-app.onrender.com/api/webhooks/stripe`

### 2.2 Select Events to Listen For
Add these events to your webhook:

**Payment Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

**Subscription Events:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Invoice Events:**
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 2.3 Get Webhook Secret
1. After creating the webhook, click on it
2. Copy the "Signing secret" (starts with `whsec_...`)
3. Add it to your `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🧪 Step 3: Testing with ngrok (Local Development)

If testing locally, use ngrok to expose your localhost:

```bash
# Install ngrok if not already installed
# Then run:
ngrok http 5000

# Use the HTTPS URL for your webhook endpoint
# Example: https://abc123.ngrok.io/api/webhooks/stripe
```

## 💰 Step 4: Create Stripe Products & Prices

You can create these manually in Stripe Dashboard or use the Stripe CLI:

### Basic Package (£50/month)
```bash
stripe products create --name="Basic Gym Package" --description="Access to gym facilities"
stripe prices create --product=prod_xxx --unit-amount=5000 --currency=gbp --recurring[interval]=month
```

### Standard Package (£70/month)
```bash
stripe products create --name="Standard Gym Package" --description="Gym access + group classes"
stripe prices create --product=prod_xxx --unit-amount=7000 --currency=gbp --recurring[interval]=month
```

### Premium Package (£100/month)
```bash
stripe products create --name="Premium Gym Package" --description="Full access + personal training"
stripe prices create --product=prod_xxx --unit-amount=10000 --currency=gbp --recurring[interval]=month
```

## 🔄 Step 5: Update Package Price IDs

After creating products in Stripe, update your database seed file with the actual price IDs:

```typescript
// In backend/prisma/seed.ts
const packages = [
  {
    name: 'Basic',
    price: 50,
    description: 'Access to gym facilities only',
    features: ['24/7 Gym Access', 'Basic Equipment'],
    stripePriceId: 'price_xxx' // Replace with actual Stripe price ID
  },
  // ... other packages
];
```

## ✅ Step 6: Test the Integration

1. Start your backend server
2. Visit your frontend packages page
3. Try subscribing to a package
4. Check Stripe Dashboard for payment events
5. Verify webhook events are being received

## 🚨 Important Notes

- **Webhook Order:** Webhook routes MUST come before `express.json()` middleware
- **Raw Body:** Stripe needs the raw request body for signature verification
- **Test Mode:** Use test API keys during development
- **Production:** Switch to live keys only when ready for production

## 🔧 Troubleshooting

### Webhook Signature Verification Failed
- Check that STRIPE_WEBHOOK_SECRET is correct
- Ensure webhook endpoint receives raw body
- Verify the webhook URL is accessible

### Payment Not Working
- Check Stripe API keys are correct
- Verify price IDs match your Stripe products
- Check browser console for errors

### Subscription Not Activating
- Check webhook events are being received
- Verify database updates in webhook handlers
- Check Stripe Dashboard event logs
