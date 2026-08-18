import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The on-screen dev-tools badge only ever renders in `next dev`, never in a
  // production build, but it floats over the corner of full-bleed hero sections
  // and gets mistaken for site chrome during design review. Compile and runtime
  // errors are still surfaced with this off.
  devIndicators: false,
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
