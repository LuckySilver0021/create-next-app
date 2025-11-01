import type { NextConfig } from "next";
import path from "path";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  // ✅ Ensures Next.js traces files relative to the monorepo root
  outputFileTracingRoot: path.resolve(__dirname, ".."),

  // ✅ Enable standalone output only on Vercel (prevents Windows symlink errors locally)
  ...(isVercel ? { output: "standalone" } : {}),

  // ✅ Disable TypeScript build errors (acts like ESLint ignore)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Turbopack config (optional; harmless to include)
  turbopack: {},
};

export default nextConfig;

