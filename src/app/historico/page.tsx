"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { ReflectionData } from "@/lib/apiClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function HistoricoPage() {
  const [reflections, setReflections] = useState<ReflectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login");
          return;
        }
        fetchReflections();
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const fetchReflections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reflections")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReflections(data || []);
    } catch (error) {
      console.error("Erro ao buscar reflexões:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            Minhas Reflexões
          </h1>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Nova Reflexão
          </button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-xl p-6">
          {reflections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-gray-500 mb-6">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Nenhuma reflexão encontrada
              </h3>
              <p className="text-gray-500 mb-6">
                Comece sua jornada de reflexão agora mesmo!
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Criar Primeira Reflexão
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {reflections.map((reflection, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        {reflection.type === "bible" ? "Bíblica" : "Psicológica"}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {reflection.language === "pt" ? "PT" : "EN"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {reflection.created_at 
                        ? new Date(reflection.created_at).toLocaleDateString()
                        : 'Data não disponível'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">
                        O que você escreveu:
                      </h3>
                      <p className="text-gray-600 bg-white p-4 rounded-lg border border-gray-100">
                        {reflection.text}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">
                        Resposta da IA:
                      </h3>
                      <p className="text-gray-600 bg-white p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                        {reflection.reflection}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </main>
  );
} 