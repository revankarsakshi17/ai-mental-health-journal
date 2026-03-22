import Journal from "../models/journal.js";
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";

// POST /api/journals
export const createJournal = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Journal text is required." });
    }

    const analysis = await analyzeEmotion(text);

    const journal = await Journal.create({
      user: req.user._id,
      text,
      emotion: analysis.primaryEmotion,
      primaryEmotion: analysis.primaryEmotion,
      emotions: analysis.emotions,
      sentimentScore: analysis.sentimentScore,
      sentimentLabel: analysis.sentimentLabel,
      themes: analysis.themes,
      suggestions: analysis.suggestions,
      summary: analysis.summary,
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error("createJournal error:", error.message);
    res.status(500).json({ message: "Failed to create journal entry." });
  }
};

// GET /api/journals
export const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(journals);
  } catch (error) {
    console.error("getJournals error:", error.message);
    res.status(500).json({ message: "Failed to fetch journals." });
  }
};

// GET /api/journals/:id
export const getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!journal) {
      return res.status(404).json({ message: "Journal entry not found." });
    }
    res.json(journal);
  } catch (error) {
    console.error("getJournalById error:", error.message);
    res.status(500).json({ message: "Failed to fetch journal entry." });
  }
};

// DELETE /api/journals/:id
export const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!journal) {
      return res.status(404).json({ message: "Journal entry not found." });
    }
    res.json({ message: "Journal entry deleted." });
  } catch (error) {
    console.error("deleteJournal error:", error.message);
    res.status(500).json({ message: "Failed to delete journal entry." });
  }
};