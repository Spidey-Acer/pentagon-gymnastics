import { Router } from "express";
import { register, login, updateProfile, validateToken } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/validate", authenticate, validateToken);
router.put("/profile/:id", authenticate, updateProfile);

export default router;
