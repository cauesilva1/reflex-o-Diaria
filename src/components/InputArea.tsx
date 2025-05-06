import React, { useEffect, useState } from "react";

interface Props {
  onSend: (text: string, type: "bible" | "psych") => void;
  clearSignal: boolean;
}

export default function InputArea({ onSend, clearSignal }: Props) {
  const [text, setText] = useState("");
  const [type, setType] = useState<"bible" | "psych">("bible");

  useEffect(() => {
    if (clearSignal) {
      setText("");
    }
  }, [clearSignal]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text, type);
    setText("");
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        rows={4}
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="Como foi seu dia?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-full border ${
              type === "bible"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setType("bible")}
          >
            Bíblia
          </button>
          <button
            className={`px-3 py-1 rounded-full border ${
              type === "psych"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setType("psych")}
          >
            Psicólogo
          </button>
        </div>

        <button
          onClick={handleSend}
          className="bg-purple-600 text-white px-4 py-2 rounded-md"
        >
          Refletir
        </button>
      </div>
    </div>
  );
}
