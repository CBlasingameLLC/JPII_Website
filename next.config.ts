import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Printful serves synced product images from its own CDN.
    remotePatterns: [
      { protocol: "https", hostname: "files.cdn.printful.com" },
      { protocol: "https", hostname: "printful-upload.s3-accelerate.amazonaws.com" },
    ],
  },
};

export default nextConfig;
