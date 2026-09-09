import { Resend } from 'resend';
import { kv } from '@vercel/kv';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

const JUEGOS: Record<string, {
  asunto: string;
  imagen: string;
  destino: string[];
}> = {
  simbolos: {
    asunto: 'Nueva participación en Símbolos',
    imagen: 'cultura.png',
    destino: (process.env.EMAIL_DESTINO_SIMBOLOS as string).split(',').map(email => email.trim()),
  },
  cultura: {
    asunto: 'Nueva participación en Cultura',
    imagen: 'desaparecidos.png',
    destino: (process.env.EMAIL_DESTINO_CULTURA as string).split(',').map(email => email.trim()),
  },
  desaparecidos: {
    asunto: 'Nueva participación en Desaparecidos',
    imagen: 'clima.png',
    destino: (process.env.EMAIL_DESTINO_DESAPARECIDOS as string).split(',').map(email => email.trim()),
  },
};

export async function POST(request: NextRequest) {
  // CORS
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'https://0x000042.com',
    'https://simbolos.0x000042.com',
    'https://cultura.0x000042.com',
    'https://desaparecidos.0x000042.com',
    'http://localhost:3000',
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
    const { nombre, juego } = await request.json();

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
    const fecha = new Date().toLocaleString('es-MX');
    const config = JUEGOS[juego];

    // Leer imagen del juego correspondiente
    const imagenPath = path.join(process.cwd(), 'public', config.imagen);
    const imagenBuffer = fs.readFileSync(imagenPath);

    // Enviar correo
    await resend.emails.send({
      from: process.env.EMAIL_ORIGEN as string,
      to: config.destino,
      subject: `${config.asunto} — ${nombreLimpio}`,
      html: `<img src="cid:imagen" alt="${juego}" style="max-width:100%;" />`,
      attachments: [
        {
          filename: config.imagen,
          content: imagenBuffer,
          contentId: 'imagen',
        },
      ],
    });

    // Guardar puntaje por nombre y por juego
    const claveKV = `puntajes_${juego}`;
    const puntosActuales = await kv.hincrby(claveKV, nombreLimpio, 1);

    // Log general con juego incluido
    await kv.lpush('lista_envios', JSON.stringify({ nombre: nombreLimpio, juego, fecha }));

    return Response.json(
      { success: true, puntos: puntosActuales },
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
    'https://desaparecidos.0x000042.com',
    'http://localhost:3000',
    'https://presencias.0x000042.com',
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


