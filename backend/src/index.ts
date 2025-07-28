import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import classRoutes from "./routes/classRoutes";
import sessionRoutes from "./routes/sessionRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/sessions", sessionRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
