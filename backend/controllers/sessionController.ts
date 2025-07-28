import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const bookSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (session && session.bookings < session.capacity) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { bookings: { increment: 1 } },
    });
    res.json({ message: "Booked" });
  } else {
    res.status(400).json({ error: "Full or invalid" });
  }
};
