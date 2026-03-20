import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
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
};

export default nextConfig;
