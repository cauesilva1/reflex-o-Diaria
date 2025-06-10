// components/ChatBubble.tsx
import React from "react";
import { motion } from "framer-motion";

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
  isError?: boolean;
  retryAction?: () => void;
};

const ChatBubble = ({ message, isUser, isError, retryAction }: ChatBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-none"
            : isError
            ? "bg-red-50 text-red-600 rounded-bl-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap">{message}</p>
        {isError && retryAction && (
          <button
            onClick={retryAction}
            className="mt-2 text-sm font-medium hover:underline focus:outline-none"
          >
            Tentar novamente
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
