import { NextResponse, type NextRequest } from "next/server";
import legacyRedirects from "@/lib/generated/redirects.json";
import unpublishedFallbacks from "@/lib/generated/unpublished.json";
import { LEGACY_REGION_SLUGS, REGION_COOKIE, REGION_SLUGS, defaultRegion, isRegionSlug, regionForCountry } from "@/lib/region";
import { SOLUTIONS_ANCHOR } from "@/lib/anchors";
import { securityHeaders } from "@/lib/security-headers";
import { previewingDrafts } from "@/lib/preview";

/**
 * 0. Preview protection: when PREVIEW_USERNAME and PREVIEW_PASSWORD are both set (staging), every request, including
 *    /_next data, media and API routes, must carry matching Basic Auth. /api/revalidate is exempt: it has its own
 *    shared secret and is called server-to-server by the seed and the CMS. Unset locally and in production.
 * 1. "/" only: region cookie → that homepage; otherwise IP country → /in/, /uk/ or /gcc/. Inner pages are never geo-redirected.
 * 2. Homepages are canonical with a trailing slash (/in → /in/). The old Gulf homepage /ae/ (and anything under it) is a 301 to /gcc/.
 * 2b. /solutions (and anything under it) is a 301 to the Products & Solutions section of the region homepage:
 *    solutions have no pages here since 17 Nov 2026, they link out to their own websites.
 * 3. Legacy WordPress URLs → new URLs (Redirect table, compiled to lib/generated/redirects.json by the seed).
 * 3b. A detail URL whose row exists but is not published → its listing, as a real 307 with a Location header
 *    (lib/generated/unpublished.json). In the route itself redirect() would only emit a client-side meta
 *    refresh, because the route is prerendered and streams (QA BUG-039). Skipped while drafts are previewed.
 * 4. Any other single-segment path that isn't a top-level page is a 404 (app/[region] only serves in/uk/gcc).
 * 5. Any other trailing slash is removed.
 * Every response the proxy creates itself carries the security headers (lib/security-headers.ts); next.config.ts
 * adds them to everything else.
 */
const redirects = legacyRedirects as unknown as Record<string, [string, number]>;
/** Detail path → the listing to send a visitor to while the row is unpublished; empty in a drafts build. */
const unpublished = previewingDrafts ? {} : (unpublishedFallbacks as unknown as Record<string, string>);

/**
 * Top-level folders in app/ besides [region]. app/[region] reads its param inside <Suspense> (instant navigation), so
 * a notFound() there would arrive after the 200 has been sent; unknown regions are rejected here instead.
 * Keep in step with app/ when a top-level page is added.
 */
const TOP_LEVEL_ROUTES = new Set([
  "about", "case-studies", "contact", "cookie-policy", "credentials", "insights", "privacy-policy",
  "search", "services", "terms-of-use", "thank-you",
  "figma-fixture", // design-comparison fixture, served only with FIGMA_FIXTURE=1 (app/figma-fixture)
]);

// Country headers set by the CDN in front of the app (CloudFront in production).
const COUNTRY_HEADERS = ["cloudfront-viewer-country", "x-vercel-ip-country", "cf-ipcountry", "x-country-code"];

/** Paths the routing rules below never touch (Next internals, API routes, media and files with an extension). */
const PASS_THROUGH = /^\/(?:_next\/|api\/|media\/)|\.[\w]+$/;

/** Root-level files the app serves (metadata routes); any other single-segment "file" is a 404, not a region. */
const ROOT_FILES = new Set(["/robots.txt", "/sitemap.xml", "/favicon.ico"]);

function withSecurityHeaders<T extends NextResponse>(res: T): T {
  for (const { key, value } of securityHeaders()) res.headers.set(key, value);
  return res;
}

/** Constant-time string comparison, so the challenge does not leak how much of a guess matched. */
function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** The visitor's region: the cookie when it names one (legacy "ae" included), otherwise the CDN country, otherwise DEFAULT_REGION. */
function regionFor(request: NextRequest) {
  const raw = request.cookies.get(REGION_COOKIE)?.value;
  const cookie = raw && LEGACY_REGION_SLUGS[raw] ? LEGACY_REGION_SLUGS[raw] : raw;
  if (isRegionSlug(cookie)) return cookie;
  const country = COUNTRY_HEADERS.map((h) => request.headers.get(h)).find(Boolean);
  return regionForCountry(country, defaultRegion());
}

function previewAuthorized(request: NextRequest): boolean {
  const user = process.env.PREVIEW_USERNAME;
  const pass = process.env.PREVIEW_PASSWORD;
  if (!user || !pass) return true;
  if (request.nextUrl.pathname === "/api/revalidate") return true;
  const header = request.headers.get("authorization") ?? "";
  if (!/^Basic\s+/i.test(header)) return false;
  try {
    const decoded = atob(header.replace(/^Basic\s+/i, "").trim());
    return sameSecret(decoded, `${user}:${pass}`);
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!previewAuthorized(request)) {
    return withSecurityHeaders(
      new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="AdamasTech preview", charset="UTF-8"', "Cache-Control": "no-store" },
      }),
    );
  }

  if (PASS_THROUGH.test(pathname)) {
    // "/.env", "/wp-login.php" and the like would otherwise match app/[region] and get the App Shell (a 200) on their first hit.
    const single = /^\/[^/]*\.[\w]+$/.test(pathname) && !ROOT_FILES.has(pathname.toLowerCase());
    return single ? NextResponse.rewrite(new URL("/_unknown/region", request.url)) : NextResponse.next();
  }

  if (pathname === "/") {
    const region = regionFor(request);
    const res = NextResponse.redirect(new URL(`/${region}/${search}`, request.url), 307);
    res.headers.set("Vary", "Cookie, CloudFront-Viewer-Country");
    res.headers.set("Cache-Control", "private, no-store");
    return withSecurityHeaders(res);
  }

  const bare = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  // The Gulf homepage moved from /ae/ to /gcc/ (sitemap, 13 Nov 2026): one hop, whatever followed /ae/.
  if (bare === "/ae" || bare.startsWith("/ae/")) {
    return withSecurityHeaders(NextResponse.redirect(new URL(`/gcc/${search}`, request.url), 301));
  }

  // Solutions live on their own websites (17 Nov 2026): /solutions and anything under it land on the Products &
  // Solutions section of the visitor's regional homepage, in one hop, with the region taken from the cookie.
  if (bare === "/solutions" || bare.startsWith("/solutions/")) {
    const res = NextResponse.redirect(new URL(`/${regionFor(request)}/${search}#${SOLUTIONS_ANCHOR}`, request.url), 301);
    res.headers.set("Vary", "Cookie, CloudFront-Viewer-Country");
    return withSecurityHeaders(res);
  }

  if (REGION_SLUGS.some((r) => bare === `/${r}`)) {
    return pathname.endsWith("/") ? NextResponse.next() : withSecurityHeaders(NextResponse.redirect(new URL(`${bare}/${search}`, request.url), 308));
  }

  const legacy = redirects[bare.toLowerCase()];
  if (legacy) {
    const [to, status] = legacy;
    return withSecurityHeaders(NextResponse.redirect(new URL(to.startsWith("http") ? to : `${to}${search}`, request.url), status === 302 ? 302 : 301));
  }

  // The row exists but is not published yet: a temporary redirect to its listing, never cached, so the page
  // starts answering 200 again the moment the row is published (QA BUG-002, BUG-039).
  const hidden = unpublished[bare.toLowerCase()];
  if (hidden) {
    const res = NextResponse.redirect(new URL(`${hidden}${search}`, request.url), 307);
    res.headers.set("Cache-Control", "no-store");
    return withSecurityHeaders(res);
  }

  const segments = bare.split("/").filter(Boolean);
  if (segments.length === 1 && !TOP_LEVEL_ROUTES.has(segments[0])) {
    // Rewrite to a path no route matches (underscore folders are private), so the app's not-found page renders with a 404.
    return NextResponse.rewrite(new URL("/_unknown/region", request.url));
  }

  if (pathname !== bare) {
    return withSecurityHeaders(NextResponse.redirect(new URL(`${bare}${search}`, request.url), 308));
  }

  return NextResponse.next();
}

export const config = {
  // Everything, so the preview challenge covers /_next data, media and API routes too; PASS_THROUGH skips the routing rules for them.
  matcher: ["/(.*)"],
};
