import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";
import {
  getAdminDashboard,
  getAllUsers,
  updateUserRole,
  getAllBookings,
  updateSessionCapacity,
  deleteClass,
  getAnalyticsReport,
  getFinancialOverview,
  getEquipmentManagement,
  updateGearItem,
  updateOrderStatus
} from "../controllers/adminController";

const router = Router();

// All admin routes require authentication and admin privileges
router.use(authenticate, requireAdmin);

// Dashboard analytics
router.get("/dashboard", getAdminDashboard);

// Comprehensive analytics and reporting
router.get("/analytics", getAnalyticsReport);
router.get("/financial", getFinancialOverview);
router.get("/equipment", getEquipmentManagement);

// User management
router.get("/users", getAllUsers);
router.put("/users/:userId/role", updateUserRole);

// Booking management
router.get("/bookings", getAllBookings);

// Session management
router.put("/sessions/:sessionId/capacity", updateSessionCapacity);

// Class management
router.delete("/classes/:classId", deleteClass);

// Equipment management
router.put("/gear/:itemId", updateGearItem);
router.put("/orders/:orderId/status", updateOrderStatus);

export default router;
