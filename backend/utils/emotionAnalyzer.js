import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeEmotion = async (text) => {
  try {
    // ✅ Move these INSIDE the function so .env is already loaded
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
    console.log("=== GEMINI DEBUG ===");
    console.log("API KEY:", process.env.GEMINI_API_KEY?.slice(0, 15));
    const prompt = `You are an expert emotion and sentiment analyst. Analyze this journal entry and respond ONLY with valid JSON — no markdown, no backticks, no explanation.

Return JSON with exactly these keys:
{
  "primaryEmotion": string (one of: joy, sadness, anger, fear, surprise, disgust, neutral, anxiety, gratitude, love, hope, frustration),
  "emotions": { "<emotion>": <score 0-100> },
  "sentimentScore": number (-100 to 100),
  "sentimentLabel": "Positive" | "Neutral" | "Negative",
  "themes": [string],
  "suggestions": [string, string, string],
  "summary": string (1 sentence)
}

Journal entry:
"""
${text}
"""`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini AI analysis error:", error.message);
    return {
      primaryEmotion: "neutral",
      emotions: { neutral: 100 },
      sentimentScore: 0,
      sentimentLabel: "Neutral",
      themes: [],
      suggestions: [
        "Take a moment to breathe and reflect.",
        "Consider talking to someone you trust.",
        "Write more tomorrow to track your feelings.",
      ],
      summary: "Unable to analyze entry at this time.",
    };
  }
};

