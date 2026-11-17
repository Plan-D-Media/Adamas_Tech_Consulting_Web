import Link from "next/link";
import type { PersonData } from "@/lib/data/pages";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  people: PersonData[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
  /** Review-only line shown when the list is empty while drafts are previewed. */
  emptyLabel?: string | null;
  /** Full profiles (/about/team) show the biography; the About page shows name and role only. */
  withBio?: boolean;
  /**
   * /about/team keeps its heading and intro when no profile is visible: it is a published page of its own, and
   * dropping the whole block left it with no <h1> at all. As a section of About us the block still removes itself.
   */
  keepWhenEmpty?: boolean;
  headingLevel?: "h2" | "h1";
}

/**
 * "Our People" (Figma 274:1617, band y 10172-10770), reused as the body of /about/team.
 *
 * The three names in the design (Robert Amplilian, Maggie Strickland, Stephen Mearsley) are the template's stock
 * people and must never be published: the grid is fed from the Person table instead, which is why it is empty in
 * the public build while the client confirms the leadership rows (they are DRAFT). With nothing visible the section
 * leaves itself out rather than drawing an empty grid.
 */
export function AboutPeople({ eyebrow, heading, body, people, ctaLabel, ctaHref, emptyLabel, withBio = false, keepWhenEmpty = false, headingLevel = "h2" }: Props) {
  if (people.length === 0 && !emptyLabel && !keepWhenEmpty) return null;
  const Head = headingLevel;
  return (
    <section data-compare="about-people" aria-labelledby="about-people-heading" className="bg-white py-14 lg:py-[96px]">
      <div className="container-site">
        <div className="max-w-[760px]" data-reveal>
          {eyebrow && <Eyebrow className="!text-[1.25rem] !tracking-normal">{eyebrow}</Eyebrow>}
          {heading &&
            (Head === "h1" ? (
              <h1 id="about-people-heading" className="mt-3 font-heading text-[clamp(1.875rem,1.2rem+1.9vw,2.6875rem)] font-bold leading-[1.14] tracking-[-0.035em] text-navy-800">
                {heading}
              </h1>
            ) : (
              <Heading2 id="about-people-heading" className="mt-3">
                {heading}
              </Heading2>
            ))}
          {body && <p className="mt-4 font-body text-[1.125rem] leading-[1.6] text-grey-600">{body}</p>}
        </div>

        {people.length > 0 ? (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-[52px] lg:grid-cols-3" role="list">
            {people.map((p) => (
              <li key={p.slug} className="overflow-hidden rounded-lg bg-tint-25 ring-1 ring-grey-200" data-reveal>
                <div className="relative aspect-[276/220] w-full overflow-hidden bg-grey-50">
                  {p.photo ? (
                    <Img src={p.photo} alt={p.photo.alt || p.name} fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-grey-400" aria-hidden="true">
                      <Icon name="user" size={28} />
                    </span>
                  )}
                </div>
                <div className="px-6 py-5">
                  <p className="font-heading text-[1.375rem] font-semibold leading-[1.25] text-navy-850">
                    {p.name}
                    {p.draft && <span className="ml-2 align-middle rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.6875rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
                  </p>
                  <p className="mt-1 font-body text-[0.875rem] font-medium text-grey-600">{p.role}</p>
                  {withBio && p.bio && <p className="mt-3 font-body text-[0.9375rem] leading-[1.6] text-grey-600">{p.bio}</p>}
                  {p.linkedinUrl && (
                    <a href={p.linkedinUrl} rel="noopener noreferrer" target="_blank" className="mt-3 inline-flex min-h-6 items-center gap-2 font-body text-[0.875rem] text-blue-600 hover:underline">
                      <Icon name="linkedin" size={16} />
                      LinkedIn
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          emptyLabel && <p className="mt-8 rounded-sm bg-orange-500/10 px-4 py-3 font-body text-[0.9375rem] text-[#9A5208]">{emptyLabel}</p>
        )}

        {ctaLabel && ctaHref && (
          <Link href={ctaHref} className="mt-8 inline-flex items-center gap-3 font-heading text-[0.9375rem] font-bold text-navy-850 hover:text-blue-600">
            {ctaLabel}
            <Icon name="arrow" size={17} />
          </Link>
        )}
      </div>
    </section>
  );
}
