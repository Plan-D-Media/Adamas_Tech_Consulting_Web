import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { badge, db, visible } from "@/lib/db";
import { mediaSelect, toMedia, type Media } from "@/lib/media";
import type { FaqData, SeoData } from "./mappers";
import type { StatData } from "./home";
import { isPending } from "@/lib/public-copy";
import { previewingDrafts } from "@/lib/preview";

/**
 * Company, utility and legal pages (Page table). `blocks` is free JSON in the DB, so each template's shape is
 * validated here with zod; a malformed row logs and renders the page with its fallbacks instead of crashing.
 *
 * Cache tags: every reader also carries "blocks", which the seed's revalidation call already clears
 * (app/api/revalidate lists no "pages" tag yet; see docs/round2-notes/company.md).
 */

// ── Block schemas per template ──────────────────────────────────────────

const link = z.object({ label: z.string(), href: z.string() });
const header = z.object({ eyebrow: z.string().optional(), heading: z.string().optional(), body: z.string().optional() });

const aboutBlocks = z.object({
  story: header.extend({
    ctaLabel: z.string().optional(),
    ctaHref: z.string().optional(),
    paragraphs: z.array(z.string()).default([]),
    held: z.array(z.object({ text: z.string(), reason: z.string() })).default([]),
    pendingLabel: z.string().optional(),
  }),
  mission: z.object({ eyebrow: z.string().optional(), text: z.string() }).optional(),
  group: z.object({ eyebrow: z.string().optional(), body: z.string() }).optional(),
  whyUs: header.extend({ items: z.array(z.object({ title: z.string(), body: z.string().optional() })).default([]) }).optional(),
  model: header.extend({ steps: z.array(z.string()).default([]) }).optional(),
  leadership: header.extend({ ctaLabel: z.string().optional(), ctaHref: z.string().optional() }).optional(),
  credentials: header.extend({ ctaLabel: z.string().optional(), ctaHref: z.string().optional() }).optional(),
});

/** Both labels name their own absence, so they are review-only copy: withheld with PREVIEW_DRAFTS off. */
const teamBlocks = z.object({
  bioPendingLabel: z.string().optional(),
  emptyLabel: z.string().optional(),
});

const comingSoonBlocks = z.object({
  status: z.string().default("Coming soon"),
  message: z.string().optional(),
  links: z.array(link).default([]),
});

const credentialsBlocks = z.object({
  certifications: header.optional(),
  partners: header.optional(),
  /** Stand-in labels for certificate numbers, validity and partner tiers: review-only, withheld when drafts are off. */
  pending: z.object({ certificate: z.string(), number: z.string(), validity: z.string(), tier: z.string() }).optional(),
});

const contactBlocks = z.object({
  form: header.extend({ email: z.string().optional() }),
  support: z.object({ heading: z.string(), body: z.string().optional(), email: z.string() }).optional(),
  phone: z.object({ heading: z.string(), body: z.string().optional(), number: z.string(), href: z.string().optional() }).optional(),
  presence: header.optional(),
});

const thankYouBlocks = z.object({
  nextHeading: z.string().optional(),
  next: z.array(z.object({ title: z.string(), href: z.string(), icon: z.string().optional() })).default([]),
});

const legalPart = z.object({
  text: z.string().optional(),
  table: z.object({ columns: z.array(z.string()), rows: z.array(z.array(z.string())) }).optional(),
});

const legalBlocks = z.object({
  updated: z.string().optional(),
  documentTitle: z.string().optional(),
  intro: z.string().optional(),
  sections: z.array(z.object({ id: z.string(), title: z.string(), parts: z.array(legalPart), links: z.array(link).default([]) })).default([]),
  /** Placeholder body ("[Placeholder] …") while the client has not supplied the text. */
  pending: z.string().optional(),
});

const schemas = {
  about: aboutBlocks,
  team: teamBlocks,
  "coming-soon": comingSoonBlocks,
  credentials: credentialsBlocks,
  contact: contactBlocks,
  "thank-you": thankYouBlocks,
  legal: legalBlocks,
} as const;

/**
 * Block-level placeholder gate (Swayang, 17 Nov 2026): a PUBLISHED page may still carry a placeholder paragraph
 or a "to be confirmed" label inside one block, and taking the whole page to DRAFT would remove a page the
 * visitor needs. With PREVIEW_DRAFTS off those blocks are dropped here, so the template simply leaves the
 * section out; with drafts previewed everything is passed through for review. See lib/public-copy.ts.
 */
function prunePending(template: PageTemplate, blocks: Record<string, unknown>): Record<string, unknown> {
  if (previewingDrafts) return blocks;
  const out = { ...blocks };
  if (template === "about") {
    const story = out.story as { pendingLabel?: string; held?: unknown[] } | undefined;
    if (story) {
      const { pendingLabel, held, ...rest } = story;
      void pendingLabel;
      // `held` is the live copy withheld for conflicting figures, with the reason: internal, never public.
      void held;
      out.story = rest;
    }
    const group = out.group as { body?: string } | undefined;
    if (group && isPending(group.body)) delete out.group;
  }
  if (template === "team") {
    if (isPending(out.bioPendingLabel as string | undefined)) delete out.bioPendingLabel;
    if (isPending(out.emptyLabel as string | undefined)) delete out.emptyLabel;
  }
  if (template === "credentials") delete out.pending;
  if (template === "legal" && isPending(out.pending as string | undefined)) delete out.pending;
  return out;
}

export type PageTemplate = keyof typeof schemas;
export type PageBlocks<T extends PageTemplate> = z.infer<(typeof schemas)[T]>;
export type LegalBlocks = PageBlocks<"legal">;
export type LegalSectionData = LegalBlocks["sections"][number];

export interface PageData<T extends PageTemplate> extends SeoData {
  path: string;
  template: T;
  title: string;
  eyebrow: string | null;
  intro: string | null;
  image: Media | null;
  /** null when the row has no blocks or they fail validation (logged). */
  blocks: PageBlocks<T> | null;
  faqs: FaqData[];
  updatedAt: string;
}

export async function getPage<T extends PageTemplate>(path: string, template: T): Promise<PageData<T> | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("pages", `page:${path}`, "blocks");
  const p = await db.page.findFirst({
    where: { path, ...visible },
    include: { image: mediaSelect, faqs: { where: visible, orderBy: { sortOrder: "asc" } } },
  });
  if (!p) return null;
  if (p.template !== template) console.warn(`[pages] ${path}: template "${p.template}" read as "${template}"`);
  const parsed = schemas[template].safeParse(prunePending(template, (p.blocks as Record<string, unknown> | null) ?? {}));
  if (!parsed.success) console.error(`[pages] ${path}: invalid blocks`, z.prettifyError(parsed.error));
  return {
    path: p.path,
    template,
    title: p.title,
    eyebrow: p.eyebrow,
    intro: p.intro,
    image: toMedia(p.image),
    blocks: parsed.success ? (parsed.data as PageBlocks<T>) : null,
    faqs: p.faqs.map((f) => ({ question: f.question, answer: f.answer, draft: badge(f.status) })),
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    noindex: p.noindex,
    updatedAt: p.updatedAt.toISOString(),
  };
}

/** Indexable published pages for the site search (title, intro, path). */
export async function getPageLinks(): Promise<{ path: string; title: string; eyebrow: string | null; intro: string | null; template: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("pages", "blocks");
  const rows = await db.page.findMany({
    where: { ...visible, noindex: false },
    select: { path: true, title: true, eyebrow: true, intro: true, template: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows;
}

// ── People (team) ───────────────────────────────────────────────────────

export interface PersonData {
  slug: string;
  name: string;
  role: string;
  bio: string | null;
  photo: Media | null;
  linkedinUrl: string | null;
  draft: boolean;
}

export async function getTeam(): Promise<PersonData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("people", "blocks");
  const rows = await db.person.findMany({ where: { ...visible, showOnTeam: true }, include: { photo: mediaSelect }, orderBy: { sortOrder: "asc" } });
  return rows.map((p) => ({
    slug: p.slug,
    name: p.name,
    role: p.role,
    bio: p.bio,
    photo: toMedia(p.photo),
    linkedinUrl: p.linkedinUrl,
    draft: badge(p.status),
  }));
}

// ── Certifications ──────────────────────────────────────────────────────

export interface CertificationData {
  slug: string;
  name: string;
  issuer: string | null;
  standard: string | null;
  description: string | null;
  badge: Media | null;
  /** Only set when the certification is verified. */
  certificateUrl: string | null;
  certificateNumber: string | null;
  validUntil: string | null;
  verified: boolean;
  /** Partner programmes (AWS, SAP, Oracle NetSuite) carry no standard; management-system certifications do. */
  kind: "certification" | "partner";
  draft: boolean;
}

export async function getCertifications(): Promise<CertificationData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("certifications", "blocks");
  const rows = await db.certification.findMany({
    where: visible,
    include: { badge: mediaSelect, certificateFile: mediaSelect },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((c) => ({
    slug: c.slug,
    name: c.name,
    issuer: c.issuer,
    standard: c.standard,
    description: c.description,
    badge: toMedia(c.badge),
    // Nothing that has not been verified is presented as evidence.
    certificateUrl: c.verified ? (toMedia(c.certificateFile)?.url ?? null) : null,
    certificateNumber: c.verified ? c.certificateNumber : null,
    validUntil: c.verified && c.validUntil ? c.validUntil.toISOString() : null,
    verified: c.verified,
    kind: c.standard ? "certification" : "partner",
    draft: badge(c.status),
  }));
}

// ── Stats for the About page (verified only) ────────────────────────────

export async function getAboutStats(): Promise<StatData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("stats", "blocks");
  const rows = await db.stat.findMany({
    where: { status: "PUBLISHED", verified: true, placements: { has: "about" } },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((s) => ({ key: s.key, value: s.value, numeric: s.numeric, prefix: s.prefix, suffix: s.suffix, label: s.label }));
}

// ── Company journey (/about) ────────────────────────────────────────────

export interface MilestoneData {
  id: string;
  /** null until the client confirms it (rendered as "Milestone 0N" + "Year to be confirmed"). */
  year: string | null;
  title: string;
  description: string | null;
  image: Media | null;
  draft: boolean;
}

export async function getMilestones(): Promise<MilestoneData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("milestones", "blocks");
  const rows = await db.milestone.findMany({ where: visible, include: { image: mediaSelect }, orderBy: { sortOrder: "asc" } });
  return rows.map((m) => ({
    id: m.id,
    year: m.year?.trim() || null,
    title: m.title,
    description: m.description,
    image: toMedia(m.image),
    draft: badge(m.status),
  }));
}
