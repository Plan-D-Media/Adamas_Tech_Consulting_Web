import type { MilestoneData } from "@/lib/data/pages";
import { plain } from "@/lib/placeholder";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  milestones: MilestoneData[];
}

/**
 * "Our Journey" (Figma 274:1617, band y 5580-6330): the header on the left, the years along a rule beneath it.
 * Fed from the Milestone table, which is why the design's 2020-2029 strip is not hard-coded; a milestone whose year
 * the client has not confirmed shows as "Milestone 0N" (lib/data/pages.ts), and with no visible milestone the
 * section is left out entirely.
 */
export function AboutJourney({ eyebrow, heading, body, milestones }: Props) {
  if (milestones.length === 0) return null;
  return (
    <section data-compare="about-journey" aria-labelledby="about-journey-heading" className="bg-white py-14 lg:py-[96px]">
      <div className="container-site">
        <div className="max-w-[760px]" data-reveal>
          {eyebrow && <Eyebrow className="!text-[1.25rem] !tracking-normal">{eyebrow}</Eyebrow>}
          {heading && <Heading2 id="about-journey-heading" className="mt-3">{heading}</Heading2>}
          {body && <p className="mt-4 font-body text-[1.125rem] leading-[1.6] text-grey-600">{body}</p>}
        </div>
        <ol className="mt-10 grid gap-6 border-t border-grey-200 pt-8 sm:grid-cols-2 lg:mt-[56px] lg:grid-cols-3" role="list">
          {milestones.map((m, i) => (
            <li key={m.id} className="relative pl-6" data-reveal>
              <span className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden="true" />
              <p className="font-heading text-[1.75rem] font-bold leading-[1.1] text-navy-850">{m.year ?? `Milestone ${String(i + 1).padStart(2, "0")}`}</p>
              <p className="mt-2 font-heading text-[1.0625rem] font-semibold leading-[1.35] text-navy-800">{plain(m.title)}</p>
              {m.description && <p className="mt-2 font-body text-[1rem] leading-[1.6] text-grey-600">{plain(m.description)}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
