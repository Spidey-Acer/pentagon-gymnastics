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
// Configure CORS for production
const corsOptions = {
  origin: [
    "http://localhost:5173", // Vite dev server
    "https://Pentagon-gymnastics-frontend.onrender.com", // Production frontend
    /\.onrender\.com$/, // Allow all Render subdomains
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/classes", classRoutes_1.default);
app.use("/api/sessions", sessionRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
