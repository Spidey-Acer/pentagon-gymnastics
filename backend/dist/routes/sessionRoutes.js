"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const authMiddleware_1 = require("../middleware/authMiddleware"); // Ensure this import
const sessionController_1 = require("../controllers/sessionController");
const router = (0, express_1.Router)();
router.post("/book", authMiddleware_1.authenticate, sessionController_1.bookSession); // Apply auth to prevent anonymous bookings
router.get("/booked", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const bookings = yield prisma_1.prisma.booking.findMany({
            where: { userId },
            include: { session: { include: { class: true } } },
        });
        res.json(bookings);
    }
    catch (error) {
        console.error("Fetch bookings error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.delete("/bookings/:id", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const bookingId = parseInt(req.params.id);
    try {
        // First check if the booking exists and belongs to the user
        const booking = yield prisma_1.prisma.booking.findFirst({
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
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Decrement booking count for the session
            yield tx.session.update({
                where: { id: booking.sessionId },
                data: { bookingCount: { decrement: 1 } },
            });
            // Delete the booking
            yield tx.booking.delete({
                where: { id: bookingId },
            });
        }));
        res.json({ message: "Booking deleted successfully" });
    }
    catch (error) {
        console.error("Delete booking error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.delete("/clear-bookings", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        // Get all user's bookings to decrement session booking counts
        const userBookings = yield prisma_1.prisma.booking.findMany({
            where: { userId },
            include: { session: true },
        });
        // Use transaction to ensure data consistency
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Decrement booking count for each session
            for (const booking of userBookings) {
                yield tx.session.update({
                    where: { id: booking.sessionId },
                    data: { bookingCount: { decrement: 1 } },
                });
            }
            // Delete all user's bookings
            yield tx.booking.deleteMany({
                where: { userId },
            });
        }));
        res.json({ message: "All bookings cleared successfully" });
    }
    catch (error) {
        console.error("Clear bookings error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
