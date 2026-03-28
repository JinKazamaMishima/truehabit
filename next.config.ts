import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.railway.app",
      },
      {
        protocol: "https",
        hostname: "*.storage.railway.app",
      },
    ],
  },
};

export default nextConfig;
