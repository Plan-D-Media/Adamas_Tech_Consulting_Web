import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { getJobs, applyTarget } from "@/lib/data/careers";
import { getBlocks, getRegions } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { breadcrumbJsonLd, heroIntro, jobPostingJsonLd, pageMetadata, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealScope } from "@/components/motion/RevealScope";
import { ContactSection } from "@/components/home/ContactSection";
import { AboutHero } from "@/components/about/AboutHero";
import { CareersWhy } from "@/components/careers/CareersWhy";
import { CareersProcess } from "@/components/careers/CareersProcess";
import { CareersOpenings } from "@/components/careers/CareersOpenings";

const PATH = "/about/careers";
const CRUMBS: Crumb[] = [
  { name: "About Us", path: "/about" },
  { name: "Careers", path: PATH },
];

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "careers"), PATH, "Careers");
}

/** The role chips are plain links, so the filter is read from the query string on the server. */
export const instant = false;

/**
 * Careers, built to Figma frame 274:2667 ("Carrer").
 *
 * Phase 2, and DRAFT on purpose: the Page row is unpublished, so this renders in the drafts preview for review and
 * answers a 404 publicly, while the menu keeps showing "Careers (coming soon)" as plain text (the nav row carries
 * `comingSoon`, so it is not a link). The Job table is empty - the brief forbids invented vacancies - so the
 * openings band shows its empty state, and `JobPosting` data is emitted only for roles that are actually published.
 *
 * The application and CV upload are out of scope for this phase: every Apply button is a link to CAREERS_APPLY_URL
 * or CAREERS_EMAIL, and is not drawn at all when neither is set.
 */
export default function CareersRoute({ searchParams }: PageProps<"/about/careers">) {
  return <Careers searchParams={searchParams} />;
}

async function Careers({ searchParams }: { searchParams: PageProps<"/about/careers">["searchParams"] }) {
  const [page, jobs, blocks, regions, params] = await Promise.all([getPage(PATH, "careers"), getJobs(), getBlocks(null), getRegions(), searchParams]);
  if (!page) notFound();

  const b = page.blocks;
  const role = Array.isArray(params.role) ? (params.role[0] ?? null) : (params.role ?? null);
  const applyHref = applyTarget();
  const india = regions.find((r) => r.slug === "in") ?? regions[0] ?? null;
  const phone = india?.phone && india.phoneHref ? { label: india.phone, href: india.phoneHref } : null;
  const published = jobs.filter((j) => !j.draft);

  return (
    <RevealScope>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />
      {/* Structured data for real vacancies only: a DRAFT row is not a job offer. */}
      {published.map((j) => (
        <JsonLd key={j.slug} data={jobPostingJsonLd({ title: j.title, description: j.description ?? j.summary, path: PATH, location: j.location, region: j.region, type: j.type, remote: j.remote, posted: j.publishedAt, closes: j.closesAt })} />
      ))}
      <AboutHero eyebrow={page.eyebrow ? plain(page.eyebrow) : "Careers"} title={plain(page.title)} intro={heroIntro(page.intro)} crumbs={CRUMBS} />
      <CareersWhy
        eyebrow={b?.why?.eyebrow ? plain(b.why.eyebrow) : null}
        heading={b?.why?.heading ? plain(b.why.heading) : null}
        body={b?.why?.body ? plain(b.why.body) : null}
        ctaLabel={b?.why?.ctaLabel ?? null}
        applyHref={applyHref}
        phone={phone}
      />
      <CareersProcess
        eyebrow={b?.process?.eyebrow ? plain(b.process.eyebrow) : null}
        heading={b?.process?.heading ? plain(b.process.heading) : null}
        body={b?.process?.body ? plain(b.process.body) : null}
        steps={(b?.process?.steps ?? []).map((s) => ({ title: plain(s.title), body: s.body ? plain(s.body) : null }))}
      />
      <CareersOpenings
        eyebrow={b?.openings?.eyebrow ? plain(b.openings.eyebrow) : null}
        heading={b?.openings?.heading ? plain(b.openings.heading) : null}
        body={b?.openings?.body ? plain(b.openings.body) : null}
        jobs={jobs}
        active={role}
        emptyLabel={b?.openings?.emptyLabel ?? null}
        applyHref={applyHref}
      />
      {blocks["home.contact"] && <ContactSection block={blocks["home.contact"]} regionSlug={null} />}
    </RevealScope>
  );
}
