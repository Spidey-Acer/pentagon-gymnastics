import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";
import {
  getAdminDashboard,
  getAllUsers,
  updateUserRole,
  getAllBookings,
  updateSessionCapacity,
  deleteClass
} from "../controllers/adminController";

const router = Router();

// All admin routes require authentication and admin privileges
router.use(authenticate, requireAdmin);

// Dashboard analytics
router.get("/dashboard", getAdminDashboard);

// User management
router.get("/users", getAllUsers);
router.put("/users/:userId/role", updateUserRole);

// Booking management
router.get("/bookings", getAllBookings);

// Session management
router.put("/sessions/:sessionId/capacity", updateSessionCapacity);

// Class management
router.delete("/classes/:classId", deleteClass);

export default router;
