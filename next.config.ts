import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static export for GitHub Pages
  distDir: "out", // Builds the site in "out" folder
  basePath: "/Finance_Management_Platform", // Set correct base path for GitHub Pages

  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js image optimization
  },
  trailingSlash: true, // Fixes 404 errors on subpages
  eslint: {
    ignoreDuringBuilds: true, // Ensures ESLint doesn't block production builds
  },
  typescript: {
    ignoreBuildErrors: true, // (Optional) Ignore TS errors during build
  },
};

export default nextConfig;
