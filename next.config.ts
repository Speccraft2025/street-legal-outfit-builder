import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // The storefront is a standalone page (public/storefront.html); serve it as the home page.
      beforeFiles: [{ source: "/", destination: "/storefront.html" }],
    };
  },
};

export default nextConfig;
