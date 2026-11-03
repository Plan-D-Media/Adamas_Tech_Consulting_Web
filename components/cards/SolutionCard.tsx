import Link from "next/link";
import type { SolutionCardData } from "@/lib/data/home";
import { Img } from "@/components/media/Img";
import { CardArt } from "@/components/media/CardArt";
import { Icon, type IconName } from "@/components/ui/Icon";
import { DraftBadge, TbcTag } from "@/components/ui/SectionHeader";
import { copy } from "@/lib/placeholder";
import { cx } from "@/lib/cx";

const kindLabel: Record<SolutionCardData["kind"], string> = {
  PRODUCT: "Product",
  AI_SOLUTION: "AI solution",
  ARIVOO_MODULE: "Arivoo",
};

function glyphFor(s: SolutionCardData): IconName {
  if (s.slug.startsWith("arivoo")) return "cap";
  if (s.slug === "testguard") return "shield";
  if (s.kind === "PRODUCT") return "spark";
  return "cpu";
}

/**
 * Solution card. Photography when we have it (AI solutions use their case-study image);
 * otherwise branded artwork with the product's glyph. Arivoo lists its modules as chips.
 * `index` varies the artwork so neighbouring cards never look identical.
 */
export function SolutionCard({ s, index = 0 }: { s: SolutionCardData; index?: number }) {
  const Title = s.external ? "a" : Link;
  const titleProps = s.external ? { href: s.href, target: "_blank", rel: "noopener" } : { href: s.href };
  const name = copy(s.name);
  const line = copy(s.tagline ?? s.summary ?? "[Placeholder].");

  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card bg-navy-950 text-white" data-spotlight>
      <div className="card-media relative aspect-[16/10] overflow-hidden">
        <div data-parallax className="absolute inset-y-0 -inset-x-[6%]">
          {s.image ? (
            <Img media={s.image} sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 84vw" />
          ) : (
            <CardArt icon={glyphFor(s)} variant={index} />
          )}
        </div>
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/25 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-navy-950/55 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur-sm">
          {kindLabel[s.kind]}
        </span>
        {s.draft && <DraftBadge className="absolute right-5 top-5" />}
      </div>
      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-1 md:px-7 md:pb-7">
        <h3 className="text-h3 font-bold">
          <Title {...titleProps} className="after:absolute after:inset-0 after:z-[2] after:content-['']">
            {name.text}
            {s.external && <span className="sr-only"> (opens in a new tab)</span>}
          </Title>
        </h3>
        {name.pending && <TbcTag tone="dark" className="mt-3 self-start" />}
        <p className={cx("mt-3 line-clamp-3", line.pending ? "text-small italic text-on-navy-muted/80" : "text-on-navy-muted")}>{line.text}</p>
        {s.children.length > 0 && (
          <ul className="relative z-[3] mt-5 flex flex-wrap gap-2">
            {s.children.map((c) => (
              <li key={c.name}>
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener" : undefined}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/25 px-3.5 text-sm font-semibold transition-colors duration-(--duration-base) hover:border-sky-400 hover:text-sky-300"
                >
                  {c.name}
                  {c.external && <Icon name="arrowUpRight" size={14} />}
                  {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.9375rem] font-semibold text-sky-400">
          {s.external ? "Visit site" : "Explore"}
          <Icon name={s.external ? "arrowUpRight" : "arrowRight"} size={18} className="transition-transform duration-(--duration-base) group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
