// components/ChatBubble.tsx
import React from "react";

interface Props {
  message: string;
  isUser?: boolean;
}

export default function ChatBubble({ message, isUser = false }: Props) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
