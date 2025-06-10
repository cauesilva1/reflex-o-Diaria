import { supabase } from '@/app/lib/supabaseClient';

export type ReflectionType = 'bible' | 'psych';
export type Language = 'pt' | 'en';

export type ReflectionData = {
  text: string;
  reflection: string;
  type: ReflectionType;
  language: Language;
  user_id: string;
  created_at?: string;
};

export type ApiError = {
  message: string;
  status?: number;
};

const handleApiError = (error: unknown): ApiError => {
  console.log('handleApiError recebeu:', error);
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Erro desconhecido' };
};

export const generateReflection = async (
  text: string, 
  type: ReflectionType,
  language: Language
): Promise<string> => {
  console.log('Iniciando generateReflection com:', { text, type, language });
  try {
    const requestBody = { input_text: text, type, language };
    console.log('JSON sendo enviado para a API:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('/api/generate-reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resposta de erro:', errorData);
      
      // Mensagens de erro mais amigáveis
      if (response.status === 502) {
        throw new Error('O servidor de reflexões está temporariamente indisponível. Por favor, tente novamente em alguns minutos.');
      } else if (response.status === 504) {
        throw new Error('O servidor está demorando mais que o esperado para gerar a reflexão. Por favor, aguarde um pouco mais.');
      } else if (response.status === 500) {
        const errorMessage = errorData.details 
          ? `Erro interno do servidor: ${errorData.details}`
          : 'Ocorreu um erro interno no servidor de reflexões. Por favor, tente novamente em alguns minutos.';
        throw new Error(errorMessage);
      } else {
        throw new Error(errorData.error || 'Erro ao gerar reflexão. Por favor, tente novamente.');
      }
    }

    const data = await response.json();
    console.log('Dados recebidos da API:', data);
    
    if (!data.reflection) {
      console.error('Resposta da API sem reflection:', data);
      throw new Error('Não foi possível gerar uma reflexão válida. Por favor, tente novamente.');
    }

    return data.reflection;
  } catch (error) {
    console.error('Erro detalhado em generateReflection:', error);
    throw handleApiError(error);
  }
};

export const saveReflection = async (reflectionData: Omit<ReflectionData, 'user_id'>): Promise<boolean> => {
  console.log('Iniciando saveReflection com:', reflectionData);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('reflections')
      .insert([{ ...reflectionData, user_id: user.id }]);

    console.log('Resposta do Supabase:', { error });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro detalhado em saveReflection:', error);
    throw handleApiError(error);
  }
}; 