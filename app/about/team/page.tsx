import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getTeam } from "@/lib/data/pages";
import { optionalCopy, plain } from "@/lib/placeholder";
import { cx } from "@/lib/cx";
import { PageHero } from "@/components/layout/PageHero";
import { LinkCard } from "@/components/cards/LinkCard";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { DraftBadge, SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";
import { Portrait } from "@/components/company/Portrait";
import { heroIntro, pageMetadata } from "@/components/company/meta";

const PATH = "/about/team";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "team"), PATH, "Team");
}

export default async function TeamPage() {
  const [page, team] = await Promise.all([getPage(PATH, "team"), getTeam()]);
  if (!page) notFound();
  const labels = page.blocks ?? { bioPendingLabel: "Biography to be confirmed", emptyLabel: "Leadership profiles to be confirmed" };

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Team" }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={heroIntro(page.intro)}
        image={page.image}
        art="users"
        artVariant={1}
        size="md"
        actions={
          <ButtonLink href="/contact" arrow>
            Talk to an expert
          </ButtonLink>
        }
      />

      {/* One row per leader: portrait, name and role, biography */}
      <section aria-label="Leadership" className="section-y tone-white">
        <div className="container-site">
          {team.length === 0 ? (
            <PendingBlock label={labels.emptyLabel} lines={4} />
          ) : (
            <ul className="divide-y divide-grey-200 border-y border-grey-200">
              {team.map((p, i) => {
                const bio = optionalCopy(p.bio);
                const name = plain(p.name);
                return (
                  <li key={p.slug} id={p.slug} className="scroll-mt-[calc(var(--header-h)+1.5rem)] py-10 md:py-14">
                    <article aria-labelledby={`${p.slug}-h`} className="grid-12 items-start gap-y-8">
                      <div className="col-span-4 md:col-span-4 lg:col-span-4" data-reveal>
                        <Portrait name={p.name} photo={p.photo} variant={i} sizes="(min-width: 1024px) 400px, (min-width: 768px) 33vw, 100vw" className="aspect-square md:aspect-[4/5]" />
                      </div>
                      <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6" data-reveal>
                        <p className="eyebrow text-brand-600">{p.role}</p>
                        <h2 id={`${p.slug}-h`} className="mt-4 text-h2 text-navy-950">
                          {name}
                        </h2>
                        {p.draft && <DraftBadge className="mt-3" />}
                        {bio && !bio.pending ? (
                          <p className="mt-6 max-w-[60ch] text-lead text-grey-700">{bio.text}</p>
                        ) : (
                          <PendingBlock label={labels.bioPendingLabel} lines={4} className="mt-8 max-w-[42rem]" />
                        )}
                        {p.linkedinUrl && (
                          <a
                            href={p.linkedinUrl}
                            target="_blank"
                            rel="noopener"
                            className={cx("mt-8 inline-flex min-h-11 items-center gap-2.5 font-semibold text-brand-600 transition-colors duration-(--duration-base) hover:text-brand-700")}
                          >
                            <Icon name="linkedin" size={20} />
                            <span className="link-underline">{name} on LinkedIn</span>
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="more-h" className="section-y tone-mist">
        <div className="container-site">
          <SectionHeader id="more-h" eyebrow="About Us" heading="More about AdamasTech" action={<ArrowLink href="/about">About the company</ArrowLink>} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <li data-reveal>
              <LinkCard href="/about" title="Company" icon="globe" />
            </li>
            <li data-reveal>
              <LinkCard href="/credentials" title="Credentials" icon="award" />
            </li>
            <li data-reveal>
              <LinkCard href="/about/careers" title="Careers" icon="users" />
            </li>
          </ul>
        </div>
      </section>

      <InnerCta />
    </RevealScope>
  );
}
