import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance Optimizations
  reactStrictMode: true,
  poweredByHeader: false,

  // Compiler Options
  experimental: {
    optimizeCss: true, // Requires 'critters' dependency
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'd3',
      'd3-selection',
      'd3-geo',
      'topojson-client',
      'date-fns',
      '@mui/material',
      '@mui/icons-material',
      'lodash',
      'clsx',
      'tailwind-merge'
    ],
  },

  turbopack: {
    root: __dirname,
  },

  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: 'thvdfcogdxmqipybqzot.supabase.co' }, // Supabase Storage
      { protocol: 'https', hostname: 'images.unsplash.com' }, // Unsplash
      { protocol: 'https', hostname: 'plus.unsplash.com' }, // Unsplash Plus
      { protocol: 'https', hostname: 'www.google.com' }, // Google Logo
      { protocol: 'https', hostname: 'www.indonesianvisas.com' },
    ],
  },

  compress: true, // Enable Gzip compression
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://checkout.doku.com https://www.paypal.com https://*.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://api.openai.com https://*.google-analytics.com https://*.paypal.com https://checkout.doku.com; frame-src https://checkout.doku.com https://www.paypal.com; object-src 'none';",
          },
        ],
      },
    ];
  },

  // Modularize Imports for better Tree Shaking
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
};

export default nextConfig;
