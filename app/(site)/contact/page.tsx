import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { emptyBlock, getBlocks, getOffices, getRegions, type Block } from "@/lib/data/site";
import { optionalCopy, plain } from "@/lib/placeholder";
import { defaultRegion } from "@/lib/region";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealScope } from "@/components/motion/RevealScope";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactSection } from "@/components/home/ContactSection";
import { Presence } from "@/components/home/Presence";

const PATH = "/contact";
const CRUMBS: Crumb[] = [{ name: "Contact", path: PATH }];

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "contact"), PATH, "Contact us");
}

/**
 * Contact page (no Figma frame: built from the homepage Contact section and the "Our Presence" office cards with the
 * same tokens and components, QA Phase 2 decision of 17 Nov 2026). Every "Talk to an expert" button lands here.
 * Region-aware in the browser: the visitor's cookie region (DEFAULT_REGION before hydration and without JavaScript)
 * is shown first with its phone and email, and its featured office is "Your nearest office"; all three regions and
 * every office stay on the page. The form is the homepage enquiry form and its server action (database, honeypot,
 * rate limit, consent, success and error states, no-JavaScript submit), with `/contact?service=...` as its source path.
 */
export default async function ContactPage() {
  const [page, regions, offices, blocks] = await Promise.all([getPage(PATH, "contact"), getRegions(), getOffices(), getBlocks(null)]);
  if (!page) notFound();
  const fallback = defaultRegion();
  const b = page.blocks;
  const intro = optionalCopy(page.intro);
  const hours = b?.phone?.body ? { region: "IN" as const, text: b.phone.body } : null;
  const presenceBlock: Block = { ...emptyBlock, eyebrow: b?.presence?.eyebrow ?? "Our Presence", heading: b?.presence?.heading ?? null };
  const contactBlock = blocks["home.contact"];

  return (
    <RevealScope>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: plain(page.title), url: absoluteUrl(PATH), description: page.seoDescription ?? intro?.text }} />

      <section aria-labelledby="contact-page-heading" className="bg-tint-50 pb-16 pt-8 lg:pb-[96px] lg:pt-[40px]">
        <div className="container-site">
          <Breadcrumb crumbs={CRUMBS} />
          {/* Above the fold: visible from the first paint, CSS does the rise (data-reveal="now"). */}
          <div className="mt-8 max-w-[43.125rem] lg:mt-12" data-reveal="now">
            {page.eyebrow && <Eyebrow className="lg:leading-[15px]">{plain(page.eyebrow)}</Eyebrow>}
            <h1 id="contact-page-heading" className="mt-3 font-heading text-[clamp(1.875rem,1.2rem+1.9vw,2.6875rem)] font-bold leading-[1.14] tracking-[-0.035em] text-navy-800">
              {plain(page.title)}
            </h1>
            {intro && !intro.pending && <p className="mt-[17px] max-w-[40.625rem] font-heading text-[clamp(1rem,0.9rem+0.3vw,1.25rem)] leading-[1.45] text-grey-600">{intro.text}</p>}
          </div>

          <div className="mt-12 lg:mt-16">
            {b?.form?.heading && (
              <h2 id="contact-channels-heading" className="font-heading text-[clamp(1.375rem,1.2rem+0.5vw,1.75rem)] font-bold leading-[1.2] tracking-[-0.02em] text-navy-800" data-reveal>
                {plain(b.form.heading)}
              </h2>
            )}
            {b?.form?.body && (
              <p className="mt-2 max-w-[40.625rem] font-heading text-[1rem] leading-[1.6] text-grey-600" data-reveal>
                {plain(b.form.body)}
              </p>
            )}
            <div className="mt-6 lg:mt-8">
              <ContactChannels regions={regions} fallbackRegion={fallback} hours={hours} />
            </div>
          </div>
        </div>
      </section>

      {contactBlock && <ContactSection block={contactBlock} regionSlug={null} fallbackRegion={fallback} sourcePath={PATH} />}
      <Presence block={presenceBlock} offices={offices} regions={regions} region={null} fallbackRegion={fallback} />
    </RevealScope>
  );
}
