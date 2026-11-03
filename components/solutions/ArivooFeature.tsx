import Link from "next/link";
import type { SolutionListItem } from "@/lib/data/solutions";
import { copy, optionalCopy } from "@/lib/placeholder";
import { Img } from "@/components/media/Img";
import { CardArt } from "@/components/media/CardArt";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { DraftBadge, TbcTag } from "@/components/ui/SectionHeader";
import { kindLabel, solutionGlyph } from "./SolutionTile";

/**
 * Featured product with modules (Arivoo): a mosaic of the module screens beside the product, its line and
 * one row per module. Modules link out to the product site in a new tab; the product link follows the DB
 * (its page, or the product site when `externalUrl` is set).
 */
export function ArivooFeature({ s }: { s: SolutionListItem }) {
  const name = copy(s.name);
  const tagline = optionalCopy(s.tagline);
  const summary = optionalCopy(s.summary);
  const shots = s.modules.filter((m) => m.image).slice(0, 3);

  return (
    <article className="grid-12 items-center gap-y-10">
      <div className="col-span-4 md:col-span-8 lg:col-span-7" data-reveal>
        <div className="relative grid aspect-[5/4] grid-cols-5 grid-rows-2 gap-3 sm:aspect-[16/11] md:gap-4">
          {shots.length >= 3 ? (
            shots.map((m, i) => (
              <div
                key={m.slug}
                className={
                  i === 0
                    ? "card-media relative col-span-3 row-span-2 overflow-hidden rounded-card bg-navy-900"
                    : "card-media relative col-span-2 overflow-hidden rounded-card bg-navy-900"
                }
              >
                <Img media={m.image} sizes="(min-width: 1024px) 460px, 60vw" className="object-[50%_25%]" alt="" />
                <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-950 md:bottom-4 md:left-4">{plainName(m.name)}</span>
              </div>
            ))
          ) : (
            <div className="relative col-span-5 row-span-2 overflow-hidden rounded-card">
              <CardArt icon={solutionGlyph(s)} variant={1} />
            </div>
          )}
        </div>
      </div>

      <div className="col-span-4 md:col-span-8 lg:col-span-5" data-reveal>
        <p className="flex items-center gap-3 text-small font-semibold text-brand-600">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-50">
            <Icon name={solutionGlyph(s)} size={18} />
          </span>
          {kindLabel[s.kind]}
          {s.draft && <DraftBadge />}
        </p>
        <h3 className="mt-5 text-h2 text-navy-950">{name.text}</h3>
        {name.pending && <TbcTag className="mt-3" />}
        {tagline && <p className="mt-4 text-lead font-semibold text-navy-950">{tagline.text}</p>}
        {summary && !summary.pending && <p className="mt-3 text-grey-700">{summary.text}</p>}

        {s.modules.length > 0 && (
          <ul className="mt-8 divide-y divide-grey-200 border-y border-grey-200">
            {s.modules.map((m) => {
              const line = optionalCopy(m.tagline);
              const inner = (
                <>
                  <span>
                    <span className="block font-semibold text-navy-950 transition-colors duration-(--duration-base) group-hover:text-brand-600">{plainName(m.name)}</span>
                    {line && <span className="mt-0.5 block text-small text-grey-600">{line.text}</span>}
                  </span>
                  <Icon
                    name={m.external ? "arrowUpRight" : "arrowRight"}
                    size={18}
                    className="mt-1 shrink-0 text-brand-600 transition-transform duration-(--duration-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </>
              );
              return (
                <li key={m.slug}>
                  {m.external ? (
                    <a href={m.href} target="_blank" rel="noopener" className="group flex items-start justify-between gap-6 py-4">
                      {inner}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link href={m.href} className="group flex items-start justify-between gap-6 py-4">
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <ArrowLink href={s.href} external={s.external} className="mt-8">
          {s.external ? `Visit ${name.text}` : `Explore ${name.text}`}
        </ArrowLink>
      </div>
    </article>
  );
}

function plainName(n: string) {
  return copy(n).text;
}
