import { Resend } from 'resend';
import { kv } from '@vercel/kv';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

const ORIGENES_PERMITIDOS = [
  'https://trenmaya.neocities.org',
  'https://com-three-inky.vercel.app',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000',
  'https://0x000042.com',
];

function withCors(response: Response, origin: string | null) {
  if (origin && ORIGENES_PERMITIDOS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return withCors(new Response(null, { status: 204 }), origin);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const { nombre } = await request.json();

    if (!nombre || !nombre.trim()) {
      return withCors(
        Response.json({ success: false, error: 'Nombre requerido' }, { status: 400 }),
        origin
      );
    }

    const nombreLimpio = nombre.trim();
    const fecha = new Date().toLocaleString('es-MX');

    const imagenPath = path.join(process.cwd(), 'public', 'dibujo.jpg');
    const imagenBuffer = fs.readFileSync(imagenPath);

    await resend.emails.send({
      from: 'noreply@0x000042.com',
      to: process.env.EMAIL_DESTINO?.split(',').map(email => email.trim()) as string[],
      subject: `Nueva solicitud de ${nombreLimpio}`,
      html: `<img src="cid:logo" alt="Imagen" style="max-width: 100%;" />`,
      attachments: [
        {
          filename: 'dibujo.jpg',
          content: imagenBuffer,
          contentId: 'dibujo',
        },
      ],
    });

    const puntosActuales = await kv.hincrby('puntajes', nombreLimpio, 1);
    await kv.lpush('lista_envios', JSON.stringify({ nombre: nombreLimpio, fecha }));

    return withCors(Response.json({ success: true, puntos: puntosActuales }), origin);
  } catch (error: any) {
    console.error(error);
    return withCors(
      Response.json({ success: false, error: error.message }, { status: 500 }),
      origin
    );
  }
}