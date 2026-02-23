import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"*",
        port:'',
        pathname:"/**"
      }
    ]
  },
  async headers() {
    return [
      {
        // WebContainer needs these headers — only apply to playground
        source: '/playground/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
        ],
      },
      // NOTE: /api/auth/* must NOT have COOP/COEP headers at all
      // Adding them breaks signOut(), signIn() and session fetching
    ];
  },
  reactStrictMode: false
};

export default nextConfig;