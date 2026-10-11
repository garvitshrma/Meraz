import type { NextConfig } from "next";

// Fully static build: `npm run build` writes plain HTML/CSS/JS to `out/`, with index.html at its root. Copy the
// contents of `out/` to any web server (or Vercel). No server features: no headers(), rewrites or image optimisation.
// The 3D assets' caching lives with the host instead: public/.htaccess (Apache) and vercel.json (Vercel).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // /contact/ -> out/contact/index.html, served by any plain web server without rewrites
  images: { unoptimized: true },
  // basePath: "/meraz", // uncomment if the site is hosted under a sub-path instead of a domain's root
};

export default nextConfig;
