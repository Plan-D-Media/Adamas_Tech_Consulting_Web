/**
 * RFC 5545 calendar entry for an event (the /calendar route and the registration confirmation email attach the
 * same file). Without a confirmed end time the entry carries no DTEND, so calendars apply their default length.
 */

export interface IcsEvent {
  slug: string;
  title: string;
  description: string;
  startsAt: string | Date;
  endsAt: string | Date | null;
  venueName: string | null;
  venueAddress: string | null;
  updatedAt: string | Date;
  url: string;
}

/** UTC timestamp, e.g. 20261126T180000Z */
const stamp = (d: string | Date) => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Escape text values; fold lines at 75 octets (approximated by characters). */
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
function fold(line: string) {
  const out: string[] = [];
  for (let i = 0; i < line.length; i += 73) out.push((i ? " " : "") + line.slice(i, i + 73));
  return out.join("\r\n");
}

export function buildIcs(e: IcsEvent): string {
  const location = [e.venueName, e.venueAddress].filter(Boolean).join(", ");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AdamasTech Consulting//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.slug}@adamastechconsulting.com`,
    `DTSTAMP:${stamp(e.updatedAt)}`,
    `DTSTART:${stamp(e.startsAt)}`,
    ...(e.endsAt ? [`DTEND:${stamp(e.endsAt)}`] : []),
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.description)}`,
    ...(location ? [`LOCATION:${esc(location)}`] : []),
    `URL:${e.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export const icsFilename = (slug: string) => `${slug}.ics`;
export const ICS_CONTENT_TYPE = "text/calendar; charset=utf-8; method=PUBLISH";
