"use client";
import { useState, useEffect } from "react";
import ChatBubble from "../components/ChatBubble";
import InputArea from "../components/InputArea";
import { ScrollArea } from "../components/ui/scroll-area";

type Message = { text: string; isUser: boolean };
type ReflectionData = {
  type: "bible" | "psych";
  reflection: string;
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reflection, setReflection] = useState<ReflectionData | null>(null);
  const [clearInput, setClearInput] = useState(false);

  const handleSend = async (text: string, type: "bible" | "psych") => {
    setMessages((prev) => [...prev, { text, isUser: true }]);

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });

      const data = await res.json();

      if (!data.response || data.response.trim().length === 0) {
        throw new Error("Reflexão gerada vazia");
      }

      setMessages((prev) => [
        ...prev,
        { text: data.response, isUser: false },
      ]);

      setReflection({ text, reflection: data.response, type });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Erro ao se comunicar com a IA. Tente novamente mais tarde.",
          isUser: false,
        },
      ]);
    }
  };

  const handleSaveReflection = async () => {
    if (reflection) {
      try {
        const res = await fetch("/api/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: reflection.text,
            reflection: reflection.reflection,
            type: reflection.type,
          }),
        });

        const data = await res.json();
        console.log("Resposta da API:", data);

        if (data.success) {
          alert("Reflexão salva com sucesso!");
          setMessages([]);       // Limpa mensagens
          setReflection(null);   // Limpa reflexão
          setClearInput(true);   // Dispara limpeza do input
        } else {
          console.error("Erro ao salvar reflexão:", data.message || "Erro desconhecido");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Erro ao tentar salvar reflexão:", error.message || error.toString());
        } else {
          console.error("Erro desconhecido:", error);
        }
      }
    }
  };

  const handleDiscardReflection = () => {
    setReflection(null);
  };

  // Reseta o sinal após limpar o input
  useEffect(() => {
    if (clearInput) {
      setClearInput(false);
    }
  }, [clearInput]);

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-screen-lg">
        {/* Área de mensagens */}
        <div className="bg-white rounded-lg shadow-lg w-full md:w-2/3 flex flex-col p-6 max-h-[90vh] min-h-[80vh]">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Reflexão do Dia</h1>

          <ScrollArea className="flex-1 mb-4 bg-gray-50 p-4 rounded-lg overflow-auto">
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg.text} isUser={msg.isUser} />
            ))}
          </ScrollArea>

          <InputArea onSend={handleSend} clearSignal={clearInput} />
        </div>

        {/* Área da reflexão */}
        {reflection && (
          <div className="bg-white rounded-lg shadow-lg w-full md:w-1/3 flex flex-col p-6 max-h-[90vh] min-h-[80vh]">
            <ScrollArea className="flex-1 bg-gray-50 p-4 rounded-lg overflow-auto">
              <div className="text-gray-800">
                <h3 className="font-semibold text-xl mb-4">Detalhes da Reflexão</h3>
                <div className="font-medium">O que você escreveu:</div>
                <p className="text-gray-600">{reflection.text}</p>
                <div className="font-medium mt-4">Tipo de Reflexão:</div>
                <p className="text-gray-600">
                  {reflection.type === "bible" ? "Bíblica" : "Psicológica"}
                </p>
                <div className="font-medium mt-4">Resposta da IA:</div>
                <p className="text-gray-600">{reflection.reflection}</p>
              </div>
            </ScrollArea>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
              <button
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                onClick={handleSaveReflection}
              >
                Salvar
              </button>
              <button
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
                onClick={handleDiscardReflection}
              >
                Não Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}