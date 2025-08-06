import express from 'express';
import { WebhookController } from '../controllers/webhookController';

const router = express.Router();

// Generic webhook endpoint for future integrations
router.post('/generic', WebhookController.handleGenericWebhook);

// Health check for webhook service
router.get('/health', WebhookController.healthCheck);

export default router;
