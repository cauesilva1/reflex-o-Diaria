"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        // Após o cadastro bem-sucedido, redireciona para o login
        setIsSignUp(false);
        setError("Conta criada com sucesso! Faça login para continuar.");
      } else {
        await signIn(email, password);
        router.push("/historico");
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error);
      
      // Tratamento específico para erros comuns
      if (error.message.includes("rate limit exceeded")) {
        setError("Limite de tentativas excedido. Por favor, tente novamente em alguns minutos.");
      } else if (error.message.includes("Invalid login credentials")) {
        setError("Email ou senha inválidos.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Por favor, verifique seu email para confirmar a conta.");
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Ocorreu um erro durante a autenticação"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          {isSignUp ? "Criar Conta" : "Entrar"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className={`text-sm text-center p-3 rounded-lg ${
              error.includes("sucesso") 
                ? "bg-green-50 text-green-600" 
                : "bg-red-50 text-red-600"
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : isSignUp ? (
              "Criar Conta"
            ) : (
              "Entrar"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
          >
            {isSignUp
              ? "Já tem uma conta? Entre aqui"
              : "Não tem uma conta? Cadastre-se"}
          </button>
        </form>
      </div>
    </main>
  );
} 