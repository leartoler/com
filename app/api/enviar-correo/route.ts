
import { Resend } from 'resend';
import { kv } from '@vercel/kv';
import { NextRequest } from 'next/server';
 
const resend = new Resend(process.env.RESEND_API_KEY);
 
const JUEGOS: Record<string, {
  asunto: string;
  imagen: string;
  destino: string[];
}> = {
  simbolos: {
    asunto: 'Carta en apoyo a cultura',
    imagen: 'cultura.png',
    destino: (process.env.EMAIL_DESTINO_SIMBOLOS as string).split(',').map(email => email.trim()),
  },
  ausencias: {
    asunto: 'Carta en demanda contra las desapariciones forzadas',
    imagen: 'desaparecidos.png',
    destino: (process.env.EMAIL_DESTINO_AUSENCIAS as string).split(',').map(email => email.trim()),
  },
  efectos: {
    asunto: 'Carta en demanda contra el cambio climatico',
    imagen: 'clima.png',
    destino: (process.env.EMAIL_DESTINO_EFECTOS as string).split(',').map(email => email.trim()),
  },
};
 
// Escapa texto que viene del jugador antes de incrustarlo en el HTML del
// correo — el "contenido" (poema/verso/carta reconstruida) es texto libre
// armado a partir de piezas fijas del juego, pero igual conviene no confiar
// en él a ciegas dentro de HTML.
function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
 
export async function POST(request: NextRequest) {
  // CORS
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'https://0x000042.com',
    'https://simbolos.0x000042.com',
    'https://cultura.0x000042.com',
    'https://desaparecidos.0x000042.com',
    'http://localhost:3000',
    'https://ausencias.0x000042.com',
    'https://clima.0x000042.com',
    'https://efectos.0x000042.com',
  ];
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
 
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
 
  try {
    // "contenido" es el texto que el jugador produjo jugando: la carta
    // reconstruida (simbolos), el poema reunido (ausencias) o el verso
    // logrado (efectos). Es opcional — si no llega, el correo se manda
    // igual, solo con la imagen del juego, como antes.
    const { nombre, juego, contenido } = await request.json();
 
    if (!nombre || !nombre.trim()) {
      return Response.json(
        { success: false, error: 'Nombre requerido' },
        { status: 400, headers: corsHeaders }
      );
    }
 
    if (!juego || !JUEGOS[juego]) {
      return Response.json(
        { success: false, error: 'Juego no reconocido' },
        { status: 400, headers: corsHeaders }
      );
    }
 
    const nombreLimpio = nombre.trim();
    const contenidoLimpio = typeof contenido === 'string' ? contenido.trim() : '';
    const fecha = new Date().toLocaleString('es-MX');
    const config = JUEGOS[juego];
 
    // Bloque HTML con el contenido producido (si lo hay), debajo de la
    // imagen del juego — se conserva el salto de línea del poema/verso
    // con white-space: pre-wrap.
    const bloqueContenidoHtml = contenidoLimpio
      ? `<pre style="font-family: Georgia, serif; font-size: 16px; line-height: 1.8; white-space: pre-wrap; margin-top: 20px;">${escapeHtml(contenidoLimpio)}</pre>`
      : '';
 
    const bloqueContenidoTexto = contenidoLimpio ? `\n\n${contenidoLimpio}` : '';
 
    // Enviar correo
    await resend.emails.send({
      from: process.env.EMAIL_ORIGEN as string,
      to: config.destino,
      subject: `${config.asunto} — ${nombreLimpio}`,
      text: `${config.asunto} — ${nombreLimpio}${bloqueContenidoTexto}`,
      html: `<img src="https://com-three-inky.vercel.app/${config.imagen}" style="max-width:100%;" />${bloqueContenidoHtml}`,
    });
 
    // Guardar puntaje por nombre y por juego
    const claveKV = `puntajes_${juego}`;
    const puntosActuales = await kv.hincrby(claveKV, nombreLimpio, 1);
 
    // Log general con juego incluido
    await kv.lpush('lista_envios', JSON.stringify({ nombre: nombreLimpio, juego, fecha }));
 
    return Response.json(
      { success: true, puntos: puntosActuales, destinatarios: config.destino },
      { headers: corsHeaders }
    );
 
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
 
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'https://0x000042.com',
    'https://simbolos.0x000042.com',
    'https://cultura.0x000042.com',
    'http://localhost:3000',
    'https://desaparecidos.0x000042.com',
    'https://ausencias.0x000042.com',
    'https://clima.0x000042.com',
    'https://efectos.0x000042.com',
  ];
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}