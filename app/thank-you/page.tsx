import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { PageHero } from "@/components/layout/PageHero";
import { CardArt } from "@/components/media/CardArt";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { heroIntro, pageMetadata } from "@/components/company/meta";

const PATH = "/thank-you";

export async function generateMetadata(): Promise<Metadata> {
  // Always noindex, even if the row is edited.
  return { ...pageMetadata(await getPage(PATH, "thank-you"), PATH, "Thank you"), robots: { index: false, follow: true } };
}

const ICONS = new Set<IconName>(["layers", "chart", "award", "cloud", "spark", "globe", "users", "doc"]);

/** Generic confirmation after the contact form (and any other enquiry), with clear next steps. */
export default async function ThankYouPage() {
  const page = await getPage(PATH, "thank-you");
  if (!page) notFound();
  const b = page.blocks ?? { next: [] };

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Thank you" }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={heroIntro(page.intro)}
        art="check"
        artVariant={2}
        size="sm"
        actions={
          <>
            <ButtonLink href="/" arrow>
              Back to the homepage
            </ButtonLink>
            <ArrowLink href="/contact" tone="dark">
              Send another message
            </ArrowLink>
          </>
        }
      />

      {b.next.length > 0 && (
        <section aria-labelledby="next-h" className="section-y tone-white">
          <div className="container-site">
            <SectionHeader id="next-h" eyebrow="Next steps" heading={b.nextHeading ?? "Next steps"} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
              {b.next.map((n, i) => {
                const icon = n.icon && ICONS.has(n.icon as IconName) ? (n.icon as IconName) : "arrowRight";
                return (
                  <li key={n.href} data-reveal>
                    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-grey-200">
                      <div className="card-media relative aspect-[16/9]">
                        <CardArt icon={icon} variant={i} />
                        <span className="absolute left-6 top-6 inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm">
                          <Icon name={icon} size={24} strokeWidth={1.5} />
                        </span>
                      </div>
                      <div className="flex flex-1 items-center justify-between gap-4 p-6 md:p-7">
                        <h3 className="text-h4 font-bold text-navy-950">
                          <Link href={n.href} className="after:absolute after:inset-0 after:z-[2] after:content-['']">
                            {n.title}
                          </Link>
                        </h3>
                        <Icon name="arrowRight" size={22} className="shrink-0 text-brand-600 transition-transform duration-(--duration-base) group-hover:translate-x-1" />
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </RevealScope>
  );
}
