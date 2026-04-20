import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Fallback: se não estiver no env, usa admin padrão (apenas para ambiente de desenvolvimento)
    const adminEmail = process.env.ADMIN_EMAIL || "admin@jpenxovais.com.br";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";

    if (email === adminEmail && password === adminPassword) {
      // Define o cookie de forma assíncrona para compatibilidade com Next.js novo
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 semana logado
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "E-mail ou Senha incorretos." }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Erro de servidor." }, { status: 500 });
  }
}
