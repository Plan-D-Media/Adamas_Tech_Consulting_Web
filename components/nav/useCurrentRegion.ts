"use client";

import type { RegionInfo } from "@/lib/data/site";
import type { RegionSlug } from "@/lib/region";
import { useRegionCookie } from "@/components/nav/regionClient";

/**
 * Which region the chrome should show. On a regional homepage the server passes it (so the HTML is right without
 * JavaScript); on global pages it comes from the cookie once hydrated, and before that from DEFAULT_REGION.
 */
export function useCurrentRegion(regions: RegionInfo[], initial: RegionSlug | null, fallback: RegionSlug): RegionInfo {
  const cookie = useRegionCookie();
  const slug = initial ?? cookie ?? fallback;
  return regions.find((r) => r.slug === slug) ?? regions[0];
}
