import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { db } from "@/lib/db";

/**
 * Shared plumbing for the site's forms (contact, event registration, newsletter):
 * a DB-backed rate limiter, a hashed client IP (never stored raw), and the mailer.
 *
 * MAILER=console (default) logs each message. MAILER=smtp sends through any SMTP relay (Google Workspace, Amazon SES
 * SMTP credentials, Postmark...) using SMTP_HOST, SMTP_PORT (587 STARTTLS or 465 TLS), SMTP_USER, SMTP_PASS and
 * MAIL_FROM. Mail failures never fail the visitor's submission: the row is saved first, the mail result only sets
 * `mailedAt`.
 */

export async function clientIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${ip}|${process.env.REVALIDATE_SECRET ?? "adamas"}`).digest("hex").slice(0, 32);
}

/** Fixed-window limiter: at most `limit` hits per `windowSec` for a key. Returns false when over the limit. */
export async function rateLimit(key: string, limit = 5, windowSec = 600): Promise<boolean> {
  const windowStart = new Date(Math.floor(Date.now() / (windowSec * 1000)) * windowSec * 1000);
  const row = await db.rateLimitHit.upsert({
    where: { key_windowStart: { key, windowStart } },
    update: { count: { increment: 1 } },
    create: { key, windowStart },
  });
  return row.count <= limit;
}

export interface MailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  /** Optional HTML alternative; the text part is always sent. */
  html?: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

let transport: Transporter | null = null;

function smtpTransport() {
  if (transport) return transport;
  const port = Number(process.env.SMTP_PORT ?? 587);
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transport;
}

export const mailFrom = () => process.env.MAIL_FROM ?? "AdamasTech Consulting <no-reply@adamastechconsulting.com>";

export async function sendMail(msg: MailMessage): Promise<boolean> {
  const mailer = process.env.MAILER ?? "console";
  if (mailer === "smtp" && process.env.SMTP_HOST) {
    try {
      await smtpTransport().sendMail({
        from: mailFrom(),
        to: msg.to,
        replyTo: msg.replyTo,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
        attachments: msg.attachments?.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })),
      });
      return true;
    } catch (e) {
      console.error(`[mail] smtp send failed for "${msg.subject}":`, e instanceof Error ? e.message : e);
      return false;
    }
  }
  if (mailer !== "console") console.warn(`[mail] MAILER=${mailer} is not configured (SMTP_HOST missing?); message logged instead.`);
  console.info(`[mail] to=${msg.to} subject="${msg.subject}"${msg.attachments?.length ? ` attachments=${msg.attachments.map((a) => a.filename).join(",")}` : ""}\n${msg.text}`);
  return mailer === "console";
}

/**
 * Where leads are delivered. ONE inbox for the whole site and all three regions (client decision, 23 Nov 2026):
 * the contact form on /in/, /uk/ and /gcc/, /contact (which every "Talk to an expert" and "Discuss This Service"
 * button on the service, sub-service and case-study pages links to), the event registration's organiser copy and
 * the newsletter notification all send here. There is deliberately no per-region routing.
 *
 * Set it in the environment. The fallback exists only so a local checkout without a .env still works.
 */
export const enquiriesInbox = () => process.env.MAIL_TO_ENQUIRIES ?? "marketing@adamastech.in";

/**
 * The address shown TO VISITORS (the rate-limit notice). Deliberately a constant, not `enquiriesInbox()`: where a
 * lead is delivered may change to a CRM dropbox or a routing alias, and that address must never appear on the page.
 * The addresses in the footer, top bar and contact cards come from the seeded region/page content, not from here.
 */
export const PUBLIC_CONTACT_EMAIL = "marketing@adamastech.in";

/** Honeypot: a hidden field real people never fill. */
export const HONEYPOT = "company_website";
