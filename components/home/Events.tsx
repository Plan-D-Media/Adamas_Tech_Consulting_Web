import Link from "next/link";
import type { EventCardData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { blockExtra } from "@/lib/data/home-blocks";
import { dateParts } from "@/lib/dates";
import { optionalCopy, plain } from "@/lib/placeholder";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Img } from "@/components/media/Img";

/**
 * Events & Insights (Figma Events frame 236:2419): tint-50 band with a faint ring top-right, header, the featured
 * event card (967x571, date block, label, title, outline button) and a white insights card that overlaps its right
 * edge. The event comes from the database; the three insight rows are seeded copy awaiting real articles.
 */
export function Events({ block, event }: { block: Block; event: EventCardData | null }) {
  const { insights } = blockExtra(block, "insights");
  if (!event && insights.length === 0) return null;
  const date = event ? dateParts(event.startsAt, event.timezone) : null;
  const venue = event?.venueName ? plain(event.venueName).replace(/,.*$/, "") : null;
  const eyebrow = event ? optionalCopy(event.eyebrow) : null;
  return (
    <section aria-labelledby="events-heading" data-compare="events" className="relative overflow-hidden bg-tint-50 pb-16 pt-16 lg:pb-[110px] lg:pt-24">
      <div className="pointer-events-none absolute right-[-150px] top-[-170px] hidden h-[460px] w-[460px] rounded-full border border-[#94BADA]/[0.26] shadow-[0_0_0_126px_rgb(157_187_208/0.13)] lg:block" aria-hidden="true" />
      <div className="container-site relative">
        <SectionHeader id="events-heading" eyebrow={plain(block.eyebrow)} heading={plain(block.heading)} eyebrowClassName="lg:h-[22px]" />
        <div className="mt-10 grid gap-6 lg:mt-12 xl:grid-cols-[775px_minmax(0,1fr)] xl:gap-0">
          {event && (
            <article className="relative min-h-[26rem] overflow-hidden rounded-2xl bg-navy-900 text-white lg:min-h-[30rem] xl:h-[571px] xl:w-[967px]" data-reveal>
              {event.image && <Img src={event.image} fill sizes="(min-width: 1280px) 967px, 100vw" className="object-cover" />}
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(6_21_46/0.96)_0%,rgb(6_21_46/0.55)_40%,rgb(6_21_46/0)_100%)]" aria-hidden="true" />
              {date && (
                <div className="absolute left-0 top-7 flex items-center gap-[9px] bg-blue-600 px-[17px] py-[15px] shadow-[12px_14px_35px_rgb(0_28_58/0.29)]">
                  <span className="font-heading text-[1.75rem] font-bold leading-[1.5]">{date.day}</span>
                  <span className="w-[38px] font-heading text-[1rem] uppercase leading-[1.3]">
                    {date.month} {date.year}
                  </span>
                </div>
              )}
              <div className="relative flex h-full flex-col justify-end p-6 lg:px-[34px] lg:pb-[28px]">
                <p className="font-heading text-[clamp(0.875rem,0.8rem+0.3vw,1.125rem)] font-extrabold uppercase leading-none tracking-[0.06em] text-sky-300">
                  {eyebrow && !eyebrow.pending ? eyebrow.text : "Upcoming"}
                  {venue ? ` · ${venue}${venue.toLowerCase().includes("london") ? "" : ", London"}` : ""}
                </p>
                <h3 className="mt-4 max-w-[34rem] text-balance font-heading text-[clamp(1.375rem,1.2rem+0.6vw,1.75rem)] font-bold leading-[1.21]">{plain(event.title)}</h3>
                <Link href={`/insights/events/${event.slug}`} className="mt-[21px] inline-flex h-[42px] w-fit items-center gap-3 border border-white/40 bg-white/5 px-[19px] font-heading text-[1rem] font-bold text-white transition-colors duration-(--duration-fast) hover:bg-white/15">
                  {block.ctaLabel ?? "View Event / Register"}
                  <Icon name="arrow" size={17} />
                </Link>
                {event.draft && <span className="absolute right-6 top-6 rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
              </div>
            </article>
          )}
          {insights.length > 0 && (
            <ul className="relative z-10 divide-y divide-[#DFE6EE] rounded-[20px] bg-white px-6 shadow-[0_25px_60px_rgb(19_51_82/0.13)] xl:mt-[61px] xl:h-fit xl:w-[544px] xl:px-[25px]" role="list" data-reveal>
              {insights.map((it) => (
                <li key={it.title} className="py-6">
                  <p className="font-heading text-[1rem] uppercase leading-none tracking-[0.07em] text-blue-600">{it.label}</p>
                  <h3 className="mt-2 font-heading text-[1.125rem] font-semibold leading-[1.22] text-navy-800">{it.title}</h3>
                  <Link href={it.href} className="mt-2 inline-flex items-center gap-3 font-heading text-[1rem] leading-none text-blue-600 hover:text-blue-500">
                    {it.linkLabel}
                    <Icon name="arrow" size={17} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
