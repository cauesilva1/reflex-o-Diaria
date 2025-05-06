export const generateReflection = async (
  input: string,
  type: "bible" | "psych"
): Promise<string> => {
  const prompt =
    type === "bible"
      ? `Leia o seguinte texto e escreva uma reflexão breve baseada em ensinamentos bíblicos:\n\n"${input}"`
      : `Leia o seguinte texto e escreva uma reflexão breve com base em conceitos psicológicos, focando no autoconhecimento e equilíbrio emocional:\n\n"${input}"`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // Aqui acessando a chave da API do .env.local
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // URL do seu site (modifique conforme necessário)
        "X-Title": "Reflection Generator", // Título do seu site
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-maverick:free", // Modelo Llama 4 Maverick
        messages: [
          {
            role: "system",
            content: "Você é um gerador de reflexões breves e profundas.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Resposta completa da IA:", JSON.stringify(data, null, 2));

    const reflection = data.choices?.[0]?.message?.content?.trim();

    if (!reflection) {
      console.error("Reflexão gerada vazia");
      return "Não foi possível gerar reflexão.";
    }

    return reflection;
  } catch (error) {
    console.error("Erro ao gerar reflexão:", error);
    return "Erro ao gerar reflexão.";
  }
};
