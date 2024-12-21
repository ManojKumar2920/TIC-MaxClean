import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
          // Remove x-rtb-fingerprint-id from headers configuration
        ],
      },
      {
        // Matching all routes except API routes
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Add Content Security Policy to control script execution
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com; connect-src 'self' https://api.razorpay.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;"
          }
        ],
      },
    ];
  },
  // Additional configuration for Razorpay domain
  async rewrites() {
    return [
      {
        source: '/api/razorpay/:path*',
        destination: 'https://api.razorpay.com/:path*',
      },
    ];
  },
  // Enable CORS for specific domains if needed
  async middleware() {
    return {
      // Configure CORS middleware
      cors: {
        origin: '*', // Or specify your domains
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'X-CSRF-Token',
          'X-Requested-With',
          'Accept',
          'Accept-Version',
          'Content-Length',
          'Content-MD5',
          'Content-Type',
          'Date',
          'X-Api-Version',
          'Authorization'
        ],
        credentials: true,
      },
    };
  },
  // Additional security configurations
  poweredByHeader: false,
  compress: true,
};

// Handle environment-specific configurations
if (process.env.NODE_ENV === 'development') {
  nextConfig.headers = async () => {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  };
}

export default nextConfig;