import type { NextConfig } from "next";

// CSP statique, appliquée par le routage (aucune Function / middleware invoquée).
// Exclut /studio (Sanity Studio a besoin d'une politique plus permissive) et /api.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.sanity.io https://images.unsplash.com https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.api.sanity.io https://*.apicdn.sanity.io",
  "frame-src 'self' https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/activities/:slug',
        destination: '/aventures/:slug',
        permanent: true,
      },
      // Anciens slugs d'activités supprimés de Sanity (encore vus par Google).
      {
        source: '/aventures/planche-a-voile-windsurf',
        destination: '/aventures/vtt-et-planche-a-voile',
        permanent: true,
      },
      {
        source: '/aventures/vtt',
        destination: '/aventures/vtt-et-vtt-electrique',
        permanent: true,
      },
      {
        source: '/activities',
        destination: '/aventures/mono-activite',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/:path((?!studio|api).*)',
        headers: [{ key: 'Content-Security-Policy', value: CSP }],
      },
    ];
  },
};

export default nextConfig;
