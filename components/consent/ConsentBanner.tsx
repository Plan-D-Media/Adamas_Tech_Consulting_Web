"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { analyticsConfigured } from "@/lib/consent";
import { cx } from "@/lib/cx";
import { Button } from "@/components/ui/Button";
import { onConsentManagerOpen, readConsent, saveConsent, useConsent } from "@/components/consent/consentClient";

/**
 * Cookie consent banner (Swayang, 17 November 2026). Shown only when this build has a Tag Manager container ID and
 * the visitor has made no choice yet, or when they reopen it from the footer's "Cookie settings" link. Nothing
 * analytics-related loads until a choice is made (components/consent/TagManager.tsx).
 *
 * Three ways out, as asked: accept everything, reject everything, or manage the two categories one by one. The
 * choice is stored in the `consent` cookie for six months and can be changed at any time from the footer.
 *
 * Deliberately not a modal: it does not trap focus or block the page, because a visitor who ignores it gets no
 * tags, which is the safe default. It is announced politely, sits above the page in the tab order after the main
 * content, and is reachable by keyboard. Reopening it from the footer moves focus to its heading.
 */
export function ConsentBanner() {
  const stored = useConsent();
  const [reopened, setReopened] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();

  // Reopened from the footer: show the category list, starting from whatever is stored right now (read from the
  // cookie inside the handler, so this subscription never has to be re-created).
  useEffect(
    () =>
      onConsentManagerOpen(() => {
        const current = readConsent();
        setAnalytics(!!current?.analytics);
        setMarketing(!!current?.marketing);
        setReopened(true);
        setManaging(true);
      }),
    [],
  );

  // Move focus into the banner once it is on screen, so the footer control leads somewhere for keyboard users.
  useEffect(() => {
    if (reopened) headingRef.current?.focus();
  }, [reopened]);

  if (!analyticsConfigured) return null;
  const open = reopened || !stored;
  if (!open) return null;

  const decide = (choice: { analytics: boolean; marketing: boolean }) => {
    const wasAllowed = !!stored && (stored.analytics || stored.marketing);
    saveConsent(choice);
    setReopened(false);
    setManaging(false);
    // A script that is already running cannot be unloaded, so withdrawing consent reloads the page.
    if (wasAllowed && !choice.analytics && !choice.marketing) location.reload();
  };

  return (
    <section
      aria-labelledby={`${uid}-heading`}
      aria-live="polite"
      data-consent-banner
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/15 bg-navy-900/95 text-white backdrop-blur print:hidden"
    >
      <div className="container-chrome py-5 lg:py-6">
        <div className={cx("flex flex-col gap-4", !managing && "lg:flex-row lg:items-center lg:justify-between lg:gap-8")}>
          <div className="max-w-[46rem]">
            <h2 id={`${uid}-heading`} ref={headingRef} tabIndex={-1} className="font-ui text-[1.0625rem] font-bold leading-snug outline-none">
              Cookies on this site
            </h2>
            <p className="mt-1.5 font-body text-small leading-relaxed text-grey-300">
              We use one cookie to remember your region, which the site needs to work. With your agreement we would also measure how the site is used, so we can improve it.
              You can change your mind at any time.{" "}
              <Link href="/cookie-policy" className="underline underline-offset-4 hover:text-white">
                Read our cookie policy
              </Link>
              .
            </p>

            {managing && (
              <ul className="mt-4 grid gap-3" role="list">
                <li className="rounded-lg bg-white/5 p-3.5 ring-1 ring-white/10">
                  <p className="font-body text-small font-semibold text-white">Strictly necessary</p>
                  <p className="mt-0.5 font-body text-caption text-grey-300">
                    The region cookie, and your choice here. Always on, because the site cannot work without them.
                  </p>
                </li>
                <li className="rounded-lg bg-white/5 p-3.5 ring-1 ring-white/10">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-blue-500"
                    />
                    <span>
                      <span className="block font-body text-small font-semibold text-white">Analytics</span>
                      <span className="mt-0.5 block font-body text-caption text-grey-300">
                        Google Analytics, through Google Tag Manager, to count visits and see which pages are useful. No advertising profile is built from it.
                      </span>
                    </span>
                  </label>
                </li>
                <li className="rounded-lg bg-white/5 p-3.5 ring-1 ring-white/10">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-blue-500"
                    />
                    <span>
                      <span className="block font-body text-small font-semibold text-white">Advertising</span>
                      <span className="mt-0.5 block font-body text-caption text-grey-300">
                        Lets us measure which campaigns bring people here, and show relevant adverts elsewhere.
                      </span>
                    </span>
                  </label>
                </li>
              </ul>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {managing ? (
              <>
                <Button variant="primary" arrow={false} onClick={() => decide({ analytics, marketing })} data-consent="save">
                  Save my choices
                </Button>
                <Button variant="secondary" arrow={false} onClick={() => decide({ analytics: false, marketing: false })} data-consent="reject">
                  Reject all
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" arrow={false} onClick={() => decide({ analytics: true, marketing: true })} data-consent="accept">
                  Accept all
                </Button>
                <Button variant="secondary" arrow={false} onClick={() => decide({ analytics: false, marketing: false })} data-consent="reject">
                  Reject all
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setAnalytics(!!stored?.analytics);
                    setMarketing(!!stored?.marketing);
                    setManaging(true);
                  }}
                  data-consent="manage"
                  className="min-h-12 px-2 font-body text-small font-semibold text-sky-300 underline underline-offset-4 hover:text-white"
                >
                  Manage cookies
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
