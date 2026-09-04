'use client';

import { useEffect, useState } from 'react';

type ColorKey = 'rojo' | 'verde' | 'azul';

const COLORES: Record<ColorKey, string> = {
  rojo: '#c62828',
  verde: '#2e7d32',
  azul: '#1565c0',
};

const COLORES_TEXTO: Record<ColorKey, string> = {
  rojo: '#ff8a80',
  verde: '#b9f6ca',
  azul: '#82b1ff',
};

const PALABRAS: ColorKey[] = ['rojo', 'verde', 'azul'];

function colorAleatorio(): ColorKey {
  return PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
}

function mezclarArray<T>(arr: T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function generarRonda() {
  const texto = colorAleatorio();
  const colorPintura = colorAleatorio();
  const ordenBotones = mezclarArray(PALABRAS);
  const coloresTextoBotones: Record<ColorKey, ColorKey> = {
    rojo: colorAleatorio(),
    verde: colorAleatorio(),
    azul: colorAleatorio(),
  };
  // Pequeño desnivel vertical aleatorio por botón, para romper el patrón visual
  const desniveles: Record<ColorKey, number> = {
    rojo: Math.floor(Math.random() * 30),
    verde: Math.floor(Math.random() * 30),
    azul: Math.floor(Math.random() * 30),
  };
  return { texto, colorPintura, ordenBotones, coloresTextoBotones, desniveles };
}

const RONDA_INICIAL = {
  texto: 'rojo' as ColorKey,
  colorPintura: 'rojo' as ColorKey,
  ordenBotones: PALABRAS,
  coloresTextoBotones: { rojo: 'rojo', verde: 'verde', azul: 'azul' } as Record<ColorKey, ColorKey>,
  desniveles: { rojo: 0, verde: 0, azul: 0 } as Record<ColorKey, number>,
};

export default function Home() {
  const [nombre, setNombre] = useState('');
  const [puntaje, setPuntaje] = useState(0);
  const [ronda, setRonda] = useState<ReturnType<typeof generarRonda> | null>(null);
  const [resultado, setResultado] = useState<'acierto' | 'fallo' | null>(null);

useEffect(() => {
  setRonda(generarRonda());
}, []);

  const manejarClick = (colorBoton: ColorKey) => {
    if (!ronda) return; //
    if (!nombre.trim()) return;

    const acerto = colorBoton === ronda.texto;

    if (acerto) {
      setPuntaje((prev) => prev + 1);
      setResultado('acierto');

      fetch('/api/enviar-correo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      }).catch(() => {});
    } else {
      setResultado('fallo');
    }

    setRonda(generarRonda());
  };

  if (!ronda) {
    return (
      <main style={{ padding: '1.5rem', textAlign: 'center' }}>
        Cargando...
      </main>    
      );
  }

  return (
    <main
      style={{
        padding: '1.5rem',
        textAlign: 'center',
        maxWidth: '420px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <p style={{ fontSize: '16px', marginBottom: '0.5rem' }}>Pon tu nombre para jugar</p>

      <input
        type="text"
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{
          padding: '12px',
          fontSize: '16px',
          width: '100%',
          marginBottom: '1.5rem',
          boxSizing: 'border-box',
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
      />

      <p style={{ fontSize: '20px' }}>
        Puntaje: <strong>{puntaje}</strong>
      </p>

      <div
        style={{
          fontSize: 'clamp(36px, 10vw, 48px)',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: COLORES[ronda.colorPintura],
          margin: '2rem 0',
        }}
      >
        {ronda.texto}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexWrap: 'nowrap',
        }}
      >
        {ronda.ordenBotones.map((color) => (
          <button
            key={color}
            onClick={() => manejarClick(color)}
            style={{
              width: '28vw',
              maxWidth: '90px',
              height: '28vw',
              maxHeight: '90px',
              marginTop: `${ronda.desniveles[color]}px`,
              borderRadius: '12px',
              border: 'none',
              backgroundColor: COLORES[color],
              cursor: 'pointer',
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: COLORES_TEXTO[ronda.coloresTextoBotones[color]],
              fontWeight: 'bold',
              textTransform: 'capitalize',
              touchAction: 'manipulation',
            }}
          >
            {color}
          </button>
        ))}
      </div>

      {resultado && (
        <p style={{ marginTop: '1.5rem', fontSize: '32px', fontWeight: 'bold' }}>
          {resultado === 'acierto' ? ':D' : 'X'}
        </p>
      )}
    </main>
  );
}