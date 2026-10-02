import type { NextConfig } from "next";

// The 3D scene's assets: repeat visits reuse them for a day without asking, then revalidate in the background for a
// week. (File names carry no hash, so a long immutable cache would serve stale models after an update.)
const sceneCache = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" };

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/models/:path*", headers: [sceneCache] },
      { source: "/sky.jpg", headers: [sceneCache] },
    ];
  },
};

export default nextConfig;
