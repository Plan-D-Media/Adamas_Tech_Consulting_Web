import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAboutStats, getCertifications, getMilestones, getPage, getTeam } from "@/lib/data/pages";
import { getBlocks } from "@/lib/data/site";
import { optionalCopy, plain } from "@/lib/placeholder";
import { breadcrumbJsonLd, heroIntro, pageMetadata, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealScope } from "@/components/motion/RevealScope";
import { ContactSection } from "@/components/home/ContactSection";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutCompany } from "@/components/about/AboutCompany";
import { AboutApproach } from "@/components/about/AboutApproach";
import { AboutExpertise } from "@/components/about/AboutExpertise";
import { AboutJourney } from "@/components/about/AboutJourney";
import { AboutPeople } from "@/components/about/AboutPeople";
import { AboutCredentials } from "@/components/about/AboutCredentials";

const PATH = "/about";
const CRUMBS: Crumb[] = [{ name: "About Us", path: PATH }];

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "about"), PATH, "About Us");
}

/**
 * About Us, built to Figma frame 274:1617 (17 Nov 2026). Every section is fed from the Page row's blocks or from the
 * tables behind them, so the sections the client has not confirmed simply do not render in the public build:
 *
 *   hero          Page row (eyebrow, title, intro)        · always
 *   our company   blocks.story + the verified years stat  · `held` copy and the pending label are drafts-only
 *   our approach  blocks.model.steps                      · the step count drives the figure in the corner
 *   our expertise blocks.whyUs.items
 *   our journey   Milestone rows                          · all DRAFT today, so the band is absent publicly
 *   our people    blocks.leadership + Person rows         · all DRAFT today (Figma's stock names are never used)
 *   credentials   blocks.credentials + Certification rows
 *   contact       the shared home.contact card
 *
 * Designed sections with no content behind them yet (testimonials, "Progress in Numbers", the second statistics
 * band, "Life at Adamas", "Our Commitment", "Our Strategic Direction") are listed for the client and the designer
 * in docs/qa/evidence/phase2/client-content-request.md and docs/design-notes.md rather than filled with invented
 * copy or HCLTech's figures.
 */
export default async function AboutPage() {
  const [page, team, certs, stats, blocks, milestones] = await Promise.all([
    getPage(PATH, "about"),
    getTeam(),
    getCertifications(),
    getAboutStats(),
    getBlocks(null),
    getMilestones(),
  ]);
  if (!page) notFound();

  const b = page.blocks;
  const story = b?.story;
  const mission = b?.mission;
  const model = b?.model;
  const whyUs = b?.whyUs;
  const leadership = b?.leadership;
  const credentials = b?.credentials;

  // The mission sits with the company paragraphs: one voice, one column, in the order the client wrote them.
  const storyParagraphs = [...(story?.paragraphs ?? []), mission?.text ?? null]
    .map((p) => optionalCopy(p))
    .filter((c): c is { text: string; pending: boolean } => !!c && !c.pending)
    .map((c) => c.text);

  const years = stats.find((s) => /year/i.test(s.label ?? "") || /experience/i.test(s.label ?? "")) ?? null;

  return (
    <RevealScope>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />
      <AboutHero eyebrow={page.eyebrow ? plain(page.eyebrow) : null} title={plain(page.title)} intro={heroIntro(page.intro)} crumbs={CRUMBS} />
      <AboutCompany
        eyebrow={story?.eyebrow ? plain(story.eyebrow) : null}
        heading={story?.heading ? plain(story.heading) : null}
        paragraphs={storyParagraphs}
        figure={years}
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
      <AboutExpertise
        eyebrow={whyUs?.eyebrow ? plain(whyUs.eyebrow) : null}
        heading={whyUs?.heading ? plain(whyUs.heading) : null}
        body={whyUs?.body ? plain(whyUs.body) : null}
        items={(whyUs?.items ?? []).map((it) => ({ title: plain(it.title), body: it.body ? plain(it.body) : null }))}
      />
      <AboutJourney eyebrow="Our journey" heading="A journey of growth and trust" body={null} milestones={milestones} />
      <AboutPeople
        eyebrow={leadership?.eyebrow ? plain(leadership.eyebrow) : null}
        heading={leadership?.heading ? plain(leadership.heading) : null}
        body={leadership?.body ? plain(leadership.body) : null}
        people={team}
        ctaLabel={leadership?.ctaLabel ?? null}
        ctaHref={leadership?.ctaHref ?? null}
      />
      <AboutCredentials
        eyebrow={credentials?.eyebrow ? plain(credentials.eyebrow) : null}
        heading={credentials?.heading ? plain(credentials.heading) : null}
        body={credentials?.body ? plain(credentials.body) : null}
        items={certs}
        ctaLabel={credentials?.ctaLabel ?? null}
        ctaHref={credentials?.ctaHref ?? null}
      />
      {blocks["home.contact"] && <ContactSection block={blocks["home.contact"]} regionSlug={null} />}
    </RevealScope>
  );
}
