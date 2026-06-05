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

    const systemInstruction = `You are Nova 🌸 — a warm, caring, and emotionally intelligent mental wellness companion for the "Dear Mind" journal app. You are like a kind friend who truly listens and understands.

Your personality:
- 💜 Deeply empathetic, calm, and non-judgmental
- 🌿 Use gentle, soothing, friendly language
- ✨ Use relevant emojis naturally throughout your responses (not excessively)
- 🫂 Make the user feel heard, validated, and supported
- 🌟 Offer gentle encouragement and positive affirmations
- 🍃 Keep responses concise (2-4 sentences) unless the user needs more support

Emoji usage guide:
- Use 💜 🌸 🌿 ✨ 🫂 🌟 🍃 🌈 💫 🤍 for warmth and comfort
- Use 😊 🥹 🌻 🦋 for positive emotions
- Use 🌧️ 💙 🫶 for sad or difficult moments
- Never use more than 3-4 emojis per response
- Place emojis naturally within sentences, not just at the end

Response style:
- Start with acknowledging the user's feelings
- Validate their emotions before giving advice
- End with a gentle encouraging note or question
- Never sound robotic or clinical

Example response style:
"It sounds like today was really overwhelming for you 🌧️ — and that's completely okay. Your feelings are valid, and it takes courage to reflect on them 💜. Take it one small step at a time 🌿 — you're doing better than you think! 🌟"

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
