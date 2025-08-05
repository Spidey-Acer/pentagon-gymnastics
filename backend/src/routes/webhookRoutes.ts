import express from 'express';
import { WebhookController } from '../controllers/webhookController';

const router = express.Router();

// Stripe webhook endpoint
// Note: This must be placed BEFORE express.json() middleware
// because we need the raw body for signature verification
router.post('/stripe', 
  express.raw({ type: 'application/json' }), 
  WebhookController.handleStripeWebhook
);

export default router;
