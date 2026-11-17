import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  steps: { title: string; body: string | null }[];
}

/**
 * "Our Hiring Process!" (Figma 274:2667, band y 1402-2093): a centred header over the numbered stages the design
 * draws as a connected row (Send your CV, Initial Screening, Job Interview, Test Task, You're Hired!).
 *
 * The connector is a rule behind the numbers at 1024px and above; below that the stages stack and the rule is
 * dropped, which keeps the numbers legible at 360px without shrinking them (docs/design-notes.md).
 */
export function CareersProcess({ eyebrow, heading, body, steps }: Props) {
  if (steps.length === 0) return null;
  return (
    <section data-compare="careers-process" aria-labelledby="careers-process-heading" className="bg-tint-50 py-14 lg:py-[88px]">
      <div className="container-site">
        <div className="mx-auto max-w-[820px] text-center" data-reveal>
          {eyebrow && <Eyebrow className="!text-[1.25rem] !tracking-normal">{eyebrow}</Eyebrow>}
          {heading && <Heading2 id="careers-process-heading" className="mt-3">{heading}</Heading2>}
          {body && <p className="mt-4 font-body text-[1.125rem] leading-[1.6] text-grey-600">{body}</p>}
        </div>
        <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:mt-[72px] lg:grid-cols-5 lg:gap-5" role="list">
          <span className="pointer-events-none absolute left-[10%] right-[10%] top-[26px] hidden h-px bg-grey-200 lg:block" aria-hidden="true" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative text-center" data-reveal>
              <span className="relative z-10 mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-blue-600 font-heading text-[1.25rem] font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 font-heading text-[1.25rem] font-bold leading-[1.25] text-navy-850">{s.title}</h3>
              {s.body && <p className="mt-2 font-body text-[1rem] leading-[1.6] text-grey-600">{s.body}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
