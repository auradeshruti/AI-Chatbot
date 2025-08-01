const express = require("express");
const cors = require("cors");
const axios = require("axios");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Store AbortControllers for each request
const controllers = new Map();

/**
 * ✅ Create New Chat
 */
app.post("/api/chat", async (req, res) => {
  try {
    const chatResult = await pool.query(
      "INSERT INTO chats (title, created_at) VALUES ($1, NOW()) RETURNING *",
      ["New Chat"]
    );
    res.status(201).json(chatResult.rows[0]);
  } catch (error) {
    console.error("❌ Error creating chat:", error.message);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

/**
 * ✅ Send Message + Reply + Auto-title
 */
app.post("/api/chat/:chatId/message", async (req, res) => {
  const { chatId } = req.params;
  const { message, requestId } = req.body;

  try {
    // Save user message
    await pool.query(
      "INSERT INTO messages (chat_id, role, content, timestamp) VALUES ($1, $2, $3, NOW())",
      [chatId, "user", message]
    );

    // Auto-title on first message
    const msgCount = await pool.query(
      "SELECT COUNT(*) FROM messages WHERE chat_id = $1",
      [chatId]
    );
    if (parseInt(msgCount.rows[0].count) === 1) {
      const autoTitle = message.split(" ").slice(0, 6).join(" ");
      await pool.query("UPDATE chats SET title = $1 WHERE id = $2", [
        autoTitle,
        chatId,
      ]);
    }

    // Prepare AbortController (future use)
    const controller = new AbortController();
    controllers.set(requestId, controller);

    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "gemma:2b",
        prompt: message,
        stream: false,
      },
      {
        headers: { "Content-Type": "application/json" },
        family: 4,
        signal: controller.signal,
      }
    );

    const botReply = response.data.response;

    // Save assistant reply
    await pool.query(
      "INSERT INTO messages (chat_id, role, content, timestamp) VALUES ($1, $2, $3, NOW())",
      [chatId, "assistant", botReply]
    );

    controllers.delete(requestId);
    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Message error:", error.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

/**
 * ✅ Get All Chats
 */
app.get("/api/chats", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM chats ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching chats:", error.message);
    res.status(500).json({ error: "Failed to get chats" });
  }
});

/**
 * ✅ Get Messages by Chat ID
 */
app.get("/api/chat/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC",
      [chatId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching messages:", error.message);
    res.status(500).json({ error: "Failed to get chat messages" });
  }
});

/**
 * ✅ Delete Chat
 */
app.delete("/api/chat/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    await pool.query("DELETE FROM messages WHERE chat_id = $1", [chatId]);
    await pool.query("DELETE FROM chats WHERE id = $1", [chatId]);
    res.json({ message: "Chat deleted" });
  } catch (error) {
    console.error("❌ Error deleting chat:", error.message);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

/**
 * ✅ Stop Chat Generation (AbortController)
 */
app.post("/api/chat/:chatId/stop", (req, res) => {
  const { requestId } = req.body;
  const controller = controllers.get(requestId);

  if (controller) {
    controller.abort();
    controllers.delete(requestId);
    res.json({ message: "Stream aborted" });
  } else {
    res.status(404).json({ error: "No stream found to abort" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
