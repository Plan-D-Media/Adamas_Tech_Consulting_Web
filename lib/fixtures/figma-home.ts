import type { ClaimData, PillarData } from "@/lib/data/home";
import type { Block, NavLink, RegionInfo } from "@/lib/data/site";
import type { HeroCard } from "@/components/home/HeroCarousel";

/**
 * The approved Figma Home Page (236:1395) with the designer's own placeholder copy and artwork, for the layout
 * comparison on /figma-fixture (FIGMA_FIXTURE=1 only). Nothing here is site content: it exists so that content
 * differences (database copy, dates, badges) drop out of the pixel comparison and only layout remains.
 * Figma typos ("Whats's", "Al-driven") are kept on purpose. The one change is "Middle East" to "GCC" in the hero
 * body (brief: the words never appear in the UI).
 */

export const FIXTURE_HERO: Block = {
  eyebrow: "India Engineering Delivery Center · Kolkata & Pan-India",
  heading: "Powering Enterprise Excellence With Cloud, SAP & AI",
  body: "Accelerating digital sovereignty, automated e-invoicing compliance, and mission-critical cloud modernization for governments and top enterprises across the GCC.",
  ctaLabel: "Talk to an expert",
  ctaHref: "/contact",
  extra: { secondaryLabel: "Explore services", secondaryHref: "/services" },
};

/** Frame 47: the three designer-baked cards (scripts/figma-fixture.mjs crops them from the Figma sheet). */
export const FIXTURE_HERO_CARDS: HeroCard[] = [
  { id: "f1", category: "Event", eyebrow: null, title: "Join us at the House of Lords, London", href: "/insights/events", external: false, image: { url: "/media/figma-fixture/hero-card-1.png", alt: "" }, artwork: true },
  { id: "f2", category: "Solutions", eyebrow: null, title: "Arivoo runs universities, schools and learning programmes", href: "/solutions", external: false, image: { url: "/media/figma-fixture/hero-card-2.png", alt: "" }, artwork: true },
  { id: "f3", category: "Case study", eyebrow: null, title: "How SAP Treasury improved cash forecasting by 30%", href: "/case-studies", external: false, image: { url: "/media/figma-fixture/hero-card-3.png", alt: "" }, artwork: true },
];

export const FIXTURE_CLAIMS: ClaimData[] = [
  { key: "fixture-satisfied", value: "100%", label: "Satisfied", placement: "hero-trust", draft: false },
  { key: "fixture-zero-risk", value: "Zero", label: "Risk", placement: "hero-trust", draft: false },
  { key: "cash-forecasting-improvement-30", value: "30%", label: "improvement in cash forecasting", placement: "outcome", draft: false },
];

const STORY = {
  date: "2026-10-29",
  title: "Adamas accelerates enterprise transformation with Al-driven solutions",
  body: "Discover how Adamas Tech Consulting is leveraging advanced Al and cloud technologies to drive efficiency, innovation, and measurable business impact across global operations.",
  href: "/insights",
  image: "figma-fixture/story.png",
  imageAlt: "",
};

export const FIXTURE_STORIES: Block = {
  eyebrow: "Top Stories",
  heading: "Latest Insights, Success Stories and Whats’s Next",
  body: "Explore our latest news, client success stories, industry insights and upcoming events shaping a smarter, digital future.",
  ctaLabel: null,
  ctaHref: null,
  extra: { items: [STORY, STORY, STORY] },
};

const CLOUD_SUMMARY =
  "Adamas Tech Consulting helps enterprises, institutions, and public-sector organizations design modern cloud foundations, optimize operations, and apply AI on AWS for measurable business outcomes.";

/** Frame 12459: the Figma tab names and sub-service names (the live names come from the sitemap). The paragraph is repeated twice in the design. */
export function fixturePillars(real: PillarData[]): PillarData[] {
  const cloud = real.find((p) => p.slug === "cloud-services") ?? real[0];
  const names = ["Cloud Migration", "Cloud Transformation", "Managed Cloud & Cloud Reselling", "SAP on Cloud", "Oracle NetSuite / Cloud ERP", "Cloud Security & FinOps"];
  return [
    {
      ...cloud,
      name: "Cloud Services",
      summary: `${CLOUD_SUMMARY}\n\n${CLOUD_SUMMARY}`,
      outcomeLine: "Cloud that Scales your Organisation",
      services: names.map((name, i) => ({ slug: `fixture-${i}`, name, descriptor: null, href: "/services/cloud-services" })),
    },
    { ...cloud, slug: "digital-transformation", name: "Digital Transformation", services: [] },
    { ...cloud, slug: "ai-services", name: "AI Services", services: [] },
  ];
}

/** Group 21303: "About" (not "About Us"), no Insights sub-menu, the Figma placeholder phone and email, four social icons. */
export function fixtureNav(header: NavLink[]): NavLink[] {
  return header.map((item) => {
    if (/^about/i.test(item.label)) return { ...item, label: "About" };
    if (/^insights/i.test(item.label)) return { ...item, children: [], featured: null };
    return item;
  });
}

export const FIXTURE_SOCIAL: NavLink[] = ["LinkedIn", "Facebook", "Twitter", "YouTube"].map((label) => ({
  key: `fixture.${label.toLowerCase()}`,
  label,
  descriptor: null,
  href: "https://example.invalid/",
  external: true,
  comingSoon: false,
  draft: false,
  children: [],
  featured: null,
}));

export function fixtureRegions(regions: RegionInfo[]): RegionInfo[] {
  return regions.map((r) => (r.slug === "in" ? { ...r, phone: "+91 000 500 0000", phoneHref: null, email: "support@adamastechconsulting.com" } : r));
}
