"use client";
import { useState } from "react";
import ChatBubble from "../components/ChatBubble";
import InputArea from "../components/InputArea";
import { ScrollArea } from "../components/ui/scroll-area"; // Importando o ScrollArea

type Message = { text: string; isUser: boolean };
type ReflectionData = {
  type: "bible" | "psych";
  reflection: string;
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reflection, setReflection] = useState<ReflectionData | null>(null);
  const [reflectionType, setReflectionType] = useState<"bible" | "psych">("bible");

  const handleChangeReflectionType = (newType: "bible" | "psych") => {
    if (newType !== reflectionType) {
      setReflectionType(newType);
      setReflection(null);
    }
  };

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

        if (data.success) {
          console.log("Reflexão salva com sucesso!");
        } else {
          console.error("Erro ao salvar reflexão:", data.message);
        }
      } catch (error) {
        console.error("Erro ao tentar salvar reflexão:", error);
      }
    }
  };

  const handleDiscardReflection = () => {
    setReflection(null); // Descarta a reflexão
  };

  return (
    <main className="max-w-full h-screen flex justify-center gap-18 p-2">
      <div className="w-[60%] p-4 flex flex-col gap-4 border-2 rounded-sm">  
        <h1 className="text-2xl font-bold text-center">Reflexão do Dia</h1>

        {/* Usando ScrollArea do ShadCN para mensagens */}
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          <ScrollArea className="h-[70vh]"> {/* Adiciona a rolagem para a área de mensagens */}
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg.text} isUser={msg.isUser} />
            ))}
          </ScrollArea>
        </div>

        <InputArea onSend={handleSend} />
      </div>
      
      <div className="flex w-[20%]">
        {reflection && (
          <div className="flex flex-col items-end mt-4">
            {/* Usando ScrollArea do ShadCN para a reflexão */}
            <ScrollArea className="h-[90vh] w-[300px]"> {/* Adiciona a rolagem para a área de reflexão */}
              <div className="bg-blue-100 text-black p-4 rounded-lg shadow-lg">
                <div className="font-semibold">O que você escreveu:</div>
                <p className="mt-1">{reflection.text}</p>
                <div className="font-semibold mt-2">Tipo de Reflexão:</div>
                <p>{reflection.type === "bible" ? "Bíblica" : "Psicológica"}</p>
                <div className="font-semibold mt-2">Resposta da IA:</div>
                <p>{reflection.reflection}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded"
                    onClick={handleSaveReflection}
                  >
                    Salvar
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded"
                    onClick={handleDiscardReflection}
                  >
                    Não Salvar
                  </button>
                </div>
                
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </main>
  );
}
