import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import classRoutes from "./routes/classRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import adminRoutes from "./routes/adminRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import gearRoutes from "./routes/gearRoutes";
import webhookRoutes from "./routes/webhookRoutes";

const app = express();

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

app.use(cors(corsOptions));

// IMPORTANT: Webhook routes must come BEFORE express.json()
// because Stripe needs the raw body for signature verification
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/gear", gearRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
