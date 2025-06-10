"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatBubble from "../components/ChatBubble";
import InputArea from "../components/InputArea";
import TypingIndicator from "../components/TypingIndicator";
import LanguageSelector from "../components/LanguageSelector";
import { ScrollArea } from "../components/ui/scroll-area";
import { generateReflection, saveReflection, type ReflectionData, type Language } from "../lib/apiClient";
import { getCurrentUser } from "@/lib/auth";
import HistoryButton from "../components/HistoryButton";

type Message = { text: string; isUser: boolean };

const ReflectionDetails = ({ reflection, onSave, onDiscard }: {
  reflection: Omit<ReflectionData, 'user_id'>;
  onSave: () => void;
  onDiscard: () => void;
}) => (
  <div className="bg-white rounded-xl shadow-xl w-full md:w-1/3 flex flex-col p-6 max-h-[90vh] min-h-[80vh] border border-gray-100">
    <ScrollArea className="flex-1 bg-gray-50 p-6 rounded-lg overflow-auto">
      <div className="text-gray-800 space-y-6">
        <div>
          <h3 className="font-semibold text-2xl mb-6 text-indigo-600">Detalhes da Reflexão</h3>
          <div className="space-y-4">
            <div>
              <div className="font-medium text-gray-700 mb-2">O que você escreveu:</div>
              <p className="text-gray-600 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">{reflection.text}</p>
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-2">Tipo de Reflexão:</div>
              <p className="text-gray-600 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                {reflection.type === "bible" ? "Bíblica" : "Psicológica"}
              </p>
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-2">Idioma:</div>
              <p className="text-gray-600 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                {reflection.language === "pt" ? "Português" : "English"}
              </p>
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-2">Resposta da IA:</div>
              <p className="text-gray-600 bg-white p-4 rounded-lg border border-gray-100 shadow-sm whitespace-pre-wrap">{reflection.reflection}</p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>

    <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
      <button
        className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        onClick={onSave}
      >
        Salvar Reflexão
      </button>
      <button
        className="bg-gray-100 text-gray-700 py-3 px-8 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        onClick={onDiscard}
      >
        Descartar
      </button>
    </div>
  </div>
);

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reflection, setReflection] = useState<Omit<ReflectionData, 'user_id'> | null>(null);
  const [clearInput, setClearInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("pt");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleSend = async (text: string, type: "bible" | "psych") => {
    setMessages((prev) => [...prev, { text, isUser: true }]);
    setIsLoading(true);

    try {
      const reflectionText = await generateReflection(text, type, language);

      if (!reflectionText?.trim()) {
        throw new Error("Reflexão gerada vazia");
      }

      setMessages((prev) => [
        ...prev,
        { text: reflectionText, isUser: false },
      ]);

      setReflection({ text, reflection: reflectionText, type, language });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Erro ao se comunicar com a IA. Tente novamente mais tarde.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReflection = async () => {
    if (!reflection) return;

    try {
      const success = await saveReflection(reflection);

      if (success) {
        alert("Reflexão salva com sucesso!");
        setMessages([]);
        setReflection(null);
        setClearInput(true);
      }
    } catch (error) {
      console.error("Erro ao tentar salvar reflexão:", error);
      alert("Erro ao salvar reflexão. Tente novamente.");
    }
  };

  const handleDiscardReflection = () => {
    setReflection(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex justify-center items-center px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-screen-lg">
        {/* Área de mensagens */}
        <div className="bg-white rounded-xl shadow-xl w-full md:w-2/3 flex flex-col p-6 max-h-[90vh] min-h-[80vh] border border-gray-100">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">Reflexão do Dia</h1>
          
          <div className="flex justify-between items-center mb-4">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
            <HistoryButton />
          </div>

          <ScrollArea className="flex-1 mb-4 bg-gray-50 p-6 rounded-lg overflow-auto">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg.text} isUser={msg.isUser} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-4">
            <InputArea onSend={handleSend} clearSignal={clearInput} />
          </div>
        </div>

        {/* Área da reflexão */}
        {reflection && (
          <ReflectionDetails
            reflection={reflection}
            onSave={handleSaveReflection}
            onDiscard={handleDiscardReflection}
          />
        )}
      </div>
    </main>
  );
}