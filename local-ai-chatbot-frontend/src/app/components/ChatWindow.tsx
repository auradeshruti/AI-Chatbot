"use client";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isStreaming: boolean;
}

export default function ChatWindow({ messages, isStreaming }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-900 text-white space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-3 rounded max-w-xl ${
            msg.role === "user"
              ? "bg-blue-600 self-end ml-auto"
              : "bg-gray-700 self-start mr-auto"
          }`}
        >
          {msg.content}
        </div>
      ))}

      {isStreaming && (
        <div className="text-sm text-gray-400 italic">Typing...</div>
      )}
    </div>
  );
}
