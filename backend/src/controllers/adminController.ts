import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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
