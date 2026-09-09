const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ausencias.html',
        permanent: false,
        has: [{ type: 'host', value: 'ausencias.0x000042.com' }],
      },
      {
        source: '/',
        destination: '/efectos.html',
        permanent: false,
        has: [{ type: 'host', value: 'efectos.0x000042.com' }],
      },
    ];
  },
};

export default nextConfig;