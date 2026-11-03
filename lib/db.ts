import "server-only";
import { PrismaClient, type Status } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Statuses visible on the public site. Local review builds can set
 * PREVIEW_DRAFTS=true to also render drafts (badged only when SHOW_DRAFT_BADGES=true).
 * Never set it in production. ARCHIVED (deliberately retired content) is never visible, preview or not.
 */
export const visibleStatuses: Status[] =
  process.env.PREVIEW_DRAFTS === "true" && process.env.SITE_ENV !== "production"
    ? ["PUBLISHED", "DRAFT"]
    : ["PUBLISHED"];

export const visible = { status: { in: visibleStatuses } } as const;

/**
 * SHOW_DRAFT_BADGES=true marks draft rows with a "Draft" badge (internal review).
 * Off by default, so client previews show drafts cleanly.
 */
export const showDraftBadges = process.env.SHOW_DRAFT_BADGES === "true";

/** True when a row should carry the draft badge. */
export const badge = (status: Status) => showDraftBadges && status !== "PUBLISHED";
