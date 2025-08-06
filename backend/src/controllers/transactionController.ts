import { Request, Response } from "express";
import { TransactionService } from "../services/transactionService";

// Get user's transactions
export const getUserTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await TransactionService.getUserTransactions(userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error("Get user transactions error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Get user's activity log
export const getUserActivityLog = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await TransactionService.getUserActivityLog(userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error("Get user activity log error:", error);
    res.status(500).json({ error: "Failed to fetch activity log" });
  }
};

// Get all transactions (admin only)
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const {
      page,
      limit,
      type,
      status,
      userId,
      startDate,
      endDate
    } = req.query;

    const filters: any = {};
    if (page) filters.page = parseInt(page as string);
    if (limit) filters.limit = parseInt(limit as string);
    if (type) filters.type = type as string;
    if (status) filters.status = status as string;
    if (userId) filters.userId = parseInt(userId as string);
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const result = await TransactionService.getAllTransactions(filters);
    res.json(result);
  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Get transaction statistics
export const getTransactionStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, userId } = req.query;

    const filters: any = {};
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    if (userId) filters.userId = parseInt(userId as string);

    const stats = await TransactionService.getTransactionStats(filters);
    res.json(stats);
  } catch (error) {
    console.error("Get transaction stats error:", error);
    res.status(500).json({ error: "Failed to fetch transaction statistics" });
  }
};

// Get user's transaction summary
export const getUserTransactionSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { startDate, endDate } = req.query;

    const filters: any = { userId };
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const stats = await TransactionService.getTransactionStats(filters);
    res.json(stats);
  } catch (error) {
    console.error("Get user transaction summary error:", error);
    res.status(500).json({ error: "Failed to fetch transaction summary" });
  }
};
