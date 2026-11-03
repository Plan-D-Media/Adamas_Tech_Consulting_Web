import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAboutStats, getCertifications, getMilestones, getPage, getTeam } from "@/lib/data/pages";
import { emptyBlock, getBlocks, getOffices } from "@/lib/data/site";
import { copy, plain } from "@/lib/placeholder";
import { cx } from "@/lib/cx";
import { PageHero } from "@/components/layout/PageHero";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { Eyebrow, SectionHeader, TbcTag } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { StatementReveal } from "@/components/motion/StatementReveal";
import { StatCounter } from "@/components/motion/StatCounter";
import { GlobalPresence } from "@/components/sections/GlobalPresence";
import { InnerCta } from "@/components/sections/InnerCta";
import { BadgeTile } from "@/components/company/BadgeTile";
import { Journey } from "@/components/company/Journey";
import { Portrait } from "@/components/company/Portrait";
import { heroIntro, pageMetadata } from "@/components/company/meta";

const PATH = "/about";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "about"), PATH, "About Us");
}

/** The six "Why choose us" reasons are parallel, not a sequence: each gets a glyph, never a number. */
const reasonGlyph: IconName[] = ["layers", "users", "cloud", "spark", "clock", "award"];

export default async function AboutPage() {
  const [page, team, certs, stats, blocks, offices, milestones] = await Promise.all([
    getPage(PATH, "about"),
    getTeam(),
    getCertifications(),
    getAboutStats(),
    getBlocks(null),
    getOffices(),
    getMilestones(),
  ]);
  if (!page) notFound();
  const b = page.blocks;
  const story = b?.story;
  const group = b?.group ? copy(b.group.body) : null;
  const certifications = certs.filter((c) => c.kind === "certification");

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "About Us" }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={heroIntro(page.intro)}
        image={page.image}
        art="globe"
        size="lg"
        actions={
          <>
            <ButtonLink href={story?.ctaHref ?? "/contact"} arrow>
              {story?.ctaLabel ?? "Contact Us"}
            </ButtonLink>
            <ArrowLink href="#story" tone="dark">
              Our story
            </ArrowLink>
          </>
        }
      />

      {/* Mission & Journey: the verified copy (held-back figures as a designed pending note), then the year-by-year
          journey from the Milestone table (pinned horizontal timeline on desktop, vertical on smaller screens) */}
      {story && (
        <section id="story" aria-labelledby="story-h" className="section-y tone-white scroll-mt-(--header-h)">
          <div className="container-site grid-12 gap-y-10">
            <div className="col-span-4 md:col-span-8 lg:col-span-5" data-reveal>
              {story.eyebrow && <Eyebrow>{story.eyebrow}</Eyebrow>}
              <h2 id="story-h" className="mt-4 text-h2 text-navy-950">
                {story.heading}
              </h2>
              {certifications.length > 0 && (
                <ul aria-label="Certifications" className="mt-10 flex flex-wrap gap-3">
                  {certifications.map((c) => (
                    <li key={c.slug}>
                      <BadgeTile badge={c.badge} name={c.name} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
              {story.paragraphs.map((p) => (
                <p key={p} className="text-lead text-grey-700 first:text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] first:leading-snug first:text-navy-950" data-reveal>
                  {p}
                </p>
              ))}
              {story.held.length > 0 && <PendingBlock label={story.pendingLabel ?? "Copy to be confirmed"} lines={3} className="mt-8" />}
              {group && (
                <div className="mt-6 flex items-start gap-5 rounded-card border border-grey-200 p-6 md:p-7" data-reveal>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon name="globe" size={24} strokeWidth={1.5} />
                  </span>
                  <div>
                    {b?.group?.eyebrow && <p className="font-display text-h4 font-bold text-navy-950">{b.group.eyebrow}</p>}
                    {group.pending ? <TbcTag className="mt-3">Group description to be confirmed</TbcTag> : <p className="mt-2 text-grey-700">{group.text}</p>}
                  </div>
                </div>
              )}
              {story.ctaHref && (
                <ArrowLink href={story.ctaHref} className="mt-8">
                  {story.ctaLabel ?? "Contact Us"}
                </ArrowLink>
              )}
            </div>
          </div>
          {stats.length > 0 && (
            <dl className="container-site mt-16 grid grid-cols-2 gap-y-8 border-t border-grey-100 pt-10 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.key} className="flex flex-col-reverse border-l border-grey-200 pl-5" data-reveal>
                  <dt className="mt-2 text-small text-grey-600">{s.label}</dt>
                  <dd className="font-display-wide text-h2 font-bold text-navy-950">
                    <StatCounter stat={s} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <Journey milestones={milestones} />
        </section>
      )}

      {/* Mission statement: the dark focal band */}
      {b?.mission && (
        <section aria-labelledby="mission-h" className="section-y relative overflow-hidden bg-navy-950 text-white" data-morph>
          <div aria-hidden="true" className="pointer-events-none absolute -right-1/4 top-0 h-full w-3/4 bg-[radial-gradient(closest-side,rgb(0_112_188/0.35),transparent)]" />
          <div className="container-site relative grid-12 gap-y-8">
            <div className="col-span-4 md:col-span-3">
              <p id="mission-h" className="eyebrow flex items-center gap-3 text-sky-400">
                <span aria-hidden="true" className="h-px w-8 bg-sky-400" />
                {b.mission.eyebrow ?? "Our mission"}
              </p>
            </div>
            <div className="col-span-4 md:col-span-9">
              <StatementReveal as="p" text={b.mission.text} className="max-w-[28ch] !text-h2 text-white" />
            </div>
          </div>
        </section>
      )}

      {/* Why choose us: six parallel reasons */}
      {b?.whyUs && b.whyUs.items.length > 0 && (
        <section aria-labelledby="why-h" className="section-y tone-mist">
          <div className="container-site">
            <SectionHeader id="why-h" eyebrow={b.whyUs.eyebrow} heading={b.whyUs.heading} intro={b.whyUs.body} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
              {b.whyUs.items.map((it, i) => (
                <li key={it.title} className="card-lift flex flex-col rounded-card border border-grey-200 bg-white p-6 hover:border-brand-200 md:p-8" data-reveal>
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon name={reasonGlyph[i % reasonGlyph.length]} size={24} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 text-h4 font-bold text-navy-950">{it.title}</h3>
                  {it.body && <p className="mt-3 text-grey-700">{it.body}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Our model: a real sequence, so the steps are numbered */}
      {b?.model && b.model.steps.length > 0 && (
        <section aria-labelledby="model-h" className="section-y tone-white">
          <div className="container-site">
            <SectionHeader id="model-h" eyebrow={b.model.eyebrow} heading={b.model.heading} intro={b.model.body} />
            <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 xl:grid-cols-6">
              {b.model.steps.map((s, i) => (
                <li key={s} className="relative border-t-2 border-grey-200 pt-6" data-reveal>
                  <span aria-hidden="true" className="absolute -top-0.5 left-0 h-0.5 w-12 bg-brand-600" />
                  <p className="font-display text-sm font-bold tabular-nums text-brand-600">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-h4 font-bold text-navy-950">{s}</h3>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Leadership teaser */}
      {b?.leadership && team.length > 0 && (
        <section aria-labelledby="leaders-h" className="section-y tone-mist">
          <div className="container-site">
            <SectionHeader
              id="leaders-h"
              eyebrow={b.leadership.eyebrow}
              heading={b.leadership.heading}
              action={b.leadership.ctaHref ? <ArrowLink href={b.leadership.ctaHref}>{b.leadership.ctaLabel ?? "Meet the team"}</ArrowLink> : undefined}
            />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
              {team.map((p, i) => (
                <li key={p.slug} data-reveal>
                  <article className="card-lift group relative h-full overflow-hidden rounded-card bg-white ring-1 ring-grey-200">
                    <Portrait name={p.name} photo={p.photo} variant={i} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] !rounded-none" />
                    <div className="p-6 md:p-7">
                      <h3 className="text-h4 font-bold text-navy-950">
                        <Link href={`/about/team#${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
                          {plain(p.name)}
                        </Link>
                      </h3>
                      <p className="mt-1 text-grey-600">{p.role}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Credentials: dark band with the badges */}
      {b?.credentials && (
        <section aria-labelledby="creds-h" className="section-y relative overflow-hidden bg-navy-950 text-white" data-morph>
          <div className="container-site grid-12 items-center gap-y-10">
            <div className="col-span-4 md:col-span-8 lg:col-span-6" data-reveal>
              {b.credentials.eyebrow && <Eyebrow tone="dark">{b.credentials.eyebrow}</Eyebrow>}
              <h2 id="creds-h" className="mt-4 text-h2 text-white">
                {b.credentials.heading}
              </h2>
              {b.credentials.body && <p className="mt-5 max-w-[42rem] text-lead text-on-navy-muted">{b.credentials.body}</p>}
              {b.credentials.ctaHref && (
                <ButtonLink href={b.credentials.ctaHref} variant="ghost-dark" arrow className="mt-9">
                  {b.credentials.ctaLabel ?? "View our credentials"}
                </ButtonLink>
              )}
            </div>
            {certifications.length > 0 && (
              <ul aria-label="Certifications" className="col-span-4 grid grid-cols-3 gap-3 md:col-span-8 lg:col-span-5 lg:col-start-8">
                {certifications.map((c) => (
                  <li key={c.slug} className="rounded-card bg-white/5 p-3 ring-1 ring-white/10" data-spotlight data-reveal>
                    <BadgeTile badge={c.badge} name={c.name} size="lg" className="!aspect-[4/3] !p-3 ring-0" />
                    <p className={cx("mt-3 text-center text-xs font-semibold leading-snug text-on-navy-muted")}>{c.standard ?? c.name}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <GlobalPresence block={blocks["home.presence"] ?? emptyBlock} offices={offices} featuredSlug={null} />
      <InnerCta />
    </RevealScope>
  );
}

