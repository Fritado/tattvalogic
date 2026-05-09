import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [25, 40, 50, 75],
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
    optimizeCss: true,
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
