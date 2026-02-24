import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
async headers() {
  return [
    // Auth routes (no COEP)
    {
      source: "/(auth|api/auth)(.*)",
      headers: [
        { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },

    // Playground ONLY (WebContainer needs this)
    {
      source: "/playground(.*)",
      headers: [
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
      ],
    },

    // Rest of app (NO COEP here)
    {
      source: "/((?!playground).*)",
      headers: [
        { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
      ],
    },
  ];
}
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "recharts",
    ],
  },
};

export default nextConfig;