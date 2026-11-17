"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { submitContact } from "@/app/(site)/contact/actions";
import type { ContactField, ContactState } from "@/lib/contact-schema";
import { fieldError } from "@/lib/contact-validate";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { cx } from "@/lib/cx";
import type { RegionSlug } from "@/lib/region";
import { useLocationSearch } from "@/lib/use-client-snapshot";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/nav/Flag";
import { useRegionCookie } from "@/components/nav/regionClient";

interface Props {
  placeholders: { name: string; email: string; phone: string; message: string };
  submitLabel: string;
  consentLabel: string;
  /** The page's region on a regional homepage; null on global pages, where the visitor's cookie (then `fallbackRegion`) picks the default country. */
  regionSlug: string | null;
  fallbackRegion?: RegionSlug;
  /** Source path stored with the enquiry; the page's query string (e.g. ?service=sap) is appended in the browser. Defaults to the homepage path. */
  sourcePath?: string;
}

const DEFAULT_COUNTRY: Record<string, string> = { in: "India", uk: "United Kingdom", gcc: "United Arab Emirates" };

/** Country options for the phone selector (Figma shows a flag + chevron); the value doubles as the "country" field. */
const COUNTRIES = [
  { code: "in", label: "India", dial: "+91" },
  { code: "uk", label: "United Kingdom", dial: "+44" },
  { code: "ie", label: "Ireland", dial: "+353" },
  { code: "gcc", label: "United Arab Emirates", dial: "+971" },
  { code: "sa", label: "Saudi Arabia", dial: "+966" },
  { code: "qa", label: "Qatar", dial: "+974" },
  { code: "kw", label: "Kuwait", dial: "+965" },
  { code: "bh", label: "Bahrain", dial: "+973" },
  { code: "om", label: "Oman", dial: "+968" },
  { code: "us", label: "United States", dial: "+1" },
  { code: "other", label: "Other", dial: "" },
];
const FLAG_FOR: Record<string, string> = { in: "in", uk: "uk", gcc: "gcc" };
const initial: ContactState = { status: "idle" };

const LEGAL_LINKS: Record<string, string> = { "Privacy Policy": "/privacy-policy", "Terms of Use": "/terms-of-use" };
const linkCls = "text-blue-600 underline underline-offset-2";

/** Turns "Privacy Policy" and "Terms of Use" inside the consent copy into links; appends both when the copy names neither. */
function consentWithLinks(label: string) {
  const parts = label.split(/(Privacy Policy|Terms of Use)/);
  if (parts.length === 1) {
    return (
      <>
        {label}{" "}
        <Link href={LEGAL_LINKS["Privacy Policy"]} className={linkCls}>
          Privacy Policy
        </Link>
        {" / "}
        <Link href={LEGAL_LINKS["Terms of Use"]} className={linkCls}>
          Terms of Use
        </Link>
      </>
    );
  }
  return parts.map((part, i) =>
    LEGAL_LINKS[part] ? (
      <Link key={i} href={LEGAL_LINKS[part]} className={linkCls}>
        {part}
      </Link>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function HomeContactForm({ placeholders, submitLabel, consentLabel, regionSlug, fallbackRegion = "in", sourcePath }: Props) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const uid = useId();
  // Default country: the page's region, else the visitor's cookie once hydrated (null during SSR), else the fallback.
  const cookieRegion = useRegionCookie();
  const defaultCountry = DEFAULT_COUNTRY[regionSlug ?? cookieRegion ?? fallbackRegion] ?? "India";
  const [chosen, setChosen] = useState<string | null>(state.values?.country || null);
  const country = chosen ?? defaultCountry;
  const search = useLocationSearch();
  const source = sourcePath ? `${sourcePath}${search}` : regionSlug ? `/${regionSlug}/` : "/";
  const [live, setLive] = useState<Partial<Record<ContactField, string | undefined>>>({});
  const errors = { ...state.fieldErrors, ...live };
  const flag = FLAG_FOR[COUNTRIES.find((c) => c.label === country)?.code ?? ""] ?? null;

  const field = (name: Exclude<ContactField, "consent" | "country">) => ({
    id: `${uid}-${name}`,
    name,
    defaultValue: state.values?.[name] ?? "",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => setLive((l) => ({ ...l, [name]: fieldError(name, e.target.value) })),
  });
  // Keyboard focus keeps the global 2px blue ring (focus-visible); the 1px border change alone was too thin (QA BUG-016).
  const inputCls = "h-[52px] w-full rounded-sm border border-[#EDF5F8] bg-white pr-4 font-ui text-[1.125rem] text-[#333E63] placeholder:text-[#333E63]/50 focus:border-blue-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-blue-600";
  const err = (name: ContactField) =>
    errors[name] ? (
      <p id={`${uid}-${name}-error`} className="mt-1 font-body text-[0.8125rem] text-[#B4600A]">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form action={action} noValidate className="mt-[26px] grid max-w-[421px] gap-5">
      {state.status !== "idle" && state.message && (
        <p role="status" className={cx("rounded-sm px-4 py-3 font-body text-[0.9375rem]", state.status === "error" || state.status === "limited" ? "bg-orange-500/10 text-[#B4600A]" : "bg-tint-100 text-navy-800")}>
          {state.message}
        </p>
      )}
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="sourcePath" value={source} />

      <div>
        <label htmlFor={`${uid}-name`} className="sr-only">
          {placeholders.name}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-[15px] top-1/2 -translate-y-1/2 text-blue-500" aria-hidden="true">
            <Icon name="user" size={16} />
          </span>
          <span className="pointer-events-none absolute left-[50px] top-2 h-9 w-px bg-[#EDF5F8]" aria-hidden="true" />
          <input {...field("name")} type="text" autoComplete="name" required placeholder={placeholders.name} className={cx(inputCls, "pl-[65px]")} />
        </div>
        {err("name")}
      </div>

      <div>
        <label htmlFor={`${uid}-email`} className="sr-only">
          {placeholders.email}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-[15px] top-1/2 -translate-y-1/2 text-blue-500" aria-hidden="true">
            <Icon name="mail" size={20} />
          </span>
          <span className="pointer-events-none absolute left-[50px] top-2 h-9 w-px bg-[#EDF5F8]" aria-hidden="true" />
          <input {...field("email")} type="email" autoComplete="email" required placeholder={placeholders.email} className={cx(inputCls, "pl-[65px]")} />
        </div>
        {err("email")}
      </div>

      <div>
        <label htmlFor={`${uid}-phone`} className="sr-only">
          {placeholders.phone}
        </label>
        <div className="relative">
          <label htmlFor={`${uid}-country`} className="sr-only">
            Country
          </label>
          {/* The invisible select sits over the flag; its keyboard focus is drawn as a ring on the flag box (peer), since
              an opacity-0 control cannot show its own outline (QA BUG-009). */}
          <select id={`${uid}-country`} name="country" value={country} onChange={(e) => setChosen(e.target.value)} className="peer absolute left-0 top-0 h-[52px] w-[50px] cursor-pointer opacity-0" aria-label="Country">
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.label}>
                {c.label}
                {c.dial ? ` (${c.dial})` : ""}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute left-[6px] top-1/2 z-10 flex h-9 -translate-y-1/2 items-center gap-1 rounded-sm px-1 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-0 peer-focus-visible:outline-blue-600" aria-hidden="true">
            {flag ? <Flag slug={flag} className="[&_img]:h-[22px] [&_img]:w-[22px] [&_img]:rounded-full" /> : <Icon name="globe" size={20} className="text-grey-500" />}
            <Icon name="chevron-down" size={8} className="text-blue-500" />
          </span>
          <input {...field("phone")} type="tel" autoComplete="tel" placeholder={placeholders.phone} className={cx(inputCls, "pl-[65px]")} />
        </div>
        {err("phone")}
        {err("country")}
      </div>

      <div>
        <label htmlFor={`${uid}-message`} className="sr-only">
          {placeholders.message}
        </label>
        <textarea {...field("message")} required rows={3} placeholder={placeholders.message} className={cx(inputCls, "h-[111px] resize-y px-[15px] py-3")} />
        {err("message")}
      </div>

      {/* The consent line is not in the Figma form (the contact action requires it); it sits inside the design's 35px gap above the button. */}
      <div className="-mt-2.5">
        <label className="flex items-start gap-2 font-body text-[0.75rem] leading-[1.5] text-grey-600">
          <input type="checkbox" name="consent" value="on" required defaultChecked={false} className="mt-0.5 h-4 w-4 accent-blue-600" aria-describedby={errors.consent ? `${uid}-consent-error` : undefined} />
          <span>{consentWithLinks(consentLabel)}</span>
        </label>
        {err("consent")}
        <button type="submit" disabled={pending} className="mt-[7px] inline-flex h-[43px] min-w-[168px] items-center justify-center rounded-pill bg-[linear-gradient(90deg,#4285F7_0%,#3476F6_100%)] px-6 font-ui text-[0.875rem] font-medium text-white transition-[filter] duration-(--duration-fast) hover:brightness-110 disabled:opacity-60">
          {pending ? "Sending..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
