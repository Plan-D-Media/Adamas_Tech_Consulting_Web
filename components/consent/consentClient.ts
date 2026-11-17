"use client";

import { useSyncExternalStore } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  CONSENT_VERSION,
  decodeConsent,
  encodeConsent,
  type ConsentChoice,
} from "@/lib/consent";

/**
 * The visitor's consent choice, read from and written to the `consent` cookie, shared by the banner, the Tag Manager
 * loader and the footer's "Cookie settings" button. Same shape as components/nav/regionClient.ts: a tiny external
 * store, so the server and the hydrating client agree (null during SSR) and nothing is read in an effect.
 */

const listeners = new Set<() => void>();
const OPEN_EVENT = "atc:consent-open";

/**
 * The decoded choice, cached against the raw cookie value.
 *
 * useSyncExternalStore compares snapshots by identity and re-renders whenever they differ, so a getSnapshot that
 * decodes a fresh object on every call never settles: React re-renders, reads again, gets another object, and
 * stops with "Maximum update depth exceeded" (error #185). Before a choice is made `decodeConsent` returns null,
 * which is stable, so the loop only began once the visitor accepted or rejected - and it tore down the whole tree
 * at the moment of the click (QA BUG-040, found by the chain's GTM container run, 17 Nov 2026).
 */
let cachedRaw: string | null = null;
let cachedChoice: ConsentChoice | null = null;

function rawCookie(): string | null {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    // Cookies blocked entirely: treat as no choice made, so nothing loads.
    return null;
  }
}

function read(): ConsentChoice | null {
  const raw = rawCookie();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedChoice = decodeConsent(raw);
  }
  return cachedChoice;
}

/** The stored choice, read straight from the cookie. For event handlers; components use useConsent(). */
export function readConsent(): ConsentChoice | null {
  return read();
}

/** The stored choice, or null when the visitor has not chosen yet. Always null during SSR and hydration. */
export function useConsent(): ConsentChoice | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => null,
  );
}

/** Store a choice for six months and tell every listener. Silently does nothing if cookies are blocked. */
export function saveConsent(choice: Omit<ConsentChoice, "version" | "date">) {
  const full: ConsentChoice = {
    version: CONSENT_VERSION,
    analytics: choice.analytics,
    marketing: choice.marketing,
    date: new Date().toISOString().slice(0, 10),
  };
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(encodeConsent(full))}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
  } catch {
    // Nothing to do: without the cookie the banner simply asks again next time, and no tag loads.
  }
  listeners.forEach((l) => l());
}

/** Reopen the banner in its "manage" state. Called by the footer link on any page. */
export function openConsentManager() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentManagerOpen(handler: () => void): () => void {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
