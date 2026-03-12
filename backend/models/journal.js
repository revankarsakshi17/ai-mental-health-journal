import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  text: {
    type: String,
    required: true
  },

  emotion: {
    type: String,
    default: "Neutral"
  }
},
{ timestamps: true }
);

export default mongoose.model("Journal", journalSchema);