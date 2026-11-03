import { getEvent } from "@/lib/data/events";
import { optionalCopy, plain } from "@/lib/placeholder";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** RFC 5545 UTC timestamp: 20261126T180000Z */
const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Escape text values and fold lines at 75 octets (approximated by characters). */
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
function fold(line: string) {
  const out: string[] = [];
  for (let i = 0; i < line.length; i += 73) out.push((i ? " " : "") + line.slice(i, i + 73));
  return out.join("\r\n");
}

/** Add-to-calendar file for an event (.ics). With no confirmed end time, the entry carries no DTEND. */
export async function GET(_req: Request, ctx: RouteContext<"/insights/events/[slug]/calendar">) {
  const { slug } = await ctx.params;
  const e = await getEvent(slug);
  if (!e) return new Response("Not found", { status: 404 });

  const url = `${siteUrl}/insights/events/${e.slug}`;
  const summary = optionalCopy(e.summary);
  const description = [summary && !summary.pending ? summary.text : null, `Details and registration: ${url}`].filter(Boolean).join("\n\n");
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
    `SUMMARY:${esc(plain(e.title) || "AdamasTech event")}`,
    `DESCRIPTION:${esc(description)}`,
    ...(location ? [`LOCATION:${esc(location)}`] : []),
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${e.slug}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
