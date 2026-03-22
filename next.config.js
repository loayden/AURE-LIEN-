/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true, // Disable Next.js image optimization
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'aurelien-eta.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
