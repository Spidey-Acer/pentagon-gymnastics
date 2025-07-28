import { Router } from "express";
import { bookSession } from "../controllers/sessionController";

const router = Router();
router.post("/book", bookSession);

export default router;
