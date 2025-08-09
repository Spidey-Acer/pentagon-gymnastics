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

    // Map to rental-friendly shape expected by frontend EquipmentBooking page
    const mapped = items.map((i) => {
      const baseDay = Math.max(1, Number.isFinite(i.price) ? (i.price as number) : 1);
      return {
        id: i.id,
        name: i.name,
        description: i.description,
        category: i.category || "equipment",
        imageUrl: i.imageUrl || undefined,
        // Derived rental prices (simple heuristics)
        pricePerDay: baseDay,
        pricePerWeek: Math.round(baseDay * 6 * 100) / 100,
        pricePerMonth: Math.round(baseDay * 20 * 100) / 100,
        // Stock and discount helpers
        availableStock: i.stock ?? 0,
        discountPercentage: 10,
      };
    });

    res.json(mapped);
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
