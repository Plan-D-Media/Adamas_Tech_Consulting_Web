import type { Media } from "@/lib/media";
import { Img } from "@/components/media/Img";

interface Props {
  pill: string;
  title: string;
  body?: string | null;
  image?: Media | string | null;
  imageAlt?: string;
  /** Shown next to the pill while the title is a placeholder from the design file. */
  pending?: boolean;
}

/**
 * Service page hero (Figma 292:24612-24619): a 530px navy band under the header with the photo ("raise_money"),
 * a centred pill (black at 30%, white 44% stroke), the 62px Roboto title and a 24px line.
 */
export function ServiceHero({ pill, title, body, image, imageAlt = "", pending }: Props) {
  return (
    <section data-dark-hero data-compare="hero" aria-labelledby="service-heading" className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0" aria-hidden="true">
        {image && <Img src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_12_51/0.35)_0%,rgb(0_12_51/0.55)_100%)]" />
      </div>
      <div className="container-site relative flex flex-col items-center pb-14 pt-10 text-center lg:pb-[139px] lg:pt-[66px]">
        <p className="inline-flex min-h-10 items-center rounded-pill border border-white/45 bg-black/30 px-[38px] font-ui text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] font-medium leading-tight text-white">
          {pill}
          {pending && <span className="ml-3 rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Title to be confirmed</span>}
        </p>
        <h1 id="service-heading" className="mt-[19px] max-w-[1017px] text-balance font-ui text-[clamp(2.25rem,1.3rem+3vw,3.875rem)] font-bold leading-[1.17]">
          {title}
        </h1>
        {body && <p className="mt-[19px] max-w-[847px] font-ui text-[clamp(1.0625rem,0.95rem+0.5vw,1.5rem)] leading-[1.17] text-white">{body}</p>}
      </div>
    </section>
  );
}
