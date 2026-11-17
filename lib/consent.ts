/**
 * Cookie consent (Swayang, 17 November 2026). Google Tag Manager is loaded only after the visitor has agreed, and
 * never at all when `NEXT_PUBLIC_GTM_ID` is empty, so a build without a container ID ships no analytics, no banner
 * and no consent cookie: nothing to consent to, nothing stored.
 *
 * Google Consent Mode v2 is set up with every signal denied before any tag can run, and updated from the visitor's
 * choice. The two categories the banner offers map onto the four Consent Mode signals:
 *
 *   analytics  -> analytics_storage
 *   marketing  -> ad_storage, ad_user_data, ad_personalization
 *
 * This module holds no secrets and imports nothing, so the client components, the server chrome and the proxy can
 * all use it.
 */

/** The container ID, or "" when analytics is not configured for this build. Inlined by Next at build time. */
export const GTM_ID = (process.env.NEXT_PUBLIC_GTM_ID ?? "").trim();

/** True when this build may load Google Tag Manager at all. */
export const analyticsConfigured = /^GTM-[A-Z0-9]+$/i.test(GTM_ID);

export const CONSENT_COOKIE = "consent";
/** Six months, the usual re-ask interval for analytics consent. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 182;
/** Bump when the categories change, so stored choices are asked again rather than silently reinterpreted. */
export const CONSENT_VERSION = 1;

export type ConsentCategory = "analytics" | "marketing";

export interface ConsentChoice {
  version: number;
  analytics: boolean;
  marketing: boolean;
  /** When the choice was made, ISO date only (no time), so the cookie carries no precise timestamp. */
  date: string;
}

export const DENY_ALL: ConsentChoice = { version: CONSENT_VERSION, analytics: false, marketing: false, date: "" };

/** Compact cookie value, e.g. "1:a1m0:2026-11-17". Easy to read in dev tools and to parse without JSON. */
export function encodeConsent(c: ConsentChoice): string {
  return `${c.version}:a${c.analytics ? 1 : 0}m${c.marketing ? 1 : 0}:${c.date}`;
}

/** Parse a stored choice. Returns null for anything unrecognised or from an older version, so the banner asks again. */
export function decodeConsent(value: string | null | undefined): ConsentChoice | null {
  const m = /^(\d+):a([01])m([01]):(\d{4}-\d{2}-\d{2})?$/.exec((value ?? "").trim());
  if (!m) return null;
  const version = Number(m[1]);
  if (version !== CONSENT_VERSION) return null;
  return { version, analytics: m[2] === "1", marketing: m[3] === "1", date: m[4] ?? "" };
}

/** The Consent Mode v2 signals for a choice. Everything is denied until the visitor says otherwise. */
export function consentSignals(c: ConsentChoice | null) {
  const analytics = c?.analytics ? "granted" : "denied";
  const marketing = c?.marketing ? "granted" : "denied";
  return {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    // Never granted by this banner: no tag here needs them.
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
  } as const;
}

/** True when a stored choice allows at least one tag to run, i.e. when Tag Manager should be loaded. */
export function allowsTags(c: ConsentChoice | null): boolean {
  return !!c && (c.analytics || c.marketing);
}
