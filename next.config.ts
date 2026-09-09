const nextConfig = {
  async rewrites() {
    return [
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
      {
        source: '/',
        destination: '/simbolos.html',
        has: [{ type: 'host', value: 'simbolos.0x000042.com' }],
      },      
    ];
  },
};

export default nextConfig;