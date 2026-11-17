import { cx } from "@/lib/cx";
import { Img } from "@/components/media/Img";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  steps: { title: string; body: string | null }[];
}

/**
 * "Our Approach" (Figma 274:1617, band y 1192-1824): a dark contour-map band carrying the header and a large step
 * count, with the numbered step cards overlapping its lower edge.
 *
 * The step list is the Page row's `model.steps`, so the count in the corner follows the data rather than the
 * design's fixed "04". Cards sit in a horizontal scroller below 1024px, which keeps four cards readable at 360px
 * without shrinking the type (docs/design-notes.md).
 */
export function AboutApproach({ eyebrow, heading, body, steps }: Props) {
  if (steps.length === 0) return null;
  return (
    <section data-compare="about-approach" aria-labelledby="about-approach-heading" className="relative bg-white pb-14 lg:pb-[96px]">
      <div className="relative isolate overflow-hidden bg-navy-950 pb-[170px] pt-12 lg:pb-[230px] lg:pt-[100px]">
        <Img src="images/about/approach-bg.webp" alt="" width={1920} height={490} sizes="100vw" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        {/* The contour artwork is busy enough to drop the eyebrow and the intro below AA on their own, so the
            band carries a navy wash over it (docs/design-notes.md: the design relies on the raw image). */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(4_18_45/0.86)_0%,rgb(4_18_45/0.72)_60%,rgb(4_18_45/0.9)_100%)]" aria-hidden="true" />
        <div className="container-site flex flex-col gap-6 text-white lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[620px]" data-reveal>
            {eyebrow && <p className="eyebrow !text-[1.25rem] !text-sky-300">{eyebrow}</p>}
            {heading && (
              <h2 id="about-approach-heading" className="mt-3 font-heading text-[clamp(1.75rem,1.2rem+1.9vw,2.625rem)] font-bold leading-[1.16] tracking-[-0.02em]">
                {heading}
              </h2>
            )}
            {body && <p className="mt-4 max-w-[560px] font-body text-[1.125rem] leading-[1.6] text-white/75">{body}</p>}
          </div>
          <p className="flex items-end gap-3 font-heading leading-none text-white/25" aria-hidden="true">
            <span className="text-[clamp(4rem,2rem+8vw,8.6875rem)] font-bold">{String(steps.length).padStart(2, "0")}</span>
            <span className="pb-3 text-[1.8125rem] font-bold text-white/70">Steps</span>
          </p>
        </div>
      </div>
      <div className="container-site -mt-[130px] lg:-mt-[170px]">
        <ol className={cx("grid gap-5 sm:grid-cols-2", steps.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3")} role="list">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-lg bg-white px-[26px] pb-[30px] pt-[34px] shadow-lift ring-1 ring-grey-200" data-reveal>
              <span className="absolute -top-5 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-heading text-[1.125rem] font-bold text-white">
                {i + 1}
              </span>
              <h3 className="font-heading text-[1.3125rem] font-bold leading-[1.2] text-navy-850">{s.title}</h3>
              {s.body && <p className="mt-3 font-body text-[1rem] leading-[1.6] text-grey-600">{s.body}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
