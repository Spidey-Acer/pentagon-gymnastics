import express from 'express';
import { GearController } from '../controllers/gearController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Get all gear items (public)
router.get('/items', GearController.getGearItems);

// Protected routes (require authentication)
router.post('/order', authenticate, GearController.createGearOrder);
router.post('/order/payment', authenticate, GearController.processGearOrderPayment);
router.get('/orders', authenticate, GearController.getUserOrders);
router.get('/orders/:orderId', authenticate, GearController.getOrderById);

export default router;
