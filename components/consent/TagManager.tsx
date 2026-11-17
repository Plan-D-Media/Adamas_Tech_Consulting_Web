"use client";

import Script from "next/script";
import { GTM_ID, allowsTags, analyticsConfigured, consentSignals } from "@/lib/consent";
import { useConsent } from "@/components/consent/consentClient";

/**
 * Google Tag Manager, loaded only when there is a container ID for this build AND the visitor has agreed to at least
 * one category. Before that, nothing is requested, no dataLayer is created and no Google cookie exists.
 *
 * On agreement the order is fixed, because Consent Mode has to see the denied state before any tag runs:
 *   1. dataLayer is created and `consent default` is pushed with every signal denied,
 *   2. `consent update` is pushed with the visitor's choice,
 *   3. only then is the gtm.js script requested.
 * Next's `Script` with `afterInteractive` keeps it off the critical path, so it cannot delay the first paint.
 *
 * Changing the choice later pushes another `consent update`. Withdrawing consent entirely cannot unload a script
 * that is already running, so the page is reloaded, which is what the banner tells the visitor.
 */
export function TagManager() {
  const consent = useConsent();
  if (!analyticsConfigured || !allowsTags(consent)) return null;

  const signals = consentSignals(consent);
  const bootstrap = [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments)}",
    // Everything denied first, with a short wait so tags queue rather than fire ungated.
    `gtag('consent','default',${JSON.stringify({ ...consentSignals(null), wait_for_update: 500 })});`,
    `gtag('consent','update',${JSON.stringify(signals)});`,
    "dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});",
  ].join("");

  return (
    <>
      <Script id="gtm-consent" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <Script id="gtm-loader" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`} />
    </>
  );
}
