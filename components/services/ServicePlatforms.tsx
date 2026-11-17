import { Img } from "@/components/media/Img";
import { ServiceSectionHead } from "@/components/services/ServiceSectionHead";

interface Item {
  title: string;
  summary: string;
  detail?: string;
  image?: string;
}

interface Props {
  eyebrow?: string | null;
  heading: string;
  accent?: string;
  body?: string | null;
  note?: string | null;
  items: Item[];
}

const ICONS = ["images/services/platform-icon-1@2x.webp", "images/services/platform-icon-2@2x.webp", "images/services/platform-icon-3@2x.webp", "images/services/platform-icon-4@2x.webp"];

/**
 * "Platform expertise" (Figma Section 298:28154): light band, the head in a 530px column with a bordered note, and a
 * 710px accordion of frosted rows (number, cloud glyph, 20px title, 18px summary, 38px plus/minus). Native
 * <details name> keeps one row open at a time and works without JavaScript; the first row starts open as designed.
 */
export function ServicePlatforms({ eyebrow, heading, accent, body, note, items }: Props) {
  return (
    <section data-compare="platforms" aria-labelledby="service-platforms-heading" className="bg-grey-50 py-14 lg:py-[108px]">
      <div className="container-site grid gap-10 lg:grid-cols-[530px_minmax(0,1fr)] lg:gap-[80px]">
        <ServiceSectionHead id="service-platforms-heading" eyebrow={eyebrow} heading={heading} accent={accent} body={body} gap="lg">
          {note && <p className="mt-[34px] max-w-[501px] border-t border-navy-850/[0.13] pt-[18px] font-heading text-[1.125rem] leading-[1.53] text-grey-550">{note}</p>}
        </ServiceSectionHead>
        {items.length > 0 && (
          <div className="grid gap-[14px]" data-reveal>
            {items.map((it, i) => (
              <details key={it.title} name="service-platforms" open={i === 0} className="group rounded-[9px] bg-white/68 shadow-[0_9px_30px_rgb(64_79_116/0.05)] ring-1 ring-white/95 open:bg-white/92 open:shadow-[0_15px_38px_rgb(64_79_116/0.10)]">
                <summary className="grid cursor-pointer list-none grid-cols-[36px_minmax(0,1fr)_38px] items-start gap-0 px-[22px] pb-5 pt-[14px] [&::-webkit-details-marker]:hidden">
                  <span className="pt-[5px] font-heading text-[1.125rem] leading-none text-grey-550" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-4">
                      <Img src={it.image ?? ICONS[i % ICONS.length]} alt="" width={27} height={19} sizes="27px" className="h-[19px] w-[27px] object-contain" aria-hidden="true" />
                      <span className="font-heading text-[1.25rem] font-bold leading-[1.5] text-navy-850">{it.title}</span>
                    </span>
                    <span className="mt-[6px] block max-w-[583px] font-heading text-[1.125rem] leading-[1.22] text-[#566272]">{it.summary}</span>
                  </span>
                  <span className="relative mt-[2px] inline-flex h-[38px] w-[38px] items-center justify-center rounded-full text-blue-600 ring-1 ring-blue-600/30 group-open:bg-blue-600 group-open:text-white group-open:ring-blue-600" aria-hidden="true">
                    <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M4 9h10" />
                      <path d="M9 4v10" className="group-open:hidden" />
                    </svg>
                  </span>
                </summary>
                {/* Expanded copy lives outside <summary>, so selecting or clicking the text does not collapse the row and
                    screen readers do not read it as part of the button (QA BUG-030). Indented to the title column. */}
                {it.detail && <p className="-mt-2 max-w-[564px] px-[22px] pb-5 pl-[58px] font-heading text-[1.125rem] leading-[1.22] text-[#394A60]">{it.detail}</p>}
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
