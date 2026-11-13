import { Img } from "@/components/media/Img";
import { ServiceSectionHead } from "@/components/services/ServiceSectionHead";

interface Item {
  name: string;
  image?: string;
}

interface Props {
  eyebrow?: string | null;
  heading: string;
  body?: string | null;
  note?: string | null;
  items: Item[];
  draft?: boolean;
}

/**
 * "Technology ecosystem" (Figma Section 299:28592): a lilac-to-blue band, the head in a 556px column and a grid of
 * 220x112 frosted tiles (logo above a 16px name) with the disclaimer under them. Tiles without a supplied logo show
 * the name only: no brand marks are drawn in.
 */
export function ServiceEcosystem({ eyebrow, heading, body, note, items, draft }: Props) {
  return (
    <section data-compare="ecosystem" aria-labelledby="service-ecosystem-heading" className="bg-[linear-gradient(180deg,#EEEDF7_0%,#E6EFFB_100%)] py-14 lg:py-[108px]">
      <div className="container-site grid gap-10 lg:grid-cols-[556px_minmax(0,1fr)] lg:gap-[80px]">
        <ServiceSectionHead id="service-ecosystem-heading" eyebrow={eyebrow} heading={heading} body={body} bodyClassName="mt-[22px] text-[1.25rem] leading-[1.35]">
          {draft && <span className="mt-4 inline-block rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
        </ServiceSectionHead>
        <div data-reveal>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="list">
            {items.map((it) => (
              <li key={it.name} className="flex h-[112px] flex-col items-center justify-center gap-[15px] rounded-lg bg-white/68 px-3 text-center ring-1 ring-white/98">
                {it.image ? <Img src={it.image} alt="" width={75} height={30} sizes="75px" className="h-[30px] w-auto max-w-[75px] object-contain" /> : <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-blue-600/10 font-heading text-[0.8125rem] font-bold text-blue-600" aria-hidden="true">{it.name.slice(0, 1)}</span>}
                <span className="font-heading text-[1rem] leading-none text-grey-400">{it.name}</span>
              </li>
            ))}
          </ul>
          {note && <p className="mt-[26px] font-heading text-[1.125rem] leading-[1.72] text-[#7B8794]">{note}</p>}
        </div>
      </div>
    </section>
  );
}
