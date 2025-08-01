"use client";

import { useState, useEffect } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  onRetry: () => void;
}

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
  onRetry,
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() !== "") {
      onSend(text);
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center p-4 bg-black border-t border-gray-700"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none"
        style={{ color: "white" }}
      />

      <div className="ml-4 flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[#a0a0a0] text-black disabled:opacity-50"
          disabled={isStreaming}
        >
          Send
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded bg-[#a0a0a0] text-black disabled:opacity-50"
          disabled={isStreaming}
        >
          Retry
        </button>

        <button
          type="button"
          onClick={onStop}
          className="px-4 py-2 rounded bg-[#a0a0a0] text-black disabled:opacity-50"
          disabled={!isStreaming}
        >
          Stop
        </button>
      </div>
    </form>
  );
}
