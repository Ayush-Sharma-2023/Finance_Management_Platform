import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express(); 
const PORT = 5000;

app.use(cors()); 
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running! 🚀");
});

app.post("/", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        prompt: userMessage,
        stream: false,
      }),
    });

    const data = await response.json();
    console.log("Ollama API Response:", data); // ✅ Debugging log

    const cleanedReply = data.response.replace(/<think>\n\n<\/think>\n\n/, "");
    res.json({ reply: cleanedReply });
  } catch (error) {
    console.error("Error:", error); // ✅ Debugging log
    res.status(500).json({ error: "Error connecting to Ollama", details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
