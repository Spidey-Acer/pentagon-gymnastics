import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import classRoutes from "./routes/classRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import gearRoutes from "./routes/gearRoutes";
import adminRoutes from "./routes/adminRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import transactionRoutes from "./routes/transactionRoutes";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/gear", gearRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
