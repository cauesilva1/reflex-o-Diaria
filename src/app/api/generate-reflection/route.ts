import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  console.log('API route iniciada');
  console.log('BACKEND_URL:', BACKEND_URL);

  if (!BACKEND_URL) {
    console.error('BACKEND_URL não está definida');
    return NextResponse.json(
      { error: 'Configuração do servidor inválida. BACKEND_URL não definida.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log('Corpo da requisição recebido:', body);

    const { input_text, type, language } = body;

    if (!input_text || !type || !language) {
      console.error('Dados inválidos:', { input_text, type, language });
      return NextResponse.json(
        { error: 'Dados inválidos. Texto, tipo e idioma são obrigatórios.' },
        { status: 400 }
      );
    }

    console.log('Enviando requisição para o backend:', {
      url: `${BACKEND_URL}/generate-reflection`,
      method: 'POST',
      body: { input_text, type, language }
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 segundos de timeout

    try {
      const response = await fetch(`${BACKEND_URL}/generate-reflection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text, type, language }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Resposta do backend:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
          console.error('Erro do backend (texto):', errorText);
        } catch (e) {
          console.error('Erro ao ler resposta do backend:', e);
          errorText = response.statusText;
        }

        let errorMessage = 'Erro ao gerar reflexão';
        if (response.status === 502) {
          errorMessage = 'O servidor está iniciando. Por favor, aguarde alguns segundos e tente novamente.';
          console.error('Erro 502 do Render:', {
            status: response.status,
            statusText: response.statusText,
            errorText,
            headers: Object.fromEntries(response.headers.entries())
          });
        } else if (response.status === 504) {
          errorMessage = 'O servidor está demorando mais que o esperado para gerar a reflexão. Por favor, aguarde um pouco mais.';
        } else if (response.status === 500) {
          errorMessage = 'Ocorreu um erro interno no servidor de reflexões. Por favor, tente novamente em alguns minutos.';
          console.error('Erro 500 detalhado:', {
            status: response.status,
            statusText: response.statusText,
            errorText,
            headers: Object.fromEntries(response.headers.entries())
          });
        }

        return NextResponse.json(
          { 
            error: errorMessage,
            details: errorText,
            status: response.status
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('Dados recebidos do backend:', data);

      if (!data.reflection) {
        console.error('Resposta inválida do backend:', data);
        return NextResponse.json(
          { error: 'Resposta inválida do servidor de reflexões' },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Erro na requisição ao backend:', fetchError);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          return NextResponse.json(
            { error: 'O servidor está demorando mais que o esperado para gerar a reflexão. Por favor, aguarde um pouco mais.' },
            { status: 504 }
          );
        }
        
        // Tratamento específico para erros de conexão
        if (fetchError.message.includes('ECONNREFUSED') || fetchError.message.includes('fetch failed')) {
          console.error('Erro de conexão com o backend:', {
            error: fetchError,
            backendUrl: BACKEND_URL
          });
          return NextResponse.json(
            { 
              error: 'Não foi possível conectar ao servidor de reflexões. Por favor, verifique se o servidor está online.',
              details: 'Erro de conexão com o backend'
            },
            { status: 503 }
          );
        }

        return NextResponse.json(
          { 
            error: 'Erro ao conectar com o servidor de reflexões',
            details: fetchError.message
          },
          { status: 500 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Erro na API route:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 