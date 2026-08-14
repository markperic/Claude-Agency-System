import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every module image is a local file in public/images/library/ now, so
    // no placeholder photo host needs listing here. YouTube's thumbnail CDN
    // is the one remote source still in use, for module 29's video embed.
    remotePatterns: [{ protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" }],
  },
  async redirects() {
    return [
      { source: "/demo", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
