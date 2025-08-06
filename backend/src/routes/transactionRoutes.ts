import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";
import {
  getUserTransactions,
  getUserActivityLog,
  getAllTransactions,
  getTransactionStats,
  getUserTransactionSummary
} from "../controllers/transactionController";

const router = Router();

// User transaction routes (authenticated users only)
router.get("/my-transactions", authenticate, getUserTransactions);
router.get("/my-activity", authenticate, getUserActivityLog);
router.get("/my-summary", authenticate, getUserTransactionSummary);

// Admin transaction routes (admin only)
router.get("/all", authenticate, requireAdmin, getAllTransactions);
router.get("/stats", authenticate, requireAdmin, getTransactionStats);

export default router;
