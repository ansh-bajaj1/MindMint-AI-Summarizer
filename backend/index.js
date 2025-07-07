const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173", 
    "X-Title": "ai-summarizer",              
  },
});

app.use(cors());
app.use(express.json());

app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  try {
    const completion = await openai.chat.completions.create({
    model: "anthropic/claude-3-haiku",
      messages: [
  {
    role: "system",
    content: "You are a helpful assistant that summarizes any given input into 2-3 sentences clearly and concisely.",
  },
  {
    role: "user",
    content: `Summarize the following:\n\n${text}`,
  },
],
    });

    console.log("OpenRouter Response:", JSON.stringify(completion, null, 2));

    const summary = completion.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return res.status(500).json({ error: "Summary was empty. Try again." });
    }

    res.json({ summary });

  } catch (error) {
    console.error(" OpenRouter Error:", error.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

app.listen(port, () => {
  console.log(` AI Summarizer backend running at http://localhost:${port}`);
});
