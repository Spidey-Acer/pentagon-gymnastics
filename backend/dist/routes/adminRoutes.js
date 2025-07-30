"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// All admin routes require authentication and admin privileges
router.use(authMiddleware_1.authenticate, adminMiddleware_1.requireAdmin);
// Dashboard analytics
router.get("/dashboard", adminController_1.getAdminDashboard);
// User management
router.get("/users", adminController_1.getAllUsers);
router.put("/users/:userId/role", adminController_1.updateUserRole);
// Booking management
router.get("/bookings", adminController_1.getAllBookings);
// Session management
router.put("/sessions/:sessionId/capacity", adminController_1.updateSessionCapacity);
// Class management
router.delete("/classes/:classId", adminController_1.deleteClass);
exports.default = router;
