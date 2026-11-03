"use client";

import { useSyncExternalStore } from "react";

/**
 * Values that only exist in the browser, read without setState-in-an-effect (react-hooks/set-state-in-effect).
 * Each returns the server value during SSR and hydration, then the browser value, so static HTML stays valid.
 */
const never = () => () => {};

/** False on the server and while hydrating; true once the component runs in the browser. */
export function useHydrated() {
  return useSyncExternalStore(
    never,
    () => true,
    () => false,
  );
}

/** `location.search` (e.g. "?q=sap"); "" on the server. */
export function useLocationSearch() {
  return useSyncExternalStore(
    never,
    () => window.location.search,
    () => "",
  );
}

/** `location.pathname + location.search`; "" on the server. */
export function useLocationPath() {
  return useSyncExternalStore(
    never,
    () => window.location.pathname + window.location.search,
    () => "",
  );
}
