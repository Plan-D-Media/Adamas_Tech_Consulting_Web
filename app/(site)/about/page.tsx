import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAboutStats, getCertifications, getMilestones, getPage, getTeam } from "@/lib/data/pages";
import { getBlocks, getRegions } from "@/lib/data/site";
import { defaultRegion } from "@/lib/region";
import { figmaDraft } from "@/lib/figma-draft";
import { optionalCopy, plain } from "@/lib/placeholder";
import { breadcrumbJsonLd, heroIntro, pageMetadata, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealScope } from "@/components/motion/RevealScope";
import { ContactSection } from "@/components/home/ContactSection";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutCompany } from "@/components/about/AboutCompany";
import { AboutApproach } from "@/components/about/AboutApproach";
import { AboutPartners } from "@/components/about/AboutPartners";
import { AboutCommitment } from "@/components/about/AboutCommitment";
import { AboutDirection } from "@/components/about/AboutDirection";
import { AboutProgress } from "@/components/about/AboutProgress";
import { AboutExpertise } from "@/components/about/AboutExpertise";
import { AboutJourney } from "@/components/about/AboutJourney";
import { AboutClients } from "@/components/about/AboutClients";
import { AboutStatement } from "@/components/about/AboutStatement";
import { AboutLife } from "@/components/about/AboutLife";
import { AboutCta } from "@/components/about/AboutCta";
import { AboutPeople } from "@/components/about/AboutPeople";
import { AboutAwards } from "@/components/about/AboutAwards";

const PATH = "/about";
const CRUMBS: Crumb[] = [{ name: "About Us", path: PATH }];

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "about"), PATH, "About Us");
}

/**
 * About Us, built to Figma frame 274:1617. Round 8 (18 Nov 2026) rebuilt this page against the frame's full
 * section list: all sixteen bands are now present, in the frame's order and on its 1194px column, rather than the
 * eight that had content behind them.
 *
 *   y    0- 530  hero                     Page row (eyebrow, title, intro)
 *   y  588-1094  our company              blocks.story + the years figure (DRAFT: the design's 12 is unverified)
 *   y 1192-1824  our approach             blocks.model.steps
 *   y 1894-1999  partner logo strip       Certification rows, kind = partner
 *   y 2089-3081  video + our commitment    designer's copy          · drafts only
 *   y 3164-3747  our strategic direction   designer's copy          · drafts only
 *   y 3859-4664  progress in numbers       layout only, 9 placeholders · drafts only
 *   y 4774-5469  our expertise            blocks.whyUs.items (three slots, as designed)
 *   y 5580-6330  our journey              Milestone rows
 *   y 6440-6877  clients & partners       Certification badges + placeholders · drafts only
 *   y 6997-7972  statement + testimonials  layout only, 8 placeholders · drafts only
 *   y 8092-9111  life at adamas            designer's photographs   · drafts only
 *   y 9474-10052 cta band + statistics     layout only, 4 placeholders · drafts only
 *   y10172-10770 our people               blocks.leadership + Person rows
 *   y10886-11016 award badges             Certification badges + placeholders
 *   y11119-12685 contact                  the shared home.contact card
 *
 * Content gating now changes what is *inside* a section, never whether the section exists in the drafts preview.
 * `figmaDraft()` returns null in the public build, so every band whose copy is still the designer's disappears
 * there exactly as before. Filler that must never be shown anywhere - HCLTech's figures, the "Miyah Myles"
 * testimonials, the borrowed client logos, the template's award badges and statistics, the stock leadership names -
 * is replaced by neutral placeholders inside the kept layout (lib/figma-draft.ts).
 *
 * One section from the previous build is gone: AboutCredentials occupied the y 6440-6877 band as a stand-in. That
 * band is now the frame's own "Organisations That Inspire Our Work", and the certifications it listed are shown as
 * badges in the awards row and in full on /credentials.
 */
export default async function AboutPage() {
  const [page, team, certs, stats, blocks, milestones, regions] = await Promise.all([
    getPage(PATH, "about"),
    getTeam(),
    getCertifications(),
    getAboutStats(),
    getBlocks(null),
    getMilestones(),
    getRegions(),
  ]);
  if (!page) notFound();

  const b = page.blocks;
  const story = b?.story;
  const mission = b?.mission;
  const model = b?.model;
  const whyUs = b?.whyUs;
  const leadership = b?.leadership;
  const draft = figmaDraft();

  // The mission sits with the company paragraphs: one voice, one column, in the order the client wrote them.
  const storyParagraphs = [...(story?.paragraphs ?? []), mission?.text ?? null]
    .map((p) => optionalCopy(p))
    .filter((c): c is { text: string; pending: boolean } => !!c && !c.pending)
    .map((c) => c.text);

  // The design gives "Our Expertise" three cards; the client's block currently carries six (CONTENT_TODO.md).
  const whyUsItems = (whyUs?.items ?? []).map((it) => ({ title: plain(it.title), body: it.body ? plain(it.body) : null }));

  const years = stats.find((s) => /year/i.test(s.label ?? "") || /experience/i.test(s.label ?? "")) ?? null;
  // The band statistics are whatever is verified and not already spent on the years figure.
  const bandStats = stats.filter((s) => s !== years);
  const home = regions.find((r) => r.slug === defaultRegion()) ?? regions[0] ?? null;

  return (
    <RevealScope>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />
      <AboutHero eyebrow={page.eyebrow ? plain(page.eyebrow) : null} title={plain(page.title)} intro={heroIntro(page.intro)} crumbs={CRUMBS} />
      <AboutCompany
        eyebrow={story?.eyebrow ? plain(story.eyebrow) : null}
        heading={story?.heading ? plain(story.heading) : null}
        paragraphs={storyParagraphs}
        figure={years}
        draftFigure={draft ? { value: draft.company.figureValue, label: draft.company.figureLabel } : null}
        ctaLabel={story?.ctaLabel ?? null}
        ctaHref={story?.ctaHref ?? null}
        held={story?.held ?? []}
        pendingLabel={story?.pendingLabel ?? null}
      />
      <AboutApproach
        eyebrow={model?.eyebrow ? plain(model.eyebrow) : null}
        heading={model?.heading ? plain(model.heading) : null}
        body={model?.body ? plain(model.body) : null}
        steps={(model?.steps ?? []).map((s) => ({ title: plain(s), body: null }))}
      />
      <AboutPartners items={certs} />
      {draft && <AboutCommitment content={draft.commitment} />}
      {draft && <AboutDirection content={draft.direction} />}
      {draft && <AboutProgress content={draft.progress} stats={bandStats} />}
      <AboutExpertise
        eyebrow={whyUs?.eyebrow ? plain(whyUs.eyebrow) : null}
        heading={whyUs?.heading ? plain(whyUs.heading) : null}
        body={whyUs?.body ? plain(whyUs.body) : null}
        items={whyUsItems}
        photos={!!draft}
        overflow={whyUsItems.slice(3)}
      />
      <AboutJourney eyebrow="Our journey" heading="A journey of growth and trust" body={null} milestones={milestones} />
      {draft && <AboutClients content={draft.clients} items={certs} />}
      {draft && <AboutStatement content={draft.statement} />}
      {draft && <AboutLife content={draft.life} />}
      {draft && <AboutCta content={draft.cta} stats={bandStats} phone={home?.phone ?? null} phoneHref={home?.phoneHref ?? null} />}
      <AboutPeople
        eyebrow={leadership?.eyebrow ? plain(leadership.eyebrow) : null}
        heading={leadership?.heading ? plain(leadership.heading) : null}
        body={leadership?.body ? plain(leadership.body) : null}
        people={team}
        ctaLabel={leadership?.ctaLabel ?? null}
        ctaHref={leadership?.ctaHref ?? null}
      />
      <AboutAwards items={certs} preview={!!draft} />
      {blocks["home.contact"] && <ContactSection block={blocks["home.contact"]} regionSlug={null} />}
    </RevealScope>
  );
}
