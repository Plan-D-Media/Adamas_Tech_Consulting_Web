import Image from "next/image";
import type { AgendaItemData, EventPageData, SpeakerData } from "@/lib/data/events";
import { cx } from "@/lib/cx";
import { copy, optionalCopy } from "@/lib/placeholder";
import { CardArt } from "@/components/media/CardArt";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TbcTag } from "@/components/ui/SectionHeader";
import { clock, longDate, timeRange, zoneLabel } from "./format";

export const calendarHref = (slug: string) => `/insights/events/${slug}/calendar`;

/** "Add to calendar" text link: downloads the .ics from the calendar route. */
export function CalendarLink({ slug, tone = "light", className }: { slug: string; tone?: "light" | "dark"; className?: string }) {
  return (
    <a
      href={calendarHref(slug)}
      download
      className={cx(
        "group/al inline-flex min-h-12 items-center gap-2 font-semibold transition-colors duration-(--duration-base)",
        tone === "light" ? "text-brand-600 hover:text-brand-700" : "text-white",
        className,
      )}
    >
      <Icon name="calendar" size={18} className="shrink-0" />
      <span className="link-underline">Add to calendar</span>
      <span className="sr-only"> (downloads an .ics file)</span>
    </a>
  );
}

/** Date, time and venue as an icon list; used in the hero panel and beside the form. */
export function EventFacts({ event, tone = "light", className }: { event: EventPageData; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  const timesTbc = event.needsReview || !event.endsAt;
  const rows: { icon: IconName; label: string; value: React.ReactNode }[] = [
    { icon: "calendar", label: "Date", value: <time dateTime={event.startsAt}>{longDate(event.startsAt, event.timezone)}</time> },
    {
      icon: "clock",
      label: "Time",
      value: (
        <>
          {timeRange(event.startsAt, event.endsAt, event.timezone)}
          {timesTbc && (
            <TbcTag tone={tone} className="ml-0 mt-2 flex w-fit">
              {event.endsAt ? "Timings to be confirmed" : "Finish time to be confirmed"}
            </TbcTag>
          )}
        </>
      ),
    },
  ];
  if (event.venueName || event.venueAddress) {
    rows.push({
      icon: "pin",
      label: "Venue",
      value: (
        <>
          {event.venueName && <span className={cx("block font-semibold", dark ? "text-white" : "text-navy-950")}>{event.venueName}</span>}
          {event.venueAddress && <span className="block">{event.venueAddress}</span>}
        </>
      ),
    });
  }
  return (
    <dl className={cx("grid gap-5", className)}>
      {rows.map((r) => (
        <div key={r.label} className="flex items-start gap-4">
          <span className={cx("inline-flex size-10 shrink-0 items-center justify-center rounded-full", dark ? "bg-white/8 text-sky-400 ring-1 ring-white/15" : "bg-brand-50 text-brand-600")}>
            <Icon name={r.icon} size={18} />
          </span>
          <div className="min-w-0 pt-0.5">
            <dt className={cx("eyebrow", dark ? "text-on-navy-muted" : "text-grey-600")}>{r.label}</dt>
            <dd className={cx("mt-1.5 text-[0.9375rem] leading-snug", dark ? "text-white" : "text-navy-950")}>{r.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

/** Agenda as a vertical timeline: a real time sequence, so the steps carry numbered markers. */
export function AgendaTimeline({ items, tz }: { items: AgendaItemData[]; tz: string }) {
  return (
    <ol className="relative mt-12 md:mt-16">
      {items.map((a, i) => {
        const t = copy(a.title);
        const body = optionalCopy(a.body);
        const last = i === items.length - 1;
        return (
          <li key={a.id} className="relative grid grid-cols-[3rem_1fr] gap-x-4 sm:grid-cols-[3.5rem_1fr] md:grid-cols-[9rem_3.5rem_1fr] md:gap-x-6" data-reveal>
            {/* Time: its own column from md; above the card on phones. */}
            <p className="col-start-2 pb-2 font-display text-h3 font-bold tabular-nums text-brand-600 [font-stretch:112%] md:col-start-1 md:row-start-1 md:pb-0 md:pt-4 md:text-right">
              <time dateTime={a.startsAt}>{clock(a.startsAt, tz)}</time>
              <span className="ml-2 align-middle text-xs font-semibold tracking-wider text-grey-600 md:ml-0 md:block">{zoneLabel(a.startsAt, tz)}</span>
            </p>
            <div className="relative col-start-1 row-span-2 row-start-1 flex justify-center md:col-start-2 md:row-span-1">
              {!last && <span aria-hidden="true" className="absolute top-12 bottom-0 w-px bg-brand-200 md:top-16" />}
              <span className="relative z-[1] mt-0 inline-flex size-12 items-center justify-center rounded-full bg-white font-display text-sm font-bold tabular-nums text-brand-600 ring-1 ring-brand-200 md:mt-3 md:size-14">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className={cx("col-start-2 md:col-start-3 md:row-start-1", last ? "pb-0" : "pb-8 md:pb-10")}>
              <div className="card-lift rounded-card border border-grey-200 bg-white p-6 hover:border-brand-200 md:p-7">
                <h3 className="text-h4 font-bold text-navy-950">{t.text}</h3>
                {body ? <p className="mt-2 text-grey-700">{body.text}</p> : null}
                {(t.pending || a.needsReview) && <TbcTag className="mt-4">Details to be confirmed</TbcTag>}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const speakerGlyphVariants = [0, 1, 2];

/** Speakers (EventSpeaker → Person), or three designed "to be announced" places until they are confirmed. */
export function SpeakerGrid({ speakers }: { speakers: SpeakerData[] }) {
  if (!speakers.length) {
    return (
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6" aria-label="Speakers to be announced">
        {speakerGlyphVariants.map((v) => (
          <li key={v} className="overflow-hidden rounded-card bg-navy-900 ring-1 ring-navy-700" data-spotlight data-reveal>
            <div className="relative aspect-[4/3] overflow-hidden">
              <CardArt icon="users" variant={v} />
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 inline-flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/8 text-sky-300 ring-1 ring-white/20 backdrop-blur-sm">
                <Icon name="users" size={40} strokeWidth={1.25} />
              </span>
            </div>
            <div className="p-6 md:p-7">
              <TbcTag tone="dark">Speaker to be announced</TbcTag>
              <div aria-hidden="true" className="mt-5 grid gap-2.5">
                <span className="block h-3 w-3/4 rounded-full bg-white/12" />
                <span className="block h-2.5 w-1/2 rounded-full bg-white/8" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
      {speakers.map((s, i) => (
        <li key={s.slug} className="card-lift overflow-hidden rounded-card bg-navy-900 ring-1 ring-navy-700" data-spotlight data-reveal>
          <div className="card-media relative aspect-[4/3] overflow-hidden bg-navy-800">
            {s.photo ? (
              <Image src={s.photo.url} alt={s.photo.alt || ""} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
            ) : (
              <CardArt icon="users" variant={i} />
            )}
          </div>
          <div className="p-6 md:p-7">
            <h3 className="text-h4 font-bold text-white">{copy(s.name).text}</h3>
            <p className="mt-1 text-[0.9375rem] text-on-navy-muted">{s.role}</p>
            {s.bio && <p className="mt-4 line-clamp-4 text-small text-on-navy-muted">{s.bio}</p>}
            {s.linkedinUrl && (
              <a href={s.linkedinUrl} target="_blank" rel="noopener" className="mt-5 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-sky-300 hover:text-white">
                <Icon name="linkedin" size={18} />
                LinkedIn
                <span className="sr-only"> profile of {s.name} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
