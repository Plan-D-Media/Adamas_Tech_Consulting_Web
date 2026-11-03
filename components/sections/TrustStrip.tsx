import type { LogoData, StatData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { LogoMarquee } from "@/components/motion/LogoMarquee";
import { StatCounter } from "@/components/motion/StatCounter";

/**
 * Partners + certifications marquee and the verified stats row.
 * Unverified stats never reach this component (filtered in lib/data/home).
 */
export function TrustStrip({ block, logos, stats }: { block: Block; logos: LogoData[]; stats: StatData[] }) {
  const trustLogos = logos.filter((l) => l.kind !== "CLIENT");
  const shown = trustLogos.length ? trustLogos : logos;
  if (!shown.length && !stats.length) return null;

  return (
    <section aria-labelledby="trust-heading" className="tone-white pb-14 pt-16 md:pb-20 md:pt-24">
      <div className="container-site">
        <div className="grid-12 items-end gap-y-4">
          <div className="col-span-4 md:col-span-7" data-reveal>
            {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
            <h2 id="trust-heading" className="mt-4 text-h3 text-navy-950">
              {block.heading ?? "Partners & certifications"}
            </h2>
          </div>
          {block.body && (
            <p className="col-span-4 text-grey-700 md:col-span-5 md:text-right" data-reveal>
              {block.body}
            </p>
          )}
        </div>
        <div className="mt-16">
          <LogoMarquee logos={shown} label="Partners and certifications" />
        </div>
        {stats.length > 0 && (
          <dl className="mt-12 grid grid-cols-2 gap-y-8 border-t border-grey-100 pt-10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.key} className="flex flex-col-reverse border-l border-grey-200 pl-5" data-reveal>
                <dt className="mt-2 text-small text-grey-600">{s.label}</dt>
                <dd className="font-display-wide text-h2 font-bold text-navy-950">
                  <StatCounter stat={s} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
