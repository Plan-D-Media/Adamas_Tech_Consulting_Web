import Link from "next/link";
import type { ClaimData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { blockExtra } from "@/lib/data/home-blocks";
import { plain } from "@/lib/placeholder";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Client Outcomes (Figma Frame 12460): tint-50 band with the outline word "IMPACT" top-right, header, a 1043x550
 * feature card (dashboard image, gradient from the left, label, title, headline metric, button) and two white cards
 * that overlap its right edge by 141px.
 */
export function Outcomes({ block, claims }: { block: Block; claims: ClaimData[] }) {
  const { feature, cards } = blockExtra(block, "outcomes");
  if (!feature && cards.length === 0) return null;
  const metric = feature?.metricStat ? claims.find((c) => c.key === feature.metricStat) : undefined;
  return (
    <section aria-labelledby="outcomes-heading" data-compare="outcomes" className="relative overflow-hidden bg-tint-50 py-16 lg:pb-[110px] lg:pt-[100px]">
      <div className="container-site relative">
        <p className="pointer-events-none absolute right-[var(--gutter)] top-[-56px] hidden select-none font-heading text-[8.125rem] font-extrabold leading-none tracking-[-0.07em] text-blue-700/[0.03] lg:block" aria-hidden="true">
          IMPACT
        </p>
        <SectionHeader id="outcomes-heading" eyebrow={plain(block.eyebrow)} heading={plain(block.heading)} headingClassName="max-w-[43rem] leading-[1.37]" />

        <div className="mt-8 grid gap-6 lg:mt-[29px] xl:grid-cols-[882px_minmax(0,1fr)] xl:gap-0">
          {feature && (
            <article className="relative min-h-[26rem] overflow-hidden rounded-2xl bg-[#051732] text-white xl:h-[550px] xl:w-[1043px]" data-reveal>
              {feature.image && <img src={feature.image} alt={feature.imageAlt} width={1043} height={550} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(5_25_54/1)_0%,rgb(5_25_54/0.85)_30%,rgb(6_21_46/0)_100%)]" aria-hidden="true" />
              <div className="relative flex h-full max-w-[480px] flex-col p-8 lg:px-[38px] lg:py-[46px]">
                <p className="font-heading text-[0.625rem] font-extrabold uppercase leading-none tracking-[0.11em] text-sky-300">{feature.label}</p>
                <h3 className="mt-[18px] max-w-[405px] font-heading text-[clamp(1.375rem,1.2rem+0.5vw,1.6875rem)] font-bold leading-[1.35]">{feature.title}</h3>
                {metric && (
                  <div className="mt-auto flex items-center gap-3.5 border-t border-white/[0.22] pt-5">
                    <p className="font-heading text-[3.375rem] font-bold leading-none text-[#5BC6F3]">{metric.value}</p>
                    <p className="w-[100px] font-heading text-[0.625rem] leading-[1.5] text-[#C7D2DF]">
                      {metric.label}
                      {metric.draft && <span className="ml-1 rounded-xs bg-orange-500 px-1 py-0.5 text-[0.5rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
                    </p>
                  </div>
                )}
                <Link href={feature.href} className={`${metric ? "mt-6" : "mt-auto"} inline-flex h-[42px] w-fit items-center gap-3 border border-white/40 bg-white/5 px-[19px] font-heading text-[0.75rem] font-bold text-white transition-colors duration-(--duration-fast) hover:bg-white/15`}>
                  {feature.linkLabel}
                  <Icon name="arrow" size={17} />
                </Link>
              </div>
            </article>
          )}
          {cards.length > 0 && (
            <ul className="relative z-10 grid gap-4 md:grid-cols-2 xl:mt-[37px] xl:grid-cols-1 xl:pl-5" role="list">
              {cards.map((c) => (
                <li key={c.href + c.title}>
                  <article className="flex h-full flex-col rounded-[23px] bg-white p-7 shadow-[0_20px_55px_rgb(16_44_75/0.14)] ring-1 ring-[#DFE6EE]" data-reveal>
                    <p className="font-heading text-[0.875rem] font-extrabold uppercase leading-none tracking-[0.08em] text-blue-600">{c.label}</p>
                    <h3 className="mt-[13px] font-heading text-[1.125rem] font-bold leading-[1.37] text-navy-800">{c.title}</h3>
                    {c.body && <p className="mt-2 font-heading text-[1rem] leading-[1.41] text-grey-600">{c.body}</p>}
                    <Link href={c.href} className="mt-auto inline-flex items-center gap-3 pt-4 font-heading text-[0.875rem] font-bold text-blue-600 hover:text-blue-500">
                      {c.linkLabel}
                      <Icon name="arrow" size={17} />
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
