import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/lib/db";

/**
 * Shared plumbing for the site's forms (contact, event registration, newsletter):
 * a DB-backed rate limiter, a hashed client IP (never stored raw), and a mailer seam.
 * MAILER=console (default) logs the message; MAILER=ses is wired when hosting is decided.
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

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export async function sendMail(msg: MailMessage): Promise<boolean> {
  const mailer = process.env.MAILER ?? "console";
  if (mailer === "console") {
    console.info(`[mail] to=${msg.to} subject="${msg.subject}"\n${msg.text}`);
    return true;
  }
  // SES transport lands with hosting (Milestone 3 / launch). Never fail the visitor's submission on mail errors.
  console.warn(`[mail] MAILER=${mailer} is not configured yet; message logged instead.`);
  console.info(`[mail] to=${msg.to} subject="${msg.subject}"\n${msg.text}`);
  return false;
}

export const enquiriesInbox = () => process.env.MAIL_TO_ENQUIRIES ?? "marketing@adamastech.in";

/** Honeypot: a hidden field real people never fill. */
export const HONEYPOT = "company_website";
