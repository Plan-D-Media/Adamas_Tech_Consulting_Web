import type { MilestoneData } from "@/lib/data/pages";
import { cx } from "@/lib/cx";
import { Img } from "@/components/media/Img";
import { TbcTag } from "@/components/ui/SectionHeader";
import { JourneyPin } from "./JourneyPin";

const pad = (n: number) => String(n).padStart(2, "0");

/** "2019", or "Milestone 03" while the year is still to be confirmed. */
const yearLabel = (m: MilestoneData, i: number) => m.year ?? `Milestone ${pad(i + 1)}`;

/**
 * Year-by-year company journey (/about, "Our Company: Mission & Journey").
 *
 * The server HTML is the complete static timeline, readable without JavaScript and used as-is on mobile, tablet,
 * short screens and with reduced motion: a vertical line with stacked milestones below 1024px, a three-column row
 * of milestones on wider screens. Milestones reveal on scroll through the page's RevealScope.
 * On desktop with motion allowed, JourneyPin pins the block and vertical scroll moves the milestones left to right
 * along a horizontal progress line (same technique as the Solutions and Case Studies rails): the line fills, year
 * markers light up as each milestone becomes active, and clicking a year scrolls to it.
 */
export function Journey({ milestones }: { milestones: MilestoneData[] }) {
  if (milestones.length === 0) return null;
  const n = milestones.length;

  return (
    <JourneyPin count={n}>
      <div className="container-site flex items-end justify-between gap-6">
        <p id="journey-h" className="eyebrow flex items-center gap-3 text-brand-600">
          <span aria-hidden="true" className="h-px w-8 bg-brand-600" />
          Our journey
        </p>
        <p aria-hidden="true" className="journey-count hidden font-display text-sm font-bold tabular-nums text-grey-600">
          <span data-journey-count className="text-navy-950">
            01
          </span>
          <span className="mx-1.5">/</span>
          {pad(n)}
        </p>
      </div>

      {/* Horizontal progress line with year markers: shown only while pinned (desktop, motion allowed). */}
      <div className="journey-progress container-site hidden">
        <div className="relative mx-[0.4375rem] h-14">
          <span aria-hidden="true" className="absolute inset-x-0 top-[0.4375rem] h-0.5 bg-grey-200" />
          <span
            aria-hidden="true"
            data-journey-fill
            className="absolute inset-x-0 top-[0.4375rem] h-0.5 origin-left scale-x-0 bg-brand-600"
          />
          <ol aria-label="Jump to a year">
            {milestones.map((m, i) => (
              <li key={m.id} className="absolute top-0 -translate-x-1/2" style={{ left: `${n > 1 ? (i / (n - 1)) * 100 : 0}%` }}>
                <button
                  type="button"
                  data-journey-marker={i}
                  className="group flex flex-col items-center gap-2 rounded-btn px-1 focus-visible:outline-offset-4"
                >
                  <span className="journey-dot block size-3.5 rounded-full border-2 border-grey-300 bg-white transition-[background-color,border-color,transform] duration-(--duration-base) ease-(--ease-out-expo)" />
                  <span className="journey-mark whitespace-nowrap font-display text-xs font-bold tabular-nums text-grey-600 transition-colors duration-(--duration-base)">
                    {m.year ?? pad(i + 1)}
                  </span>
                  <span className="sr-only">Go to {yearLabel(m, i)}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ol aria-labelledby="journey-h" className="journey-track container-site relative mt-10 grid gap-y-12 md:mt-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
        {/* Vertical line (below 1024px) */}
        <span aria-hidden="true" className="journey-line absolute bottom-3 left-[calc(var(--gutter)+0.4375rem)] top-3 w-0.5 bg-grey-200 lg:hidden" />
        {milestones.map((m, i) => (
          <li
            key={m.id}
            data-journey-item
            className="journey-item relative pl-10 lg:border-t-2 lg:border-grey-200 lg:pl-0 lg:pt-7"
          >
            <span aria-hidden="true" className="absolute left-0 top-[0.9rem] size-3.5 rounded-full border-2 border-brand-600 bg-white lg:hidden" />
            <span aria-hidden="true" className="journey-accent absolute -top-0.5 left-0 hidden h-0.5 w-12 bg-brand-600 lg:block" />
            <div data-reveal>
              <p className="font-display text-display font-bold tabular-nums text-brand-600">{yearLabel(m, i)}</p>
              {!m.year && <TbcTag className="mt-4">Year to be confirmed</TbcTag>}
              {m.image && (
                <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-card bg-grey-50">
                  <Img media={m.image} sizes="(min-width: 1024px) 28rem, 90vw" />
                </div>
              )}
              <h3 className={cx("mt-5 text-h4 font-bold text-navy-950", m.draft && "opacity-80")}>{m.title}</h3>
              {m.description && <p className="mt-2 max-w-[38ch] text-grey-700">{m.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </JourneyPin>
  );
}
