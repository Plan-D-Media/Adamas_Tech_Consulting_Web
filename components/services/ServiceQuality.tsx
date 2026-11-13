import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/media/Img";
import { ServiceSectionHead } from "@/components/services/ServiceSectionHead";

interface Props {
  eyebrow?: string | null;
  heading: string;
  accent?: string;
  body?: string | null;
  items: string[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
  badge: string;
  badgeCaption: string;
  noteLabel: string;
  note?: string | null;
}

const BADGES = ["images/services/quality-badge-1@2x.webp", "images/services/quality-badge-2.webp", "images/services/quality-badge-3.webp"];

/**
 * "Quality & trust" (Figma Section 299:28654): the head in a 540px column, four numbered principle rows and a small
 * link; on the right the 708x480 "delivery principles" artwork rebuilt in CSS (gradient card, two rings, the glowing
 * centre badge, three credential circles and the "Important" note row).
 */
export function ServiceQuality({ eyebrow, heading, accent, body, items, ctaLabel, ctaHref, badge, badgeCaption, noteLabel, note }: Props) {
  return (
    <section data-compare="quality" aria-labelledby="service-quality-heading" className="bg-white py-14 lg:py-[108px]">
      <div className="container-site grid gap-10 lg:grid-cols-[540px_minmax(0,1fr)] lg:gap-[72px]">
        <ServiceSectionHead id="service-quality-heading" eyebrow={eyebrow} heading={heading} accent={accent} body={body} gap="lg">
          {items.length > 0 && (
            <ol className="mt-9 grid gap-[11px]" role="list">
              {items.map((it, i) => (
                <li key={it} className="grid h-[70px] grid-cols-[38px_minmax(0,1fr)_18px] items-center rounded-lg bg-[#EAEEF9]/40 px-[18px] ring-1 ring-[#E8EEF9]">
                  <span className="font-heading text-[1rem] leading-none text-blue-600" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-[1.125rem] font-bold leading-[1.1] text-navy-850">{it}</span>
                  <Icon name="arrow" size={17} className="text-navy-850" />
                </li>
              ))}
            </ol>
          )}
          {ctaLabel && ctaHref && (
            <Link href={ctaHref} className="mt-[25px] inline-flex items-center gap-3 font-heading text-[0.6875rem] font-bold text-navy-850 hover:text-blue-600">
              {ctaLabel}
              <Icon name="arrow" size={17} />
            </Link>
          )}
        </ServiceSectionHead>
        <div className="relative h-[480px] overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#CBD8EE_0%,#DDE4F3_48%,#CFC5EB_100%)] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.65)] lg:mt-[99px]" data-reveal aria-hidden="true">
          <div className="absolute left-1/2 top-[85px] h-[310px] w-[310px] -translate-x-1/2 rounded-full border border-[#18529E]/30" />
          <div className="absolute left-1/2 top-[130px] h-[220px] w-[220px] -translate-x-1/2 rounded-full border border-[#18529E]/30" />
          <div className="absolute left-1/2 top-[165px] flex h-[150px] w-[150px] -translate-x-1/2 flex-col items-center justify-center rounded-full bg-[radial-gradient(circle,#2784F8_0%,#0C4FA8_100%)] text-white shadow-[0_0_50px_rgb(17_103_216/0.4)]">
            <Icon name="shield" size={34} />
            <p className="mt-2 font-heading text-[0.9375rem] font-bold uppercase leading-[1.5] tracking-[0.15em]">{badge}</p>
            <p className="mt-[5px] font-heading text-[0.375rem] uppercase leading-[1.5] tracking-[0.14em]">{badgeCaption}</p>
          </div>
          {[
            { left: "calc(50% - 20px)", top: "75px" },
            { left: "calc(50% - 155px)", top: "305px" },
            { left: "calc(50% + 120px)", top: "307px" },
          ].map((pos, i) => (
            <div key={i} className="absolute h-10 w-10 overflow-hidden rounded-full bg-white/85 ring-1 ring-blue-600/25" style={pos}>
              <Img src={BADGES[i]} alt="" width={40} height={40} sizes="40px" className="h-10 w-10 object-cover" />
            </div>
          ))}
          {note && (
            <div className="absolute bottom-[22px] left-[25px] right-[18px] flex gap-[15px] border-t border-[#1E467D]/20 pt-[14px] font-heading text-[0.6875rem] leading-[1.25]">
              <span className="shrink-0 uppercase tracking-[0.1em] text-[#70B0FF]">{noteLabel}</span>
              <span className="text-[#3F526B]">{note}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
