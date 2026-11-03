"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { useHydrated } from "@/lib/use-client-snapshot";
import { cx } from "@/lib/cx";
import { HONEYPOT_FIELD as HONEYPOT } from "./honeypot";
import { Button, ButtonLink, ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { registerForEvent, type RegistrationField, type RegistrationState } from "./actions";

const initial: RegistrationState = { status: "idle" };

/**
 * Event registration. Server action + useActionState, so it works before (or without) JavaScript:
 * the browser posts the form and the page re-renders with the result. Once hydrated, native bubbles are
 * swapped for the designed inline messages, and focus moves to the first problem.
 */
export function RegistrationForm({ slug, eventLabel, dateLabel, calendarHref }: { slug: string; eventLabel: string; dateLabel: string; calendarHref: string }) {
  const [state, action, pending] = useActionState(registerForEvent, initial, `/insights/events/${slug}`);
  const hydrated = useHydrated();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "error" && state.fieldErrors) {
      const first = Object.keys(state.fieldErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-card bg-white p-7 shadow-(--shadow-float) ring-1 ring-grey-200 outline-none md:p-10">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-8 ring-brand-50/50">
          <Icon name="check" size={28} strokeWidth={2} />
        </span>
        <h3 className="mt-7 text-h3 text-navy-950">{state.firstName ? `You’re registered, ${state.firstName}` : "You’re registered"}</h3>
        <p className="mt-4 text-lead text-grey-700">
          Thank you. Your place at <strong className="font-semibold text-navy-950">{eventLabel}</strong> is recorded, and we will be in touch by email with the final details.
        </p>
        <dl className="mt-7 grid gap-3 rounded-card bg-grey-25 p-5 text-[0.9375rem] ring-1 ring-grey-100">
          <div className="flex items-center gap-3">
            <dt className="sr-only">Date</dt>
            <Icon name="calendar" size={18} className="shrink-0 text-brand-600" />
            <dd className="font-semibold text-navy-950">{dateLabel}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ButtonLink href={calendarHref} variant="secondary" download>
            <Icon name="download" size={18} />
            Add to calendar
          </ButtonLink>
          <ArrowLink href="/insights/events">All events</ArrowLink>
        </div>
      </div>
    );
  }

  const err = (f: RegistrationField) => state.fieldErrors?.[f];
  const v = (f: Exclude<RegistrationField, "consent">) => state.values?.[f] ?? "";
  const banner = state.status !== "idle" ? state.message : undefined;

  return (
    <form
      ref={formRef}
      action={action}
      noValidate={hydrated}
      aria-describedby="reg-status"
      className="rounded-card bg-white p-6 shadow-(--shadow-float) ring-1 ring-grey-200 sm:p-8 md:p-10"
    >
      <input type="hidden" name="event" value={slug} />
      <div id="reg-status" aria-live="polite" className={banner ? "mb-8" : undefined}>
        {banner && (
          <div
            className={cx(
              "flex gap-3 rounded-card p-4 text-[0.9375rem] ring-1",
              state.status === "duplicate" ? "bg-brand-50 text-navy-950 ring-brand-100" : "bg-orange-500/8 text-navy-950 ring-orange-500/40",
            )}
          >
            <Icon name={state.status === "duplicate" ? "check" : "close"} size={20} className={cx("mt-0.5 shrink-0", state.status === "duplicate" ? "text-brand-600" : "text-orange-700")} />
            <p className="font-semibold">{banner}</p>
          </div>
        )}
      </div>

      <fieldset disabled={pending} className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <legend className="sr-only">Your details</legend>
        <Field name="name" label="Full name" required autoComplete="name" error={err("name")} defaultValue={v("name")} className="sm:col-span-2" />
        <Field name="email" label="Work email" type="email" required autoComplete="email" inputMode="email" error={err("email")} defaultValue={v("email")} className="sm:col-span-2" />
        <Field name="company" label="Organisation" autoComplete="organization" error={err("company")} defaultValue={v("company")} />
        <Field name="jobTitle" label="Job title" autoComplete="organization-title" error={err("jobTitle")} defaultValue={v("jobTitle")} />
        <Field name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" error={err("phone")} defaultValue={v("phone")} className="sm:col-span-2" hint="Optional. Include your country code." />
        <Field name="notes" label="Anything we should know?" multiline error={err("notes")} defaultValue={v("notes")} className="sm:col-span-2" hint="Optional. For example, accessibility or dietary requirements." />

        {/* Honeypot: hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`reg-${HONEYPOT}`}>Leave this field empty</label>
          <input id={`reg-${HONEYPOT}`} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Consent error={err("consent")} className="sm:col-span-2">
          I agree to AdamasTech storing these details to manage my registration, as described in the{" "}
          <Link href="/privacy-policy" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
            Privacy Policy
          </Link>
          .
        </Consent>
      </fieldset>

      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" arrow={!pending} disabled={pending} aria-disabled={pending} className="w-full sm:w-auto disabled:cursor-wait disabled:opacity-80">
          {pending ? "Registering…" : "Register my place"}
        </Button>
        <p className="text-small text-grey-600">
          <span aria-hidden="true">*</span> Required
        </p>
      </div>
    </form>
  );
}

const control =
  "block w-full rounded-btn border bg-white px-4 text-base text-navy-950 transition-[border-color,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) placeholder:text-grey-500 hover:border-grey-500 focus:border-brand-600";

export function Field({
  name,
  label,
  type = "text",
  required,
  error,
  hint,
  defaultValue,
  multiline,
  className,
  idPrefix = "reg",
  ...rest
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  defaultValue?: string;
  multiline?: boolean;
  className?: string;
  idPrefix?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
}) {
  const id = `${idPrefix}-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    required,
    defaultValue,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: cx(control, error ? "border-orange-700 bg-orange-500/5" : "border-grey-300"),
    ...rest,
  };
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[0.9375rem] font-semibold text-navy-950">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-orange-700">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-small text-grey-600">
          {hint}
        </p>
      )}
      {multiline ? <textarea {...common} rows={4} className={cx(common.className, "mt-2 min-h-32 resize-y py-3")} /> : <input {...common} type={type} className={cx(common.className, "mt-2 h-13")} />}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function FieldError({ id, error, tone = "light" }: { id: string; error?: string; tone?: "light" | "dark" }) {
  if (!error) return null;
  return (
    <p id={id} className={cx("mt-2 flex items-start gap-2 text-small font-semibold", tone === "dark" ? "text-orange-500" : "text-orange-700")}>
      <Icon name="close" size={16} strokeWidth={2.25} className="mt-0.5 shrink-0" />
      {error}
    </p>
  );
}

function Consent({ error, children, className }: { error?: string; children: ReactNode; className?: string }) {
  const id = "reg-consent";
  return (
    <div className={className}>
      <div className={cx("flex items-start gap-4 rounded-card p-4 ring-1", error ? "bg-orange-500/5 ring-orange-700" : "bg-grey-25 ring-grey-200")}>
        <input
          id={id}
          name="consent"
          type="checkbox"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-6 shrink-0 cursor-pointer rounded-[3px] accent-brand-600"
        />
        <label htmlFor={id} className="cursor-pointer text-[0.9375rem] leading-relaxed text-grey-700">
          {children}
          <span aria-hidden="true" className="ml-0.5 text-orange-700">
            *
          </span>
        </label>
      </div>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}
