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
exports.deleteClass = exports.updateSessionCapacity = exports.getAllBookings = exports.updateUserRole = exports.getAllUsers = exports.getAdminDashboard = void 0;
const prisma_1 = require("../lib/prisma");
// Get dashboard analytics
const getAdminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [totalUsers, totalClasses, totalSessions, totalBookings, recentBookings, classPopularity, sessionUtilization] = yield Promise.all([
            // Total users (non-admin)
            prisma_1.prisma.user.count({
                where: { role: "user" }
            }),
            // Total classes
            prisma_1.prisma.class.count(),
            // Total sessions
            prisma_1.prisma.session.count(),
            // Total bookings
            prisma_1.prisma.booking.count(),
            // Recent bookings (last 10)
            prisma_1.prisma.booking.findMany({
                take: 10,
                orderBy: { id: "desc" },
                include: {
                    user: { select: { email: true } },
                    session: {
                        include: { class: { select: { name: true } } }
                    }
                }
            }),
            // Class popularity
            prisma_1.prisma.booking.groupBy({
                by: ["sessionId"],
                _count: {
                    id: true
                },
                orderBy: {
                    _count: {
                        id: "desc"
                    }
                },
                take: 5
            }),
            // Session utilization rates
            prisma_1.prisma.session.findMany({
                include: {
                    class: { select: { name: true } },
                    _count: { select: { bookings: true } }
                }
            })
        ]);
        // Calculate utilization rates
        const utilizationData = sessionUtilization.map(session => ({
            id: session.id,
            className: session.class.name,
            timeSlot: session.timeSlot,
            capacity: session.capacity,
            bookings: session._count.bookings,
            utilizationRate: Math.round((session._count.bookings / session.capacity) * 100)
        }));
        res.json({
            summary: {
                totalUsers,
                totalClasses,
                totalSessions,
                totalBookings
            },
            recentBookings,
            classPopularity,
            sessionUtilization: utilizationData
        });
    }
    catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAdminDashboard = getAdminDashboard;
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: { id: "desc" }
        });
        res.json(users);
    }
    catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllUsers = getAllUsers;
// Update user role
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        const updatedUser = yield prisma_1.prisma.user.update({
            where: { id: parseInt(userId) },
            data: { role },
            select: {
                id: true,
                email: true,
                role: true
            }
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateUserRole = updateUserRole;
// Get all bookings with filters
const getAllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 50, classId, timeSlot } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (classId) {
            where.session = { classId: Number(classId) };
        }
        if (timeSlot) {
            where.session = Object.assign(Object.assign({}, where.session), { timeSlot: timeSlot });
        }
        const [bookings, total] = yield Promise.all([
            prisma_1.prisma.booking.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    user: { select: { email: true } },
                    session: {
                        include: { class: { select: { name: true } } }
                    }
                },
                orderBy: { id: "desc" }
            }),
            prisma_1.prisma.booking.count({ where })
        ]);
        res.json({
            bookings,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllBookings = getAllBookings;
// Update session capacity
const updateSessionCapacity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        const { capacity } = req.body;
        if (!capacity || capacity < 1) {
            return res.status(400).json({ error: "Invalid capacity" });
        }
        // Check if new capacity is less than current bookings
        const session = yield prisma_1.prisma.session.findUnique({
            where: { id: parseInt(sessionId) }
        });
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        if (capacity < session.bookingCount) {
            return res.status(400).json({
                error: `Cannot reduce capacity below current bookings (${session.bookingCount})`
            });
        }
        const updatedSession = yield prisma_1.prisma.session.update({
            where: { id: parseInt(sessionId) },
            data: { capacity: Number(capacity) },
            include: {
                class: { select: { name: true } }
            }
        });
        res.json(updatedSession);
    }
    catch (error) {
        console.error("Update session capacity error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateSessionCapacity = updateSessionCapacity;
// Delete a class (and all its sessions)
const deleteClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        // Delete in transaction to maintain data integrity
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // First delete all bookings for sessions of this class
            yield tx.booking.deleteMany({
                where: {
                    session: { classId: parseInt(classId) }
                }
            });
            // Then delete all sessions for this class
            yield tx.session.deleteMany({
                where: { classId: parseInt(classId) }
            });
            // Finally delete the class
            yield tx.class.delete({
                where: { id: parseInt(classId) }
            });
        }));
        res.json({ message: "Class deleted successfully" });
    }
    catch (error) {
        console.error("Delete class error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteClass = deleteClass;
