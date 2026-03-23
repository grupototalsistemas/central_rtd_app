import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  experimental: {
    optimizePackageImports: ['@next/font'],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Configuração removida: optimizeFonts foi removido do Next.js 13+
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  allowedDevOrigins: [
    '189.126.111.30', // IP público da VPS
  ],
};

export default nextConfig;
