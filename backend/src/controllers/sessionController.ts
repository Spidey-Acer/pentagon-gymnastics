import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const bookSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const userId = (req as any).user.id; // From authMiddleware; ensure middleware is applied to this route
  
  try {
    // Validate input
    if (!sessionId) {
      return res.status(400).json({
        error: "Session ID is required",
      });
    }

    // Check if user has an active subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        package: {
          include: {
            packageClasses: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

    if (!subscription) {
      return res.status(403).json({
        error: "No subscription found. Please select a package first.",
        code: "NO_SUBSCRIPTION",
      });
    }

    if (subscription.status !== "active") {
      return res.status(403).json({
        error: `Your subscription is ${subscription.status}. Please complete payment or contact support.`,
        code: "SUBSCRIPTION_NOT_ACTIVE",
      });
    }

    // Check if subscription is still valid
    const now = new Date();
    if (subscription.endDate < now) {
      return res.status(403).json({
        error: "Your subscription has expired. Please renew to book sessions.",
        code: "SUBSCRIPTION_EXPIRED",
      });
    }

    // Get session details
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        class: {
          include: {
            packageClasses: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if user's package includes access to this class
    const hasClassAccess = session.class.packageClasses.some(
      (pc) => pc.packageId === subscription.packageId
    );

    if (!hasClassAccess) {
      return res.status(403).json({
        error: `Your ${subscription.package.name} package doesn't include access to ${session.class.name} classes. Please upgrade your package.`,
        code: "CLASS_NOT_INCLUDED",
        suggestedAction: "upgrade_package",
      });
    }

    // Check session capacity
    if (session.bookingCount >= session.capacity) {
      return res.status(400).json({
        error: "Session is fully booked. Please try another time slot.",
        code: "SESSION_FULL",
      });
    }

    // Check if user already booked this session
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        sessionId,
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "You have already booked this session",
        code: "ALREADY_BOOKED",
      });
    }

    // Create booking and update session count in a transaction
    const result = await prisma.$transaction([
      prisma.session.update({
        where: { id: sessionId },
        data: { bookingCount: { increment: 1 } },
      }),
      prisma.booking.create({
        data: { userId, sessionId },
        include: {
          session: {
            include: {
              class: true,
            },
          },
        },
      }),
    ]);

    const booking = result[1];

    res.json({
      success: true,
      message: "Session booked successfully",
      booking,
      sessionDetails: {
        className: booking.session.class.name,
        timeSlot: booking.session.timeSlot,
        remainingSpots: booking.session.capacity - booking.session.bookingCount,
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      error: "Internal server error. Please try again.",
      code: "SERVER_ERROR",
    });
  }
};
