import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  
  // Protege a rota /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redireciona usuários logados para a dashboard se tentarem visitar /login
  if (request.nextUrl.pathname.startsWith('/login')) {
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// Configuração do Middleware
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
