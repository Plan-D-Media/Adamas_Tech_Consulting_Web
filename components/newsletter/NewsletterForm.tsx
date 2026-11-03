"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { useHydrated } from "@/lib/use-client-snapshot";
import { cx } from "@/lib/cx";
import { HONEYPOT_FIELD } from "@/components/events/honeypot";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { subscribeToNewsletter, type NewsletterState } from "./actions";

const initial: NewsletterState = { status: "idle" };

/**
 * Email-only newsletter signup (NewsletterSubscriber). Reusable on any page and on light or dark surfaces.
 * `permalink` is where the browser posts when JavaScript has not loaded (the page that renders the form).
 */
export function NewsletterForm({ tone = "light", permalink, className }: { tone?: "light" | "dark"; permalink: string; className?: string }) {
  const [state, action, pending] = useActionState(subscribeToNewsletter, initial, permalink);
  const hydrated = useHydrated();
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId().replace(/:/g, "");
  const dark = tone === "dark";
  const done = state.status === "success" || state.status === "already";

  useEffect(() => {
    if (state.status !== "error") return;
    const first = state.fieldErrors?.email ? "email" : "consent";
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  const emailErr = state.fieldErrors?.email;
  const consentErr = state.fieldErrors?.consent;
  const errCls = dark ? "text-orange-500" : "text-orange-700";

  if (done) {
    return (
      <div role="status" className={cx("flex items-start gap-4 rounded-card p-5 ring-1", dark ? "bg-white/5 ring-white/15" : "bg-white ring-grey-200", className)}>
        <span className={cx("inline-flex size-10 shrink-0 items-center justify-center rounded-full", dark ? "bg-sky-400/15 text-sky-300" : "bg-brand-50 text-brand-600")}>
          <Icon name="check" size={20} strokeWidth={2} />
        </span>
        <div>
          <p className={cx("font-display text-h4 font-bold", dark ? "text-white" : "text-navy-950")}>{state.status === "already" ? "You’re already subscribed" : "You’re subscribed"}</p>
          {state.message && <p className={cx("mt-1 text-[0.9375rem]", dark ? "text-on-navy-muted" : "text-grey-700")}>{state.message}</p>}
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate={hydrated} className={className}>
      <label htmlFor={`${uid}-email`} className={cx("block text-[0.9375rem] font-semibold", dark ? "text-white" : "text-navy-950")}>
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          defaultValue={state.email}
          placeholder="name@company.com"
          aria-invalid={emailErr ? true : undefined}
          aria-describedby={emailErr ? `${uid}-email-error` : undefined}
          disabled={pending}
          className={cx(
            "h-14 w-full min-w-0 flex-1 rounded-btn border px-4 text-base transition-[border-color] duration-(--duration-base) ease-(--ease-out-expo)",
            dark
              ? "border-white/25 bg-white/5 text-white placeholder:text-on-navy-muted/70 hover:border-white/50 focus:border-sky-400"
              : "border-grey-300 bg-white text-navy-950 placeholder:text-grey-500 hover:border-grey-500 focus:border-brand-600",
            emailErr && "border-orange-700",
          )}
        />
        <Button type="submit" size="lg" disabled={pending} arrow={!pending} className="w-full sm:w-auto disabled:cursor-wait disabled:opacity-80">
          {pending ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {emailErr && (
        <p id={`${uid}-email-error`} className={cx("mt-2 flex items-start gap-2 text-small font-semibold", errCls)}>
          <Icon name="close" size={16} strokeWidth={2.25} className="mt-0.5 shrink-0" />
          {emailErr}
        </p>
      )}

      <div className="mt-4 flex items-start gap-3">
        <input
          id={`${uid}-consent`}
          name="consent"
          type="checkbox"
          required
          disabled={pending}
          aria-invalid={consentErr ? true : undefined}
          aria-describedby={consentErr ? `${uid}-consent-error` : undefined}
          className={cx("mt-0.5 size-6 shrink-0 cursor-pointer rounded-[3px]", dark ? "accent-sky-400" : "accent-brand-600")}
        />
        <label htmlFor={`${uid}-consent`} className={cx("cursor-pointer text-small leading-relaxed", dark ? "text-on-navy-muted" : "text-grey-700")}>
          I would like to receive email updates from AdamasTech. I can unsubscribe at any time; see the{" "}
          <Link href="/privacy-policy" className={cx("font-semibold underline underline-offset-2", dark ? "text-white hover:text-sky-300" : "text-brand-600 hover:text-brand-700")}>
            Privacy Policy
          </Link>
          .
        </label>
      </div>
      {consentErr && (
        <p id={`${uid}-consent-error`} className={cx("mt-2 flex items-start gap-2 text-small font-semibold", errCls)}>
          <Icon name="close" size={16} strokeWidth={2.25} className="mt-0.5 shrink-0" />
          {consentErr}
        </p>
      )}

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-hp`}>Leave this field empty</label>
        <input id={`${uid}-hp`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p aria-live="polite" className={cx("text-small font-semibold", state.status === "idle" ? "sr-only" : "mt-4", errCls)}>
        {state.status !== "idle" ? state.message : ""}
      </p>
    </form>
  );
}
