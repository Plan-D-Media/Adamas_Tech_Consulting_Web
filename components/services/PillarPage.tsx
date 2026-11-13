import type { PillarPageData } from "@/lib/data/services";
import type { Block } from "@/lib/data/site";
import { pillarBlock, serviceBlockExtra } from "@/lib/data/service-blocks";
import { copy, optionalCopy, plain } from "@/lib/placeholder";
import { RevealScope } from "@/components/motion/RevealScope";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceIntro } from "@/components/services/ServiceIntro";
import { ServiceDifference } from "@/components/services/ServiceDifference";
import { ServiceExpertise } from "@/components/services/ServiceExpertise";
import { ServicePlatforms } from "@/components/services/ServicePlatforms";
import { ServiceIndustries } from "@/components/services/ServiceIndustries";
import { ServiceCapabilities } from "@/components/services/ServiceCapabilities";
import { ServiceCases } from "@/components/services/ServiceCases";
import { ServiceEcosystem } from "@/components/services/ServiceEcosystem";
import { ServiceQuality } from "@/components/services/ServiceQuality";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ContactSection } from "@/components/home/ContactSection";

const paragraphs = (s: string | null | undefined) => {
  const c = optionalCopy(s);
  return c && !c.pending ? c.text.split(/\n\s*\n/).filter(Boolean) : [];
};

/**
 * Service pillar page, the Cloud Services design (Figma 292:24608) applied to any pillar: every section reads its
 * copy from `services.<slug>.<section>` ContentBlock rows and the pillar's own rows (sub-services, FAQs, case
 * studies). Sections without a block (or whose block is DRAFT outside the preview) are left out.
 */
export function PillarPage({ pillar, blocks }: { pillar: PillarPageData; blocks: Record<string, Block> }) {
  const b = (section: Parameters<typeof pillarBlock>[2]) => pillarBlock(blocks, pillar.slug, section);
  const hero = b("hero");
  const heroExtra = serviceBlockExtra(hero, "hero");
  const heroTitle = hero?.heading ? copy(hero.heading) : null;
  const title = heroTitle && !heroTitle.pending ? heroTitle.text : plain(pillar.outcomeLine) || plain(pillar.tagline) || plain(pillar.name);

  const intro = b("intro");
  const introExtra = serviceBlockExtra(intro, "intro");
  const difference = b("difference");
  const stats = serviceBlockExtra(b("stats"), "stats");
  const expertise = b("expertise");
  const expertiseExtra = serviceBlockExtra(expertise, "expertise");
  const platforms = b("platforms");
  const platformsExtra = serviceBlockExtra(platforms, "platforms");
  const industries = b("industries");
  const industriesExtra = serviceBlockExtra(industries, "industries");
  const capabilities = b("capabilities");
  const capabilitiesExtra = serviceBlockExtra(capabilities, "capabilities");
  const cases = b("cases");
  const casesExtra = serviceBlockExtra(cases, "cases");
  const ecosystem = b("ecosystem");
  const ecosystemExtra = serviceBlockExtra(ecosystem, "ecosystem");
  const quality = b("quality");
  const qualityExtra = serviceBlockExtra(quality, "quality");
  const faq = b("faq");

  return (
    <RevealScope>
      <ServiceHero pill={plain(hero?.eyebrow) || plain(pillar.name)} title={title} body={hero?.body ? plain(hero.body) : null} image={heroExtra.image ?? pillar.image} imageAlt={heroExtra.imageAlt} pending={!!heroTitle?.pending} />
      {intro && (
        <ServiceIntro
          eyebrow={plain(intro.eyebrow)}
          heading={plain(intro.heading) || plain(pillar.name)}
          paragraphs={paragraphs(intro.body ?? pillar.summary)}
          ctaLabel={intro.ctaLabel}
          ctaHref={intro.ctaHref}
          secondaryLabel={introExtra.secondaryLabel}
          secondaryHref={introExtra.secondaryHref}
          image={introExtra.image ?? pillar.image}
          imageAlt={introExtra.imageAlt}
          pills={introExtra.pills}
        />
      )}
      {difference && <ServiceDifference heading={plain(difference.heading)} paragraphs={paragraphs(difference.body)} ctaLabel={difference.ctaLabel} ctaHref={difference.ctaHref} stats={stats.items.map((s) => ({ ...s, draft: true }))} />}
      {expertise && <ServiceExpertise eyebrow={plain(expertise.eyebrow)} heading={plain(expertise.heading)} accent={expertiseExtra.accent} body={plain(expertise.body)} ctaLabel={expertise.ctaLabel} ctaHref={expertise.ctaHref} cards={expertiseExtra.cards} />}
      {platforms && <ServicePlatforms eyebrow={plain(platforms.eyebrow)} heading={plain(platforms.heading)} accent={platformsExtra.accent} body={plain(platforms.body)} note={platformsExtra.note} items={platformsExtra.items} />}
      {industries && <ServiceIndustries eyebrow={plain(industries.eyebrow)} heading={plain(industries.heading)} body={plain(industries.body)} items={industriesExtra.items} />}
      {pillar.services.length > 0 && (
        <ServiceCapabilities
          eyebrow={plain(capabilities?.eyebrow) || "Services & capabilities"}
          heading={plain(capabilities?.heading) || `What ${plain(pillar.name)} covers`}
          body={plain(capabilities?.body)}
          prefix={capabilitiesExtra.prefix}
          ctaLabel={capabilitiesExtra.ctaLabel}
          ctaHref={capabilitiesExtra.ctaHref}
          items={pillar.services.map((s) => ({ slug: s.slug, name: plain(s.name), summary: s.descriptor ? plain(s.descriptor) : null, bullets: (s.bullets ?? []).map(plain), href: s.href }))}
        />
      )}
      {pillar.caseStudies.length > 0 && <ServiceCases eyebrow={plain(cases?.eyebrow) || "Case Studies"} heading={plain(cases?.heading) || `${plain(pillar.name)} in action`} body={plain(cases?.body)} note={casesExtra.note} ctaLabel={cases?.ctaLabel ?? "See All Case Studies"} ctaHref={cases?.ctaHref ?? "/case-studies"} items={pillar.caseStudies} />}
      {ecosystem && ecosystemExtra.items.length > 0 && <ServiceEcosystem eyebrow={plain(ecosystem.eyebrow)} heading={plain(ecosystem.heading)} body={plain(ecosystem.body)} note={ecosystemExtra.note} items={ecosystemExtra.items} draft />}
      {quality && <ServiceQuality eyebrow={plain(quality.eyebrow)} heading={plain(quality.heading)} accent={qualityExtra.accent} body={plain(quality.body)} items={qualityExtra.items} ctaLabel={quality.ctaLabel} ctaHref={quality.ctaHref} badge={qualityExtra.badge} badgeCaption={qualityExtra.badgeCaption} noteLabel={qualityExtra.noteLabel} note={qualityExtra.note} />}
      {pillar.faqs.length > 0 && <ServiceFaq eyebrow={plain(faq?.eyebrow) || "Frequently asked questions"} heading={plain(faq?.heading) || `Questions about ${plain(pillar.name)}, answered.`} items={pillar.faqs} />}
      {blocks["home.contact"] && <ContactSection block={blocks["home.contact"]} regionSlug={null} />}
    </RevealScope>
  );
}
