import express from 'express';
import { GearController } from '../controllers/gearController';
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Back-compat: simple list for pages expecting an array at /api/gear
router.get("/", async (_req, res) => {
  try {
    const items = await prisma.gearItem.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    res.json(items);
  } catch (error) {
    console.error("Error fetching gear items (array):", error);
    res.status(500).json([]);
  }
});

// Get all gear items (public)
router.get('/items', GearController.getGearItems);

// Protected routes (require authentication)
router.post('/order', authenticate, GearController.createGearOrder);
router.post('/order/payment', authenticate, GearController.processGearOrderPayment);
router.get('/orders', authenticate, GearController.getUserOrders);
router.get('/orders/:orderId', authenticate, GearController.getOrderById);

export default router;
