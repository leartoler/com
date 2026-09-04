import { Resend } from 'resend';
import { kv } from '@vercel/kv';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();

    if (!nombre || !nombre.trim()) {
      return Response.json({ success: false, error: 'Nombre requerido' }, { status: 400 });
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

    return Response.json({ success: true, puntos: puntosActuales });
  } catch (error: any) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}