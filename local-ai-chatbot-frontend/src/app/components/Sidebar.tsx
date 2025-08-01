"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

interface Chat {
  id: number;
  title: string;
  created_at: string;
}

interface Props {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  onNewChat: () => void;
  onDeleteChat: (id: number) => void;
}

export default function Sidebar({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: Props) {
  return (
    <div className="w-64 bg-blue-900 text-white p-4 overflow-y-auto">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2 mb-4"
        onClick={onNewChat}
      >
        <FaPlus /> New Chat
      </button>

      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`flex justify-between items-center p-3 rounded cursor-pointer ${
            selectedChatId === chat.id ? "bg-blue-700" : "bg-blue-800"
          } hover:bg-blue-700`}
        >
          <div>
            <div className="text-white truncate w-40">{chat.title}</div>
            <div className="text-gray-300 text-xs">
              {format(new Date(chat.created_at), "PPP p")}
            </div>
          </div>
          <FaTrash
            className="text-red-400 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              const confirm = window.confirm("Delete this chat?");
              if (confirm) onDeleteChat(chat.id);
            }}
          />
        </div>
      ))}
    </div>
  );
}
