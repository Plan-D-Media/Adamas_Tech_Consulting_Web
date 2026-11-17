import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/media/Img";

export interface SolutionCardProps {
  slug: string;
  kind: string;
  name: string;
  namePending: boolean;
  tagline: string | null;
  taglinePending: boolean;
  /** The product's own website. null only in the drafts preview, where the URL is still missing. */
  href: string | null;
  image: { url: string; alt: string } | null;
  draft: boolean;
  modules: { name: string; href: string | null }[];
}

/**
 * One Products & Solutions card (Figma Frame 12457, 424x523). A server component on purpose (LCP work, 17 Nov 2026):
 * the card is a picture, a title and some links with no interactive state of its own, so it is rendered on the
 * server and handed to the slider as children. That keeps its markup out of the client bundle and its elements out
 * of the hydration pass; only the slider's own controls are hydrated.
 *
 * Every solution lives on its own website (scope change, 17 Nov 2026), so the title and the module chips are plain
 * anchors opening in a new tab with rel="noopener noreferrer" and an external-link icon, and the call to action
 * reads "Visit site". A card whose URL has not been supplied yet appears only in the drafts preview, with a
 * "Link to be confirmed" note instead of a link.
 */
export function SolutionCard({ s }: { s: SolutionCardProps }) {
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;
  return (
    <article className="relative flex h-[523px] w-[min(424px,85vw)] shrink-0 snap-start flex-col overflow-hidden rounded-lg bg-navy-900 text-white" data-reveal>
      {s.image && <Img src={s.image.url} alt={s.image.alt} fill sizes="(min-width: 1024px) 424px, 85vw" className="object-cover" />}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0)_0%,rgb(0_0_0/0.25)_45%,rgb(0_0_0/0.92)_100%)]" aria-hidden="true" />
      <div className="relative p-5">
        <span className="inline-flex items-center rounded-pill bg-navy-900/55 px-3 py-1 font-body text-[0.75rem] font-semibold text-white ring-1 ring-white/20 backdrop-blur">
          {s.kind}
        </span>
        {s.draft && <span className="ml-2 rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
      </div>
      <div className="relative mt-auto px-7 pb-7">
        <h3 className="font-ui text-[2rem] font-bold leading-[1.16] tracking-[-0.015em]">
          {s.href ? (
            <a href={s.href} {...external} className="after:absolute after:inset-0 after:content-['']">
              {s.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            s.name
          )}
        </h3>
        {s.namePending && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-2.5 py-1 font-body text-[0.75rem] font-semibold leading-none text-sky-200 ring-1 ring-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-200" aria-hidden="true" />
            Name to be confirmed
          </p>
        )}
        {s.tagline && <p className="mt-3 font-ui text-[1.0625rem] leading-[1.65] text-grey-300">{s.tagline}</p>}
        {s.taglinePending && <p className="mt-3 font-ui text-[0.875rem] italic leading-[1.5] text-grey-300/80">Details to be confirmed</p>}
        {s.modules.length > 0 && (
          <ul className="relative z-10 mt-3 flex flex-wrap gap-[7px]" role="list">
            {s.modules.map((m) => (
              <li key={m.name}>
                {m.href ? (
                  <a href={m.href} {...external} className="inline-flex items-center gap-1 rounded-pill border border-white/40 bg-white/10 px-3 py-1.5 font-body text-[0.875rem] font-semibold text-white hover:bg-white/20">
                    {m.name}
                    <Icon name="external" size={10} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-pill border border-white/25 bg-white/5 px-3 py-1.5 font-body text-[0.875rem] font-semibold text-white/70">{m.name}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {s.href ? (
          <p className="mt-6 inline-flex items-center gap-2 font-body text-[0.9375rem] font-semibold text-sky-400">
            Visit site
            <Icon name="external" size={12} />
          </p>
        ) : (
          <p className="mt-6 inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-2.5 py-1 font-body text-[0.75rem] font-semibold leading-none text-sky-200 ring-1 ring-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-200" aria-hidden="true" />
            Link to be confirmed
          </p>
        )}
      </div>
    </article>
  );
}
