"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { registerForEvent, type RegistrationField, type RegistrationState } from "@/lib/actions/event";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

interface Props {
  slug: string;
  title: string;
  /** Registration switched on and the event not yet over. */
  open: boolean;
  calendarHref: string;
}

const initial: RegistrationState = { status: "idle" };
const inputCls = "h-[52px] w-full rounded-sm border border-[#DCE3EA] bg-white px-4 font-ui text-[1.0625rem] text-navy-900 placeholder:text-grey-500 focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30";
const labelCls = "mb-1.5 block font-body text-[0.8125rem] font-semibold text-navy-900";

/**
 * Event registration (homepage contact-form styling). Posts to the `registerForEvent` server action, which saves the
 * row, emails the enquiries inbox and the attendee (with the .ics attached) and answers duplicate, closed and
 * rate-limited states. Works without JavaScript: the action re-renders the page with the values and errors.
 */
export function RegistrationForm({ slug, title, open, calendarHref }: Props) {
  const [state, action, pending] = useActionState(registerForEvent, initial);
  const uid = useId();
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="rounded-2xl bg-white p-7 shadow-lift ring-1 ring-grey-200 lg:p-8" role="status">
        <p className="eyebrow text-[1.125rem] text-blue-600 lg:leading-[15px]">Registration received</p>
        <h2 className="mt-4 font-heading text-[1.5rem] font-bold leading-[1.25] text-navy-800">Thank you{state.firstName ? `, ${state.firstName}` : ""}.</h2>
        <p className="mt-3 font-body text-[1rem] leading-[1.6] text-grey-600">
          Your place at {title} is reserved. A confirmation with the calendar entry attached is on its way to your inbox, and we will email the final details before the day.
        </p>
        <a href={calendarHref} className="mt-6 inline-flex h-12 items-center gap-2.5 rounded-sm border border-blue-600 px-5 font-ui text-button font-bold text-blue-600 transition-colors duration-(--duration-fast) hover:bg-blue-600 hover:text-white">
          Add to calendar
          <Icon name="calendar" size={16} />
        </a>
      </div>
    );
  }

  const field = (name: Exclude<RegistrationField, "consent">) => ({
    id: `${uid}-${name}`,
    name,
    defaultValue: state.values?.[name] ?? "",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
  });
  const err = (name: RegistrationField) =>
    errors[name] ? (
      <p id={`${uid}-${name}-error`} className="mt-1 font-body text-[0.8125rem] text-[#B4600A]">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form id="register" action={action} noValidate className="rounded-2xl bg-white p-7 shadow-lift ring-1 ring-grey-200 lg:p-8" aria-labelledby={`${uid}-title`}>
      <p className="eyebrow text-[1.125rem] text-blue-600 lg:leading-[15px]">Register</p>
      <h2 id={`${uid}-title`} className="mt-4 font-heading text-[1.5rem] font-bold leading-[1.25] text-navy-800">
        Reserve your place
      </h2>
      {!open && (
        <p className="mt-3 rounded-sm bg-tint-100 px-4 py-3 font-body text-[0.9375rem] text-navy-800" role="status">
          Registration for this event is closed.
        </p>
      )}
      {state.status !== "idle" && state.message && (
        <p role={state.status === "error" ? "alert" : "status"} className={cx("mt-3 rounded-sm px-4 py-3 font-body text-[0.9375rem]", state.status === "error" || state.status === "limited" ? "bg-orange-500/10 text-[#B4600A]" : "bg-tint-100 text-navy-800")}>
          {state.message}
        </p>
      )}
      <input type="hidden" name="event" value={slug} />
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="mt-6 grid gap-4">
        <div>
          <label htmlFor={`${uid}-name`} className={labelCls}>
            Full name
          </label>
          <input {...field("name")} type="text" autoComplete="name" required className={inputCls} disabled={!open} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className={labelCls}>
            Work email
          </label>
          <input {...field("email")} type="email" autoComplete="email" required className={inputCls} disabled={!open} />
          {err("email")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-company`} className={labelCls}>
              Organisation <span className="font-normal text-grey-500">(optional)</span>
            </label>
            <input {...field("company")} type="text" autoComplete="organization" className={inputCls} disabled={!open} />
            {err("company")}
          </div>
          <div>
            <label htmlFor={`${uid}-jobTitle`} className={labelCls}>
              Job title <span className="font-normal text-grey-500">(optional)</span>
            </label>
            <input {...field("jobTitle")} type="text" autoComplete="organization-title" className={inputCls} disabled={!open} />
            {err("jobTitle")}
          </div>
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={labelCls}>
            Phone <span className="font-normal text-grey-500">(optional)</span>
          </label>
          <input {...field("phone")} type="tel" autoComplete="tel" className={inputCls} disabled={!open} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor={`${uid}-notes`} className={labelCls}>
            Anything we should know? <span className="font-normal text-grey-500">(optional)</span>
          </label>
          <textarea {...field("notes")} rows={3} className={cx(inputCls, "h-[96px] resize-y py-3")} disabled={!open} />
          {err("notes")}
        </div>
        <div>
          <label className="flex items-start gap-2 font-body text-[0.8125rem] leading-[1.5] text-grey-600">
            <input type="checkbox" name="consent" value="on" required className="mt-0.5 h-4 w-4 accent-blue-600" disabled={!open} aria-describedby={errors.consent ? `${uid}-consent-error` : undefined} />
            <span>
              I agree to AdamasTech Consulting processing my details to manage this event, as set out in the{" "}
              <Link href="/privacy-policy" className="text-blue-600 underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {err("consent")}
        </div>
      </div>

      <button type="submit" disabled={pending || !open} className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-md border border-blue-600 bg-blue-600 px-5 font-ui text-button font-bold text-white transition-colors duration-(--duration-fast) hover:border-blue-500 hover:bg-blue-500 disabled:opacity-60 sm:w-auto">
        {pending ? "Sending..." : "Register"}
        <Icon name="arrow" size={16} />
      </button>
    </form>
  );
}
