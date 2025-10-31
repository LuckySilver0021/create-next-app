import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure Next.js traces files relative to the monorepo root to avoid duplicated React copies
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  // Use Turbopack (Next.js 16 default). If you need custom config later, add it under this key.
  turbopack: {},
};

export default nextConfig;
