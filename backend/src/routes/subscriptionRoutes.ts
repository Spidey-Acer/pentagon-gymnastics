import express from 'express';
import { SubscriptionController } from '../controllers/subscriptionController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Get all packages (public)
router.get('/packages', SubscriptionController.getPackages);

// Protected routes (require authentication)
router.get('/current', authenticate, SubscriptionController.getUserSubscription);
router.post('/create', authenticate, SubscriptionController.createSubscription);
router.put('/switch', authenticate, SubscriptionController.switchPackage);
router.delete('/cancel', authenticate, SubscriptionController.cancelSubscription);

export default router;
