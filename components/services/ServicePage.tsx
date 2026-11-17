import Link from "next/link";
import type { ServicePageData } from "@/lib/data/services";
import type { Block } from "@/lib/data/site";
import { pillarBlock, serviceBlockExtra } from "@/lib/data/service-blocks";
import { optionalCopy, plain } from "@/lib/placeholder";
import { RevealScope } from "@/components/motion/RevealScope";
import { Icon } from "@/components/ui/Icon";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceIntro } from "@/components/services/ServiceIntro";
import { ServiceCapabilities } from "@/components/services/ServiceCapabilities";
import { ServiceQuality } from "@/components/services/ServiceQuality";
import { ServiceEcosystem } from "@/components/services/ServiceEcosystem";
import { ServiceCases } from "@/components/services/ServiceCases";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceSectionHead } from "@/components/services/ServiceSectionHead";
import { ContactSection } from "@/components/home/ContactSection";

const paragraphs = (...parts: (string | null | undefined)[]) =>
  parts.flatMap((s) => {
    const c = optionalCopy(s);
    return c && !c.pending ? c.text.split(/\n\s*\n/).filter(Boolean) : [];
  });

/**
 * Sub-service page on the same template as the pillar page (Figma 292:24608), fed from the Service row: hero (pillar
 * name as the pill, the service name as the title, its descriptor as the line), intro (summary, "who it is for",
 * the first "what we do" items as the floating pills), the "what we do" list in the capabilities panel, delivery
 * steps in the quality rows, technologies as ecosystem tiles, FAQs, case studies, the other services of the pillar,
 * and the contact card. Section labels here are interim UI labels (CONTENT_TODO).
 */
export function ServicePage({ service, blocks }: { service: ServicePageData; blocks: Record<string, Block> }) {
  const hero = pillarBlock(blocks, service.pillar.slug, "hero");
  const heroExtra = serviceBlockExtra(hero, "hero");
  const quality = pillarBlock(blocks, service.pillar.slug, "quality");
  const qualityExtra = serviceBlockExtra(quality, "quality");
  // Placeholder "what we do" items are already left out of `service.whatWeDo` outside the drafts preview (lib/data/services.ts).
  const whatWeDo = service.whatWeDo.map((t) => ({ title: plain(t.title), body: t.body ? plain(t.body) : null }));
  const intro = paragraphs(service.summary, service.whoFor);
  return (
    <RevealScope>
      <ServiceHero pill={plain(service.pillar.name)} title={plain(service.name)} body={service.descriptor ? plain(service.descriptor) : null} image={heroExtra.image ?? service.image} imageAlt={heroExtra.imageAlt} />
      {(intro.length > 0 || whatWeDo.length > 0) && (
        <ServiceIntro eyebrow={plain(service.pillar.name)} heading={`About ${plain(service.name)}`} paragraphs={intro} ctaLabel="Talk to an expert" ctaHref="/contact" image={service.image} imageAlt={service.image?.alt} pills={whatWeDo.slice(0, 4).map((t) => t.title)} />
      )}
      {whatWeDo.length > 0 && (
        <ServiceCapabilities
          eyebrow="What we do"
          heading={`${plain(service.name)}, step by step`}
          body={null}
          prefix={plain(service.pillar.name)}
          ctaLabel="Discuss This Service"
          ctaHref="/contact"
          explore={false}
          items={whatWeDo.map((t, i) => ({ slug: `item-${i}`, name: t.title, summary: t.body, bullets: [], href: "/contact" }))}
        />
      )}
      {service.steps.length > 0 && (
        <ServiceQuality eyebrow="How we deliver" heading={`How we deliver ${plain(service.name)}`} body={null} items={service.steps.map((s) => plain(s.title))} ctaLabel="Talk to an expert" ctaHref="/contact" badge={qualityExtra.badge} badgeCaption={qualityExtra.badgeCaption} noteLabel={qualityExtra.noteLabel} note={qualityExtra.note} />
      )}
      {service.technologies.length > 0 && <ServiceEcosystem eyebrow="Technologies" heading="Platforms and tools we work with." body={null} items={service.technologies.map((name) => ({ name }))} />}
      {service.caseStudies.length > 0 && <ServiceCases eyebrow="Case Studies" heading={`${plain(service.name)} in action`} ctaLabel="See All Case Studies" ctaHref="/case-studies" items={service.caseStudies} />}
      {service.faqs.length > 0 && <ServiceFaq eyebrow="Frequently asked questions" heading={`Questions about ${plain(service.name)}, answered.`} items={service.faqs} />}
      {service.siblings.length > 0 && (
        <section aria-labelledby="service-siblings-heading" className="bg-grey-50 py-14 lg:py-[80px]">
          <div className="container-site">
            <ServiceSectionHead id="service-siblings-heading" eyebrow={plain(service.pillar.name)} heading={`More in ${plain(service.pillar.name)}`} />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {service.siblings.map((s) => (
                <li key={s.slug}>
                  <Link href={s.href} className="flex h-full min-h-[76px] items-center justify-between gap-4 rounded-lg bg-white/80 px-[22px] py-4 font-heading text-[1.125rem] font-semibold text-navy-850 ring-1 ring-white/92 transition-colors duration-(--duration-fast) hover:bg-white">
                    {plain(s.name)}
                    <Icon name="chevron-right" size={17} className="shrink-0 text-blue-600" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href={service.pillar.href} className="flex h-full min-h-[76px] items-center justify-between gap-4 rounded-lg bg-blue-600 px-[22px] py-4 font-heading text-[1.125rem] font-semibold text-white transition-colors duration-(--duration-fast) hover:bg-blue-500">
                  All {plain(service.pillar.name)}
                  <Icon name="arrow" size={17} />
                </Link>
              </li>
            </ul>
          </div>
        </section>
      )}
      {blocks["home.contact"] && <ContactSection block={blocks["home.contact"]} regionSlug={null} />}
    </RevealScope>
  );
}
