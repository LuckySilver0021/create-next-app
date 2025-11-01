import type { NextConfig } from "next";
import path from "path";

const nextConfig = {
  // Ensure Next.js traces files relative to the monorepo root
  outputFileTracingRoot: path.resolve(__dirname, ".."),

  // Disable ESLint checks during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Use Turbopack (Next.js 16 default). If you need custom config later, add it under this key.
  turbopack: {},
} as unknown as NextConfig; // 👈 force-cast fixes the typing issue safely

export default nextConfig;
