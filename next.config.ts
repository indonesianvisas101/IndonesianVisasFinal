import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance Optimizations
  reactStrictMode: true,
  poweredByHeader: false,

  // Compiler Options
  experimental: {
    optimizeCss: true, // Requires 'critters'
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
      'tailwind-merge',
      'react-use',
      '@paypal/react-paypal-js'
    ],
    scrollRestoration: true,
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
    // Cache optimized images for 1 year at CDN/browser level
    minimumCacheTTL: 31536000,
    // Tune breakpoints to real traffic — fewer variants = faster build + less disk
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256],
    remotePatterns: [
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: 'thvdfcogdxmqipybqzot.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'www.google.com' },
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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        // PERFORMANCE: Aggressive caching for static assets (JS, CSS, fonts, images)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // PERFORMANCE: Cache public images for 1 year
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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

  async redirects() {
    return [
      {
        source: '/australia/citizenship',
        destination: '/en/services/Australia/indonesia-citizenship',
        permanent: true,
      },
      {
        source: '/:locale/australia/citizenship',
        destination: '/:locale/services/Australia/indonesia-citizenship',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
