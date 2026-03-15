import Journal from "../models/journal.js";

export const getMoodStats = async (req, res) => {
  try {                                                    // ✅ added try {

    const journals = await Journal.find({ user: req.user._id });

    const stats = {};

    journals.forEach(j => {
      if (!stats[j.emotion]) {
        stats[j.emotion] = 0;
      }
      stats[j.emotion]++;
    });                                                    // ✅ close forEach here

    res.json(stats);                                       // ✅ send response AFTER loop

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};