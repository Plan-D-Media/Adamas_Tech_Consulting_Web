import Link from "next/link";
import { Img } from "@/components/media/Img";

interface Stat {
  value: string;
  label: string;
  image?: string;
  draft?: boolean;
}

interface Props {
  heading: string;
  paragraphs: string[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
  stats: Stat[];
}

const GEARS = ["images/services/stat-gear-1.webp", "images/services/stat-gear-2.webp", "images/services/stat-gear-3.webp", "images/services/stat-gear-4.webp"];

/**
 * "What makes ... different" (Figma Frame 12463 + Group 21308): light band, 42px heading, two 24px/33.6 paragraphs,
 * an outlined "Learn more" button and four 310x311 white cards (gear artwork, 56px figure, 22px label). The stats
 * block is seeded DRAFT until the client supplies real figures, so this row only renders in the preview.
 */
export function ServiceDifference({ heading, paragraphs, ctaLabel, ctaHref, stats }: Props) {
  return (
    <section data-compare="difference" aria-labelledby="service-difference-heading" className="bg-grey-50 py-14 lg:py-[106px]">
      <div className="container-site lg:px-[60px]">
        <div data-reveal>
          <h2 id="service-difference-heading" className="max-w-[684px] font-heading text-[clamp(1.875rem,1.4rem+1.4vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-navy-800">
            {heading}
          </h2>
          <div className="mt-6 font-heading text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-[1.4] text-grey-550 [&>p+p]:mt-5 [&>p:first-child]:max-w-[935px] [&>p:nth-child(2)]:max-w-[1301px]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {ctaLabel && ctaHref && (
            <Link href={ctaHref} className="mt-[34px] inline-flex h-14 items-center rounded-[9px] border border-blue-600 bg-white/95 px-[27px] font-ui text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] font-medium text-blue-600 transition-colors duration-(--duration-fast) hover:bg-blue-600 hover:text-white">
              {ctaLabel}
            </Link>
          )}
        </div>
        {stats.length > 0 && (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-[54px] lg:grid-cols-4 lg:gap-[27px]" role="list">
            {stats.map((s, i) => (
              <li key={s.label} className="flex min-h-[311px] flex-col items-center rounded-[20px] bg-white px-4 pt-[29px] pb-8 text-center" data-reveal>
                <Img src={s.image ?? GEARS[i % GEARS.length]} alt="" width={174} height={116} sizes="174px" className="h-[116px] w-[174px] object-contain" aria-hidden="true" />
                <p className="mt-11 font-ui text-[3.5rem] font-bold leading-none tracking-[-0.01em] text-navy-800">
                  {s.value}
                  {s.draft && <span className="ml-2 align-middle rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
                </p>
                <p className="mt-[22px] font-body text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-[1.27] text-navy-850/80">{s.label}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
