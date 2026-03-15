import Journal from "../models/journal.js";

export const getMoodStats = async (req, res) => {

  const journals = await Journal.find({ user: req.user._id });

  const stats = {};

  journals.forEach(j => {

    if (!stats[j.emotion]) {
      stats[j.emotion] = 0;
    }

    stats[j.emotion]++;

  });

  res.json(stats);
};