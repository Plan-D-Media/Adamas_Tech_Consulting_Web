"use client";

import { useSyncExternalStore } from "react";

function subscribe(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}

/** Media-query hook; returns `serverValue` during SSR. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True when the user asked for reduced motion. Assumes reduced on the server (safe default). */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/** True when video should not autoload: Save-Data on, or a 2G/slow-2G connection. */
export function isConstrainedConnection(): boolean {
  if (typeof navigator === "undefined") return true;
  const c = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!c) return false;
  return !!c.saveData || c.effectiveType === "2g" || c.effectiveType === "slow-2g";
}
