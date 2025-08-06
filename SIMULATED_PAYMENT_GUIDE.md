# Simulated Payment System

## Overview

This project now uses a **simulated payment system** instead of Stripe for demonstration purposes. The system provides a realistic payment experience without processing real transactions.

## Features

### 🔧 Backend Features

- **Simulated Payment Cards**: Pre-loaded test cards with different scenarios
- **Payment Processing**: Realistic payment flow with success/failure simulation
- **Payment History**: Complete transaction tracking and reporting
- **Admin Dashboard**: Payment statistics and management tools

### 💳 Test Cards Available

The system includes several test cards for different scenarios:

1. **Valid Visa Card**
   - Number: `****-****-****-1111`
   - Name: John Doe
   - Status: ✅ Valid (High Balance)

2. **Valid Mastercard**
   - Number: `****-****-****-4444`
   - Name: Jane Smith
   - Status: ✅ Valid (Medium Balance)

3. **Declined Card**
   - Number: `****-****-****-0002`
   - Name: Bob Johnson
   - Status: ❌ Will Decline

4. **Insufficient Funds**
   - Number: `****-****-****-0119`
   - Name: Alice Brown
   - Status: ⚠️ Low Balance

5. **Valid Amex**
   - Number: `****-****-****-0005`
   - Name: Charlie Wilson
   - Status: ✅ Valid (High Balance)

## How It Works

### 1. **Subscription Creation**
- User selects a package in the Package Selection Modal
- System creates a pending subscription
- Payment form is displayed with test card options

### 2. **Payment Processing**
- User selects a test card from the available options
- System simulates payment processing (1-3 seconds delay)
- Payment success/failure is determined by card type
- Subscription status is updated accordingly

### 3. **Transaction Recording**
- All payments are recorded in the `SimulatedPayment` table
- Transaction history is maintained for admin reporting
- Payment details are linked to subscriptions/orders

## API Endpoints

### Payment Routes (`/api/payments/`)

- `GET /test-cards` - Get available test cards
- `POST /test-cards/initialize` - Initialize test card data
- `POST /subscription` - Process subscription payment
- `POST /gear` - Process equipment payment
- `POST /validate-card` - Validate card details
- `GET /payment/:id` - Get payment details
- `GET /order-payments` - Get payments for an order
- `POST /refund/:id` - Process refund (admin only)
- `GET /statistics` - Payment statistics (admin only)

## Database Schema

### SimulatedCard Table
```sql
- id: Primary key
- cardNumber: Card number (masked in API responses)
- cardholderName: Cardholder name
- expiryMonth/expiryYear: Expiration date
- cvv: Security code (never returned in API)
- cardType: visa/mastercard/amex
- isValid: Whether card will process successfully
- balance: Simulated account balance
```

### SimulatedPayment Table
```sql
- id: Primary key
- cardId: Reference to SimulatedCard
- subscriptionId/gearOrderId: Related order
- amount: Payment amount
- status: succeeded/failed/declined
- paymentType: subscription/gear/upgrade
- description: Payment description
- failureReason: If failed, reason code
- simulatedDelay: Processing delay in seconds
```

## Frontend Integration

### SimulatedPaymentForm Component
- Displays available test cards
- Handles payment processing
- Shows realistic loading states
- Provides payment confirmation

### Package Selection Modal
- Integrated with payment form
- Handles subscription creation → payment flow
- Updates UI based on payment results

## Setup Instructions

### 1. **Database Migration**
The simulated payment tables are already included in the schema. Run:
```bash
cd backend
npx prisma migrate dev
```

### 2. **Initialize Test Cards**
Test cards are automatically initialized on first use, or manually via:
```bash
# Using API endpoint
curl -X POST http://localhost:5000/api/payments/test-cards/initialize
```

### 3. **Start Development Servers**
```bash
# Backend
cd backend && npm start

# Frontend  
cd frontend && npm run dev
```

## Testing Scenarios

### ✅ Successful Payment
- Use cards ending in 1111, 4444, or 0005
- Should process successfully and activate subscription

### ❌ Failed Payment
- Use card ending in 0002 (will be declined)
- Should show appropriate error message

### ⚠️ Insufficient Funds
- Use card ending in 0119 (low balance)
- Should fail with insufficient funds error

### 🔄 Processing Delay
- All payments have a realistic 1-3 second processing delay
- Loading states are shown during processing

## Admin Features

### Payment Statistics
- Total revenue and transaction counts
- Breakdown by payment type and status
- Recent transaction history

### Payment Management
- View all payment details
- Process refunds
- Monitor transaction patterns

## Benefits Over Stripe

1. **No External Dependencies**: Works offline and in any environment
2. **Predictable Testing**: Controlled success/failure scenarios
3. **No API Keys Required**: No configuration needed
4. **Full Control**: Complete visibility into payment flow
5. **Cost-Free**: No transaction fees or account requirements

## Security Notes

- All card numbers are masked in API responses
- CVV codes are never returned from the API
- Payment processing is completely simulated
- No real financial data is handled

## Future Enhancements

- Add more card types and scenarios
- Implement webhook simulation
- Add payment analytics dashboard
- Support for partial refunds
- Multi-currency support simulation

---

The simulated payment system provides a complete payment experience for development and demonstration while maintaining the flexibility to integrate with real payment processors in production.
