import Link from "next/link";
import type { JobData } from "@/lib/data/careers";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  jobs: JobData[];
  /** Selected discipline chip, from the query string; filtering works without JavaScript. */
  active: string | null;
  /** Shown when nothing is open. The design has no empty state (docs/design-notes.md). */
  emptyLabel: string | null;
  applyHref: string | null;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * "Current Openings" (Figma 274:2667, band y 2192-4714): the header, a row of discipline chips and one row per
 * vacancy (title, experience, location, "Learn More").
 *
 * The design's chips (Remote, Design, Marketing, JAVA/Tech, Mobile App, #Trend) are the template's own; the real
 * ones are the disciplines present on the published roles, plus "Remote" when a remote role exists. Each chip is a
 * link to the same page with a query string, so the filter needs no JavaScript.
 */
export function CareersOpenings({ eyebrow, heading, body, jobs, active, emptyLabel, applyHref }: Props) {
  const disciplines = [...new Set(jobs.map((j) => j.discipline).filter((d): d is string => !!d))].sort();
  const chips = [...disciplines.map((d) => ({ value: slug(d), label: d })), ...(jobs.some((j) => j.remote) ? [{ value: "remote", label: "Remote" }] : [])];
  const shown = active ? jobs.filter((j) => (active === "remote" ? j.remote : j.discipline && slug(j.discipline) === active)) : jobs;
  const pill = "inline-flex min-h-9 items-center rounded-pill px-4 font-body text-[0.875rem] leading-none transition-colors duration-(--duration-fast)";

  return (
    <section data-compare="careers-openings" aria-labelledby="careers-openings-heading" className="bg-white py-14 lg:py-[88px]">
      <div className="container-site">
        <div className="mx-auto max-w-[820px] text-center" data-reveal>
          {eyebrow && <Eyebrow className="!text-[1.25rem] !tracking-normal">{eyebrow}</Eyebrow>}
          {heading && <Heading2 id="careers-openings-heading" className="mt-3">{heading}</Heading2>}
          {body && <p className="mt-4 font-body text-[1.125rem] leading-[1.6] text-grey-600">{body}</p>}
        </div>

        {chips.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/about/careers" aria-current={active ? undefined : "true"} className={cx(pill, active ? "bg-grey-50 text-grey-600 hover:bg-tint-100" : "bg-blue-600 text-white")}>
              All roles
            </Link>
            {chips.map((c) => (
              <Link key={c.value} href={`/about/careers?role=${c.value}`} aria-current={active === c.value ? "true" : undefined} className={cx(pill, active === c.value ? "bg-blue-600 text-white" : "bg-grey-50 text-grey-600 hover:bg-tint-100")}>
                {c.label}
              </Link>
            ))}
          </div>
        )}

        {shown.length > 0 ? (
          <ul className="mx-auto mt-10 grid max-w-[1120px] gap-3" role="list">
            {shown.map((j) => (
              <li key={j.slug} className="grid gap-3 rounded-lg bg-tint-25 px-7 py-6 ring-1 ring-grey-200 lg:grid-cols-[minmax(0,1fr)_200px_140px] lg:items-center" data-reveal>
                <div>
                  <h3 className="font-heading text-[1.3125rem] font-bold leading-[1.25] text-navy-850">
                    {j.title}
                    {j.draft && <span className="ml-2 align-middle rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.6875rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
                  </h3>
                  {j.experience && <p className="mt-1 font-body text-[1rem] text-grey-600">{j.experience}</p>}
                  {j.summary && <p className="mt-2 max-w-[640px] font-body text-[0.9375rem] leading-[1.6] text-grey-600">{j.summary}</p>}
                </div>
                <p className="font-body text-[1rem] text-grey-600">
                  {j.location}
                  {j.remote && <span className="ml-2 rounded-pill bg-blue-600/10 px-2 py-0.5 font-body text-[0.75rem] text-blue-600">Remote</span>}
                </p>
                {applyHref && (
                  <a href={j.applyUrl ?? applyHref} className="inline-flex min-h-10 items-center gap-2 font-heading text-[0.9375rem] font-bold text-blue-600 hover:text-blue-500">
                    Apply
                    <span className="sr-only">for {j.title}</span>
                    <Icon name="arrow" size={16} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto mt-10 max-w-[760px] rounded-lg bg-tint-50 px-6 py-12 text-center lg:py-16" data-reveal>
            <p className="font-heading text-[1.375rem] font-bold text-navy-850">{jobs.length === 0 ? "No vacancies are open at the moment" : "No roles match that filter"}</p>
            {emptyLabel && <p className="mx-auto mt-3 max-w-[560px] font-body text-[1.0625rem] leading-[1.6] text-grey-600">{emptyLabel}</p>}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {applyHref && (
                <a href={applyHref} className="inline-flex min-h-[46px] items-center gap-3 rounded-pill bg-blue-600 px-7 font-heading text-[0.9375rem] font-bold text-white hover:bg-blue-500">
                  Send us your CV
                  <Icon name="arrow" size={17} />
                </a>
              )}
              <Link href="/contact" className="inline-flex min-h-[46px] items-center gap-3 rounded-pill bg-white px-7 font-heading text-[0.9375rem] font-bold text-navy-850 ring-1 ring-grey-150 hover:bg-grey-50">
                Get in touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
