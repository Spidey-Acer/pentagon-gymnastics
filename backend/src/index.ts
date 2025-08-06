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
import paymentRoutes from "./routes/paymentRoutes";
import maintenanceRoutes from "./routes/maintenanceRoutes";

const app = express();

// Dynamic CORS configuration based on environment
const allowedOrigins = [
  // Local development
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  // Production domains
  "https://abc-gymnastics-1.onrender.com",
  "https://abc-gymnastics.onrender.com",
];

// Add environment-specific origins
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or matches onrender pattern
      if (allowedOrigins.includes(origin) || /^https:\/\/.*\.onrender\.com$/.test(origin)) {
        return callback(null, true);
      }
      
      // Log rejected origins in development
      if (process.env.NODE_ENV === 'development') {
        console.log('CORS rejected origin:', origin);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// Handle preflight requests for all routes
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

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
app.use("/api/payments", paymentRoutes);
app.use("/api/maintenance", maintenanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
