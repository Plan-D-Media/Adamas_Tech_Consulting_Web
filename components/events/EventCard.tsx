import Link from "next/link";
import type { EventCardData } from "@/lib/data/home";
import { cx } from "@/lib/cx";
import { copy, optionalCopy } from "@/lib/placeholder";
import { Img } from "@/components/media/Img";
import { CardArt } from "@/components/media/CardArt";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { DraftBadge, Eyebrow, TbcTag } from "@/components/ui/SectionHeader";
import { Countdown } from "@/components/motion/Countdown";
import { dateParts, longDate, timeRange } from "./format";

const href = (slug: string) => `/insights/events/${slug}`;
const glyphs: IconName[] = ["calendar", "users", "award"];

/** Calendar-leaf date block: the date is the focal point of every event card. */
export function DateBlock({ iso, tz, tone = "light", className }: { iso: string; tz: string; tone?: "light" | "dark"; className?: string }) {
  const d = dateParts(iso, tz);
  const dark = tone === "dark";
  return (
    <time
      dateTime={iso}
      className={cx(
        "inline-flex w-[5.25rem] flex-col items-center overflow-hidden rounded-card text-center shadow-(--shadow-card)",
        dark ? "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md" : "bg-white text-navy-950 ring-1 ring-grey-200",
        className,
      )}
    >
      <span className={cx("w-full py-1 text-[11px] font-bold uppercase tracking-[0.14em]", dark ? "bg-sky-400 text-navy-950" : "bg-brand-600 text-white")}>{d.month}</span>
      <span className="pt-1.5 font-display text-[2.125rem] font-bold leading-none tabular-nums [font-stretch:112%]">{d.day}</span>
      <span className={cx("pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider", dark ? "text-on-navy-muted" : "text-grey-600")}>
        {d.weekday} · {d.year}
      </span>
    </time>
  );
}

/**
 * Featured (next) event: a wide split card. Visual and date on the left, the story, countdown and the
 * one primary action on the right.
 */
export function FeaturedEventCard({ event }: { event: EventCardData }) {
  const title = copy(event.title);
  const summary = optionalCopy(event.summary);
  const eyebrow = event.eyebrow ? copy(event.eyebrow).text : "Event";
  const venue = [event.venueName, event.venueAddress].filter(Boolean).join(", ");
  return (
    <article className="card-lift group relative grid overflow-hidden rounded-card border border-grey-200 bg-white hover:border-brand-200 lg:grid-cols-12">
      <div className="card-media relative min-h-72 overflow-hidden bg-navy-900 sm:min-h-80 lg:col-span-5 lg:min-h-[30rem]">
        {event.image ? <Img media={event.image} sizes="(min-width: 1024px) 42vw, 100vw" /> : <CardArt icon="calendar" variant={2} />}
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-transparent to-transparent" />
        <DateBlock iso={event.startsAt} tz={event.timezone} tone="dark" className="absolute left-6 top-6 md:left-8 md:top-8" />
        <p className="absolute inset-x-6 bottom-6 flex items-center gap-2 text-small font-semibold text-white md:inset-x-8 md:bottom-8">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full rounded-full bg-sky-400 opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2.5 rounded-full bg-sky-400" />
          </span>
          {event.registrationOpen ? "Registration open" : "Upcoming"}
        </p>
      </div>
      <div className="flex flex-col p-7 sm:p-9 lg:col-span-7 lg:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          {event.draft && <DraftBadge />}
        </div>
        <h3 className="mt-5 max-w-[24ch] text-h2 text-navy-950">
          <Link href={href(event.slug)} className="after:absolute after:inset-0 after:z-[1] after:content-['']">
            {title.text}
          </Link>
        </h3>
        {title.pending && <TbcTag className="mt-4 self-start">Title to be confirmed</TbcTag>}
        {summary && <p className="mt-5 max-w-[60ch] text-lead text-grey-700">{summary.text}</p>}
        <ul className="mt-7 grid gap-3 text-[0.9375rem] text-grey-700 sm:grid-cols-2">
          <li className="flex items-start gap-3">
            <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-brand-600" />
            <span>
              {longDate(event.startsAt, event.timezone)}
              <br />
              {timeRange(event.startsAt, event.endsAt, event.timezone)}
            </span>
          </li>
          {venue && (
            <li className="flex items-start gap-3">
              <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-brand-600" />
              <span>{venue}</span>
            </li>
          )}
        </ul>
        <div className="mt-auto flex flex-col gap-6 pt-9 md:flex-row md:items-end md:justify-between">
          <Countdown startsAt={event.startsAt} endsAt={event.endsAt} tone="light" />
          {/* Above the card's stretched link, so it stays its own target. */}
          <ButtonLink href={`${href(event.slug)}#register`} arrow className="relative z-[2] self-start md:self-auto">
            {event.registrationOpen ? "Register now" : "View event"}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

/** Grid card for further upcoming and past events. */
export function EventCard({ event, index = 0, past = false }: { event: EventCardData; index?: number; past?: boolean }) {
  const title = copy(event.title);
  const venue = event.venueName ?? event.venueAddress;
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card border border-grey-200 bg-white hover:border-brand-200">
      <div className="card-media relative aspect-[16/10] overflow-hidden bg-navy-900">
        {event.image ? <Img media={event.image} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className={past ? "grayscale-[35%]" : undefined} /> : <CardArt icon={glyphs[index % glyphs.length]} variant={index} />}
        <DateBlock iso={event.startsAt} tz={event.timezone} tone="dark" className="absolute left-5 top-5" />
        {event.draft && <DraftBadge className="absolute right-4 top-4" />}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="eyebrow text-brand-600">{event.eyebrow ? copy(event.eyebrow).text : "Event"}</p>
        <h3 className="mt-3 text-h4 font-bold text-navy-950">
          <Link href={href(event.slug)} className="line-clamp-2 after:absolute after:inset-0 after:content-['']">
            {title.text}
          </Link>
        </h3>
        {title.pending && <TbcTag className="mt-3 self-start">Title to be confirmed</TbcTag>}
        {venue && (
          <p className="mt-3 flex items-center gap-2 text-small text-grey-600">
            <Icon name="pin" size={16} className="shrink-0" />
            <span className="line-clamp-1">{venue}</span>
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.9375rem] font-semibold text-brand-600">
          {!past && event.registrationOpen ? "Register" : "View event"}
          <Icon name="arrowRight" size={18} className="transition-transform duration-(--duration-base) group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
