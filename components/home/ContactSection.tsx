import type { Block } from "@/lib/data/site";
import { blockExtra } from "@/lib/data/home-blocks";
import { plain } from "@/lib/placeholder";
import { HomeContactForm } from "@/components/home/HomeContactForm";
import { Img } from "@/components/media/Img";

/**
 * Contact (Figma Rectangle 4511 card): a 1320x631 white card with a 40px shadow, the photo on the left and the form on
 * the right ("DO YOU HAVE ANY QUESTION?", blue heading, four fields with icons and the phone country selector,
 * "Submit Now!"). Posts to the contact server action (honeypot, rate limit, database, mail).
 */
export function ContactSection({ block, regionSlug }: { block: Block; regionSlug: string | null }) {
  const extra = blockExtra(block, "contact");
  return (
    <section aria-labelledby="contact-heading" data-compare="contact" className="bg-white pb-16 pt-4 lg:pb-[105px] lg:pt-[40px]">
      <div className="container-site">
        <div className="grid overflow-hidden rounded-[30px] bg-white p-[5px] shadow-[0_10px_40px_rgb(0_0_0/0.16)] lg:grid-cols-[1fr_1fr] xl:grid-cols-[785px_minmax(0,1fr)]" data-reveal>
          {extra.image && (
            <div className="relative min-h-[16rem] overflow-hidden rounded-[26px] lg:h-full lg:min-h-[36rem] xl:h-[621px]">
              <Img src={extra.image} alt={extra.imageAlt} fill sizes="(min-width: 1280px) 785px, (min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          )}
          <div className="min-w-0 px-5 pb-8 pt-7 lg:px-8 lg:pb-10 lg:pt-[29px] xl:px-12">
            {/* Figma: the eyebrow sits on a 55px line box and the heading box starts 7px before it ends. */}
            {block.eyebrow && <p className="font-ui text-[1.25rem] font-bold uppercase leading-[1.5] text-[#333E63] lg:leading-[55px]">{plain(block.eyebrow)}</p>}
            <h2 id="contact-heading" className="mt-1 max-w-[21rem] text-balance font-ui text-[clamp(1.375rem,1.2rem+0.5vw,1.625rem)] font-bold leading-[1.3] text-blue-500 lg:-mt-[7px]">
              {plain(block.heading)}
            </h2>
            <HomeContactForm placeholders={extra.placeholders} submitLabel={extra.submitLabel} consentLabel={extra.consentLabel} regionSlug={regionSlug} />
          </div>
        </div>
      </div>
    </section>
  );
}
