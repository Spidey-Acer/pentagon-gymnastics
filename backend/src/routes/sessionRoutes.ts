import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/authMiddleware"; // Ensure this import
import { bookSession } from "../controllers/sessionController";

const router = Router();

router.post("/book", authenticate, bookSession); // Apply auth to prevent anonymous bookings

router.get("/booked", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { session: { include: { class: true } } },
    });
    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete(
  "/bookings/:id",
  authenticate,
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const bookingId = parseInt(req.params.id);

    try {
      // First check if the booking exists and belongs to the user
      const booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          userId: userId,
        },
        include: { session: true },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Use transaction to ensure data consistency
      await prisma.$transaction(async (tx) => {
        // Decrement booking count for the session
        await tx.session.update({
          where: { id: booking.sessionId },
          data: { bookingCount: { decrement: 1 } },
        });

        // Delete the booking
        await tx.booking.delete({
          where: { id: bookingId },
        });
      });

      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Delete booking error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/clear-bookings",
  authenticate,
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
      // Get all user's bookings to decrement session booking counts
      const userBookings = await prisma.booking.findMany({
        where: { userId },
        include: { session: true },
      });

      // Use transaction to ensure data consistency
      await prisma.$transaction(async (tx) => {
        // Decrement booking count for each session
        for (const booking of userBookings) {
          await tx.session.update({
            where: { id: booking.sessionId },
            data: { bookingCount: { decrement: 1 } },
          });
        }

        // Delete all user's bookings
        await tx.booking.deleteMany({
          where: { userId },
        });
      });

      res.json({ message: "All bookings cleared successfully" });
    } catch (error) {
      console.error("Clear bookings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
