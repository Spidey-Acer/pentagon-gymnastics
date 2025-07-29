import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const bookSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const userId = (req as any).user.id; // From authMiddleware; ensure middleware is applied to this route
  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (session.bookingCount >= session.capacity) {
      return res.status(400).json({ error: "Session fully booked" });
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
