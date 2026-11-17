/**
 * Security headers for every response (brief section 11; QA BUG-003). Applied twice on purpose: next.config.ts
 * `headers()` covers everything Next serves (pages, /_next, media, API routes) and proxy.ts stamps them on the
 * responses it creates itself (region and legacy redirects, the preview challenge), which bypass the config.
 *
 * The CSP is the strictest policy the current build supports without nonces: the pages are prerendered (Cache
 * Components), so a per-request nonce cannot be injected, and Next's hydration payload and the js-flag script are
 * inline, hence 'unsafe-inline' for scripts and styles. Everything else is locked to the site's own origin plus the
 * media host; no frames are allowed in or out. Revisit with nonces if the site ever renders fully dynamically.
 */

const mediaBase = process.env.MEDIA_BASE_URL ?? "/media";
const mediaOrigin = /^https?:\/\//.test(mediaBase) ? new URL(mediaBase).origin : "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const isDev = process.env.NODE_ENV === "development";

export function contentSecurityPolicy(): string {
  const self = "'self'";
  const media = mediaOrigin ? ` ${mediaOrigin}` : "";
  return [
    `default-src ${self}`,
    `script-src ${self} 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src ${self} 'unsafe-inline'`,
    `img-src ${self} data: blob:${media}`,
    `media-src ${self} blob:${media}`,
    `font-src ${self} data:`,
    `connect-src ${self}${isDev ? " ws: wss:" : ""}${media}`,
    `frame-src 'none'`,
    `object-src 'none'`,
    `base-uri ${self}`,
    `form-action ${self}`,
    `frame-ancestors 'none'`,
    ...(siteUrl.startsWith("https://") ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

/** Header name/value pairs, in the order they are set. */
export function securityHeaders(): { key: string; value: string }[] {
  const headers = [
    { key: "Content-Security-Policy", value: contentSecurityPolicy() },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
  // HSTS only where the site is served over HTTPS (browsers ignore it on http://, but a stray header on the local build is noise).
  if (siteUrl.startsWith("https://")) headers.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" });
  return headers;
}
