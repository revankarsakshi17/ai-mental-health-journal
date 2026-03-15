import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createJournal } from "../controllers/journalController.js";
import Journal from "../models/journal.js"; 

const router = express.Router();

router.post("/", protect, createJournal);

router.get("/", protect, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;