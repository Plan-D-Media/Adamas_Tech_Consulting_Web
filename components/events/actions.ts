"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { HONEYPOT, clientIpHash, enquiriesInbox, rateLimit, sendMail } from "@/lib/forms";
import { getEventForRegistration } from "@/lib/data/events";
import { plain } from "@/lib/placeholder";
import { longDate, timeRange } from "./format";

export type RegistrationField = "name" | "email" | "company" | "jobTitle" | "phone" | "notes" | "consent";

export interface RegistrationState {
  status: "idle" | "error" | "success" | "duplicate" | "closed" | "limited";
  message?: string;
  fieldErrors?: Partial<Record<RegistrationField, string>>;
  /** Echoed back so a failed submission keeps what the visitor typed (also without JavaScript). */
  values?: Partial<Record<Exclude<RegistrationField, "consent">, string>>;
  /** First name, for the confirmation panel. */
  firstName?: string;
}

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, { error: `${label} must be ${max} characters or fewer.` })
    .transform((v) => v || null);

const schema = z.object({
  name: z.string().trim().min(2, { error: "Enter your full name." }).max(120, { error: "Name must be 120 characters or fewer." }),
  email: z
    .string()
    .trim()
    .min(1, { error: "Enter your work email address." })
    .pipe(z.email({ error: "Enter an email address in the correct format, like name@company.com." }))
    .transform((v) => v.toLowerCase()),
  company: optionalText(160, "Organisation"),
  jobTitle: optionalText(120, "Job title"),
  phone: z
    .string()
    .trim()
    .max(40, { error: "Phone number must be 40 characters or fewer." })
    .refine((v) => !v || /^[+()\d\s.-]{6,}$/.test(v), { error: "Enter a phone number using digits, spaces and an optional +." })
    .transform((v) => v || null),
  notes: optionalText(1000, "Notes"),
  consent: z.literal("on", { error: "Please confirm you agree so we can process your registration." }),
});

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v : "";
};

/**
 * Unbound on purpose: the event slug travels in a hidden `event` field. A bound action
 * (`registerForEvent.bind(null, slug)`) sent the server into a CPU spin when the form was
 * submitted without JavaScript (found 2026-10-30), so never bind arguments to form actions.
 */
export async function registerForEvent(_prev: RegistrationState, fd: FormData): Promise<RegistrationState> {
  const slug = str(fd, "event");
  const values = {
    name: str(fd, "name"),
    email: str(fd, "email"),
    company: str(fd, "company"),
    jobTitle: str(fd, "jobTitle"),
    phone: str(fd, "phone"),
    notes: str(fd, "notes"),
  };

  const event = await getEventForRegistration(slug);
  if (!event || !event.open) {
    return { status: "closed", message: "Registration for this event is closed.", values };
  }

  // Bots fill the hidden field: answer as if it worked, store nothing.
  if (str(fd, HONEYPOT)) return { status: "success", firstName: values.name.trim().split(/\s+/)[0] };

  const parsed = schema.safeParse({ ...values, consent: fd.get("consent") ?? "" });
  if (!parsed.success) {
    const fe = z.flattenError(parsed.error).fieldErrors as Partial<Record<RegistrationField, string[]>>;
    const fieldErrors = Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0]])) as RegistrationState["fieldErrors"];
    const n = Object.keys(fieldErrors ?? {}).length;
    return { status: "error", message: `There ${n === 1 ? "is 1 problem" : `are ${n} problems`} with your registration. Check the highlighted ${n === 1 ? "field" : "fields"}.`, fieldErrors, values };
  }

  const ipHash = await clientIpHash();
  if (!(await rateLimit(`event-registration:${ipHash}`, 5, 600))) {
    return { status: "limited", message: "Too many attempts from this connection. Please wait a few minutes and try again.", values };
  }

  const d = parsed.data;
  let id: string;
  try {
    const row = await db.eventRegistration.create({
      data: { eventId: event.id, name: d.name, email: d.email, company: d.company, jobTitle: d.jobTitle, phone: d.phone, notes: d.notes, consent: true, ipHash },
      select: { id: true },
    });
    id = row.id;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { status: "duplicate", message: `${d.email} is already registered for this event. There is no need to register again.`, values };
    }
    console.error("[event-registration]", e);
    return { status: "error", message: "Something went wrong on our side and your registration was not saved. Please try again in a moment.", values };
  }

  const title = plain(event.title) || "AdamasTech event";
  const start = event.startsAt.toISOString();
  const when = `${longDate(start, event.timezone)}, ${timeRange(start, event.endsAt?.toISOString() ?? null, event.timezone)}`;
  const where = [event.venueName, event.venueAddress].filter(Boolean).join(", ");

  const [notified] = await Promise.all([
    sendMail({
      to: enquiriesInbox(),
      replyTo: d.email,
      subject: `Event registration: ${title}`,
      text: [
        `Event: ${title} (${event.slug})`,
        `When: ${when}`,
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        `Organisation: ${d.company ?? "-"}`,
        `Job title: ${d.jobTitle ?? "-"}`,
        `Phone: ${d.phone ?? "-"}`,
        `Notes: ${d.notes ?? "-"}`,
      ].join("\n"),
    }),
    sendMail({
      to: d.email,
      subject: `Your registration: ${title}`,
      text: [`Thank you for registering, ${d.name}.`, "", title, when, where, "", "We will be in touch by email with the final details."].join("\n"),
    }),
  ]);
  if (notified) await db.eventRegistration.update({ where: { id }, data: { mailedAt: new Date() } }).catch(() => {});

  return { status: "success", firstName: d.name.split(/\s+/)[0] };
}
