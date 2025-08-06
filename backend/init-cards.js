import { SimulatedPaymentService } from "./src/services/simulatedPaymentService.js";

async function initializeCards() {
  try {
    await SimulatedPaymentService.initializeTestCards();
    console.log('✅ Test cards initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize test cards:', error);
    process.exit(1);
  }
}

initializeCards();
