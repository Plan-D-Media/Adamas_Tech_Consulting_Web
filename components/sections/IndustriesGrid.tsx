import type { IndustryData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { cx } from "@/lib/cx";
import { Img } from "@/components/media/Img";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Industry tiles (no industry pages this phase). Hover/focus-within reveals the panel copy on pointer devices;
 * touch devices show it permanently. Layout: 4 + 3 editorial grid.
 */
export function IndustriesGrid({ block, industries }: { block: Block; industries: IndustryData[] }) {
  if (!industries.length) return null;
  return (
    <section aria-labelledby="industries-heading" className="section-y tone-white">
      <div className="container-site">
        <SectionHeader id="industries-heading" eyebrow={block.eyebrow} heading={block.heading ?? "Industries"} intro={block.body} />
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-12 lg:gap-5">
          {industries.map((ind, i) => (
            <li
              key={ind.slug}
              data-reveal
              className={cx(
                "group card-lift relative isolate h-64 overflow-hidden rounded-card bg-navy-900 text-white sm:h-80 md:h-[26rem]",
                i < 4 ? "lg:col-span-3" : "lg:col-span-4",
              )}
            >
              <Img
                media={ind.image}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="-z-10 transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-[1.06]"
              />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950 via-navy-950/55 to-navy-950/5 transition-opacity duration-500 group-hover:opacity-95" />
              <div className="flex h-full flex-col justify-end p-6 md:p-7">
                <h3 className="text-h3">{ind.tabLabel}</h3>
                {/* Revealed on hover/focus for fine pointers; always visible on touch */}
                <div className="grid transition-[grid-template-rows,opacity] duration-500 ease-(--ease-out-expo) [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:grid-rows-[1fr] [@media(hover:hover)]:group-focus-within:opacity-100">
                  <div className="overflow-hidden">
                    <p className="mt-3 font-semibold leading-snug">{ind.title}</p>
                    <p className="mt-2 line-clamp-4 text-small text-on-navy-muted">{ind.body}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
