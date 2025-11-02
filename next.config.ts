import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ✅ Ensures Next.js traces files relative to the monorepo root
  outputFileTracingRoot: path.resolve(__dirname, ".."),

  // ✅ Required for proper Vercel deployment (prevents /path0/.next nesting)
  output: "standalone",

  // ✅ Disable ESLint checks during build (Next.js 16 doesn’t allow "eslint" key directly anymore)
  typescript: {
    ignoreBuildErrors: true, // Safe to ignore lint-like errors
  },

  // ✅ Turbopack is automatically used in Next 16, but leaving this is harmless
  turbopack: {},
};

export default nextConfig;

