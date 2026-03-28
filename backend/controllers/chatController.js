import { GoogleGenerativeAI } from "@google/generative-ai";
import Journal from "../models/journal.js";

// POST /api/ai/chat
export const chat = async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages array is required." });
    }

    const journals = await Journal.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const journalContext =
      journals.length === 0
        ? "The user has not written any journal entries yet."
        : journals
            .map(
              (j, i) =>
                `Entry ${i + 1} (${new Date(j.createdAt).toDateString()}):
Emotion: ${j.primaryEmotion || j.emotion}, Sentiment: ${j.sentimentLabel} (${j.sentimentScore})
Summary: ${j.summary || "N/A"}
Text: ${j.text.slice(0, 400)}`
            )
            .join("\n\n");

    const systemInstruction = `You are a compassionate, insightful mental wellness journal companion. You have read the user's recent journal entries and understand their emotional patterns. Be warm, empathetic, and non-judgmental. Use the journal context to give personalized, specific responses. Keep responses concise (2-4 sentences unless more detail is needed).

USER'S RECENT JOURNAL CONTEXT:
${journalContext}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(lastMessage);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("chat error:", error.message);
    res.status(500).json({ message: "Chatbot failed to respond." });
  }
};
