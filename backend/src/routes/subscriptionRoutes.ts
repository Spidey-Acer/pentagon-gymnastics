import express from 'express';
import { SubscriptionController } from '../controllers/subscriptionController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Get all packages (public)
router.get('/packages', SubscriptionController.getPackages);

// Protected routes (require authentication)
router.get('/subscription', authenticate, SubscriptionController.getUserSubscription);
router.post('/subscription', authenticate, SubscriptionController.createSubscription);
router.put('/subscription/switch', authenticate, SubscriptionController.switchPackage);
router.delete('/subscription', authenticate, SubscriptionController.cancelSubscription);

export default router;
