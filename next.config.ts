import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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