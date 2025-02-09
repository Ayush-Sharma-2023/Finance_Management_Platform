import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ensures ESLint doesn't block production builds
  },
  typescript: {
    ignoreBuildErrors: true, // (Optional) Ignore TS errors during build
  },
};

export default nextConfig;
