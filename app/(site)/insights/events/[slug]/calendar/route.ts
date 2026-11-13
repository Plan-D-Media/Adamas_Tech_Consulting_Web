import { getEvent } from "@/lib/data/events";
import { ICS_CONTENT_TYPE, buildIcs, icsFilename } from "@/lib/ics";
import { optionalCopy, plain } from "@/lib/placeholder";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Add-to-calendar file for an event (.ics), the same entry the confirmation email attaches. */
export async function GET(_req: Request, ctx: RouteContext<"/insights/events/[slug]/calendar">) {
  const { slug } = await ctx.params;
  const e = await getEvent(slug);
  if (!e) return new Response("Not found", { status: 404 });

  const url = `${siteUrl}/insights/events/${e.slug}`;
  const summary = optionalCopy(e.summary);
  const ics = buildIcs({
    slug: e.slug,
    title: plain(e.title) || "AdamasTech event",
    description: [summary && !summary.pending ? summary.text : null, `Details and registration: ${url}`].filter(Boolean).join("\n\n"),
    startsAt: e.startsAt,
    endsAt: e.endsAt,
    venueName: e.venueName,
    venueAddress: e.venueAddress,
    updatedAt: e.updatedAt,
    url,
  });

  return new Response(ics, {
    headers: {
      "Content-Type": ICS_CONTENT_TYPE,
      "Content-Disposition": `attachment; filename="${icsFilename(e.slug)}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
