import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getMoodStats } from "../controllers/aiController.js";

const router = express.Router();

router.get("/mood-stats", protect, getMoodStats);

export default router;