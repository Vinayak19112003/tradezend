/**
 * @fileOverview Next.js configuration optimized for performance
 *
 * This configuration includes optimizations for:
 * - Code splitting and bundle optimization
 * - Image optimization
 * - Compression
 * - Caching strategies
 */

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* TypeScript & ESLint */
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },

  /* Performance Optimizations */
  compress: true, // Enable gzip compression

  // Optimize production builds
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-icons'],
  },

  /* Image Optimization */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern image formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* External Package Configuration */
  serverExternalPackages: ['handlebars'],

  /* Headers for Better Caching */
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
