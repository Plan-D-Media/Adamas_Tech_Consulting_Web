import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { RegionCode } from "@prisma/client";
import { badge, db, visible } from "@/lib/db";

/**
 * Vacancies for /about/careers (Figma 274:2667).
 *
 * The Job table ships empty: the brief forbids invented job listings, and the client has sent none. The page is
 * built for the day they arrive, so the openings band, its filters and its empty state all follow the data.
 */

export interface JobData {
  slug: string;
  title: string;
  discipline: string | null;
  experience: string | null;
  location: string | null;
  region: RegionCode | null;
  type: string | null;
  remote: boolean;
  summary: string | null;
  description: string | null;
  applyUrl: string | null;
  closesAt: string | null;
  publishedAt: string | null;
  draft: boolean;
}

export async function getJobs(): Promise<JobData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("jobs", "blocks");
  const rows = await db.job.findMany({ where: visible, orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });
  return rows.map((j) => ({
    slug: j.slug,
    title: j.title,
    discipline: j.discipline,
    experience: j.experience,
    location: j.location,
    region: j.region,
    type: j.type,
    remote: j.remote,
    summary: j.summary,
    description: j.description,
    applyUrl: j.applyUrl,
    closesAt: j.closesAt?.toISOString() ?? null,
    publishedAt: j.publishedAt?.toISOString() ?? null,
    draft: badge(j.status),
  }));
}

/**
 * Where an application goes. The brief leaves the application and CV upload out of this phase, so the Apply button
 * is shown only when one of these is configured; with neither, the page simply does not offer one.
 */
export function applyTarget(job?: { applyUrl: string | null } | null): string | null {
  if (job?.applyUrl) return job.applyUrl;
  const url = process.env.CAREERS_APPLY_URL?.trim();
  if (url) return url;
  const email = process.env.CAREERS_EMAIL?.trim();
  return email ? `mailto:${email}` : null;
}
