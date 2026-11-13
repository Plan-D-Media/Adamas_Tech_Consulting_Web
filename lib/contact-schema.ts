import { z } from "zod";

/**
 * Contact form schema, shared by the server action (authoritative) and the browser (inline validation on blur).
 * Fields follow the ContactSubmission model; `consent` mirrors the live form's terms checkbox and is not stored.
 * Messages use the same wording style as the event registration form.
 */

export const CONTACT_FIELDS = ["name", "email", "phone", "country", "message", "consent"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

export const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Enter your name." }).max(120, { error: "Name must be 120 characters or fewer." }),
  email: z
    .string()
    .trim()
    .min(1, { error: "Enter your email address." })
    .pipe(z.email({ error: "Enter an email address in the correct format, like name@company.com." }))
    .transform((v) => v.toLowerCase()),
  phone: z
    .string()
    .trim()
    .max(40, { error: "Phone number must be 40 characters or fewer." })
    .refine((v) => !v || /^[+()\d\s.-]{6,}$/.test(v), { error: "Enter a phone number using digits, spaces and an optional +." })
    .transform((v) => v || null),
  country: z.string().trim().min(2, { error: "Enter your country." }).max(80, { error: "Country must be 80 characters or fewer." }),
  message: z
    .string()
    .trim()
    .min(10, { error: "Enter a message of at least 10 characters." })
    .max(5000, { error: "Message must be 5,000 characters or fewer." }),
  consent: z.literal("on", { error: "Please agree to the terms of use and privacy policy so we can reply." }),
});

export type ContactInput = z.input<typeof contactSchema>;

/** First error for one field (used on blur in the browser). */
export function fieldError(field: ContactField, value: string): string | undefined {
  const r = contactSchema.shape[field].safeParse(value);
  return r.success ? undefined : r.error.issues[0]?.message;
}

export interface ContactState {
  status: "idle" | "error" | "limited";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Echoed back so a failed submission keeps what the visitor typed (also without JavaScript). */
  values?: Partial<Record<Exclude<ContactField, "consent">, string>>;
}
