"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const requireAdmin = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Authentication required" });
    }
    if (user.role !== "admin") {
        return res.status(403).json({ error: "Admin privileges required" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
