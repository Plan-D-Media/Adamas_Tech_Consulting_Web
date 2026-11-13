import Link from "next/link";
import type { Block } from "@/lib/data/site";
import { blockExtra } from "@/lib/data/home-blocks";
import { plain } from "@/lib/placeholder";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Latest Perspectives & Updates (Figma SectionTitle 236:2508 + Container 236:2474): white band with the outline word
 * "NEXT" top-right, a 714x571 feature card and a right column of a small image card and a blue card. Items are seeded
 * editorial copy from the design (publication dates pending).
 */
export function Perspectives({ block }: { block: Block }) {
  const { items } = blockExtra(block, "perspectives");
  if (items.length === 0) return null;
  const feature = items.find((i) => i.variant === "feature");
  const side = items.filter((i) => i.variant !== "feature");
  return (
    <section aria-labelledby="perspectives-heading" data-compare="perspectives" className="bg-white pb-16 pt-16 lg:pb-[110px] lg:pt-[150px]">
      <div className="container-site relative">
        <p className="pointer-events-none absolute right-[var(--gutter)] top-[-74px] hidden select-none font-heading text-[9.375rem] font-extrabold leading-none tracking-[-0.08em] text-blue-700/[0.04] lg:block" aria-hidden="true">
          NEXT
        </p>
        <SectionHeader id="perspectives-heading" eyebrow={plain(block.eyebrow)} heading={plain(block.heading)} />
        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[1fr_1fr] lg:gap-[25px] xl:grid-cols-[714px_minmax(0,1fr)]">
          {feature && (
            <article className="relative flex min-h-[32rem] flex-col overflow-hidden rounded-2xl bg-tint-25 xl:h-[571px]" data-reveal>
              {feature.image && <img src={feature.image} alt={feature.imageAlt} width={715} height={401} className="h-[401px] w-full object-cover" loading="lazy" decoding="async" />}
              <div className="relative -mt-[60px] flex flex-1 flex-col bg-[linear-gradient(180deg,rgb(255_255_255/0)_0%,rgb(255_255_255/1)_30%)] px-6 pb-6 pt-[86px]">
                <p className="font-heading text-[1rem] font-extrabold uppercase leading-none tracking-[0.07em] text-sky-300">{feature.label}</p>
                <h3 className="mt-3 font-heading text-[1.25rem] font-bold leading-[1.45] text-navy-800">{feature.title}</h3>
                {feature.body && <p className="mt-2 font-heading text-[1rem] leading-[1.1] text-grey-600">{feature.body}</p>}
                <Link href={feature.href} className="mt-3 inline-flex items-center gap-3 font-heading text-[1.125rem] font-bold text-blue-600 hover:text-blue-500">
                  {feature.linkLabel}
                  <Icon name="arrow" size={17} />
                </Link>
              </div>
            </article>
          )}
          <div className="grid gap-4">
            {side.map((it) =>
              it.variant === "small" ? (
                <article key={it.title} className="flex min-h-[270px] overflow-hidden rounded-2xl bg-white ring-1 ring-[#DFE6EE]" data-reveal>
                  {it.image && <img src={it.image} alt={it.imageAlt} width={246} height={268} className="h-auto w-[42%] max-w-[246px] shrink-0 object-cover" loading="lazy" decoding="async" />}
                  <div className="flex flex-1 flex-col px-6 pb-4 pt-[25px] lg:pl-7">
                    <p className="font-heading text-[1rem] font-extrabold uppercase leading-none tracking-[0.07em] text-sky-300">{it.label}</p>
                    <h3 className="mt-[10px] max-w-[256px] font-heading text-[1.125rem] font-bold leading-[1.45] text-navy-800">{it.title}</h3>
                    <Link href={it.href} className="mt-auto inline-flex h-7 w-fit items-center gap-3 rounded-[6px] border border-blue-600 pl-[19px] pr-[22px] font-heading text-[0.75rem] font-bold text-blue-600 hover:bg-blue-600 hover:text-white">
                      {it.linkLabel}
                      <Icon name="arrow" size={17} />
                    </Link>
                  </div>
                </article>
              ) : (
                <article key={it.title} className="relative flex min-h-[285px] flex-col overflow-hidden rounded-2xl bg-blue-600 p-7 text-white ring-1 ring-blue-600" data-reveal>
                  {it.image && <img src={it.image} alt="" width={580} height={285} className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" loading="lazy" decoding="async" />}
                  <div className="relative">
                    <p className="font-heading text-[1rem] font-extrabold uppercase leading-none tracking-[0.07em] text-[#D9EBFF]">{it.label}</p>
                    <h3 className="mt-[17px] max-w-[427px] font-heading text-[1.5rem] font-bold leading-[1.21]">{it.title}</h3>
                    {it.body && <p className="mt-4 max-w-[413px] font-heading text-[1rem] leading-[1.41] text-[#D5E5FA]">{it.body}</p>}
                    <Link href={it.href} className="mt-[21px] inline-flex h-[42px] items-center gap-3 rounded-lg border border-white/40 bg-white/5 px-[19px] font-heading text-[0.75rem] font-bold text-white hover:bg-white/15">
                      {it.linkLabel}
                      <Icon name="arrow" size={17} />
                    </Link>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
