import type { EventPageData } from "@/lib/data/events";
import { dateParts, longDate, timeRange } from "@/lib/dates";
import { copy, optionalCopy, plain } from "@/lib/placeholder";
import { previewingDrafts } from "@/lib/preview";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/media/Img";

/**
 * Event hero in the homepage Events-section idiom (Figma 236:2419 card): navy-900 band under the header, the event
 * photo with the dark gradient, the blue date block, a sky eyebrow, the title and the two actions. No Figma frame
 * exists for the page; the sizes mirror the homepage card (docs/design-notes.md round 7).
 */
export function EventHero({ event }: { event: EventPageData }) {
  const date = dateParts(event.startsAt, event.timezone);
  const title = copy(event.title);
  const eyebrow = optionalCopy(event.eyebrow);
  const summary = optionalCopy(event.summary);
  const venue = event.venueName ? plain(event.venueName) : null;
  const when = `${longDate(event.startsAt, event.timezone)}, ${timeRange(event.startsAt, event.endsAt, event.timezone)}`;
  const calendarHref = `/insights/events/${event.slug}/calendar`;
  return (
    <section data-dark-hero aria-labelledby="event-heading" className="relative overflow-hidden bg-navy-900 text-white">
      <div className="absolute inset-0" aria-hidden="true">
        {event.image && <Img src={event.image} fill priority sizes="100vw" className="object-cover opacity-60" />}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(6_21_46/0.98)_0%,rgb(6_21_46/0.75)_45%,rgb(6_21_46/0.35)_100%)]" />
      </div>
      <div className="container-site relative pb-14 pt-10 lg:pb-[72px] lg:pt-[64px]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-[9px] bg-blue-600 px-[17px] py-[13px] shadow-[12px_14px_35px_rgb(0_28_58/0.29)]">
            <span className="font-heading text-[1.75rem] font-bold leading-[1.2]">{date.day}</span>
            <span className="w-[38px] font-heading text-[1rem] uppercase leading-[1.3]">
              {date.month} {date.year}
            </span>
          </div>
          <p className="font-heading text-[clamp(0.875rem,0.8rem+0.3vw,1.125rem)] font-extrabold uppercase leading-none tracking-[0.06em] text-sky-300">
            {eyebrow && !eyebrow.pending ? eyebrow.text : "Upcoming event"}
            {venue ? ` · ${venue}` : ""}
          </p>
          {event.draft && <span className="rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
        </div>
        <h1 id="event-heading" className="mt-6 max-w-[46rem] text-balance font-heading text-[clamp(2rem,1.3rem+2.2vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.03em]">
          {title.text}
          {title.pending && previewingDrafts && <span className="ml-3 align-middle font-body text-[0.75rem] font-semibold uppercase tracking-wider text-sky-300">Title to be confirmed</span>}
        </h1>
        {summary && !summary.pending && <p className="mt-5 max-w-[40rem] font-heading text-[clamp(1rem,0.95rem+0.3vw,1.25rem)] leading-[1.5] text-grey-300">{summary.text}</p>}
        <dl className="mt-7 grid gap-3 font-body text-[1rem] text-white sm:grid-cols-2 lg:max-w-[46rem]">
          <div className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-3">
            <dt className="col-start-1 col-end-3 grid grid-cols-subgrid items-center">
              <Icon name="calendar" size={18} className="text-sky-300" />
              <span className="label-caps text-sky-300">When</span>
            </dt>
            <dd className="col-start-2 mt-1">{when}</dd>
          </div>
          {(event.venueName || event.venueAddress) && (
            <div className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-3">
              <dt className="col-start-1 col-end-3 grid grid-cols-subgrid items-center">
                <Icon name="globe" size={18} className="text-sky-300" />
                <span className="label-caps text-sky-300">Where</span>
              </dt>
              <dd className="col-start-2 mt-1">{[event.venueName ? plain(event.venueName) : null, event.venueAddress].filter(Boolean).join(", ")}</dd>
            </div>
          )}
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {event.isOpen && (
            <ButtonLink href="#register" size="md" className="min-w-[174px]">
              Register
            </ButtonLink>
          )}
          <a href={calendarHref} className="inline-flex h-14 items-center gap-3 rounded-md border border-white/40 bg-white/5 px-5 font-ui text-button font-bold text-white transition-colors duration-(--duration-fast) hover:bg-white/15">
            Add to calendar
            <Icon name="calendar" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
