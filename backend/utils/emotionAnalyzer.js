export const analyzeEmotion = (text) => {

  const lower = text.toLowerCase();

  if (lower.includes("happy") || lower.includes("great")) {
    return "Happy";
  }

  if (lower.includes("sad") || lower.includes("cry")) {
    return "Sad";
  }

  if (lower.includes("stress") || lower.includes("anxious")) {
    return "Stressed";
  }

  return "Neutral";
};