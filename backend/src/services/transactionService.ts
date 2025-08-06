import { prisma } from "../lib/prisma";

export interface TransactionData {
  userId: number;
  type: 'subscription' | 'gear' | 'booking' | 'cancellation' | 'refund' | 'penalty';
  amount: number;
  currency?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  description: string;
  relatedId?: number;
  relatedType?: string;
  stripePaymentId?: string;
  metadata?: any;
}

export interface ActivityData {
  userId: number;
  action: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export class TransactionService {
  // Log a transaction
  static async logTransaction(data: TransactionData) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          userId: data.userId,
          type: data.type,
          amount: data.amount,
          currency: data.currency || 'gbp',
          status: data.status,
          description: data.description,
          relatedId: data.relatedId,
          relatedType: data.relatedType,
          stripePaymentId: data.stripePaymentId,
          metadata: data.metadata || {}
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              forename: true,
              surname: true
            }
          }
        }
      });

      console.log(`Transaction logged: ${data.type} - £${data.amount} for user ${data.userId}`);
      return transaction;
    } catch (error) {
      console.error('Failed to log transaction:', error);
      throw error;
    }
  }

  // Log user activity
  static async logActivity(data: ActivityData) {
    try {
      const activity = await prisma.activityLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          description: data.description,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: data.metadata || {}
        }
      });

      return activity;
    } catch (error) {
      console.error('Failed to log activity:', error);
      throw error;
    }
  }

  // Get user transactions with pagination
  static async getUserTransactions(userId: number, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                forename: true,
                surname: true
              }
            }
          }
        }),
        prisma.transaction.count({ where: { userId } })
      ]);

      return {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Failed to get user transactions:', error);
      throw error;
    }
  }

  // Get all transactions for admin (with filters)
  static async getAllTransactions(filters: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    userId?: number;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        type,
        status,
        userId,
        startDate,
        endDate
      } = filters;

      const skip = (page - 1) * limit;
      
      const where: any = {};
      
      if (type) where.type = type;
      if (status) where.status = status;
      if (userId) where.userId = userId;
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                forename: true,
                surname: true
              }
            }
          }
        }),
        prisma.transaction.count({ where })
      ]);

      return {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Failed to get all transactions:', error);
      throw error;
    }
  }

  // Get transaction statistics
  static async getTransactionStats(filters: {
    startDate?: Date;
    endDate?: Date;
    userId?: number;
  } = {}) {
    try {
      const { startDate, endDate, userId } = filters;
      
      const where: any = {};
      if (userId) where.userId = userId;
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const [
        totalRevenue,
        transactionsByType,
        transactionsByStatus,
        recentTransactions
      ] = await Promise.all([
        // Total revenue
        prisma.transaction.aggregate({
          where: { ...where, status: 'completed' },
          _sum: { amount: true },
          _count: { id: true }
        }),

        // Transactions by type
        prisma.transaction.groupBy({
          by: ['type'],
          where,
          _sum: { amount: true },
          _count: { id: true }
        }),

        // Transactions by status
        prisma.transaction.groupBy({
          by: ['status'],
          where,
          _sum: { amount: true },
          _count: { id: true }
        }),

        // Recent transactions
        prisma.transaction.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                forename: true,
                surname: true
              }
            }
          }
        })
      ]);

      return {
        summary: {
          totalRevenue: totalRevenue._sum.amount || 0,
          totalTransactions: totalRevenue._count
        },
        byType: transactionsByType.map(item => ({
          type: item.type,
          count: item._count.id,
          totalAmount: item._sum.amount || 0
        })),
        byStatus: transactionsByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
          totalAmount: item._sum.amount || 0
        })),
        recentTransactions
      };
    } catch (error) {
      console.error('Failed to get transaction stats:', error);
      throw error;
    }
  }

  // Get user activity log
  static async getUserActivityLog(userId: number, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const [activities, total] = await Promise.all([
        prisma.activityLog.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.activityLog.count({ where: { userId } })
      ]);

      return {
        activities,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Failed to get user activity log:', error);
      throw error;
    }
  }
}
