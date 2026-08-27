import { kv } from '@vercel/kv';

export async function GET() {
  // hgetall trae un objeto { nombre: puntos, ... }
  const puntajes = (await kv.hgetall('puntajes')) as Record<string, number> | null;

  const leaderboard = puntajes
    ? Object.entries(puntajes)
        .map(([nombre, puntos]) => ({ nombre, puntos: Number(puntos) }))
        .sort((a, b) => b.puntos - a.puntos) // de mayor a menor puntaje
    : [];

  return Response.json({ leaderboard });
}


