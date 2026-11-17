import { Icon, type IconName } from "@/components/ui/Icon";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  items: { title: string; body: string | null }[];
}

/**
 * "Our Expertise" (Figma 274:1617, band y 4774-5469): a centred header over a row of cards, each with a tick, a
 * title and a line of copy. Fed from the Page row's `whyUs` block, so the card count follows the content (the
 * design draws three; the client's copy currently carries six, which wrap onto two rows).
 */
export function AboutExpertise({ eyebrow, heading, body, items }: Props) {
  if (items.length === 0) return null;
  return (
    <section data-compare="about-expertise" aria-labelledby="about-expertise-heading" className="bg-tint-50 py-14 lg:py-[96px]">
      <div className="container-site">
        <div className="mx-auto max-w-[760px] text-center" data-reveal>
          {eyebrow && <Eyebrow className="!text-[1.25rem] !tracking-normal">{eyebrow}</Eyebrow>}
          {heading && <Heading2 id="about-expertise-heading" className="mt-3">{heading}</Heading2>}
          {body && <p className="mt-4 font-body text-[1.125rem] leading-[1.6] text-grey-600">{body}</p>}
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-[58px] lg:grid-cols-3" role="list">
          {items.map((it, i) => (
            <li key={it.title} className="rounded-lg bg-white p-[30px] ring-1 ring-grey-200" data-reveal>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600/10 text-blue-600" aria-hidden="true">
                <Icon name={`difference-${(i % 6) + 1}` as IconName} size={22} />
              </span>
              <h3 className="mt-5 font-heading text-[1.3125rem] font-bold leading-[1.2] text-navy-850">{it.title}</h3>
              {it.body && <p className="mt-3 font-body text-[1rem] leading-[1.6] text-grey-600">{it.body}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
