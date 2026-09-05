import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Server Actions are stable in Next 14+
  },

  turbopack: {
    resolveAlias: {
      fs: './empty.js',
      net: './empty.js',
      tls: './empty.js',
      crypto: './empty.js',
      path: './empty.js',
      os: './empty.js',
      stream: './empty.js',
    },
  },

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
            "img-src 'self' data: blob: *.supabase.co",
            "font-src 'self' fonts.gstatic.com",
            "connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co api.anthropic.com",
            "frame-src 'self'",
          ].join('; '),
        },
      ],
    },
  ],

  // Prevent Puppeteer/Chromium from being bundled in the client
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium-min', 'nodemailer', 'groq-sdk'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  // Webpack config to handle pdf libs
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only modules in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
      }
    }
    return config
  },
}

export default nextConfig
