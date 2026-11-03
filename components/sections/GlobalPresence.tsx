import Image from "next/image";
import type { Block, OfficeInfo } from "@/lib/data/site";
import { cx } from "@/lib/cx";
import { mediaUrl } from "@/lib/media";
import { WORLD_MAP, projectToPercent } from "@/lib/geo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";

/**
 * Stylised dotted world map with office pins; the current region's featured office pulses
 * and its card is listed first and highlighted.
 */
export function GlobalPresence({ block, offices, featuredSlug }: { block: Block; offices: OfficeInfo[]; featuredSlug: string | null }) {
  if (!offices.length) return null;
  const ordered = [...offices].sort((a, b) => Number(b.slug === featuredSlug) - Number(a.slug === featuredSlug));

  return (
    <section aria-labelledby="presence-heading" className="section-y tone-mist relative overflow-hidden">
      <div className="container-site">
        <SectionHeader id="presence-heading" eyebrow={block.eyebrow} heading={block.heading ?? "Global presence"} intro={block.body} />

        <div className="relative mt-12 md:mt-16" data-reveal>
          <div className="relative mx-auto aspect-[118/56] w-full max-w-6xl">
            <Image src={mediaUrl(WORLD_MAP.lightSrc)} alt="" fill unoptimized sizes="100vw" className="select-none object-contain" />
            {offices.map((o) => {
              if (o.lat == null || o.lng == null) return null;
              const { left, top } = projectToPercent(o.lat, o.lng);
              const featured = o.slug === featuredSlug;
              return (
                <span key={o.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
                  {featured && (
                    <span aria-hidden="true" className="absolute inset-0 m-auto size-3 rounded-full bg-orange-500 motion-safe:animate-[pulse-ring_2.2s_var(--ease-out-expo)_infinite]" />
                  )}
                  <span
                    aria-hidden="true"
                    className={cx("relative block rounded-full ring-4", featured ? "size-3 bg-orange-500 ring-orange-500/25" : "size-2.5 bg-brand-600 ring-brand-600/15")}
                  />
                  <span
                    className={cx(
                      "absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-btn px-2 py-1 text-xs font-semibold sm:block",
                      featured ? "bg-orange-500 text-navy-950" : "bg-white text-navy-950 shadow-card ring-1 ring-grey-200",
                    )}
                  >
                    {o.label}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ordered.map((o) => {
            const featured = o.slug === featuredSlug;
            return (
              <li
                key={o.slug}
                data-reveal
                className={cx("card-lift rounded-card p-6 ring-1", featured ? "bg-navy-950 text-white ring-navy-950" : "bg-white text-navy-950 ring-grey-200")}
              >
                <p className={cx("eyebrow", featured ? "text-sky-300" : "text-brand-600")}>{featured ? "Your nearest office" : o.country}</p>
                <h3 className="mt-3 text-h4">{o.label}</h3>
                <address className={cx("mt-3 text-sm not-italic leading-relaxed", featured ? "text-on-navy-muted" : "text-grey-700")}>
                  {o.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                {o.phone && (
                  <a
                    href={o.phoneHref ?? `tel:${o.phone.replace(/[^+\d]/g, "")}`}
                    className={cx("mt-4 inline-flex items-center gap-2 text-sm font-semibold", featured ? "text-white hover:text-sky-300" : "text-brand-600 hover:text-brand-700")}
                  >
                    <Icon name="phone" size={16} />
                    {o.phone}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
