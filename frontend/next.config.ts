import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tattvalogic.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4200/api/:path*', // Proxy to Backend API
      },
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:4200/uploads/:path*', // Proxy to Backend Static Files
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/admin-login',
        destination: '/portal',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
