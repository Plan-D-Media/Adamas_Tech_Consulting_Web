import type { LogoData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { StatementReveal } from "@/components/motion/StatementReveal";
import { Img } from "@/components/media/Img";
import { Icon, type IconName } from "@/components/ui/Icon";

/** The four reasons are parallel, not a sequence, so each gets a glyph rather than a number. */
function glyph(title: string): IconName {
  if (/certif|quality/i.test(title)) return "award";
  if (/expert/i.test(title)) return "chart";
  if (/custom/i.test(title)) return "layers";
  return "users";
}

interface Item {
  title: string;
  body?: string;
}

/** Statement section (word-by-word scroll reveal) followed by the four "Tech Excellence" pillars. */
export function WhyUs({ block, certifications }: { block: Block; certifications: LogoData[] }) {
  const items = (Array.isArray(block.extra?.items) ? block.extra.items : []) as Item[];
  if (!block.heading && !items.length) return null;

  return (
    <section aria-labelledby="whyus-heading" className="section-y relative overflow-hidden bg-navy-950 text-white" data-morph>
      <div aria-hidden="true" className="pointer-events-none absolute -left-1/4 bottom-0 h-full w-3/4 bg-[radial-gradient(closest-side,rgb(38_63_118/0.55),transparent)]" />
      <div className="container-site relative">
        {block.eyebrow && <Eyebrow tone="dark">{block.eyebrow}</Eyebrow>}
        {block.heading && <StatementReveal id="whyus-heading" text={block.heading} className="mt-6 max-w-[18ch] text-white md:max-w-[20ch]" />}
        {block.body && <p className="mt-8 max-w-2xl text-lead text-on-navy-muted">{block.body}</p>}

        {items.length > 0 && (
          <ul className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
            {items.map((it) => (
              <li key={it.title} data-reveal className="border-t border-navy-700 pt-6">
                <Icon name={glyph(it.title)} size={28} strokeWidth={1.5} className="text-sky-400" />
                <h3 className="mt-5 text-h4">{it.title}</h3>
                {it.body && <p className="mt-3 text-on-navy-muted">{it.body}</p>}
                {/certified|certification/i.test(it.title) && certifications.length > 0 && (
                  <ul className="mt-5 flex flex-wrap items-center gap-3" aria-label="Certifications">
                    {certifications.map((c) => (
                      <li key={c.name} className="relative flex h-14 w-20 items-center justify-center rounded-btn bg-white p-2">
                        <span className="relative block h-full w-full">
                          <Img media={c.logo} sizes="80px" alt={c.logo?.alt || c.name} className="!object-contain" />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
