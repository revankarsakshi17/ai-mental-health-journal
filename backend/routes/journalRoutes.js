import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createJournal,
  getJournals,
  getJournalById,
  deleteJournal,
} from "../controllers/journalController.js";

const router = express.Router();

router.post("/", protect, createJournal);
router.get("/", protect, getJournals);
router.get("/:id", protect, getJournalById);
router.delete("/:id", protect, deleteJournal);

export default router;