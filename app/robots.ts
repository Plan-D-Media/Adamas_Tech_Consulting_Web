import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Staging (BLOCK_INDEXING=true) disallows everything; production allows crawling and points at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.BLOCK_INDEXING === "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/search", "/thank-you"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
