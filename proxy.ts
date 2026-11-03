import { NextResponse, type NextRequest } from "next/server";
import legacyRedirects from "@/lib/generated/redirects.json";
import { REGION_COOKIE, REGION_SLUGS, defaultRegion, isRegionSlug, regionForCountry } from "@/lib/region";

/**
 * 1. "/" only: region cookie → that homepage; otherwise IP country → /in/, /uk/ or /ae/. Inner pages are never geo-redirected.
 * 2. Homepages are canonical with a trailing slash (/in → /in/).
 * 3. Legacy WordPress URLs → new URLs (Redirect table, compiled to lib/generated/redirects.json by the seed).
 * 4. Any other single-segment path that isn't a top-level page is a 404 (app/[region] only serves in/uk/ae).
 * 5. Any other trailing slash is removed.
 */
const redirects = legacyRedirects as unknown as Record<string, [string, number]>;

// Country headers set by the CDN in front of the app (CloudFront in production).
/**
 * Top-level folders in app/ besides [region]. app/[region] reads its param inside <Suspense> (instant navigation), so
 * a notFound() there would arrive after the 200 has been sent; unknown regions are rejected here instead.
 * Keep in step with app/ when a top-level page is added.
 */
const TOP_LEVEL_ROUTES = new Set([
  "about", "case-studies", "contact", "cookie-policy", "credentials", "insights", "privacy-policy",
  "search", "services", "solutions", "terms-of-use", "thank-you",
]);

const COUNTRY_HEADERS = ["cloudfront-viewer-country", "x-vercel-ip-country", "cf-ipcountry", "x-country-code"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/") {
    const cookie = request.cookies.get(REGION_COOKIE)?.value;
    let region = isRegionSlug(cookie) ? cookie : null;
    if (!region) {
      const country = COUNTRY_HEADERS.map((h) => request.headers.get(h)).find(Boolean);
      region = regionForCountry(country, defaultRegion());
    }
    const res = NextResponse.redirect(new URL(`/${region}/${search}`, request.url), 307);
    res.headers.set("Vary", "Cookie, CloudFront-Viewer-Country");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  const bare = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (REGION_SLUGS.some((r) => bare === `/${r}`)) {
    return pathname.endsWith("/") ? NextResponse.next() : NextResponse.redirect(new URL(`${bare}/${search}`, request.url), 308);
  }

  const legacy = redirects[bare.toLowerCase()];
  if (legacy) {
    const [to, status] = legacy;
    return NextResponse.redirect(new URL(to.startsWith("http") ? to : `${to}${search}`, request.url), status === 302 ? 302 : 301);
  }

  const segments = bare.split("/").filter(Boolean);
  if (segments.length === 1 && !TOP_LEVEL_ROUTES.has(segments[0])) {
    // Rewrite to a path no route matches (underscore folders are private), so the app's not-found page renders with a 404.
    return NextResponse.rewrite(new URL("/_unknown/region", request.url));
  }

  if (pathname !== bare) {
    return NextResponse.redirect(new URL(`${bare}${search}`, request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, media and files with an extension.
  matcher: ["/((?!_next/|api/|media/|.*\\.[\\w]+$).*)"],
};
