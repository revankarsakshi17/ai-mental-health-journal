import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Mental Health Journal API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);