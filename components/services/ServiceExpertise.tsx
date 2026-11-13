import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/media/Img";
import { ServiceSectionHead } from "@/components/services/ServiceSectionHead";

interface Card {
  title: string;
  body: string;
  image?: string;
}

interface Props {
  eyebrow?: string | null;
  heading: string;
  accent?: string;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  cards: Card[];
}

const ICONS = ["images/services/expertise-icon-1.webp", "images/services/expertise-icon-2.webp", "images/services/expertise-icon-3.webp", "images/services/expertise-icon-4.webp"];

/**
 * "Our cloud expertise" (Figma Group 21309): the section head in a 621px column with an outlined button, and a
 * 2x2 grid of frosted cards (304x185, white at 66%, 55px shadow) with glossy icon artwork, a numbered corner,
 * an 18px title and a 13px line.
 */
export function ServiceExpertise({ eyebrow, heading, accent, body, ctaLabel, ctaHref, cards }: Props) {
  return (
    <section data-compare="expertise" aria-labelledby="service-expertise-heading" className="overflow-x-clip bg-white py-14 lg:py-[110px]">
      <div className="container-site grid gap-10 lg:grid-cols-[621px_minmax(0,1fr)] lg:gap-[79px]">
        <ServiceSectionHead id="service-expertise-heading" eyebrow={eyebrow} heading={heading} accent={accent} body={body} gap="lg" bodyClassName="text-[0.9375rem] leading-[1.8] lg:w-[626px] lg:max-w-none">
          {ctaLabel && ctaHref && (
            <Link href={ctaHref} className="mt-[34px] inline-flex h-[52px] items-center gap-6 rounded-lg border border-[#B7C1CC] px-[23px] font-heading text-[0.8125rem] font-bold text-navy-850 transition-colors duration-(--duration-fast) hover:border-navy-850">
              {ctaLabel}
              <Icon name="arrow" size={18} />
            </Link>
          )}
        </ServiceSectionHead>
        {cards.length > 0 && (
          <ul className="grid gap-[14px] sm:grid-cols-2 lg:-mr-[52px] lg:mt-[14px] lg:p-[25px]" role="list">
            {cards.map((c, i) => (
              <li key={c.title} className="relative min-h-[174px] rounded-[10px] bg-white/66 p-[29px] pt-[103px] shadow-[0_20px_55px_rgb(66_79_113/0.16)] ring-1 ring-white/95 first:min-h-[185px]" data-reveal>
                <Img src={c.image ?? ICONS[i % ICONS.length]} alt="" width={81} height={73} sizes="81px" className="absolute left-8 top-[15px] h-[73px] w-[81px] object-contain" aria-hidden="true" />
                <span className="absolute right-9 top-[29px] font-heading text-[0.6875rem] font-bold leading-[1.5] text-blue-600" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-[1.125rem] font-bold leading-[1.5] text-navy-850">{c.title}</h3>
                <p className="mt-[7px] font-heading text-[0.8125rem] leading-[1.5] text-grey-550">{c.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
