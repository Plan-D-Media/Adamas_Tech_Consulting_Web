/**
 * The two files `proxy.ts` reads at the edge, compiled from the database:
 *
 *   lib/generated/redirects.json    legacy WordPress URL -> new URL (the Redirect table)
 *   lib/generated/unpublished.json  detail URL whose row exists but is not published -> its listing
 *
 * Both are snapshots of database state taken at build time, so the proxy costs no round-trip per request. They are
 * written in three places, and all three go through this module so the rules cannot drift:
 *
 *   - `npm run build` (the `prebuild` step, scripts/prebuild.ts) - this is what Vercel runs, against Neon
 *   - `npm run db:seed` - the local flow, right after the content it describes is loaded
 *   - `npm run redirects:build` - after editing redirects or publishing a row by hand
 *
 * Deliberately standalone: it imports Prisma and nothing from /content, so the build step does not pull the whole
 * seed (and its image processing) into a production build.
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

/** Every entry point (npm scripts, the seed, the prebuild) runs from the project root. */
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "lib", "generated");

/** The three regional homepages keep their trailing slash, so /e-invoicing-uae lands on /gcc/ in one hop (QA BUG-018). */
const HOMEPAGE = /^\/(in|uk|gcc)\/?$/;

export function normalisePath(p: string) {
  if (/^https?:\/\//.test(p)) return p;
  const clean = p.split("#")[0].split("?")[0];
  if (HOMEPAGE.test(clean)) return clean.replace(/\/?$/, "/");
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean;
}

function write(file: string, value: unknown, what: string) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(value, null, 2) + "\n");
  console.log(`  wrote ${what} -> lib/generated/${file}`);
}

/** Active redirects, lower-cased on the way in because proxy.ts looks them up that way. */
export async function writeRedirectsFile(prisma: PrismaClient) {
  const rows = await prisma.redirect.findMany({ where: { active: true }, select: { fromPath: true, toPath: true, statusCode: true } });
  const map = Object.fromEntries(rows.map((r) => [r.fromPath.toLowerCase(), [normalisePath(r.toPath), r.statusCode]]));
  write("redirects.json", map, `${rows.length} redirects`);
  return rows.length;
}

/**
 * Detail URLs whose row exists but is not PUBLISHED, each with the listing to send a visitor to.
 *
 * `lib/data/unpublished.ts` redirects these inside the route too, but `redirect()` in a prerendered (streaming)
 * route only emits a client-side meta refresh: the HTTP response is a 307 with no `Location` header and a full HTML
 * body (`next/dist/docs/01-app/03-api-reference/04-functions/redirect.md`, "When used in a streaming context"). A
 * crawler following a legacy URL to a DRAFT case study therefore reached a dead end (QA BUG-039). The docs' own
 * remedy is to redirect before the render, which is what proxy.ts does with this file.
 */
export async function writeUnpublishedFile(prisma: PrismaClient) {
  const [cases, events, pillars, services] = await Promise.all([
    prisma.caseStudy.findMany({ where: { status: { not: "PUBLISHED" } }, select: { slug: true } }),
    prisma.event.findMany({ where: { status: { not: "PUBLISHED" } }, select: { slug: true } }),
    prisma.servicePillar.findMany({ select: { slug: true, status: true } }),
    prisma.service.findMany({ select: { slug: true, status: true, pillar: { select: { slug: true, status: true } } } }),
  ]);
  const map: Record<string, string> = {};
  for (const c of cases) map[`/case-studies/${c.slug}`] = "/case-studies";
  for (const e of events) map[`/insights/events/${e.slug}`] = "/insights/events";
  for (const p of pillars) if (p.status !== "PUBLISHED") map[`/services/${p.slug}`] = "/services";
  for (const s of services) {
    const pillarVisible = s.pillar.status === "PUBLISHED";
    if (s.status === "PUBLISHED" && pillarVisible) continue;
    map[`/services/${s.pillar.slug}/${s.slug}`] = pillarVisible ? `/services/${s.pillar.slug}` : "/services";
  }
  write("unpublished.json", map, `${Object.keys(map).length} unpublished fallbacks`);
  return Object.keys(map).length;
}

/**
 * Paths whose Page row is not PUBLISHED. The route itself calls notFound(), but these routes are dynamic and
 * stream, so the 200 has already been sent by the time it runs and the visitor gets the 404 page under a 200 - a
 * soft 404 (the same shape as QA BUG-035). proxy.ts rewrites these to the unknown-route path instead, which
 * answers a real 404. Empty in a drafts build, where the pages are meant to render.
 */
export async function writeUnpublishedPagesFile(prisma: PrismaClient) {
  const rows = await prisma.page.findMany({ where: { status: { not: "PUBLISHED" } }, select: { path: true } });
  const paths = rows.map((r) => r.path.toLowerCase()).sort();
  write("unpublished-pages.json", paths, `${paths.length} unpublished page(s)`);
  return paths.length;
}
