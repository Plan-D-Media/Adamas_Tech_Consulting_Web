import { Icon, type IconName } from "@/components/ui/Icon";
import type { SubCard } from "@/lib/sub-service-content";

/**
 * The "What we manage" band of the Cloud sub-service template (`Managed Services.svg`, y 2031-2947): six cards
 * in two columns joined by curved connectors to a circular hub in the middle.
 *
 * The connectors are one decorative SVG behind the grid, drawn on the design's own 1200x480 geometry and scaled
 * with `preserveAspectRatio="none"`, so no absolute positioning has to track the card heights. Below `lg` the
 * grid collapses to one column and the SVG and hub are hidden: the design has no small-screen frame, and a
 * diagram whose connectors point nowhere is worse than a plain list.
 *
 * The first card carries the design's blue outline. The icon per row is chosen from the card's position, which is
 * what the design does - the artwork is per-slot, not per-service.
 */

const ICONS: IconName[] = ["layers", "chart", "shield", "check", "difference-5", "difference-3"];

/** The design's three connector rows, on the 1200x480 geometry the SVG is drawn on. */
const ROW_Y = [100, 240, 380];
const LEFT_PATHS = [
  "M421 100 C 520 100 520 240 600 240",
  "M421 240 L 600 240",
  "M421 380 C 520 380 520 240 600 240",
];
const RIGHT_PATHS = [
  "M779 100 C 680 100 680 240 600 240",
  "M779 240 L 600 240",
  "M779 380 C 680 380 680 240 600 240",
];

export function CloudHub({
  eyebrow,
  heading,
  hubLabel,
  items,
}: {
  eyebrow: string;
  heading: string;
  hubLabel: string;
  items: readonly SubCard[];
}) {
  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);

  return (
    <section data-compare="sub-manage" aria-labelledby="sub-manage-heading" className="bg-[#F3F7FE] py-12 lg:py-[80px]">
      <div className="container-cloud">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{eyebrow}</p>
        <h2 id="sub-manage-heading" className="u-display mt-2 text-[clamp(1.5rem,1.1rem+1.4vw,2.125rem)] font-semibold text-[#0B1B33]">
          {heading}
        </h2>

        <div className="relative mt-8 lg:mt-[44px]">
          <svg
            viewBox="0 0 1200 480"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          >
            {/* One connector per card, so a service with five delivery areas does not leave a line pointing at
                empty space. The y positions are the design's three rows, per side. */}
            <g fill="none" stroke="#9FC2F5" strokeWidth="1.5">
              {left.map((item, i) => (
                <path key={item.title} d={LEFT_PATHS[i]} />
              ))}
              {right.map((item, i) => (
                <path key={item.title} d={RIGHT_PATHS[i]} />
              ))}
            </g>
            <g fill="#2E7BE4">
              {left.map((item, i) => (
                <circle key={item.title} cx="421" cy={ROW_Y[i]} r="5" />
              ))}
              {right.map((item, i) => (
                <circle key={item.title} cx="779" cy={ROW_Y[i]} r="5" />
              ))}
            </g>
          </svg>

          <div className="relative grid gap-5 lg:grid-cols-[1fr_300px_1fr] lg:items-center lg:gap-x-8">
            <ul className="grid gap-5" role="list">
              {left.map((item, i) => (
                <HubCard key={item.title} item={item} icon={ICONS[i * 2]} highlight={i === 0} />
              ))}
            </ul>

            <div className="hidden justify-center lg:flex" aria-hidden="true">
              <span className="flex h-[230px] w-[230px] items-center justify-center rounded-full border-2 border-dotted border-[#9FC2F5] p-4">
                <span className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#2F7FE8_0%,#1356C4_100%)] px-6 text-center text-white">
                  <Icon name="layers" size={30} />
                  <span className="u-display text-[1.25rem] font-bold leading-[1.2]">{hubLabel}</span>
                </span>
              </span>
            </div>

            <ul className="grid gap-5" role="list">
              {right.map((item, i) => (
                <HubCard key={item.title} item={item} icon={ICONS[i * 2 + 1]} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function HubCard({ item, icon, highlight = false }: { item: SubCard; icon: IconName; highlight?: boolean }) {
  return (
    <li
      className={`flex items-start gap-4 rounded-xl bg-white p-5 ${highlight ? "border-2 border-blue-500" : "border border-[#E3EBF8]"}`}
      data-reveal
    >
      <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-xl bg-[#E8F1FF] text-blue-600" aria-hidden="true">
        <Icon name={icon} size={26} />
      </span>
      <div className="min-w-0">
        <h3 className="u-display text-[1.0625rem] font-bold leading-[1.3] text-[#0B1B33]">{item.title}</h3>
        {item.body && <p className="mt-2 text-[0.875rem] leading-[1.6] text-[#55617A]">{item.body}</p>}
      </div>
    </li>
  );
}
