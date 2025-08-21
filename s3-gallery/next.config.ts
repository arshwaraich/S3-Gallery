import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/S3-Gallery',
  assetPrefix: '/S3-Gallery/',
  images: {
    unoptimized: true, // Required for next export + GitHub Pages
  },
};

export default withPWA({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
