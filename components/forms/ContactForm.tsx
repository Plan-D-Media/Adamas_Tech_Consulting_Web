"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { useHydrated, useLocationPath } from "@/lib/use-client-snapshot";
import Link from "next/link";
import { cx } from "@/lib/cx";
import { HONEYPOT } from "./honeypot";
import { submitContact } from "@/app/contact/actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_FIELDS, fieldError, type ContactField, type ContactState } from "./contact-schema";
import { Checkbox, Field } from "./Field";

const initial: ContactState = { status: "idle" };

/**
 * Contact enquiry form. Server action + useActionState, so it works without JavaScript (the browser posts and
 * the page re-renders with the result, then redirects to /thank-you). Once hydrated: native bubbles give way to
 * inline validation on blur, errors clear as they are fixed, and focus moves to the first problem.
 */
export function ContactForm({ idPrefix = "contact" }: { idPrefix?: string }) {
  const [state, action, pending] = useActionState(submitContact, initial, "/contact");
  const hydrated = useHydrated();
  const sourcePath = useLocationPath();
  const [local, setLocal] = useState<Partial<Record<ContactField, string | undefined>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // A new server result replaces the client-side messages (reset while rendering, not in an effect).
  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    setLocal({});
  }

  useEffect(() => {
    if (state.status === "error" && state.fieldErrors) {
      const first = CONTACT_FIELDS.find((f) => state.fieldErrors?.[f]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }, [state]);

  const isField = (n: string): n is ContactField => (CONTACT_FIELDS as readonly string[]).includes(n);
  const valueOf = (el: HTMLInputElement | HTMLTextAreaElement) => (el instanceof HTMLInputElement && el.type === "checkbox" ? (el.checked ? "on" : "") : el.value);

  // Validate a field when the visitor leaves it (not while typing a first draft).
  const onBlur = (e: FocusEvent<HTMLFormElement>) => {
    const el = e.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    if (!isField(el.name) || el.type === "checkbox") return;
    setLocal((l) => ({ ...l, [el.name]: fieldError(el.name as ContactField, valueOf(el)) }));
  };
  // Once a field shows an error, re-check it as it is corrected.
  const onChange = (e: ChangeEvent<HTMLFormElement>) => {
    const el = e.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    if (!isField(el.name) || !err(el.name)) return;
    setLocal((l) => ({ ...l, [el.name]: fieldError(el.name as ContactField, valueOf(el)) }));
  };

  const err = (f: ContactField) => (f in local ? local[f] : state.fieldErrors?.[f]);
  const v = (f: Exclude<ContactField, "consent">) => state.values?.[f] ?? "";
  const banner = state.status !== "idle" ? state.message : undefined;
  const id = (f: string) => `${idPrefix}-${f}`;

  return (
    <form
      ref={formRef}
      action={action}
      noValidate={hydrated}
      onBlur={onBlur}
      onChange={onChange}
      aria-describedby={`${idPrefix}-status`}
      className="rounded-card bg-white p-6 shadow-(--shadow-float) ring-1 ring-grey-200 sm:p-8 md:p-10"
    >
      <div id={`${idPrefix}-status`} role="status" aria-live="polite" className={banner ? "mb-8" : undefined}>
        {banner && (
          <div className="flex gap-3 rounded-card bg-orange-500/8 p-4 text-[0.9375rem] text-navy-950 ring-1 ring-orange-500/40">
            <Icon name="close" size={20} className="mt-0.5 shrink-0 text-orange-700" />
            <p className="font-semibold">{banner}</p>
          </div>
        )}
      </div>

      <fieldset disabled={pending} className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <legend className="sr-only">Your details and message</legend>
        <Field id={id("name")} name="name" label="Name" required autoComplete="name" maxLength={120} error={err("name")} defaultValue={v("name")} className="sm:col-span-2" />
        <Field id={id("email")} name="email" label="Email" type="email" required autoComplete="email" inputMode="email" error={err("email")} defaultValue={v("email")} />
        <Field
          id={id("phone")}
          name="phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          error={err("phone")}
          defaultValue={v("phone")}
          hint="Include your country code."
        />
        <Field id={id("country")} name="country" label="Country" required autoComplete="country-name" maxLength={80} error={err("country")} defaultValue={v("country")} className="sm:col-span-2" />
        <Field id={id("message")} name="message" label="Message" multiline required maxLength={5000} error={err("message")} defaultValue={v("message")} className="sm:col-span-2" />

        {/* Honeypot: hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={id(HONEYPOT)}>Leave this field empty</label>
          <input id={id(HONEYPOT)} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="sourcePath" value={sourcePath} />

        <Checkbox id={id("consent")} name="consent" error={err("consent")} className="sm:col-span-2">
          I agree to the{" "}
          <Link href="/terms-of-use" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
            terms of use
          </Link>{" "}
          and to AdamasTech handling my details as described in the{" "}
          <Link href="/privacy-policy" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
            privacy policy
          </Link>
          .
        </Checkbox>
      </fieldset>

      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" arrow={!pending} disabled={pending} aria-disabled={pending} className={cx("w-full sm:w-auto", "disabled:cursor-wait disabled:opacity-80")}>
          {pending ? "Sending…" : "Send message"}
        </Button>
        <p className="text-small text-grey-600">
          <span aria-hidden="true">*</span> Required
        </p>
      </div>
    </form>
  );
}
