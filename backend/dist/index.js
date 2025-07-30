"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const classRoutes_1 = __importDefault(require("./routes/classRoutes"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/classes", classRoutes_1.default);
app.use("/api/sessions", sessionRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.listen(5000, () => console.log("Server running on port 5000"));
