import { supabase } from '@/app/lib/supabaseClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type ReflectionType = 'bible' | 'psych';
export type Language = 'pt' | 'en';

export type ReflectionData = {
  text: string;
  reflection: string;
  type: ReflectionType;
  language: Language;
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
    console.log('JSON sendo enviado para o backend:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/generate-reflection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta de erro:', errorText);
      throw new Error(`Erro na API: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Dados recebidos da API:', data);
    
    if (!data.reflection) {
      console.error('Resposta da API sem reflection:', data);
      throw new Error('Resposta da API inválida');
    }

    return data.reflection;
  } catch (error) {
    console.error('Erro detalhado em generateReflection:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://127.0.0.1:8000');
    }
    throw handleApiError(error);
  }
};

export const saveReflection = async (reflectionData: ReflectionData): Promise<boolean> => {
  console.log('Iniciando saveReflection com:', reflectionData);
  try {
    const { error } = await supabase
      .from('reflections')
      .insert([reflectionData]);

    console.log('Resposta do Supabase:', { error });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro detalhado em saveReflection:', error);
    throw handleApiError(error);
  }
}; 