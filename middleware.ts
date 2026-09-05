import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // Solo actuamos si piden la raíz ("/") de un subdominio específico.
  if (pathname === '/') {
    if (host.startsWith('simbolos.')) {
      return NextResponse.rewrite(new URL('/simbolos.html', request.url));
    }
    if (host.startsWith('carta.')) {
      return NextResponse.rewrite(new URL('/carta.html', request.url));
    }
    // Agrega aquí más subdominios a medida que sumes juegos.
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};