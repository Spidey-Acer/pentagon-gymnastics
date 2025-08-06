import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const bookSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const userId = (req as any).user.id; // From authMiddleware; ensure middleware is applied to this route
  try {
    // Check if user has an active subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: { package: true }
    });

    if (!subscription || subscription.status !== 'active') {
      return res.status(403).json({ 
        error: "Active subscription required to book sessions. Please select a package first." 
      });
    }

    // Check if subscription is still valid
    const now = new Date();
    if (subscription.endDate < now) {
      return res.status(403).json({ 
        error: "Your subscription has expired. Please renew to book sessions." 
      });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        class: {
          include: {
            packageClasses: true
          }
        }
      }
    });
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if user's package includes access to this class
    const hasClassAccess = session.class.packageClasses.some(
      pc => pc.packageId === subscription.packageId
    );

    if (!hasClassAccess) {
      return res.status(403).json({ 
        error: `Your ${subscription.package.name} package doesn't include access to ${session.class.name} classes. Please upgrade your package.` 
      });
    }

    if (session.bookingCount >= session.capacity) {
      return res.status(400).json({ error: "Session fully booked" });
    }

    // Check if user already booked this session
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        sessionId
      }
    });

    if (existingBooking) {
      return res.status(400).json({ error: "You have already booked this session" });
    }

    await prisma.$transaction([
      prisma.session.update({
        where: { id: sessionId },
        data: { bookingCount: { increment: 1 } },
      }),
      prisma.booking.create({
        data: { userId, sessionId },
      }),
    ]);
    res.json({ message: "Booked successfully" });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
