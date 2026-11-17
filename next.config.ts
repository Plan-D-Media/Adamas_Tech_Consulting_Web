import type { NextConfig } from "next";
// Relative imports only in this file and everything it pulls in: Next loads the config outside the
// bundler, so tsconfig `paths` aliases ("@/...") are not resolved here. `npm run check:config` enforces it.
import { securityHeaders } from "./lib/security-headers";

// Allow next/image to optimise media from CloudFront when MEDIA_BASE_URL is absolute.
const mediaBase = process.env.MEDIA_BASE_URL ?? "/media";
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (/^https?:\/\//.test(mediaBase)) {
  const u = new URL(mediaBase);
  remotePatterns.push({ protocol: u.protocol.replace(":", "") as "http" | "https", hostname: u.hostname, pathname: `${u.pathname.replace(/\/$/, "")}/**` });
}

const nextConfig: NextConfig = {
  // Default ".next", so Vercel and `next dev` are unchanged. scripts/qa/phase2-chain.mjs sets
  // NEXT_DIST_DIR=.next-drafts / .next-public so the drafts and public builds can coexist and the
  // review server can be started against the drafts build without rebuilding it.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: true,
  partialPrefetching: true,
  // Homepages live at /in/, /uk/, /ae/ (trailing slash) while inner pages have none; proxy.ts owns slash handling.
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  // Security headers on every response Next serves (lib/security-headers.ts; proxy.ts covers its own redirects).
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders() }];
  },
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    remotePatterns,
  },
  experimental: {
    // Static generation forks one worker per CPU by default (this machine reported 7), and each one holds its own
    // copy of the route modules: that is what pushed the build over the free-memory floor. Three keeps the build
    // near two minutes while leaving headroom (next/dist/build/index.js reads experimental.cpus for the worker
    // count). Vercel's build container is not constrained this way, but three is still comfortable there.
    cpus: 3,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
