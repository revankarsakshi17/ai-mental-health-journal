import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    emotion: {
      type: String,
      default: "neutral",
    },
    primaryEmotion: {
      type: String,
      default: "neutral",
    },
    emotions: {
      type: Map,
      of: Number,
      default: {},
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
    sentimentLabel: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Neutral",
    },
    themes: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Journal", journalSchema);