import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

// Test card management (development only)
router.post('/test-cards/initialize', PaymentController.initializeTestCards);
router.get('/test-cards', PaymentController.getTestCards);

// Payment processing
router.post('/subscription', authenticate, PaymentController.processSubscriptionPayment);
router.post('/gear', authenticate, PaymentController.processGearPayment);

// Card validation
router.post('/validate-card', authenticate, PaymentController.validateCard);

// Payment details and history
router.get(
  "/status/:paymentId",
  authenticate,
  PaymentController.getPaymentStatus
);
router.get('/payment/:paymentId', authenticate, PaymentController.getPayment);
router.get('/order-payments', authenticate, PaymentController.getOrderPayments);

// Refunds (admin only)
router.post('/refund/:paymentId', authenticate, requireAdmin, PaymentController.processRefund);

// Payment statistics (admin only)
router.get('/statistics', authenticate, requireAdmin, PaymentController.getPaymentStatistics);

export default router;
