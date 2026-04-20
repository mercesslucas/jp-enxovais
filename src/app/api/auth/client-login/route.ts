import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const clients = await query(
      'SELECT * FROM clients WHERE email = ? AND password = ? LIMIT 1',
      [email, password]
    ) as any[];

    if (clients.length === 0) {
      return NextResponse.json({ success: false, message: "E-mail ou Senha incorretos." }, { status: 401 });
    }

    const client = clients[0];

    if (client.status === 'pending') {
       return NextResponse.json({ success: false, message: "Cadastro em análise. Aguarde a aprovação da gerência." }, { status: 403 });
    }

    if (client.status === 'rejected') {
       return NextResponse.json({ success: false, message: "Cadastro Bloqueado. Entre em contato com o suporte." }, { status: 403 });
    }

    // Aprovado! Setar o cookie
    const cookieStore = await cookies();
    cookieStore.set('client_session', client.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 dias
    });

    // Retorna detalhes sem a senha
    const { password: _, ...safeClient } = client;

    return NextResponse.json({ success: true, client: safeClient });
  } catch (err) {
    console.error('Login Error:', err);
    return NextResponse.json({ success: false, message: "Erro interno do servidor." }, { status: 500 });
  }
}
