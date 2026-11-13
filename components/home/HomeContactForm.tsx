"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { submitContact } from "@/app/(site)/contact/actions";
import type { ContactField, ContactState } from "@/lib/contact-schema";
import { fieldError } from "@/lib/contact-schema";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/nav/Flag";

interface Props {
  placeholders: { name: string; email: string; phone: string; message: string };
  submitLabel: string;
  consentLabel: string;
  regionSlug: string | null;
}

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

export function HomeContactForm({ placeholders, submitLabel, consentLabel, regionSlug }: Props) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const uid = useId();
  const defaultCountry = regionSlug === "uk" ? "United Kingdom" : regionSlug === "ae" || regionSlug === "gcc" ? "United Arab Emirates" : "India";
  const [country, setCountry] = useState(state.values?.country || defaultCountry);
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
  const inputCls = "h-[52px] w-full rounded-sm border border-[#EDF5F8] bg-white pr-4 font-ui text-[1.125rem] text-[#333E63] placeholder:text-[#333E63]/50 focus:border-blue-500 focus:outline-none";
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
      <input type="hidden" name="sourcePath" value={regionSlug ? `/${regionSlug}/` : "/"} />

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
          <span className="pointer-events-none absolute left-[10px] top-1/2 z-10 flex -translate-y-1/2 items-center gap-1" aria-hidden="true">
            {flag ? <Flag slug={flag} className="[&_img]:h-[22px] [&_img]:w-[22px] [&_img]:rounded-full" /> : <Icon name="globe" size={20} className="text-grey-500" />}
            <Icon name="chevron-down" size={8} className="text-blue-500" />
          </span>
          <select id={`${uid}-country`} name="country" value={country} onChange={(e) => setCountry(e.target.value)} className="absolute left-0 top-0 h-[52px] w-[50px] cursor-pointer opacity-0" aria-label="Country">
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.label}>
                {c.label}
                {c.dial ? ` (${c.dial})` : ""}
              </option>
            ))}
          </select>
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

      <div>
        <label className="flex items-start gap-2 font-body text-[0.8125rem] leading-snug text-grey-600">
          <input type="checkbox" name="consent" value="on" required defaultChecked={false} className="mt-0.5 h-4 w-4 accent-blue-600" aria-describedby={errors.consent ? `${uid}-consent-error` : undefined} />
          <span>
            {consentLabel}{" "}
            <Link href="/privacy-policy" className="text-blue-500 underline underline-offset-2">
              Privacy Policy
            </Link>
            {" / "}
            <Link href="/terms-of-use" className="text-blue-500 underline underline-offset-2">
              Terms of Use
            </Link>
          </span>
        </label>
        {err("consent")}
      </div>

      <div className="pt-[15px]">
        <button type="submit" disabled={pending} className="inline-flex h-[43px] min-w-[168px] items-center justify-center rounded-pill bg-[linear-gradient(90deg,#4285F7_0%,#3476F6_100%)] px-6 font-ui text-[0.875rem] font-medium text-white transition-[filter] duration-(--duration-fast) hover:brightness-110 disabled:opacity-60">
          {pending ? "Sending..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
