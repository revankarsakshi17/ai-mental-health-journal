import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      required: true,
      enum: ["happy", "excited", "celebrate", "calm", "neutral", "sad", "crying"],
    },
    emoji: {
      type: String,
      required: true,
    },
    date: {
      type: String, // stored as YYYY-MM-DD
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mood", moodSchema);