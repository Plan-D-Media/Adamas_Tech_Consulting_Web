import type { Block } from "@/lib/data/site";
import { blockExtra } from "@/lib/data/home-blocks";
import { plain } from "@/lib/placeholder";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Img } from "@/components/media/Img";

/**
 * Why Organisations Choose Adamas (Figma SectionTitle 236:2883 + the infographic 236:2418). Figma holds the diagram
 * as a flat raster; it is rebuilt here: a 1582x838 canvas with the glowing centre sphere, two rings, six connector
 * lines and six cards placed where the raster puts them. The outer ring pulses gently (none with reduced motion).
 * Below 1024px the cards form a two-column grid under the centre.
 */
const POSITIONS = [
  { left: 13.8, top: 4.2, width: 24.1 },
  { left: 63.0, top: 4.8, width: 23.6 },
  { left: 7.8, top: 34.4, width: 23.4 },
  { left: 69.3, top: 34.4, width: 23.4 },
  { left: 17.8, top: 65.0, width: 23.8 },
  { left: 60.8, top: 65.6, width: 26.2 },
];
// Connector end points on the canvas (percent), matching the dots in the raster.
const DOTS = [
  [38.9, 23.5],
  [60.6, 23.5],
  [31.9, 41.0],
  [68.9, 41.0],
  [36.4, 62.0],
  [63.5, 62.0],
] as const;

export function Difference({ block }: { block: Block }) {
  const { centre, items } = blockExtra(block, "difference");
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="difference-heading" data-compare="difference" className="bg-white pb-10 pt-16 lg:pb-0 lg:pt-[75px]">
      <div className="container-site">
        <SectionHeader id="difference-heading" eyebrow={plain(block.eyebrow)} heading={plain(block.heading)} align="center" innerClassName="max-w-[45rem]" eyebrowClassName="lg:h-[20px]" />
      </div>
      <div className="relative mx-auto mt-10 w-full max-w-[1582px] lg:mt-3 lg:aspect-[1582/838]" data-reveal>
        {/* Rings and connectors (desktop) */}
        <svg viewBox="0 0 1582 838" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden="true">
          <circle cx="793" cy="348" r="300" fill="none" stroke="#D5E0EB" strokeWidth="1" className="difference-ring" />
          <circle cx="793" cy="348" r="228" fill="none" stroke="#D5E0EB" strokeWidth="1" />
          {DOTS.map(([x, y], i) => {
            const px = (x / 100) * 1582;
            const py = (y / 100) * 838;
            const dx = px - 793;
            const dy = py - 348;
            const len = Math.hypot(dx, dy);
            const sx = 793 + (dx / len) * 176;
            const sy = 348 + (dy / len) * 176;
            return (
              <g key={i}>
                <line x1={sx} y1={sy} x2={px} y2={py} stroke="#C7D7E9" strokeWidth="1.5" />
                <circle cx={px} cy={py} r="5" fill="#1167D8" />
                <circle cx={sx} cy={sy} r="4" fill="#4FB6E2" />
              </g>
            );
          })}
        </svg>

        {/* Centre */}
        <div className="relative mx-auto aspect-square w-[300px] lg:absolute lg:left-[39.1%] lg:top-[20.5%] lg:w-[22.3%]">
          <div className="difference-pulse absolute inset-0 rounded-full bg-[radial-gradient(circle,#1167D8_0%,#328BFF_100%)] shadow-[0_0_80px_rgb(17_103_216/0.35)]" aria-hidden="true" />
          <Img src="images/home/difference-centre.webp" alt="" fill sizes="353px" className="rounded-full object-cover opacity-30" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-start gap-[17px] px-6 pt-[13%]">
            <Img src="images/home/difference-network.webp" alt="" width={193} height={193} sizes="193px" className="h-auto w-[55%]" aria-hidden="true" />
            <p className="text-center font-heading text-[clamp(1rem,0.8rem+0.4vw,1.25rem)] font-semibold leading-[1.22] text-white">{centre}</p>
          </div>
        </div>

        {/* Cards */}
        <ul className="mt-8 grid gap-4 px-[var(--gutter)] sm:grid-cols-2 lg:contents" role="list">
          {items.map((it, i) => {
            const pos = POSITIONS[i % POSITIONS.length];
            return (
              <li key={it.title} className="lg:absolute lg:left-(--l) lg:top-(--t) lg:w-(--w)" style={{ "--l": `${pos.left}%`, "--t": `${pos.top}%`, "--w": `${pos.width}%` } as React.CSSProperties}>
                <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-[0_12px_30px_-2px_rgb(0_0_0/0.06)] ring-1 ring-grey-200/70">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-tint-100 text-blue-600">
                    <Icon name={it.icon as IconName} size={26} />
                  </span>
                  <div>
                    <h3 className="font-heading text-[1rem] font-bold leading-[1.25] text-navy-800">{it.title}</h3>
                    <p className="mt-1.5 font-heading text-[0.8125rem] leading-[1.45] text-grey-600">{it.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
