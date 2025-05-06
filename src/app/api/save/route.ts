import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const { text, reflection, type } = await req.json(); // Agora recebendo o 'type'

    // Salva no Supabase
    const { error } = await supabase
      .from('message')
      .insert([{ text, reflection, type }]); // Inserindo 'type' no banco

    if (error) {
      console.error('Erro ao salvar no Supabase:', error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao salvar reflexão:', err);
    return NextResponse.json({ success: false, message: 'Erro ao salvar reflexão.' }, { status: 500 });
  }
}
