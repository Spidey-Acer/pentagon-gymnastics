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

export default router;
