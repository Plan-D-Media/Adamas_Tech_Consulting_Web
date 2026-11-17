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
