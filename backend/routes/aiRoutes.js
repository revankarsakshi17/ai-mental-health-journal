import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getMoodStats, getDashboard } from "../controllers/aiController.js";
import { chat } from "../controllers/chatController.js";

const router = express.Router();

router.get("/mood-stats", protect, getMoodStats);
router.get("/dashboard", protect, getDashboard);
router.post("/chat", protect, chat);

export default router;