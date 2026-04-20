import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'clients.json');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    let db: { clients: any[] } = { clients: [] };
    if (fs.existsSync(dbPath)) {
      const fileData = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(fileData);
    }

    const client = db.clients.find((c: any) => c.email === email && c.password === password);

    if (!client) {
      return NextResponse.json({ success: false, message: "E-mail ou Senha incorretos." }, { status: 401 });
    }

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
    return NextResponse.json({ success: false, message: "Erro interno do servidor." }, { status: 500 });
  }
}
