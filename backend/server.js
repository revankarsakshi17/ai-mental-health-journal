import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

connectDB();

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  credentials: true,
}));

app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Mental Health Journal API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));