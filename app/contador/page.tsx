interface Jugador {
  nombre: string;
  puntos: number;
}

async function obtenerDatos(): Promise<{ leaderboard: Jugador[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contador`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function PaginaContador() {
  const { leaderboard } = await obtenerDatos();

  return (
    <main style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Marcador</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {leaderboard.map((jugador, index) => (
          <li
            key={jugador.nombre}
            style={{
              padding: '12px',
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              <strong>{index + 1}.</strong> {jugador.nombre}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{jugador.puntos} pts</span>
          </li>
        ))}
      </ul>

      {leaderboard.length === 0 && <p style={{ textAlign: 'center' }}>Todavía nadie ha jugado.</p>}
    </main>
  );
}