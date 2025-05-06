import { NextRequest, NextResponse } from 'next/server';
import { generateReflection } from '../../lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { text, type } = await req.json();

    const reflection = await generateReflection(text, type);

    if (!reflection || reflection.trim().length === 0) {
      console.error("Reflexão gerada vazia");
      return NextResponse.json({
        response: '',
        error: 'Não foi possível gerar reflexão.'
      }, { status: 500 });
    }

    return NextResponse.json({ response: reflection });
  } catch (err) {
    console.error('Erro ao gerar reflexão:', err);
    return NextResponse.json(
      { response: '', error: 'Erro ao se comunicar com a IA.' },
      { status: 500 }
    );
  }
}
