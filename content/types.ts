/**
 * Typed seed content. `prisma/seed.ts` loads these into the database; pages never import them.
 * Cross-references use slugs/keys (never DB ids). Media is referenced by its key in `media.ts`.
 *
 * Every item may carry `status` (default DRAFT) and a review flag:
 *   DRAFT = awaiting client sign-off (shown in local previews when PREVIEW_DRAFTS=true);
 *   ARCHIVED = deliberately retired (never shown, not even in previews; kept so an editor can restore it);
 *   PUBLISHED = live.
 *   needsReview: true + editorNote: "why" for placeholders, conflicts and unconfirmed facts.
 */

export type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type RegionCode = "IN" | "UK" | "GCC";
export type Prominence = "HIDDEN" | "STANDARD" | "FEATURED";

export interface Meta {
  status?: Status;
  sortOrder?: number;
  needsReview?: boolean;
  editorNote?: string;
}

export interface Seo {
  seoTitle?: string;
  seoDescription?: string;
  /** media key */
  ogImage?: string;
  noindex?: boolean;
}

export interface TitleBody {
  title: string;
  body?: string;
}

// ── Media ───────────────────────────────────────────────────────────────

export interface MediaSeed {
  /** Path relative to MEDIA_BASE_URL; the file lives at public/media/<key> */
  key: string;
  alt: string;
  kind?: "IMAGE" | "VIDEO" | "DOCUMENT";
  mimeType?: string;
  isPlaceholder?: boolean;
  /** Original URL on the old site, if migrated */
  sourceUrl?: string;
}

// ── Regions, offices, homepages ─────────────────────────────────────────

export interface RegionSeed {
  code: RegionCode;
  slug: "in" | "uk" | "gcc";
  label: string;
  locale: string;
  hreflang: string[];
  phone?: string;
  phoneHref?: string;
  whatsapp?: string;
  email?: string;
  /** office slug */
  featuredOffice?: string;
  sortOrder: number;
}

export interface OfficeSeed extends Meta {
  slug: string;
  city: string;
  label: string;
  country: string;
  region: RegionCode;
  addressLines: string[];
  phone?: string;
  phoneHref?: string;
  whatsapp?: string;
  lat?: number;
  lng?: number;
  confirmed?: boolean;
}

export interface HeroSlideSeed extends Meta {
  navLabel: string;
  eyebrow?: string;
  headline: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  vimeoId?: string;
  /** media key of a self-hosted video */
  video?: string;
  /** media key */
  poster?: string;
}

export interface PromoBanner {
  eyebrow?: string;
  heading: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
}

export interface HomeSeed extends Meta, Seo {
  region: RegionCode;
  /** event slug */
  featuredEvent?: string;
  eventProminence?: Prominence;
  showTrustStrip?: boolean;
  showWhyUs?: boolean;
  promoBanner?: PromoBanner;
  heroSlides: HeroSlideSeed[];
  serviceCards?: (Meta & { title: string; body?: string; href?: string })[];
}

export interface ContentBlockSeed extends Meta {
  key: string;
  /** omit for the global version; set to override it for one region */
  region?: RegionCode;
  eyebrow?: string;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  extra?: Record<string, unknown>;
}

// ── Navigation ──────────────────────────────────────────────────────────

export interface NavItemSeed extends Meta {
  /** stable key, e.g. "header.services", "solutions.arivoo" */
  key?: string;
  label: string;
  descriptor?: string;
  href?: string;
  external?: boolean;
  comingSoon?: boolean;
  /** case-study slug shown as the mega-menu featured card */
  featuredCaseStudy?: string;
  /** event slug shown as the mega-menu featured card */
  featuredEvent?: string;
  children?: NavItemSeed[];
}

export interface NavigationSeed {
  header: NavItemSeed[];
  footer: NavItemSeed[];
  legal: NavItemSeed[];
  social: NavItemSeed[];
}

// ── Services ────────────────────────────────────────────────────────────

export interface FaqSeed extends Meta {
  question: string;
  answer: string;
}

export interface ServiceSeed extends Meta, Seo {
  slug: string;
  name: string;
  descriptor?: string;
  summary?: string;
  whoFor?: string;
  whatWeDo?: TitleBody[];
  highlights?: TitleBody[];
  image?: string;
  legacyPath?: string;
  steps?: (Meta & TitleBody)[];
  /** technology names (created if missing) */
  technologies?: string[];
  faqs?: FaqSeed[];
}

export interface PillarSeed extends Meta, Seo {
  slug: string;
  name: string;
  tagline?: string;
  summary?: string;
  outcomeLine?: string;
  challenge?: string;
  image?: string;
  services: ServiceSeed[];
  faqs?: FaqSeed[];
}

// ── Solutions ───────────────────────────────────────────────────────────

export interface SolutionSeed extends Meta, Seo {
  slug: string;
  kind: "PRODUCT" | "AI_SOLUTION" | "ARIVOO_MODULE";
  name: string;
  tagline?: string;
  summary?: string;
  body?: string;
  externalUrl?: string;
  /** parent solution slug (Arivoo modules) */
  parent?: string;
  image?: string;
  features?: (Meta & TitleBody)[];
  screenshots?: { image: string; caption?: string }[];
  integrations?: string[];
  faqs?: FaqSeed[];
}

// ── Industries & case studies ───────────────────────────────────────────

export interface IndustrySeed extends Meta {
  slug: string;
  tabLabel: string;
  title: string;
  body: string;
  image?: string;
}

export interface CaseStudySeed extends Meta, Seo {
  slug: string;
  label: string;
  title: string;
  summary?: string;
  headlineMetric: string;
  metricLabel?: string;
  clientDescriptor?: string;
  overview?: string;
  challenge?: string;
  solution?: TitleBody[];
  quote?: string;
  quoteBy?: string;
  /** industry slug */
  industry?: string;
  regions?: RegionCode[];
  featuredIn?: RegionCode[];
  image?: string;
  legacyPath?: string;
  results?: { value: string; label: string }[];
  /** "pillar-slug/service-slug" */
  services?: string[];
  /** pillar slugs */
  pillars?: string[];
  /** solution slugs */
  solutions?: string[];
  technologies?: string[];
}

// ── Trust ───────────────────────────────────────────────────────────────

export interface StatSeed extends Meta {
  key: string;
  value: string;
  numeric?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  verified: boolean;
  sourceNote?: string;
  placements: string[];
  regions?: RegionCode[];
}

export interface LogoSeed extends Meta {
  kind: "PARTNER" | "CERTIFICATION" | "CLIENT";
  name: string;
  /** media key */
  logo: string;
  url?: string;
  regions?: RegionCode[];
}

export interface CertificationSeed extends Meta, Seo {
  slug: string;
  name: string;
  issuer?: string;
  standard?: string;
  description?: string;
  badge?: string;
  certificateFile?: string;
  certificateNumber?: string;
  validUntil?: string;
  verified?: boolean;
}

export interface PersonSeed extends Meta {
  slug: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  linkedinUrl?: string;
  showOnTeam?: boolean;
}

// ── Company journey (/about) ────────────────────────────────────────────
export interface MilestoneSeed extends Meta {
  /** Display year ("2019", "2019–20"); null until confirmed. */
  year: string | null;
  title: string;
  description?: string;
  /** media key */
  image?: string;
}

// ── Events ──────────────────────────────────────────────────────────────

export interface EventSeed extends Meta, Seo {
  slug: string;
  title: string;
  eyebrow?: string;
  summary?: string;
  body?: string;
  /** ISO 8601 with offset */
  startsAt: string;
  endsAt?: string;
  timezone?: string;
  venueName?: string;
  venueAddress?: string;
  image?: string;
  registrationOpen?: boolean;
  capacity?: number;
  agenda?: (Meta & { startsAt: string; title: string; body?: string })[];
  /** person slugs */
  speakers?: string[];
}

// ── Announcements (hero strip) ──────────────────────────────────────────

export interface AnnouncementSeed extends Meta {
  label: string;
  text: string;
  href?: string;
  /** ISO 8601 with offset; open-ended when omitted */
  startsAt?: string;
  endsAt?: string;
  regions: RegionCode[];
}

// ── Pages & redirects ───────────────────────────────────────────────────

export interface PageSeed extends Meta, Seo {
  path: string;
  template: string;
  title: string;
  eyebrow?: string;
  intro?: string;
  blocks?: unknown;
  image?: string;
  faqs?: FaqSeed[];
}

export interface RedirectSeed {
  fromPath: string;
  toPath: string;
  statusCode?: 301 | 302 | 308;
  active?: boolean;
  decisionRef?: string;
  note?: string;
}
