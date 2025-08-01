"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import axios from "axios";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: number;
  title: string;
  created_at: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  // ✅ Fetch all chats on load
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/chats");
        setChats(res.data);
      } catch (err) {
        console.error("❌ Error fetching chats:", err);
      }
    };
    fetchChats();
  }, []);

  // ✅ Load selected chat messages
  const handleSelectChat = async (id: number) => {
    setChatId(id);
    try {
      const res = await axios.get(`http://localhost:3001/api/chat/${id}`);
      const msgs = res.data.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      }));
      setMessages(msgs);
    } catch (err) {
      console.error("❌ Error loading chat messages:", err);
    }
  };

  // ✅ Create new chat
  const newChat = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/chat");
      const created = res.data;
      setChats((prev) => [created, ...prev]);
      setChatId(created.id);
      setMessages([]);
    } catch (err) {
      console.error("❌ Failed to create new chat:", err);
    }
  };

  // ✅ Send message (with AbortController streaming setup)
  const handleSend = async (text: string) => {
    if (!chatId) {
      await newChat(); // Create new chat if not existing
    }

    const newMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsStreaming(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await axios.post(
        `http://localhost:3001/api/chat/${chatId}/message`,
        { message: text },
        { signal: controller.signal }
      );

      const botMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.warn("⛔ Request was aborted.");
      } else {
        console.error("❌ Error sending message:", err);
      }
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  };

  // ✅ Stop streaming
  const handleStop = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  // ✅ Retry last user message
  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      // Remove last assistant message
      const updated = [...messages];
      const lastIndex = updated.map((m) => m.role).lastIndexOf("assistant");
      if (lastIndex !== -1) updated.splice(lastIndex, 1);
      setMessages(updated);
      handleSend(lastUserMsg.content);
    }
  };

  // ✅ Delete chat
  const handleDeleteChat = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/chat/${id}`);
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (id === chatId) {
        setChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("❌ Failed to delete chat:", err);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        selectedChatId={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={newChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex flex-col flex-1">
        <ChatWindow messages={messages} isStreaming={isStreaming} />
        <ChatInput
          onSend={handleSend}
          onStop={handleStop}
          onRetry={handleRetry}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
