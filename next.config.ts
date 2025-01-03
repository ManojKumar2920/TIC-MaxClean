import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    TWOFACTOR_API_KEY: process.env.TWOFACTOR_API_KEY,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'x-rtb-fingerprint-id',
            value: '*' // Allow this header
          }
        ]
      }
    ]
  },
  // Other Next.js config options...
}

export default nextConfig