const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
const baseConfig = {
  allowedDevOrigins: ["*.preview.same-app.com"],
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },
};

/**
 * Default: standard Next.js build for Netlify's Next.js runtime (every route is
 * prerendered static: /, robots.txt, sitemap.xml, manifest.webmanifest).
 * Set STATIC_EXPORT=1 to export a plain static site to `out/` instead.
 */
module.exports = (phase) =>
  phase !== PHASE_DEVELOPMENT_SERVER && process.env.STATIC_EXPORT === "1"
    ? { ...baseConfig, output: "export", distDir: "out" }
    : baseConfig;
