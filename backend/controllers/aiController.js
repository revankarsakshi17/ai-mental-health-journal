import Journal from "../models/journal.js";

// GET /api/ai/mood-stats
export const getMoodStats = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id });
    const stats = {};
    journals.forEach((j) => {
      const em = j.primaryEmotion || j.emotion || "neutral";
      stats[em] = (stats[em] || 0) + 1;
    });
    res.json(stats);
  } catch (error) {
    console.error("getMoodStats error:", error.message);
    res.status(500).json({ message: "Failed to get mood stats." });
  }
};

// GET /api/ai/dashboard
export const getDashboard = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({
      createdAt: 1,
    });

    if (journals.length === 0) {
      return res.json({
        totalEntries: 0,
        averageSentiment: 0,
        dominantEmotion: "neutral",
        sentimentTrend: [],
        emotionDistribution: {},
        sentimentSplit: { Positive: 0, Neutral: 0, Negative: 0 },
      });
    }

    const avgSentiment = Math.round(
      journals.reduce((sum, j) => sum + (j.sentimentScore || 0), 0) /
        journals.length
    );

    const emotionCount = {};
    journals.forEach((j) => {
      const em = j.primaryEmotion || "neutral";
      emotionCount[em] = (emotionCount[em] || 0) + 1;
    });

    const dominantEmotion = Object.entries(emotionCount).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    const sentimentTrend = journals.slice(-14).map((j) => ({
      date: j.createdAt,
      score: j.sentimentScore || 0,
      label: j.sentimentLabel || "Neutral",
      emotion: j.primaryEmotion || "neutral",
    }));

    const sentimentSplit = { Positive: 0, Neutral: 0, Negative: 0 };
    journals.forEach((j) => {
      const label = j.sentimentLabel || "Neutral";
      sentimentSplit[label] = (sentimentSplit[label] || 0) + 1;
    });

    const emotionDistribution = {};
    Object.entries(emotionCount).forEach(([em, cnt]) => {
      emotionDistribution[em] = Math.round((cnt / journals.length) * 100);
    });

    res.json({
      totalEntries: journals.length,
      averageSentiment: avgSentiment,
      dominantEmotion,
      sentimentTrend,
      emotionDistribution,
      sentimentSplit,
    });
  } catch (error) {
    console.error("getDashboard error:", error.message);
    res.status(500).json({ message: "Failed to get dashboard data." });
  }
};