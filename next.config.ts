import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['dreambox.alpaca-blenny.ts.net'],
  devIndicators: false,
  output: "standalone",
};

export default nextConfig;
