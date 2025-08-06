import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenanceController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

// All maintenance routes require admin access
router.use(authenticate, requireAdmin);

// Get maintenance alerts
router.get('/alerts', MaintenanceController.getAlerts);

// Get equipment statistics
router.get('/equipment-stats', MaintenanceController.getEquipmentStats);

// Get restock suggestions
router.get('/restock-suggestions', MaintenanceController.getRestockSuggestions);

export default router;
