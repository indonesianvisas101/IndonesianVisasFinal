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
      'date-fns',
      '@mui/material',
      '@mui/icons-material',
      '@mui/lab',
      '@mui/x-date-pickers',
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
    ],
  },

  compress: true, // Enable Gzip compression

  // Modularize Imports for better Tree Shaking
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
};

export default nextConfig;
