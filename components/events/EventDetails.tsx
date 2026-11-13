import type { EventPageData } from "@/lib/data/events";
import { clock, mapsUrl } from "@/lib/dates";
import { copy, optionalCopy, plain } from "@/lib/placeholder";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/media/Img";
import { RegistrationForm } from "@/components/events/RegistrationForm";

const TBC = <span className="ml-2 align-middle font-body text-[0.6875rem] font-semibold uppercase tracking-wider text-[#9A5208]">to be confirmed</span>;

/**
 * Event body: description, agenda (timeline), speakers and venue on the left; the registration card on the right
 * (sticky on wide screens). Placeholder copy from the seed renders as "to be confirmed" tags rather than text.
 */
export function EventDetails({ event }: { event: EventPageData }) {
  const body = optionalCopy(event.body);
  const paragraphs = body && !body.pending ? body.text.split(/\n\s*\n/).filter(Boolean) : [];
  const venueCopy = event.venueName ? copy(event.venueName) : null;
  const map = mapsUrl([event.venueName, event.venueAddress]);
  const title = plain(event.title) || "this event";
  return (
    <section className="bg-tint-50 py-14 lg:py-[88px]" aria-label="Event details and registration">
      <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className="min-w-0">
          {paragraphs.length > 0 && (
            <div className="max-w-[42rem]">
              <h2 className="eyebrow lg:leading-[15px]">About the event</h2>
              <div className="mt-6 space-y-5 font-body text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-[1.7] text-grey-600">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {event.agenda.length > 0 && (
            <div className={paragraphs.length > 0 ? "mt-14" : ""}>
              <h2 className="eyebrow lg:leading-[15px]">Agenda</h2>
              <ol className="mt-6 max-w-[42rem] divide-y divide-grey-200 border-y border-grey-200" role="list">
                {event.agenda.map((a) => {
                  const t = copy(a.title);
                  const b = optionalCopy(a.body);
                  return (
                    <li key={a.id} className="grid gap-2 py-5 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-6">
                      <time dateTime={a.startsAt} className="font-heading text-[1.125rem] font-bold leading-none text-blue-600">
                        {clock(a.startsAt, event.timezone)}
                      </time>
                      <div>
                        <h3 className="font-heading text-[1.125rem] font-semibold leading-[1.3] text-navy-800">
                          {t.text}
                          {(t.pending || a.needsReview) && TBC}
                        </h3>
                        {b && !b.pending && <p className="mt-1.5 font-body text-[0.9375rem] leading-[1.6] text-grey-600">{b.text}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {event.speakers.length > 0 && (
            <div className="mt-14">
              <h2 className="eyebrow lg:leading-[15px]">Speakers</h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2" role="list">
                {event.speakers.map((s) => (
                  <li key={s.slug} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-tint-100">{s.photo && <Img src={s.photo} fill sizes="64px" className="object-cover" />}</div>
                    <div>
                      <p className="font-heading text-[1.0625rem] font-bold text-navy-800">{plain(s.name)}</p>
                      <p className="font-body text-[0.9375rem] text-grey-600">{plain(s.role)}</p>
                      {s.linkedinUrl && (
                        <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 font-body text-[0.875rem] font-semibold text-blue-600 hover:text-blue-500">
                          LinkedIn
                          <Icon name="external" size={11} />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(venueCopy || event.venueAddress) && (
            <div className="mt-14 max-w-[42rem] rounded-2xl bg-white p-6 ring-1 ring-grey-200 lg:p-7">
              <h2 className="eyebrow lg:leading-[15px]">Venue</h2>
              {venueCopy && (
                <p className="mt-4 font-heading text-[1.25rem] font-bold leading-[1.3] text-navy-800">
                  {venueCopy.text}
                  {venueCopy.pending && TBC}
                </p>
              )}
              {event.venueAddress && <p className="mt-1.5 font-body text-[1rem] leading-[1.6] text-grey-600">{event.venueAddress}</p>}
              {map && (
                <a href={map} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 font-body text-[0.9375rem] font-semibold text-blue-600 hover:text-blue-500">
                  Open in Maps
                  <Icon name="external" size={12} />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <RegistrationForm slug={event.slug} title={title} open={event.isOpen} calendarHref={`/insights/events/${event.slug}/calendar`} />
        </div>
      </div>
    </section>
  );
}
