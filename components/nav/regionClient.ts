"use client";

import { useSyncExternalStore } from "react";
import { REGION_COOKIE, REGION_COOKIE_MAX_AGE, isRegionSlug, type RegionSlug } from "@/lib/region";

const listeners = new Set<() => void>();

function readCookie(): RegionSlug | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${REGION_COOKIE}=([^;]*)`));
  const v = m ? decodeURIComponent(m[1]) : null;
  return isRegionSlug(v) ? v : null;
}

export function setRegionCookie(slug: RegionSlug) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${REGION_COOKIE}=${slug}; Path=/; Max-Age=${REGION_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  listeners.forEach((l) => l());
}

/** The visitor's saved region (cookie), or null. Null during SSR. */
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

/** Region slug from a homepage path ("/in/" → "in"), else null. */
export function regionFromPath(pathname: string): RegionSlug | null {
  const seg = pathname.split("/")[1];
  return pathname.replace(/\/+$/, "").split("/").length === 2 && isRegionSlug(seg) ? seg : null;
}
