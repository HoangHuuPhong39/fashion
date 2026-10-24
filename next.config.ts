import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://img.vietqr.io;
  font-src 'self' data:;
  connect-src 'self' https://challenges.cloudflare.com https://api.vietqr.io;
  frame-src 'self' https://challenges.cloudflare.com;
  object-src 'none';
  base-uri 'self';
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  turbopack: {},
  poweredByHeader: false,
  allowedDevOrigins: ['192.168.157.1', 'localhost', '127.0.0.1'],
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.vietqr.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        aggregateTimeout: 300,
        poll: false,
        ignored: [
          '**/data/**',
          '**/*.tmp',
          '**/public/uploads/**',
          '**/.git/**',
          '**/node_modules/**',
          '**/.next/**',
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
