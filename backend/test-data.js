const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestData() {
  try {
    // Create some test simulated payments
    const testPayments = [
      {
        cardId: 1, // Valid Visa card
        amount: 100.0,
        status: 'completed',
        paymentType: 'subscription',
        description: 'Premium Package Subscription'
      },
      {
        cardId: 2, // Valid Mastercard
        amount: 30.0,
        status: 'completed',
        paymentType: 'gear',
        description: 'Pentagon Gym Vest Purchase'
      },
      {
        cardId: 3, // Declined card
        amount: 70.0,
        status: 'failed',
        paymentType: 'subscription',
        description: 'Standard Package Subscription',
        failureReason: 'card_declined'
      },
      {
        cardId: 4, // Insufficient funds
        amount: 150.0,
        status: 'failed',
        paymentType: 'subscription',
        description: 'Premium Package Subscription',
        failureReason: 'insufficient_funds'
      }
    ];

    for (const payment of testPayments) {
      await prisma.simulatedPayment.create({
        data: payment
      });
    }

    console.log('✅ Test payment data created');
    
    // Create some test gear orders
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    const gearItems = await prisma.gearItem.findMany();
    
    if (admin && gearItems.length > 0) {
      const testOrder = await prisma.gearOrder.create({
        data: {
          userId: admin.id,
          totalAmount: 60.0,
          status: 'paid',
          customerName: 'Admin User',
          shippingAddress: '123 Test Street, Test City',
          items: {
            create: [
              {
                gearItemId: gearItems[0].id,
                size: 'M',
                quantity: 1,
                unitPrice: 30.0,
                customText: 'Admin'
              },
              {
                gearItemId: gearItems[1].id,
                size: 'L',
                quantity: 1,
                unitPrice: 30.0,
                customText: 'Admin'
              }
            ]
          }
        }
      });
      
      console.log('✅ Test gear order created');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error creating test data:', error);
    await prisma.$disconnect();
  }
}

createTestData();
