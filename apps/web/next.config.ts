import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@automec/ui', '@automec/core', '@automec/db', '@automec/emails', '@automec/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'files.automec.io' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'img.clerk.com' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
}

export default nextConfig
