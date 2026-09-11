import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        
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