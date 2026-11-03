import type { EventCardData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { cx } from "@/lib/cx";
import { Img } from "@/components/media/Img";
import { ButtonLink, ArrowLink } from "@/components/ui/Button";
import { DraftBadge, Eyebrow, TbcTag } from "@/components/ui/SectionHeader";
import { CardArt } from "@/components/media/CardArt";
import { copy, optionalCopy } from "@/lib/placeholder";
import { Icon } from "@/components/ui/Icon";
import { Countdown } from "@/components/motion/Countdown";

function formatDate(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: tz }).format(new Date(iso));
}
function formatTime(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz, timeZoneName: "short" }).format(new Date(iso));
}

/**
 * House of Lords feature. FEATURED (UK) = full-bleed cinematic band; STANDARD = split card.
 * Region prominence comes from RegionHome.eventProminence.
 */
export function EventFeature({ block, event, prominence }: { block: Block; event: EventCardData | null; prominence: "HIDDEN" | "STANDARD" | "FEATURED" }) {
  if (!event || prominence === "HIDDEN") return null;
  const featured = prominence === "FEATURED";
  const href = `/insights/events/${event.slug}`;
  const date = formatDate(event.startsAt, event.timezone);
  const time = formatTime(event.startsAt, event.timezone);
  const title = copy(event.title);
  const summary = optionalCopy(event.summary);
  const eyebrow = copy(block.eyebrow ?? event.eyebrow ?? "Event").text;

  const meta = (
    <ul className={cx("mt-6 grid gap-2 text-[0.9375rem]", featured ? "text-on-navy-muted" : "text-grey-700")}>
      <li className="flex items-center gap-3">
        <Icon name="calendar" size={18} className={featured ? "text-sky-400" : "text-brand-600"} />
        <span>
          <time dateTime={event.startsAt}>{date}</time> · {time}
        </span>
      </li>
      {(event.venueName || event.venueAddress) && (
        <li className="flex items-center gap-3">
          <Icon name="pin" size={18} className={featured ? "text-sky-400" : "text-brand-600"} />
          <span>{[event.venueName, event.venueAddress].filter(Boolean).join(", ")}</span>
        </li>
      )}
    </ul>
  );

  if (featured) {
    return (
      <section aria-labelledby="event-heading" className="relative isolate overflow-hidden bg-navy-950 text-white" data-morph>
        {event.image ? <Img media={event.image} sizes="100vw" className="-z-20 opacity-50" /> : <CardArt icon="calendar" variant={1} className="-z-20 opacity-70" />}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950 via-navy-950/85 to-navy-950/30" />
        <div className="container-site section-y">
          <div className="grid-12 gap-y-10">
            <div className="col-span-4 md:col-span-8 lg:col-span-7" data-reveal>
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow tone="dark">{eyebrow}</Eyebrow>
                {event.draft && <DraftBadge />}
              </div>
              <h2 id="event-heading" className="mt-6 text-display text-white">
                {title.text}
              </h2>
              {title.pending && <TbcTag tone="dark" className="mt-4">Title to be confirmed</TbcTag>}
              {summary && <p className="mt-6 max-w-2xl text-lead text-on-navy-muted">{summary.text}</p>}
              {meta}
            </div>
            <div className="col-span-4 self-end md:col-span-8 lg:col-span-5 lg:justify-self-end" data-reveal>
              <Countdown startsAt={event.startsAt} endsAt={event.endsAt} />
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <ButtonLink href={href} arrow>
                  {event.registrationOpen ? "Register now" : "View event"}
                </ButtonLink>
                {block.ctaHref && (
                  <ArrowLink href={block.ctaHref} tone="dark">
                    {block.ctaLabel ?? "All events"}
                  </ArrowLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="event-heading" className="section-y tone-white">
      <div className="container-site">
        <article className="grid overflow-hidden rounded-card border border-grey-200 lg:grid-cols-12" data-reveal>
          <div className="card-media relative min-h-72 overflow-hidden bg-navy-900 lg:col-span-6">
            {event.image ? <Img media={event.image} sizes="(min-width: 1024px) 50vw, 100vw" /> : <CardArt icon="calendar" variant={2} />}
          </div>
          <div className="p-8 md:p-12 lg:col-span-6">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>{eyebrow}</Eyebrow>
              {event.draft && <DraftBadge />}
            </div>
            <h2 id="event-heading" className="mt-5 text-h2 text-navy-950">
              {title.text}
            </h2>
            {title.pending && <TbcTag className="mt-4">Title to be confirmed</TbcTag>}
            {summary && <p className="mt-4 text-grey-700">{summary.text}</p>}
            {meta}
            <Countdown startsAt={event.startsAt} endsAt={event.endsAt} tone="light" className="mt-8" />
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ButtonLink href={href} arrow>
                {event.registrationOpen ? "Register now" : "View event"}
              </ButtonLink>
              {block.ctaHref && <ArrowLink href={block.ctaHref}>{block.ctaLabel ?? "All events"}</ArrowLink>}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
