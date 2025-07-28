import { Router } from "express";
import { getClasses, createClass } from "../controllers/classController";

const router = Router();
router.get("/", getClasses);
router.post("/", createClass); // Admin only, add middleware

export default router;
