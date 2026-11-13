/**
 * Region constants shared by proxy.ts (edge of the request), server components and the client switcher.
 * Labels and phones live in the DB; only routing facts live here.
 */

export type RegionCode = "IN" | "UK" | "GCC";
export type RegionSlug = "in" | "uk" | "gcc";

/** Cookie or URL values from before the /ae/ to /gcc/ change (13 Nov 2026), still honoured. */
export const LEGACY_REGION_SLUGS: Record<string, RegionSlug> = { ae: "gcc" };

export const REGION_COOKIE = "region";
export const REGION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const REGION_SLUGS: readonly RegionSlug[] = ["in", "uk", "gcc"] as const;

export const slugToCode: Record<RegionSlug, RegionCode> = { in: "IN", uk: "UK", gcc: "GCC" };
export const codeToSlug: Record<RegionCode, RegionSlug> = { IN: "in", UK: "uk", GCC: "gcc" };

export function isRegionSlug(v: string | undefined | null): v is RegionSlug {
  return !!v && (REGION_SLUGS as readonly string[]).includes(v);
}

const GCC = new Set(["AE", "SA", "QA", "KW", "BH", "OM"]);

/** ISO 3166-1 alpha-2 country → region slug. */
export function regionForCountry(country: string | null | undefined, fallback: RegionSlug): RegionSlug {
  const c = country?.toUpperCase();
  if (!c) return fallback;
  if (c === "IN") return "in";
  if (c === "GB" || c === "UK" || c === "IE") return "uk";
  if (GCC.has(c)) return "gcc";
  return fallback;
}

export function defaultRegion(): RegionSlug {
  const env = process.env.DEFAULT_REGION?.toLowerCase();
  return isRegionSlug(env) ? env : "uk";
}
