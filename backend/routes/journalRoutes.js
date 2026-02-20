import express from "express";
import Journal from "../models/journal.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Add journal entry
router.post("/", protect, async (req, res) => {
  try {
    const { text, emotion } = req.body;

    const journal = await Journal.create({
      user: req.user._id,
      text,
      emotion,
    });

    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's journals
router.get("/", protect, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
