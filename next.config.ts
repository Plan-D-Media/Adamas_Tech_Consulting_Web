import type { NextConfig } from "next";

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
