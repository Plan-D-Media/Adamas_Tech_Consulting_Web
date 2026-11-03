import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { PageHero } from "@/components/layout/PageHero";
import { CardArt } from "@/components/media/CardArt";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";
import { heroIntro, pageMetadata } from "@/components/company/meta";

const PATH = "/about/careers";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "coming-soon"), PATH, "Careers");
}

/** Careers is Phase 2 (Q2.9): a designed "coming soon" page rather than an empty one. */
export default async function CareersPage() {
  const page = await getPage(PATH, "coming-soon");
  if (!page) notFound();
  const b = page.blocks ?? { status: "Coming soon", links: [] };
  const [primary, ...secondary] = b.links;

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "About Us", href: "/about" }, { label: page.title }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={heroIntro(page.intro)}
        art="users"
        artVariant={2}
        size="sm"
      />

      <section aria-labelledby="soon-h" className="section-y tone-white">
        <div className="container-site">
          <div className="grid-12 items-stretch gap-y-8 overflow-hidden rounded-card bg-mist ring-1 ring-grey-200 md:gap-y-0">
            <div className="col-span-4 p-7 sm:p-10 md:col-span-7 md:p-12 lg:p-16" data-reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-navy-950 ring-1 ring-grey-200">
                <span aria-hidden="true" className="relative flex size-2.5">
                  <span className="absolute inset-0 rounded-full bg-orange-500 motion-safe:animate-ping motion-safe:opacity-60" />
                  <span className="relative size-2.5 rounded-full bg-orange-500" />
                </span>
                {b.status}
              </p>
              <h2 id="soon-h" className="mt-8 max-w-[16ch] text-h2 text-navy-950">
                {b.status}: {page.title.toLowerCase()} at AdamasTech
              </h2>
              {b.message && <p className="mt-5 max-w-[46ch] text-lead text-grey-700">{b.message}</p>}
              {primary && (
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <ButtonLink href={primary.href} arrow>
                    {primary.label}
                  </ButtonLink>
                  {secondary.map((l) => (
                    <ArrowLink key={l.href} href={l.href}>
                      {l.label}
                    </ArrowLink>
                  ))}
                </div>
              )}
            </div>
            <div className="relative col-span-4 min-h-64 md:col-span-5 md:min-h-full">
              <CardArt icon="users" variant={1} />
            </div>
          </div>
        </div>
      </section>

      <InnerCta />
    </RevealScope>
  );
}
