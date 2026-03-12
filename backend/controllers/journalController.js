import Journal from "./models/Journal.js";
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";

export const createJournal = async (req, res) => {

  const { text } = req.body;

  const emotion = analyzeEmotion(text);

  const journal = await Journal.create({
    user: req.user._id,
    text,
    emotion
  });

  res.json(journal);
};