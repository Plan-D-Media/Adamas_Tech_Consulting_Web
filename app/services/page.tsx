import type { Metadata } from "next";
import Link from "next/link";
import { getPillars } from "@/lib/data/services";
import { emptyBlock, getBlocks } from "@/lib/data/site";
import { glyphFor } from "@/lib/glyphs";
import { cx } from "@/lib/cx";
import { copy } from "@/lib/placeholder";
import { PageHero } from "@/components/layout/PageHero";
import { CardArt } from "@/components/media/CardArt";
import { Img } from "@/components/media/Img";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";

export const metadata: Metadata = {
  title: "Services",
  description: "Cloud, digital transformation and AI services from AdamasTech Consulting.",
  alternates: { canonical: "/services" },
};

/** Services overview: the three pillars as alternating editorial rows, each listing its sub-services. */
export default async function ServicesPage() {
  const [pillars, blocks] = await Promise.all([getPillars(), getBlocks(null)]);
  const intro = blocks["home.whatWeDo"] ?? emptyBlock;

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Services" }]}
        eyebrow={intro.eyebrow ?? "Our services"}
        title={intro.heading ?? "Services"}
        intro={intro.body}
        art="layers"
        size="lg"
        actions={<ButtonLink href="/contact" arrow>Talk to an expert</ButtonLink>}
        aside={
          <nav aria-label="Service pillars" className="rounded-card bg-white/5 p-6 ring-1 ring-white/15 backdrop-blur-sm">
            <p className="eyebrow text-sky-300">Jump to</p>
            <ul className="mt-4 divide-y divide-white/10">
              {pillars.map((p) => (
                <li key={p.slug}>
                  <a href={`#${p.slug}`} className="group flex items-center justify-between gap-4 py-3 font-semibold transition-colors duration-(--duration-base) hover:text-sky-300">
                    {p.name}
                    <Icon name="arrowRight" size={18} className="rotate-90 transition-transform duration-(--duration-base) group-hover:translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      {pillars.map((p, i) => {
        const flip = i % 2 === 1;
        const outcome = p.outcomeLine ? copy(p.outcomeLine) : null;
        return (
          <section key={p.slug} id={p.slug} aria-labelledby={`${p.slug}-h`} className={cx("section-y scroll-mt-(--header-h)", i % 2 ? "tone-mist" : "tone-white")}>
            <div className="container-site grid-12 items-start gap-y-10">
              <div className={cx("col-span-4 md:col-span-8 lg:col-span-6", flip && "lg:order-2 lg:col-start-7")} data-reveal>
                <div className="card-media relative aspect-[4/3] overflow-hidden rounded-card bg-navy-900">
                  {p.image ? <Img media={p.image} sizes="(min-width: 1024px) 600px, 100vw" /> : <CardArt icon={glyphFor(p.slug)} variant={i} />}
                  {outcome && !outcome.pending && (
                    <p className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy-950/90 to-transparent p-6 pt-16 font-display text-h4 font-semibold text-white md:p-8">
                      {outcome.text}
                    </p>
                  )}
                </div>
              </div>
              <div className={cx("col-span-4 md:col-span-8 lg:col-span-5", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
                <div data-reveal>
                  {p.tagline && <p className="eyebrow text-brand-600">{p.tagline}</p>}
                  <h2 id={`${p.slug}-h`} className="mt-4 text-h2 text-navy-950">
                    {p.name}
                  </h2>
                  {p.summary && <p className="mt-5 text-lead text-grey-700">{p.summary}</p>}
                </div>
                <ul className="mt-8 divide-y divide-grey-200 border-y border-grey-200">
                  {p.services.map((s) => {
                    const name = copy(s.name);
                    return (
                      <li key={s.slug} data-reveal>
                        <Link href={s.href} className="group flex items-start justify-between gap-6 py-4">
                          <span>
                            <span className="block font-semibold text-navy-950 transition-colors duration-(--duration-base) group-hover:text-brand-600">{name.text}</span>
                            {s.descriptor && !copy(s.descriptor).pending && <span className="mt-1 block text-small text-grey-600 line-clamp-2">{s.descriptor}</span>}
                          </span>
                          <Icon name="arrowRight" size={18} className="mt-1 shrink-0 text-brand-600 transition-transform duration-(--duration-base) group-hover:translate-x-1" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <ArrowLink href={p.href} className="mt-8">
                  Explore {p.name}
                </ArrowLink>
              </div>
            </div>
          </section>
        );
      })}

      <InnerCta />
    </RevealScope>
  );
}
