import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Get comprehensive analytics report
export const getAnalyticsReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Set default date range if not provided (last 30 days)
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const [
      customersByPackage,
      incomeAnalysis,
      equipmentOrders,
      subscriptionRevenue,
      paymentAnalysis,
      userGrowth,
      classUtilization,
      topCustomers
    ] = await Promise.all([
      // Customers by package
      prisma.subscription.groupBy({
        by: ['packageId'],
        where: {
          status: 'active',
          createdAt: {
            gte: start,
            lte: end
          }
        },
        _count: { id: true },
        _sum: { 
          proteinSupplementPrice: true 
        }
      }),

      // Total income analysis
      prisma.payment.aggregate({
        where: {
          status: 'succeeded',
          createdAt: {
            gte: start,
            lte: end
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),

      // Equipment purchases and orders
      prisma.gearOrder.findMany({
        where: {
          createdAt: {
            gte: start,
            lte: end
          }
        },
        include: {
          items: {
            include: {
              gearItem: true
            }
          },
          user: {
            select: { email: true, forename: true, surname: true }
          }
        }
      }),

      // Subscription revenue breakdown
      prisma.subscription.findMany({
        where: {
          createdAt: {
            gte: start,
            lte: end
          }
        },
        include: {
          package: true,
          user: {
            select: { email: true, forename: true, surname: true }
          },
          payments: {
            where: { status: 'succeeded' }
          }
        }
      }),

      // Payment status analysis
      prisma.payment.groupBy({
        by: ['status', 'paymentType'],
        where: {
          createdAt: {
            gte: start,
            lte: end
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),

      // User growth over time
      prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: start,
            lte: end
          }
        },
        _count: { id: true }
      }),

      // Class utilization rates
      prisma.session.findMany({
        include: {
          class: true,
          _count: { select: { bookings: true } }
        }
      }),

      // Top customers by spending
      prisma.user.findMany({
        include: {
          subscriptions: {
            include: {
              payments: {
                where: { 
                  status: 'succeeded',
                  createdAt: {
                    gte: start,
                    lte: end
                  }
                }
              }
            }
          },
          gearOrders: {
            where: {
              status: 'paid',
              createdAt: {
                gte: start,
                lte: end
              }
            }
          }
        }
      })
    ]);

    // Get package details for customer breakdown
    const packages = await prisma.package.findMany();
    const packageMap = packages.reduce((acc, pkg) => {
      acc[pkg.id] = pkg;
      return acc;
    }, {} as Record<number, any>);

    // Process customer by package data
    const customersData = customersByPackage.map(item => ({
      package: packageMap[item.packageId] || { name: 'Unknown', price: 0 },
      customerCount: item._count.id,
      proteinSupplementRevenue: item._sum.proteinSupplementPrice || 0
    }));

    // Calculate equipment revenue and popular items
    let totalEquipmentRevenue = 0;
    const equipmentStats = equipmentOrders.reduce((acc, order) => {
      totalEquipmentRevenue += order.totalAmount;
      order.items.forEach(item => {
        const itemName = item.gearItem.name;
        if (!acc[itemName]) {
          acc[itemName] = { quantity: 0, revenue: 0 };
        }
        acc[itemName].quantity += item.quantity;
        acc[itemName].revenue += item.unitPrice * item.quantity;
      });
      return acc;
    }, {} as Record<string, { quantity: number, revenue: number }>);

    // Calculate top spending customers
    const topSpendingCustomers = topCustomers
      .map(user => {
        const subscriptionSpending = user.subscriptions.reduce((sum, sub) => 
          sum + sub.payments.reduce((paySum, payment) => paySum + payment.amount, 0), 0);
        const gearSpending = user.gearOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        return {
          user: {
            email: user.email,
            name: `${user.forename} ${user.surname}`
          },
          totalSpending: subscriptionSpending + gearSpending,
          subscriptionSpending,
          gearSpending
        };
      })
      .filter(customer => customer.totalSpending > 0)
      .sort((a, b) => b.totalSpending - a.totalSpending)
      .slice(0, 10);

    // Process class utilization
    const classUtilizationData = classUtilization.map(session => ({
      id: session.id,
      className: session.class.name,
      timeSlot: session.timeSlot,
      capacity: session.capacity,
      bookings: session._count.bookings,
      utilizationRate: Math.round((session._count.bookings / session.capacity) * 100)
    }));

    res.json({
      reportPeriod: { startDate: start, endDate: end },
      summary: {
        totalIncome: incomeAnalysis._sum.amount || 0,
        totalPayments: incomeAnalysis._count,
        totalEquipmentRevenue,
        totalCustomers: customersData.reduce((sum, item) => sum + item.customerCount, 0)
      },
      customersByPackage: customersData,
      incomeBreakdown: {
        subscriptionRevenue: subscriptionRevenue.reduce((sum, sub) => 
          sum + sub.payments.reduce((paySum, payment) => paySum + payment.amount, 0), 0),
        equipmentRevenue: totalEquipmentRevenue,
        proteinSupplementRevenue: customersData.reduce((sum, item) => sum + item.proteinSupplementRevenue, 0)
      },
      equipmentAnalysis: {
        totalOrders: equipmentOrders.length,
        totalRevenue: totalEquipmentRevenue,
        popularItems: Object.entries(equipmentStats)
          .sort((a, b) => b[1].quantity - a[1].quantity)
          .map(([name, stats]) => ({ name, ...stats }))
      },
      paymentAnalysis: paymentAnalysis.map(payment => ({
        status: payment.status,
        type: payment.paymentType,
        count: payment._count.id,
        totalAmount: payment._sum.amount || 0
      })),
      topCustomers: topSpendingCustomers,
      classUtilization: classUtilizationData,
      recentOrders: equipmentOrders.slice(0, 10).map(order => ({
        id: order.id,
        customer: `${order.user.forename} ${order.user.surname}`,
        email: order.user.email,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        itemCount: order.items.length
      }))
    });
  } catch (error) {
    console.error("Analytics report error:", error);
    res.status(500).json({ error: "Failed to generate analytics report" });
  }
};

// Get dashboard analytics
export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalClasses,
      totalSessions,
      totalBookings,
      recentBookings,
      classPopularity,
      sessionUtilization
    ] = await Promise.all([
      // Total users (non-admin)
      prisma.user.count({
        where: { role: "user" }
      }),
      
      // Total classes
      prisma.class.count(),
      
      // Total sessions
      prisma.session.count(),
      
      // Total bookings
      prisma.booking.count(),
      
      // Recent bookings (last 10)
      prisma.booking.findMany({
        take: 10,
        orderBy: { id: "desc" },
        include: {
          user: { select: { email: true } },
          session: {
            include: { class: { select: { name: true } } }
          }
        }
      }),
      
      // Class popularity
      prisma.booking.groupBy({
        by: ["sessionId"],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: "desc"
          }
        },
        take: 5
      }),
      
      // Session utilization rates
      prisma.session.findMany({
        include: {
          class: { select: { name: true } },
          _count: { select: { bookings: true } }
        }
      })
    ]);

    // Calculate utilization rates
    const utilizationData = sessionUtilization.map(session => ({
      id: session.id,
      className: session.class.name,
      timeSlot: session.timeSlot,
      capacity: session.capacity,
      bookings: session._count.bookings,
      utilizationRate: Math.round((session._count.bookings / session.capacity) * 100)
    }));

    res.json({
      summary: {
        totalUsers,
        totalClasses,
        totalSessions,
        totalBookings
      },
      recentBookings,
      classPopularity,
      sessionUtilization: utilizationData
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { id: "desc" }
    });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all bookings with filters
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, classId, timeSlot } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (classId) {
      where.session = { classId: Number(classId) };
    }
    if (timeSlot) {
      where.session = { ...where.session, timeSlot: timeSlot as string };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          user: { select: { email: true } },
          session: {
            include: { class: { select: { name: true } } }
          }
        },
        orderBy: { id: "desc" }
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update session capacity
export const updateSessionCapacity = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { capacity } = req.body;

    if (!capacity || capacity < 1) {
      return res.status(400).json({ error: "Invalid capacity" });
    }

    // Check if new capacity is less than current bookings
    const session = await prisma.session.findUnique({
      where: { id: parseInt(sessionId) }
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (capacity < session.bookingCount) {
      return res.status(400).json({ 
        error: `Cannot reduce capacity below current bookings (${session.bookingCount})` 
      });
    }

    const updatedSession = await prisma.session.update({
      where: { id: parseInt(sessionId) },
      data: { capacity: Number(capacity) },
      include: {
        class: { select: { name: true } }
      }
    });

    res.json(updatedSession);
  } catch (error) {
    console.error("Update session capacity error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a class (and all its sessions)
export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    // Delete in transaction to maintain data integrity
    await prisma.$transaction(async (tx) => {
      // First delete all bookings for sessions of this class
      await tx.booking.deleteMany({
        where: {
          session: { classId: parseInt(classId) }
        }
      });

      // Then delete all sessions for this class
      await tx.session.deleteMany({
        where: { classId: parseInt(classId) }
      });

      // Finally delete the class
      await tx.class.delete({
        where: { id: parseInt(classId) }
      });
    });

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get financial overview
export const getFinancialOverview = async (req: Request, res: Response) => {
  try {
    const { period = "30" } = req.query; // Default to last 30 days
    const daysBack = parseInt(period as string);
    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const [
      subscriptionRevenue,
      equipmentRevenue,
      totalPayments,
      failedPayments,
      pendingPayments,
      revenueByDay
    ] = await Promise.all([
      // Subscription revenue
      prisma.payment.aggregate({
        where: {
          paymentType: 'subscription',
          status: 'succeeded',
          createdAt: { gte: startDate }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),

      // Equipment revenue
      prisma.payment.aggregate({
        where: {
          paymentType: 'gear',
          status: 'succeeded',
          createdAt: { gte: startDate }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),

      // Total successful payments
      prisma.payment.aggregate({
        where: {
          status: 'succeeded',
          createdAt: { gte: startDate }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),

      // Failed payments (potential penalties)
      prisma.payment.aggregate({
        where: {
          status: 'failed',
          createdAt: { gte: startDate }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),

      // Pending payments
      prisma.payment.aggregate({
        where: {
          status: 'pending',
          createdAt: { gte: startDate }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),

      // Revenue by day for chart
      prisma.payment.findMany({
        where: {
          status: 'succeeded',
          createdAt: { gte: startDate }
        },
        select: {
          amount: true,
          createdAt: true,
          paymentType: true
        },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    // Group revenue by day
    const revenueChart = revenueByDay.reduce((acc, payment) => {
      const date = payment.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, total: 0, subscription: 0, gear: 0 };
      }
      acc[date].total += payment.amount;
      if (payment.paymentType === 'subscription') {
        acc[date].subscription += payment.amount;
      } else if (payment.paymentType === 'gear') {
        acc[date].gear += payment.amount;
      }
      return acc;
    }, {} as Record<string, any>);

    res.json({
      period: `${daysBack} days`,
      summary: {
        totalRevenue: totalPayments._sum.amount || 0,
        subscriptionRevenue: subscriptionRevenue._sum.amount || 0,
        equipmentRevenue: equipmentRevenue._sum.amount || 0,
        totalTransactions: totalPayments._count,
        failedPayments: {
          count: failedPayments._count,
          amount: failedPayments._sum.amount || 0
        },
        pendingPayments: {
          count: pendingPayments._count,
          amount: pendingPayments._sum.amount || 0
        }
      },
      revenueChart: Object.values(revenueChart),
      breakdown: {
        subscriptionStats: {
          revenue: subscriptionRevenue._sum.amount || 0,
          transactions: subscriptionRevenue._count
        },
        equipmentStats: {
          revenue: equipmentRevenue._sum.amount || 0,
          transactions: equipmentRevenue._count
        }
      }
    });
  } catch (error) {
    console.error("Financial overview error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get equipment management data
export const getEquipmentManagement = async (req: Request, res: Response) => {
  try {
    const [
      allGearItems,
      recentOrders,
      orderStats,
      popularItems
    ] = await Promise.all([
      // All gear items
      prisma.gearItem.findMany({
        include: {
          _count: {
            select: { gearOrderItems: true }
          }
        }
      }),

      // Recent orders
      prisma.gearOrder.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true, forename: true, surname: true }
          },
          items: {
            include: {
              gearItem: true
            }
          }
        }
      }),

      // Order statistics
      prisma.gearOrder.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { totalAmount: true }
      }),

      // Most popular items
      prisma.gearOrderItem.groupBy({
        by: ['gearItemId'],
        _sum: { quantity: true },
        _count: { id: true },
        orderBy: {
          _sum: { quantity: 'desc' }
        },
        take: 10
      })
    ]);

    // Get gear item details for popular items
    const popularItemsWithDetails = await Promise.all(
      popularItems.map(async (item) => {
        const gearItem = await prisma.gearItem.findUnique({
          where: { id: item.gearItemId }
        });
        return {
          item: gearItem,
          totalQuantity: item._sum.quantity || 0,
          orderCount: item._count.id
        };
      })
    );

    res.json({
      gearItems: allGearItems,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        customer: `${order.user.forename} ${order.user.surname}`,
        email: order.user.email,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          name: item.gearItem.name,
          size: item.size,
          quantity: item.quantity,
          customText: item.customText
        }))
      })),
      orderStatistics: orderStats.map(stat => ({
        status: stat.status,
        count: stat._count.id,
        totalValue: stat._sum.totalAmount || 0
      })),
      popularItems: popularItemsWithDetails
    });
  } catch (error) {
    console.error("Equipment management error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update gear item
export const updateGearItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { name, description, price, isActive } = req.body;

    const updatedItem = await prisma.gearItem.update({
      where: { id: parseInt(itemId) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("Update gear item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedOrder = await prisma.gearOrder.update({
      where: { id: parseInt(orderId) },
      data: { status },
      include: {
        user: {
          select: { email: true, forename: true, surname: true }
        },
        items: {
          include: {
            gearItem: true
          }
        }
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
