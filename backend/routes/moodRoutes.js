import express from "express";
import protect from "../middleware/authMiddleware.js";
import { saveMood, getTodayMood, getMoodHistory } from "../controllers/moodController.js";

const router = express.Router();

router.post("/", protect, saveMood);
router.get("/today", protect, getTodayMood);
router.get("/history", protect, getMoodHistory);

export default router;