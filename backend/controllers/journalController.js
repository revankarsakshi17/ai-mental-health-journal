import Journal from "../models/journal.js";
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";

export const createJournal = async (req, res) => {
  try {
    const { text } = req.body;
    const emotion = analyzeEmotion(text);
    const journal = await Journal.create({ user: req.user._id, text, emotion });
    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};