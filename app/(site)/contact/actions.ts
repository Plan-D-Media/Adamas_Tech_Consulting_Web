"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { HONEYPOT, clientIpHash, enquiriesInbox, rateLimit, sendMail } from "@/lib/forms";
import { REGION_COOKIE, isRegionSlug, slugToCode } from "@/lib/region";
import { contactSchema, type ContactField, type ContactState } from "@/lib/contact-schema";

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v : "";
};

/** A same-site path such as "/contact?service=sap" (from the hidden field, or the Referer without JavaScript). */
function sameSitePath(candidate: string, host: string | null): string | null {
  if (!candidate) return null;
  try {
    const u = new URL(candidate, `https://${host ?? "localhost"}`);
    if (host && u.host !== host) return null;
    return `${u.pathname}${u.search}`.slice(0, 300);
  } catch {
    return null;
  }
}

/** `?service=` hint, e.g. from a "Talk to an expert" link on a service page: a short slug-like value only. */
function serviceHint(path: string | null): string | null {
  if (!path) return null;
  const v = new URL(path, "https://x").searchParams.get("service")?.trim();
  return v && /^[\w\s/&.,()-]{1,120}$/.test(v) ? v : null;
}

/**
 * Contact enquiry. Works before (or without) JavaScript: the browser posts the form and the page re-renders
 * with the returned state; on success the action redirects to /thank-you (303 without JS, client navigation with).
 */
export async function submitContact(_prev: ContactState, fd: FormData): Promise<ContactState> {
  const values = {
    name: str(fd, "name"),
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    country: str(fd, "country"),
    message: str(fd, "message"),
  };

  // Bots fill the hidden field: answer as if it worked, store and send nothing.
  if (str(fd, HONEYPOT)) redirect("/thank-you");

  const parsed = contactSchema.safeParse({ ...values, consent: fd.get("consent") ?? "" });
  if (!parsed.success) {
    const fe = z.flattenError(parsed.error).fieldErrors as Partial<Record<ContactField, string[]>>;
    const fieldErrors = Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0]])) as ContactState["fieldErrors"];
    const n = Object.keys(fieldErrors ?? {}).length;
    return {
      status: "error",
      message: `There ${n === 1 ? "is 1 problem" : `are ${n} problems`} with your message. Check the highlighted ${n === 1 ? "field" : "fields"}.`,
      fieldErrors,
      values,
    };
  }

  const ipHash = await clientIpHash();
  if (!(await rateLimit(`contact:${ipHash}`, 5, 600))) {
    return {
      status: "limited",
      message: `We have received several messages from this connection. Please try again in a few minutes, or email ${enquiriesInbox()}.`,
      values,
    };
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const sourcePath = sameSitePath(str(fd, "sourcePath"), host) ?? sameSitePath(h.get("referer") ?? "", host);
  const regionSlug = (await cookies()).get(REGION_COOKIE)?.value;
  const region = isRegionSlug(regionSlug) ? slugToCode[regionSlug] : null;
  const d = parsed.data;

  const row = await db.contactSubmission.create({
    data: {
      name: d.name,
      email: d.email,
      phone: d.phone,
      country: d.country,
      message: d.message,
      region,
      sourcePath,
      serviceContext: serviceHint(sourcePath),
      ipHash,
      userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
    },
  });

  try {
    const sent = await sendMail({
      to: enquiriesInbox(),
      replyTo: d.email,
      subject: `Website enquiry from ${d.name} (${d.country})`,
      text: [
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        `Phone: ${d.phone ?? "-"}`,
        `Country: ${d.country}`,
        `Region: ${region ?? "-"}`,
        `Service: ${row.serviceContext ?? "-"}`,
        `Page: ${sourcePath ?? "-"}`,
        "",
        d.message,
      ].join("\n"),
    });
    if (sent) await db.contactSubmission.update({ where: { id: row.id }, data: { mailedAt: new Date() } });
  } catch (e) {
    // The enquiry is stored; a mail failure must never fail the visitor's submission.
    console.error("[contact] mail failed", e);
  }

  redirect("/thank-you");
}
