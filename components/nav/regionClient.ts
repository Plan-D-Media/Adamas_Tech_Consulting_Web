"use client";

import { useSyncExternalStore } from "react";
import { LEGACY_REGION_SLUGS, REGION_COOKIE, REGION_COOKIE_MAX_AGE, isRegionSlug, type RegionSlug } from "@/lib/region";

const listeners = new Set<() => void>();

function readCookie(): RegionSlug | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${REGION_COOKIE}=([^;]*)`));
  const raw = m ? decodeURIComponent(m[1]) : null;
  const v = raw && LEGACY_REGION_SLUGS[raw] ? LEGACY_REGION_SLUGS[raw] : raw;
  return isRegionSlug(v) ? v : null;
}

/** Remembers the visitor's region for a year (read by proxy.ts on the bare "/" and by the header). */
export function setRegionCookie(slug: RegionSlug) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${REGION_COOKIE}=${slug}; Path=/; Max-Age=${REGION_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  listeners.forEach((l) => l());
}

/** The visitor's saved region (cookie), or null. Always null during SSR and hydration, so static HTML stays valid. */
export function useRegionCookie(): RegionSlug | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    readCookie,
    () => null,
  );
}
