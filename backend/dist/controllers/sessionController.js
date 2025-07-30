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
exports.bookSession = void 0;
const prisma_1 = require("../lib/prisma");
const bookSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.body;
    const userId = req.user.id; // From authMiddleware; ensure middleware is applied to this route
    try {
        const session = yield prisma_1.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        if (session.bookingCount >= session.capacity) {
            return res.status(400).json({ error: "Session fully booked" });
        }
        yield prisma_1.prisma.$transaction([
            prisma_1.prisma.session.update({
                where: { id: sessionId },
                data: { bookingCount: { increment: 1 } },
            }),
            prisma_1.prisma.booking.create({
                data: { userId, sessionId },
            }),
        ]);
        res.json({ message: "Booked successfully" });
    }
    catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.bookSession = bookSession;
