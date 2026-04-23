import Mood from "../models/mood.js";

const EMOJI_MAP = {
  happy: "😊", excited: "😂", celebrate: "🥳",
  calm: "😌", neutral: "😐", sad: "😔", crying: "😢",
};

// POST /api/mood — save today's mood
export const saveMood = async (req, res) => {
  try {
    const { mood } = req.body;
    const today = new Date().toISOString().split("T")[0];

    if (!EMOJI_MAP[mood]) {
      return res.status(400).json({ message: "Invalid mood." });
    }

    // Update if already exists today, else create
    const existing = await Mood.findOneAndUpdate(
      { user: req.user._id, date: today },
      { mood, emoji: EMOJI_MAP[mood] },
      { new: true, upsert: true }
    );

    res.json(existing);
  } catch (error) {
    console.error("saveMood error:", error.message);
    res.status(500).json({ message: "Failed to save mood." });
  }
};

// GET /api/mood/today — get today's mood
export const getTodayMood = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const mood = await Mood.findOne({ user: req.user._id, date: today });
    res.json(mood || null);
  } catch (error) {
    console.error("getTodayMood error:", error.message);
    res.status(500).json({ message: "Failed to get mood." });
  }
};

// GET /api/mood/history — get all moods
export const getMoodHistory = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    console.error("getMoodHistory error:", error.message);
    res.status(500).json({ message: "Failed to get mood history." });
  }
};