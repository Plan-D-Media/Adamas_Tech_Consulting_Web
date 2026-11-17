/**
 * "What disappears when PREVIEW_DRAFTS=false": one mechanical inventory of every page, menu item and page section
 * that the public site hides, so the missing content can be requested from the client in a single list.
 *
 * Public visibility rule (lib/db.ts): only status = PUBLISHED renders in production. DRAFT renders locally with
 * PREVIEW_DRAFTS=true; ARCHIVED never renders. On top of that a few rows are invisible even when PUBLISHED:
 * Stat rows need verified = true for the trust strip and the About page, a Certification's number and certificate
 * are withheld until verified, and some Stat placements have no reader at all.
 *
 * Nothing about the routes or the link gating is hard-coded: the dynamic and static route files are looked up on
 * disk, the gated detail sections are read out of lib/data/links.ts and the redirecting sections out of
 * lib/data/unpublished.ts, all at run time. The script therefore survives a rescope (for example the 17 Nov 2026
 * removal of the solution pages) and only its numbers change after a reseed.
 *
 * It complements the hand-written CONTENT_TODO.md: that list is "what content is missing", this one is
 * "what is hidden right now, and what the visitor gets instead".
 *
 * Usage: npx tsx scripts/qa/hidden-inventory.mts [label]      (reads DATABASE_URL from .env; label defaults to phase2)
 * Output: docs/qa/evidence/<label>/hidden-when-public.md      (label phase2 -> docs/qa/evidence/phase2/...)
 */
import { Prisma, PrismaClient, type RegionCode, type Status } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const label = process.argv[2] ?? "phase2";
const out = path.join("docs", "qa", "evidence", label, "hidden-when-public.md");
const db = new PrismaClient();

/** A row is public when its status is PUBLISHED; DRAFT needs PREVIEW_DRAFTS=true, ARCHIVED is never rendered. */
const HIDDEN: Status[] = ["DRAFT", "ARCHIVED"];
const hidden = { status: { in: HIDDEN } } as const;

// ── formatting helpers ────────────────────────────────────────────────────

const cell = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
/** editorNote, collapsed and trimmed: the single most useful field, it says what is missing and often a "Q7.2" ref. */
const note = (s: string | null | undefined, max = 220) => {
  const t = cell(s);
  return t.length > max ? `${t.slice(0, max - 1)}...` : t || "-";
};
const byKey = <T,>(rows: T[], key: (r: T) => string) => [...rows].sort((a, b) => key(a).localeCompare(key(b)));
const table = (head: string[], rows: string[][]) =>
  rows.length === 0
    ? ["_None._", ""]
    : [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.join(" | ")} |`), ""];

// ── the routes and the link gating as they are right now ──────────────────

const siteDir = path.join("app", "(site)");
/** A route exists when its page file is on disk: nothing here assumes a fixed route list. */
const routeExists = (segments: string) => fs.existsSync(path.join(siteDir, segments, "page.tsx"));

/** Paths proxy.ts redirects before routing, so "no page on disk" is the intended answer rather than a 404. */
const PROXY_REDIRECTS = [/^\/solutions(\/.*)?$/];
/** A Page row only answers a URL when a static route file was built for its path. */
const pageRouteExists = (p: string) => routeExists(p.replace(/^\//, "").replace(/\/$/, ""));

const DETAIL_ROUTE: Record<string, string> = {
  "case-studies": "case-studies/[slug]",
  "insights/events": "insights/events/[slug]",
  solutions: "solutions/[slug]",
};
const DETAIL_KINDS = Object.keys(DETAIL_ROUTE);
const listingPath = (kind: string) => `/${kind}`;
const listingExists = (kind: string) => routeExists(kind);

const readSource = (...p: string[]) => fs.readFileSync(path.join(...p), "utf8");
const quotedWords = (s: string) => [...s.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const parseWarnings: string[] = [];

/**
 * The detail sections lib/data/links.ts still gates, taken from its own DETAIL pattern
 * (it covered case studies, events and solutions until solutions lost their pages on 17 Nov 2026).
 */
const gatedKinds = new Set(
  (/const DETAIL\s*=\s*\/\^\\\/\(([^)]*)\)/.exec(readSource("lib", "data", "links.ts"))?.[1] ?? "")
    .split("|")
    .map((k) => k.replace(/\\\//g, "/").trim())
    .filter(Boolean),
);
if (gatedKinds.size === 0) parseWarnings.push("Could not read the DETAIL pattern out of lib/data/links.ts: no link gating is assumed below.");

/** The sections whose dynamic route redirects a hidden row to its listing instead of answering 404 (lib/data/unpublished.ts). */
const redirectKinds = new Set(quotedWords(/type Kind\s*=([^;]*);/.exec(readSource("lib", "data", "unpublished.ts"))?.[1] ?? ""));
if (redirectKinds.size === 0) parseWarnings.push("Could not read the Kind union out of lib/data/unpublished.ts: every hidden URL is reported as a 404 below.");

/** What a visitor gets at the URL of a hidden row of this section. */
function hiddenOutcome(kind: string, routeSegments: string): string {
  if (!routeExists(routeSegments)) return `nothing: this site has no ${kind} detail route`;
  if (!redirectKinds.has(kind)) return "404";
  return listingExists(kind) ? `307 to ${listingPath(kind)}` : `307 to ${listingPath(kind)}, which has no route either (404)`;
}

// ── summary table (every model that has a status column) ──────────────────

const camel = (s: string) => s[0].toLowerCase() + s.slice(1);
type GroupDelegate = { groupBy: (a: unknown) => Promise<{ status: Status; _count: { _all: number } }[]> };
const statusModels = Prisma.dmmf.datamodel.models.filter((m) => m.fields.some((f) => f.name === "status" && f.type === "Status"));
const summary: { model: string; total: number; published: number; draft: number; archived: number }[] = [];
for (const m of statusModels) {
  const delegate = (db as unknown as Record<string, GroupDelegate>)[camel(m.name)];
  const groups = await delegate.groupBy({ by: ["status"], _count: { _all: true } });
  const of = (s: Status) => groups.find((g) => g.status === s)?._count._all ?? 0;
  const published = of("PUBLISHED");
  const draft = of("DRAFT");
  const archived = of("ARCHIVED");
  summary.push({ model: m.name, total: published + draft + archived, published, draft, archived });
}
summary.sort((a, b) => a.model.localeCompare(b.model));

// ── region slugs (for "which homepage does this belong to") ───────────────

const regions = await db.region.findMany({ select: { code: true, slug: true } });
const regionSlug = new Map(regions.map((r) => [r.code, r.slug]));
const home = (r: RegionCode | null) => (r ? `/${regionSlug.get(r) ?? r.toLowerCase()}/` : "all homepages");

// ── 1. hidden pages and routes ────────────────────────────────────────────

interface HiddenRoute {
  url: string;
  model: string;
  row: string;
  status: Status;
  gets: string;
  editorNote: string | null;
}
const hiddenRoutes: HiddenRoute[] = [];

const [hiddenHomes, hiddenPages, hiddenPillars, hiddenServices, hiddenCases, hiddenEvents, hiddenSolutions] = await Promise.all([
  db.regionHome.findMany({ where: hidden, select: { region: true, status: true, editorNote: true } }),
  db.page.findMany({ where: hidden, select: { path: true, title: true, template: true, status: true, editorNote: true } }),
  db.servicePillar.findMany({ where: hidden, select: { slug: true, name: true, status: true, editorNote: true } }),
  db.service.findMany({ where: hidden, select: { slug: true, name: true, status: true, editorNote: true, pillar: { select: { slug: true, status: true } } } }),
  db.caseStudy.findMany({ where: hidden, select: { slug: true, title: true, status: true, editorNote: true } }),
  db.event.findMany({ where: hidden, select: { slug: true, title: true, status: true, editorNote: true } }),
  db.solution.findMany({ where: hidden, select: { slug: true, name: true, kind: true, externalUrl: true, status: true, editorNote: true } }),
]);

for (const r of hiddenHomes)
  hiddenRoutes.push({ url: home(r.region), model: "RegionHome", row: r.region, status: r.status, gets: "404 (the whole regional homepage)", editorNote: r.editorNote });
for (const p of hiddenPages)
  hiddenRoutes.push({
    url: p.path,
    model: "Page",
    row: `${p.title} (${p.template})`,
    status: p.status,
    gets: pageRouteExists(p.path) ? "404" : "404 (no route built for this path)",
    editorNote: p.editorNote,
  });
for (const p of hiddenPillars)
  hiddenRoutes.push({ url: `/services/${p.slug}`, model: "ServicePillar", row: p.name, status: p.status, gets: hiddenOutcome("services", "services/[pillar]"), editorNote: p.editorNote });
for (const s of hiddenServices)
  hiddenRoutes.push({
    url: `/services/${s.pillar.slug}/${s.slug}`,
    model: "Service",
    row: s.name,
    status: s.status,
    gets: hiddenOutcome("services", "services/[pillar]/[service]"),
    editorNote: s.editorNote,
  });
for (const c of hiddenCases)
  hiddenRoutes.push({ url: `/case-studies/${c.slug}`, model: "CaseStudy", row: c.title, status: c.status, gets: hiddenOutcome("case-studies", DETAIL_ROUTE["case-studies"]), editorNote: c.editorNote });
for (const e of hiddenEvents)
  hiddenRoutes.push({ url: `/insights/events/${e.slug}`, model: "Event", row: e.title, status: e.status, gets: hiddenOutcome("insights/events", DETAIL_ROUTE["insights/events"]), editorNote: e.editorNote });
for (const s of hiddenSolutions) {
  const detailRoute = routeExists(DETAIL_ROUTE.solutions);
  const url = s.externalUrl ?? (detailRoute ? `/solutions/${s.slug}` : "no URL yet");
  const gets = s.externalUrl
    ? "nothing: every card and menu link that would open this URL is left out"
    : detailRoute
      ? hiddenOutcome("solutions", DETAIL_ROUTE.solutions)
      : "nothing: the row has no website to link to, and solutions have no pages on this site";
  hiddenRoutes.push({ url, model: `Solution (${s.kind})`, row: s.name, status: s.status, gets, editorNote: s.editorNote });
}

/** A sub-service whose own status is PUBLISHED but whose pillar is hidden: its URL still fails, because the pillar is gone. */
const orphanServices = await db.service.findMany({
  where: { status: "PUBLISHED", pillar: { status: { in: HIDDEN } } },
  select: { slug: true, name: true, pillar: { select: { slug: true, name: true, status: true } } },
});
/** A solution with no externalUrl can never be linked now that solutions have no pages, published or not. */
const unlinkableSolutions = await db.solution.findMany({
  where: { status: "PUBLISHED", externalUrl: null },
  select: { slug: true, name: true, kind: true, editorNote: true },
});

const hiddenRouteRows = byKey(hiddenRoutes, (r) => `${r.url}|${r.model}`);

// ── 2. hidden menu items ──────────────────────────────────────────────────

const navRows = await db.navItem.findMany({
  select: {
    id: true,
    menu: true,
    parentId: true,
    label: true,
    href: true,
    external: true,
    status: true,
    editorNote: true,
    sortOrder: true,
    featuredCaseStudy: { select: { slug: true, status: true } },
    featuredEvent: { select: { slug: true, status: true } },
  },
  orderBy: [{ menu: "asc" }, { sortOrder: "asc" }, { label: "asc" }],
});
const navById = new Map(navRows.map((n) => [n.id, n]));
/** "Solutions > AI Solutions > Asset Tracking" */
const navPath = (id: string): string => {
  const trail: string[] = [];
  let cursor = navById.get(id);
  const seen = new Set<string>();
  while (cursor && !seen.has(cursor.id)) {
    seen.add(cursor.id);
    trail.unshift(cursor.label);
    cursor = cursor.parentId ? navById.get(cursor.parentId) : undefined;
  }
  return trail.join(" > ");
};
const navMenus = ["HEADER", "FOOTER", "LEGAL", "SOCIAL"] as const;
const hiddenNav = navRows.filter((n) => HIDDEN.includes(n.status));
/**
 * lib/data/site.ts builds the tree from visible rows only, so a PUBLISHED child of a hidden parent is never
 * reached by build(parent.id): it disappears with its parent without being hidden itself.
 */
const orphanNav = navRows.filter((n) => n.status === "PUBLISHED" && n.parentId && HIDDEN.includes(navById.get(n.parentId)?.status ?? "PUBLISHED"));

// ── 3. visible links whose target is hidden ───────────────────────────────

async function slugSets(where: { status?: Status }) {
  const [cases, events, solutions] = await Promise.all([
    db.caseStudy.findMany({ where, select: { slug: true } }),
    db.event.findMany({ where, select: { slug: true } }),
    db.solution.findMany({ where, select: { slug: true } }),
  ]);
  return {
    "case-studies": new Set(cases.map((r) => r.slug)),
    "insights/events": new Set(events.map((r) => r.slug)),
    solutions: new Set(solutions.map((r) => r.slug)),
  } as Record<string, Set<string>>;
}
const publicSlugs = await slugSets({ status: "PUBLISHED" });
const allSlugs = await slugSets({});

const publicPagePaths = new Set((await db.page.findMany({ where: { status: "PUBLISHED" }, select: { path: true } })).map((r) => r.path));
const allPagePaths = new Set((await db.page.findMany({ select: { path: true } })).map((r) => r.path));
const publicPillars = new Set((await db.servicePillar.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } })).map((r) => r.slug));
const allPillars = new Set((await db.servicePillar.findMany({ select: { slug: true } })).map((r) => r.slug));
const serviceKey = (r: { slug: string; pillar: { slug: string } }) => `${r.pillar.slug}/${r.slug}`;
const publicServices = new Set((await db.service.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, pillar: { select: { slug: true } } } })).map(serviceKey));
const allServices = new Set((await db.service.findMany({ select: { slug: true, pillar: { select: { slug: true } } } })).map(serviceKey));
const regionSlugs = new Set(regions.map((r) => r.slug));
const hiddenRegionSlugs = new Set(hiddenHomes.map((h) => regionSlug.get(h.region) ?? ""));

/** What happens to one internal href on the public site; null when the target is fine. */
function hrefProblem(href: string | null | undefined): string | null {
  if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return null;
  const clean = href.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  if (clean === "/") return null;
  const bare = clean.slice(1);
  if (regionSlugs.has(bare)) return hiddenRegionSlugs.has(bare) ? "404: the regional homepage row is not published" : null;

  for (const kind of DETAIL_KINDS) {
    const prefix = `/${kind}/`;
    if (!clean.startsWith(prefix)) continue;
    const slug = clean.slice(prefix.length);
    if (slug.includes("/")) break;
    if (!routeExists(DETAIL_ROUTE[kind])) return `404: this site no longer has ${kind} detail pages`;
    if (publicSlugs[kind].has(slug)) return null;
    if (gatedKinds.has(kind))
      return `the link gate rewrites it to ${listingPath(kind)}${listingExists(kind) ? "" : ", which has no route either (404)"} (lib/data/links.ts)`;
    return allSlugs[kind].has(slug)
      ? `not gated: the link is rendered as seeded and the visitor gets ${hiddenOutcome(kind, DETAIL_ROUTE[kind])}`
      : "not gated: the link is rendered as seeded and 404s (no such row)";
  }

  const svc = /^\/services\/([^/]+)\/([^/]+)$/.exec(clean);
  if (svc) {
    const key = `${svc[1]}/${svc[2]}`;
    if (publicServices.has(key)) return null;
    return allServices.has(key)
      ? `not gated: the link stays in place and the visitor gets ${hiddenOutcome("services", "services/[pillar]/[service]")}`
      : "not gated: the link stays in place and 404s (no such sub-service row)";
  }
  const pillar = /^\/services\/([^/]+)$/.exec(clean);
  if (pillar) {
    if (publicPillars.has(pillar[1])) return null;
    return allPillars.has(pillar[1])
      ? `not gated: the link stays in place and the visitor gets ${hiddenOutcome("services", "services/[pillar]")}`
      : "not gated: the link stays in place and 404s (no such pillar row)";
  }
  // proxy.ts answers some paths before any route is reached. "/solutions" is the one that matters here: solutions
  // have no pages since 17 Nov 2026, so it 301s to the Products & Solutions section of the region homepage.
  if (PROXY_REDIRECTS.some((re) => re.test(clean))) return null;
  if (!pageRouteExists(clean)) return "404: no route is built for this path";
  if (allPagePaths.has(clean) && !publicPagePaths.has(clean)) return "404: the page row behind this route is hidden";
  return null;
}

const brokenNav = navRows
  .filter((n) => n.status === "PUBLISHED" && !n.external && hrefProblem(n.href))
  .map((n) => ({ menu: String(n.menu), path: navPath(n.id), href: n.href ?? "", what: hrefProblem(n.href) ?? "" }));

/** Featured mega-menu cards: dropped when the case study or event behind them is not public (lib/data/site.ts). */
const droppedFeatures = navRows
  .filter((n) => n.status === "PUBLISHED")
  .flatMap((n) => {
    const rows: { path: string; menu: string; target: string; what: string }[] = [];
    const dropped = "the featured card is dropped; the menu panel shows no card";
    const cs = n.featuredCaseStudy;
    if (cs && cs.status !== "PUBLISHED") rows.push({ path: navPath(n.id), menu: String(n.menu), target: `case study ${cs.slug} (${cs.status})`, what: dropped });
    const ev = n.featuredEvent;
    if (ev && ev.status !== "PUBLISHED") rows.push({ path: navPath(n.id), menu: String(n.menu), target: `event ${ev.slug} (${ev.status})`, what: dropped });
    return rows;
  });

// ── 3b. teaser links inside published sections that point at hidden pages ──

function* hrefsIn(value: unknown, at: string): Generator<[string, string]> {
  if (typeof value === "string") {
    if (/^(\/|https?:)/.test(value) && /href$/i.test(at.split(".").pop() ?? "")) yield [at, value];
  } else if (Array.isArray(value)) for (const [i, v] of value.entries()) yield* hrefsIn(v, `${at}[${i}]`);
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) yield* hrefsIn(v, `${at}.${k}`);
}

const publishedBlocks = await db.contentBlock.findMany({ where: { status: "PUBLISHED" }, select: { key: true, region: true, ctaHref: true, extra: true } });
const publishedSlides = await db.heroSlide.findMany({ where: { status: "PUBLISHED" }, select: { navLabel: true, ctaHref: true, home: { select: { region: true } } } });
const publishedCards = await db.homeServiceCard.findMany({ where: { status: "PUBLISHED" }, select: { title: true, href: true, home: { select: { region: true } } } });

const prunedTeasers: { where: string; item: string; href: string; what: string }[] = [];
const gated = (what: string) => what.startsWith("the link gate");
for (const b of publishedBlocks) {
  const where = `ContentBlock ${b.key} (${home(b.region)})`;
  const p = hrefProblem(b.ctaHref);
  if (p) prunedTeasers.push({ where, item: "ctaHref", href: b.ctaHref ?? "", what: p });
  for (const [at, href] of hrefsIn(b.extra, "extra")) {
    const q = hrefProblem(href);
    if (q) prunedTeasers.push({ where, item: at, href, what: gated(q) ? `${q}; a teaser card with this href is dropped entirely` : q });
  }
}
for (const s of publishedSlides) {
  const p = hrefProblem(s.ctaHref);
  if (p) prunedTeasers.push({ where: `HeroSlide, homepage ${home(s.home.region)}`, item: s.navLabel, href: s.ctaHref, what: gated(p) ? "the whole hero slide is dropped (lib/data/home.ts)" : p });
}
for (const c of publishedCards) {
  const p = hrefProblem(c.href);
  if (p) prunedTeasers.push({ where: `HomeServiceCard, homepage ${home(c.home.region)}`, item: c.title, href: c.href ?? "", what: p });
}

// ── 4. hidden content inside published pages ──────────────────────────────

interface Section {
  model: string;
  what: string;
  rows: { row: string; where: string; status: Status; editorNote: string | null }[];
}
const sections: Section[] = [];

const [blocks, slides, cards, industries, people, milestones, certs, offices, stats, logos, faqs, features, steps, agenda, announcements, technologies] = await Promise.all([
  db.contentBlock.findMany({ where: hidden, select: { key: true, region: true, heading: true, status: true, editorNote: true } }),
  db.heroSlide.findMany({ where: hidden, select: { navLabel: true, headline: true, status: true, editorNote: true, home: { select: { region: true } } } }),
  db.homeServiceCard.findMany({ where: hidden, select: { title: true, status: true, editorNote: true, home: { select: { region: true } } } }),
  db.industry.findMany({ where: hidden, select: { slug: true, tabLabel: true, title: true, status: true, editorNote: true } }),
  db.person.findMany({ where: hidden, select: { slug: true, name: true, role: true, showOnTeam: true, status: true, editorNote: true } }),
  db.milestone.findMany({ where: hidden, select: { year: true, title: true, sortOrder: true, status: true, editorNote: true } }),
  db.certification.findMany({ where: hidden, select: { slug: true, name: true, issuer: true, verified: true, status: true, editorNote: true } }),
  db.office.findMany({ where: hidden, select: { slug: true, label: true, city: true, country: true, region: true, confirmed: true, status: true, editorNote: true } }),
  db.stat.findMany({ where: hidden, select: { key: true, value: true, label: true, placements: true, verified: true, status: true, editorNote: true } }),
  db.logoItem.findMany({ where: hidden, select: { name: true, kind: true, regions: true, status: true, editorNote: true } }),
  db.faq.findMany({
    where: hidden,
    select: {
      question: true,
      status: true,
      editorNote: true,
      pillar: { select: { slug: true } },
      service: { select: { slug: true, pillar: { select: { slug: true } } } },
      solution: { select: { name: true } },
      page: { select: { path: true } },
    },
  }),
  db.solutionFeature.findMany({ where: hidden, select: { title: true, status: true, editorNote: true, solution: { select: { name: true, status: true } } } }),
  db.approachStep.findMany({
    where: hidden,
    select: { title: true, status: true, editorNote: true, service: { select: { slug: true, name: true, status: true, pillar: { select: { slug: true } } } } },
  }),
  db.agendaItem.findMany({ where: hidden, select: { title: true, startsAt: true, status: true, editorNote: true, event: { select: { slug: true, status: true } } } }),
  db.announcement.findMany({ where: hidden, select: { label: true, text: true, regions: true, status: true, editorNote: true } }),
  db.technology.findMany({
    where: hidden,
    select: { name: true, status: true, editorNote: true, services: { select: { name: true } }, solutions: { select: { name: true } }, caseStudies: { select: { slug: true } } },
  }),
]);

/** ContentBlock keys are namespaced ("home.topStories", "services.cloud-services.hero"): that names the page. */
const blockWhere = (key: string, region: RegionCode | null) => {
  const scope = region ? `${home(region)} only` : "all regions";
  if (key.startsWith("home.")) return `homepage ${scope}, section "${key.slice(5)}"`;
  const svc = /^services\.([^.]+)\.(.+)$/.exec(key);
  if (svc) return `/services/${svc[1]}, section "${svc[2]}" (${scope})`;
  const first = key.split(".")[0];
  return `${first} pages, section "${key.slice(first.length + 1) || key}" (${scope})`;
};

sections.push({
  model: "ContentBlock",
  what: "Section headers and short copy, keyed by section. A hidden row leaves the section without its heading, intro or call to action (the template falls back where it can).",
  rows: byKey(blocks, (b) => `${b.key}|${b.region ?? ""}`).map((b) => ({
    row: `${b.key}${b.region ? ` (${b.region})` : ""}${b.heading ? ` - "${cell(b.heading)}"` : ""}`,
    where: blockWhere(b.key, b.region),
    status: b.status,
    editorNote: b.editorNote,
  })),
});
sections.push({
  model: "HeroSlide",
  what: "Homepage hero stories. A hidden slide is one fewer tab in the hero carousel.",
  rows: byKey(slides, (s) => `${s.home.region}|${s.navLabel}`).map((s) => ({
    row: `${s.navLabel} - "${cell(s.headline)}"`,
    where: `homepage ${home(s.home.region)}, hero carousel`,
    status: s.status,
    editorNote: s.editorNote,
  })),
});
sections.push({
  model: "HomeServiceCard",
  what: "The per-region homepage service-card grid.",
  rows: byKey(cards, (c) => `${c.home.region}|${c.title}`).map((c) => ({ row: c.title, where: `homepage ${home(c.home.region)}, service cards`, status: c.status, editorNote: c.editorNote })),
});
sections.push({
  model: "Industry",
  what: "Industry tabs on every homepage and the industry filter on /case-studies.",
  rows: byKey(industries, (i) => i.slug).map((i) => ({ row: `${i.tabLabel} - ${cell(i.title)}`, where: "homepage industries tabs, /case-studies filter", status: i.status, editorNote: i.editorNote })),
});
sections.push({
  model: "Person",
  what: "Leadership profiles on /about/team, and event speakers.",
  rows: byKey(people, (p) => p.slug).map((p) => ({
    row: `${p.name} - ${p.role}`,
    where: p.showOnTeam ? "/about/team" : "event speakers only (showOnTeam = false)",
    status: p.status,
    editorNote: p.editorNote,
  })),
});
sections.push({
  model: "Milestone",
  what: 'The "Mission & Journey" timeline on /about.',
  rows: [...milestones]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
    .map((m) => ({ row: `${m.year ?? "year to be confirmed"} - ${cell(m.title)}`, where: "/about, journey timeline", status: m.status, editorNote: m.editorNote })),
});
sections.push({
  model: "Certification",
  what: "Certificates and partner programmes on /credentials and in the homepage trust strip.",
  rows: byKey(certs, (c) => c.slug).map((c) => ({
    row: `${c.name}${c.issuer ? ` (${c.issuer})` : ""}${c.verified ? "" : " [verified = false]"}`,
    where: "/credentials",
    status: c.status,
    editorNote: c.editorNote,
  })),
});
sections.push({
  model: "Office",
  what: 'Office addresses on /contact and in the homepage "Our Presence" block.',
  rows: byKey(offices, (o) => o.slug).map((o) => ({
    row: `${o.label} (${o.city}, ${o.country}, region ${o.region})${o.confirmed ? "" : " [confirmed = false]"}`,
    where: '/contact, homepage "Our Presence"',
    status: o.status,
    editorNote: o.editorNote,
  })),
});
sections.push({
  model: "Stat",
  what: "Figures in the hero trust row, the trust strip, the CTA band and on /about. See section 5: a Stat also needs verified = true for the trust strip and /about.",
  rows: byKey(stats, (s) => s.key).map((s) => ({
    row: `${s.key} = "${cell(s.value)}" (${cell(s.label)})${s.verified ? "" : " [verified = false]"}`,
    where: s.placements.length ? `placements: ${s.placements.join(", ")}` : "no placement set: it has no home on the site",
    status: s.status,
    editorNote: s.editorNote,
  })),
});
sections.push({
  model: "LogoItem",
  what: "Client, partner and certification logos in the homepage strips and on /credentials.",
  rows: byKey(logos, (l) => `${l.kind}|${l.name}`).map((l) => ({
    row: `${l.name} (${l.kind})`,
    where: l.regions.length ? `homepages ${l.regions.map((r) => home(r)).join(", ")}` : "no region set: it shows nowhere",
    status: l.status,
    editorNote: l.editorNote,
  })),
});
sections.push({
  model: "Faq",
  what: "FAQ accordions on service, solution and company pages.",
  rows: byKey(faqs, (f) => f.question).map((f) => ({
    row: cell(f.question),
    where: f.service
      ? `/services/${f.service.pillar.slug}/${f.service.slug}`
      : f.pillar
        ? `/services/${f.pillar.slug}`
        : f.solution
          ? `solution ${f.solution.name}`
          : f.page
            ? f.page.path
            : "not attached to any page",
    status: f.status,
    editorNote: f.editorNote,
  })),
});
sections.push({
  model: "SolutionFeature",
  what: 'The "what it delivers" capability cards for a solution.',
  rows: byKey(features, (f) => `${f.solution.name}|${f.title}`).map((f) => ({
    row: cell(f.title),
    where: `solution ${f.solution.name}${f.solution.status === "PUBLISHED" ? "" : ` (the solution itself is ${f.solution.status})`}`,
    status: f.status,
    editorNote: f.editorNote,
  })),
});
sections.push({
  model: "ApproachStep",
  what: 'The "step by step" delivery sequence on a sub-service page.',
  rows: byKey(steps, (s) => `${s.service.pillar.slug}/${s.service.slug}|${s.title}`).map((s) => ({
    row: cell(s.title),
    where: `/services/${s.service.pillar.slug}/${s.service.slug}${s.service.status === "PUBLISHED" ? "" : ` (the service itself is ${s.service.status})`}`,
    status: s.status,
    editorNote: s.editorNote,
  })),
});
sections.push({
  model: "AgendaItem",
  what: "The agenda on an event page.",
  rows: [...agenda]
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime() || a.title.localeCompare(b.title))
    .map((a) => ({
      row: `${a.startsAt.toISOString().slice(0, 16).replace("T", " ")} - ${cell(a.title)}`,
      where: `/insights/events/${a.event.slug}${a.event.status === "PUBLISHED" ? "" : ` (the event itself is ${a.event.status})`}`,
      status: a.status,
      editorNote: a.editorNote,
    })),
});
sections.push({
  model: "Announcement",
  what: "The hero announcement strip (news, partnerships, awards). Also date-windowed: an item outside its window does not show either.",
  rows: byKey(announcements, (a) => `${a.label}|${a.text}`).map((a) => ({
    row: `${a.label}: ${cell(a.text)}`,
    where: a.regions.length ? `homepages ${a.regions.map((r) => home(r)).join(", ")}` : "no region set: it shows nowhere",
    status: a.status,
    editorNote: a.editorNote,
  })),
});
sections.push({
  model: "Technology",
  what: "Technology logos in the platform strips on service and case-study pages.",
  rows: byKey(technologies, (t) => t.name).map((t) => ({
    row: t.name,
    where:
      [
        t.services.length ? `services: ${t.services.map((s) => s.name).join(", ")}` : "",
        t.solutions.length ? `solutions: ${t.solutions.map((s) => s.name).join(", ")}` : "",
        t.caseStudies.length ? `case studies: ${t.caseStudies.map((c) => c.slug).join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("; ") || "not linked to any page",
    status: t.status,
    editorNote: t.editorNote,
  })),
});

// ── 5. published but still invisible ──────────────────────────────────────

const unverifiedStats = await db.stat.findMany({
  where: { status: "PUBLISHED", verified: false },
  select: { key: true, value: true, label: true, placements: true, sourceNote: true, editorNote: true },
});
const unconfirmedOffices = await db.office.findMany({
  where: { status: "PUBLISHED", confirmed: false },
  select: { slug: true, label: true, city: true, country: true, region: true, editorNote: true },
});
const unverifiedCerts = await db.certification.findMany({ where: { status: "PUBLISHED", verified: false }, select: { slug: true, name: true, issuer: true, editorNote: true } });
/** Placement values the data readers query. trust-strip and about also demand verified = true; hero-trust and outcome do not. */
const VERIFIED_PLACEMENTS = ["trust-strip", "about"];
const READ_PLACEMENTS = ["trust-strip", "about", "hero-trust", "outcome"];
const allStats = await db.stat.findMany({ select: { key: true, value: true, label: true, placements: true, status: true } });
const orphanStats = allStats.filter((s) => s.status === "PUBLISHED" && !s.placements.some((p) => READ_PLACEMENTS.includes(p)));
const unreadPlacements = [...new Set(allStats.flatMap((s) => s.placements))].filter((p) => !READ_PLACEMENTS.includes(p)).sort();

// ── write ─────────────────────────────────────────────────────────────────

await db.$disconnect();

const totals = summary.reduce((a, s) => ({ total: a.total + s.total, published: a.published + s.published, draft: a.draft + s.draft, archived: a.archived + s.archived }), {
  total: 0,
  published: 0,
  draft: 0,
  archived: 0,
});
const hiddenSectionRows = sections.reduce((a, s) => a + s.rows.length, 0);

const lines: string[] = [
  `# Hidden on the public site (${label})`,
  "",
  `Generated ${new Date().toISOString()} by \`scripts/qa/hidden-inventory.mts\` against the local database. Re-run it after any reseed or rescope.`,
  "",
  "Everything listed here is built and sitting in the database, but does not render when `PREVIEW_DRAFTS=false` (the public configuration):",
  "DRAFT rows are awaiting content or client sign-off, ARCHIVED rows are deliberately retired, and a few PUBLISHED rows are held back by their own flags",
  "(`Stat.verified`, `Certification.verified`). This is the mechanical view; `CONTENT_TODO.md` is the hand-written list of what is missing, with questionnaire refs.",
  "",
  `**Hidden routes: ${hiddenRouteRows.length}. Hidden menu items: ${hiddenNav.length}. Hidden sections inside published pages: ${hiddenSectionRows}.**`,
  "",
  ...(parseWarnings.length ? [...parseWarnings.map((w) => `> Warning: ${w}`), ""] : []),
  "## Summary",
  "",
  ...table(
    ["Model", "Total rows", "Visible when public", "Hidden (DRAFT)", "Hidden (ARCHIVED)"],
    [
      ...summary.map((s) => [s.model, String(s.total), String(s.published), String(s.draft), String(s.archived)]),
      ["**All**", `**${totals.total}**`, `**${totals.published}**`, `**${totals.draft}**`, `**${totals.archived}**`],
    ],
  ),
  `Read from the code at run time. Detail routes on disk: ${DETAIL_KINDS.map((k) => `${k} ${routeExists(DETAIL_ROUTE[k]) ? "yes" : "no"}`).join(", ")}, service pillar ${routeExists("services/[pillar]") ? "yes" : "no"}, sub-service ${routeExists("services/[pillar]/[service]") ? "yes" : "no"}.`,
  `Listing routes on disk: ${[...DETAIL_KINDS, "services"].map((k) => `${listingPath(k)} ${listingExists(k) ? "yes" : "no"}`).join(", ")}.`,
  `Sections gated by \`lib/data/links.ts\`: ${[...gatedKinds].sort().join(", ") || "none"}. Sections that redirect a hidden row to their listing (\`lib/data/unpublished.ts\`): ${[...redirectKinds].sort().join(", ") || "none"}.`,
  "",
  `## 1. Hidden pages and routes (${hiddenRouteRows.length})`,
  "",
  "A URL whose row exists but is not visible redirects (307) to its section listing where `lib/data/unpublished.ts` covers that section; everything else answers 404.",
  "",
  ...table(
    ["URL it would have", "Model", "Row", "Status", "What the visitor gets", "Why it is hidden (editorNote)"],
    hiddenRouteRows.map((r) => [`\`${cell(r.url)}\``, r.model, cell(r.row), r.status, cell(r.gets), note(r.editorNote)]),
  ),
  `### Published rows that are invisible anyway (${orphanServices.length + unlinkableSolutions.length})`,
  "",
  ...table(
    ["Row", "Model", "Why it cannot be reached"],
    [
      ...byKey(orphanServices, (s) => serviceKey(s)).map((s) => [
        `\`/services/${s.pillar.slug}/${s.slug}\` ${cell(s.name)}`,
        "Service",
        `its pillar ${cell(s.pillar.name)} is ${s.pillar.status}, so ${hiddenOutcome("services", "services/[pillar]/[service]")}`,
      ]),
      ...byKey(unlinkableSolutions, (s) => s.slug).map((s) => [
        cell(s.name),
        `Solution (${s.kind})`,
        "PUBLISHED with no externalUrl: solutions have no pages on this site, so there is nothing to link to",
      ]),
    ],
  ),
  `## 2. Hidden menu items (${hiddenNav.length})`,
  "",
  "A DRAFT menu row is simply not rendered. Its children go with it, published or not (`lib/data/site.ts` builds the tree from visible rows only).",
  "",
];

for (const menu of navMenus) {
  const rows = hiddenNav.filter((n) => n.menu === menu);
  lines.push(`### ${menu} menu (${rows.length})`, "");
  lines.push(
    ...table(
      ["Path through the menu", "href", "External?", "Status", "Why it is hidden (editorNote)"],
      byKey(rows, (n) => navPath(n.id)).map((n) => [cell(navPath(n.id)), n.href ? `\`${cell(n.href)}\`` : "-", n.external ? "yes, new tab" : "no", n.status, note(n.editorNote)]),
    ),
  );
}

lines.push(
  `### Published menu items that disappear with a hidden parent (${orphanNav.length})`,
  "",
  ...table(
    ["Menu", "Path through the menu", "href", "Hidden parent"],
    byKey(orphanNav, (n) => navPath(n.id)).map((n) => [
      String(n.menu),
      cell(navPath(n.id)),
      n.href ? `\`${cell(n.href)}\`` : "-",
      `${cell(navById.get(n.parentId ?? "")?.label)} (${navById.get(n.parentId ?? "")?.status})`,
    ]),
  ),
  `## 3. Menu items that stay visible but whose target is hidden (${brokenNav.length + droppedFeatures.length})`,
  "",
  `\`lib/data/links.ts\` rewrites a link that points into a gated section (${[...gatedKinds].sort().join(", ") || "none"}) when the target row is not public, so it lands on that section's listing instead.`,
  "Links to anything else (service pages, company pages, solution pages) are **not** gated: they stay in the menu as seeded and the visitor meets the route itself.",
  'A row that reads "no route is built for this path" or "this site no longer has ... pages" is usually a database that has not been reseeded since a route was removed, not missing client content.',
  "",
  ...table(
    ["Menu", "Item", "href", "What happens on the public site"],
    byKey(brokenNav, (b) => `${b.menu}|${b.path}`).map((b) => [b.menu, cell(b.path), `\`${cell(b.href)}\``, cell(b.what)]),
  ),
  `### Featured mega-menu cards dropped (${droppedFeatures.length})`,
  "",
  ...table(
    ["Menu", "Item", "Featured target", "What happens"],
    byKey(droppedFeatures, (d) => `${d.menu}|${d.path}`).map((d) => [d.menu, cell(d.path), cell(d.target), cell(d.what)]),
  ),
  `### Teasers inside published sections that point at hidden pages (${prunedTeasers.length})`,
  "",
  "The same gate runs over homepage and section content, so a card advertising a hidden page is dropped rather than left dangling.",
  "",
  ...table(
    ["Where", "Item", "href", "What happens"],
    byKey(prunedTeasers, (t) => `${t.where}|${t.item}`).map((t) => [cell(t.where), cell(t.item), `\`${cell(t.href)}\``, cell(t.what)]),
  ),
  `## 4. Hidden content inside published pages (${hiddenSectionRows})`,
  "",
  "These rows do not take a page away; they leave a gap in a page that is otherwise live.",
  "",
);

for (const s of sections) {
  lines.push(`### ${s.model} (${s.rows.length})`, "", s.what, "");
  lines.push(...table(["Row", "Where it belongs", "Status", "Why it is hidden (editorNote)"], s.rows.map((r) => [cell(r.row), cell(r.where), r.status, note(r.editorNote)])));
}

lines.push(
  "## 5. Published, but still invisible",
  "",
  "These rows pass the status check and are still never rendered, by design.",
  "",
  `### Stat rows that are PUBLISHED but verified = false (${unverifiedStats.length})`,
  "",
  `Only verified figures are rendered in the trust strip and on /about (placements ${VERIFIED_PLACEMENTS.join(", ")}). A \`hero-trust\` or \`outcome\` figure does render without verification.`,
  "",
  ...table(
    ["Key", "Value", "Label", "Placements", "Renders anywhere?", "Source note / editorNote"],
    byKey(unverifiedStats, (s) => s.key).map((s) => [
      s.key,
      cell(s.value),
      cell(s.label),
      s.placements.join(", ") || "-",
      s.placements.some((p) => p === "hero-trust" || p === "outcome") ? "yes (hero-trust and outcome ignore verified)" : "no",
      note(s.sourceNote ?? s.editorNote),
    ]),
  ),
  `### Stat rows whose placement no page reads (${orphanStats.length})`,
  "",
  `Readers exist only for ${READ_PLACEMENTS.join(", ")}. Placement values in the data that no page reads: ${unreadPlacements.join(", ") || "none"}; a figure placed only there cannot appear.`,
  "",
  ...table(
    ["Key", "Value", "Label", "Placements"],
    byKey(orphanStats, (s) => s.key).map((s) => [s.key, cell(s.value), cell(s.label), s.placements.join(", ") || "none"]),
  ),
  `### Office rows that are PUBLISHED but confirmed = false (${unconfirmedOffices.length})`,
  "",
  "`confirmed = false` means the client has not checked the address or the label. Note that it does **not** stop the office rendering: `lib/data/site.ts` reads every PUBLISHED office, so these addresses are live on /contact and in the presence block exactly as seeded.",
  "",
  ...table(
    ["Office", "City", "Country", "Region", "Why it is unconfirmed (editorNote)"],
    byKey(unconfirmedOffices, (o) => o.slug).map((o) => [cell(o.label), cell(o.city), cell(o.country), o.region, note(o.editorNote)]),
  ),
  `### Certification rows that are PUBLISHED but verified = false (${unverifiedCerts.length})`,
  "",
  "The row renders, but its certificate number, validity date and download link are withheld until `verified = true` (`lib/data/pages.ts`).",
  "",
  ...table(
    ["Certification", "Issuer", "Why it is unverified (editorNote)"],
    byKey(unverifiedCerts, (c) => c.slug).map((c) => [cell(c.name), cell(c.issuer), note(c.editorNote)]),
  ),
);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`);

console.log(`Hidden inventory (${label})`);
console.log("");
console.log("| Model | Total rows | Visible when public | Hidden (DRAFT) | Hidden (ARCHIVED) |");
console.log("|---|---|---|---|---|");
for (const s of summary) console.log(`| ${s.model} | ${s.total} | ${s.published} | ${s.draft} | ${s.archived} |`);
console.log(`| **All** | **${totals.total}** | **${totals.published}** | **${totals.draft}** | **${totals.archived}** |`);
console.log("");
for (const w of parseWarnings) console.log(`warning: ${w}`);
console.log(`hidden routes: ${hiddenRouteRows.length}`);
console.log(`published but unreachable: ${orphanServices.length} sub-services under a hidden pillar, ${unlinkableSolutions.length} solutions with no website URL`);
console.log(`hidden menu items: ${hiddenNav.length} (plus ${orphanNav.length} published items under a hidden parent)`);
console.log(`visible menu items with a hidden target: ${brokenNav.length}; dropped featured cards: ${droppedFeatures.length}; pruned teasers: ${prunedTeasers.length}`);
console.log(`hidden sections inside published pages: ${hiddenSectionRows}`);
console.log(`published but invisible: ${unverifiedStats.length} unverified stats, ${orphanStats.length} stats no page reads, ${unconfirmedOffices.length} unconfirmed offices, ${unverifiedCerts.length} unverified certifications`);
console.log(`-> ${out}`);
