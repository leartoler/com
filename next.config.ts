import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/cultura.html',
          has: [{ type: 'host', value: 'cultura.0x000042.com' }],
        },
        {
          source: '/',
          destination: '/desaparecidos.html',
          has: [{ type: 'host', value: 'desaparecidos.0x000042.com' }],
        },
        {
          source: '/',
          destination: '/clima.html',
          has: [{ type: 'host', value: 'clima.0x000042.com' }],
        },
        {
          source: '/',
          destination: '/ausencias.html',
          has: [{ type: 'host', value: 'ausencias.0x000042.com' }],
        },
        {
          source: '/',
          destination: '/efectos.html',
          has: [{ type: 'host', value: 'efectos.0x000042.com' }],
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;