"use client";

import { analyticsConfigured } from "@/lib/consent";
import { openConsentManager } from "@/components/consent/consentClient";

/**
 * Footer control that reopens the consent banner in its "manage" state, so a visitor can change or withdraw their
 * choice at any time. Rendered only when this build has a Tag Manager container ID: with no analytics there is
 * nothing to manage, and offering the control would imply otherwise.
 */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!analyticsConfigured) return null;
  return (
    <button type="button" onClick={openConsentManager} data-cookie-settings className={className}>
      Cookie settings
    </button>
  );
}
