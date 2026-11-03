import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import { badge, db, visible, visibleStatuses } from "@/lib/db";
import { mediaSelect, toMedia, type Media } from "@/lib/media";
import type { EventCardData } from "./home";
import type { SeoData } from "./mappers";

/** Events: listing, detail page, calendar file and the registration action all read from here. */

export interface AgendaItemData {
  id: string;
  startsAt: string;
  title: string;
  body: string | null;
  needsReview: boolean;
}

export interface SpeakerData {
  slug: string;
  name: string;
  role: string;
  bio: string | null;
  photo: Media | null;
  linkedinUrl: string | null;
}

export interface EventPageData extends EventCardData, SeoData {
  id: string;
  body: string | null;
  capacity: number | null;
  updatedAt: string;
  /** Registration is switched on and the event has not ended (evaluated when the cache entry was made). */
  isOpen: boolean;
  ogImage: Media | null;
  agenda: AgendaItemData[];
  speakers: SpeakerData[];
}

/** Events without an end time are treated as three hours long (the same rule the countdown uses). */
const DEFAULT_LENGTH_MS = 3 * 3600_000;
export function eventEnd(e: { startsAt: string | Date; endsAt: string | Date | null }): Date {
  return e.endsAt ? new Date(e.endsAt) : new Date(new Date(e.startsAt).getTime() + DEFAULT_LENGTH_MS);
}

const cardInclude = { image: mediaSelect } as const;
type CardRow = Prisma.EventGetPayload<{ include: typeof cardInclude }>;

function toEventCard(ev: CardRow): EventCardData {
  return {
    slug: ev.slug,
    title: ev.title,
    eyebrow: ev.eyebrow,
    summary: ev.summary,
    startsAt: ev.startsAt.toISOString(),
    endsAt: ev.endsAt?.toISOString() ?? null,
    timezone: ev.timezone,
    venueName: ev.venueName,
    venueAddress: ev.venueAddress,
    image: toMedia(ev.image),
    registrationOpen: ev.registrationOpen,
    draft: badge(ev.status),
    needsReview: ev.needsReview,
  };
}

export interface EventListing {
  /** Soonest first; the first one is the featured event. */
  upcoming: EventCardData[];
  /** Most recent first. */
  past: EventCardData[];
}

export async function getEvents(): Promise<EventListing> {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  const rows = await db.event.findMany({ where: visible, include: cardInclude, orderBy: [{ startsAt: "asc" }, { sortOrder: "asc" }] });
  // Split inside the cache: an event moves to "past" within the cache lifetime (hours) of ending.
  const now = Date.now();
  const cards = rows.map(toEventCard);
  return {
    upcoming: cards.filter((e) => eventEnd(e).getTime() > now),
    past: cards.filter((e) => eventEnd(e).getTime() <= now).reverse(),
  };
}

export async function getEventParams(): Promise<{ slug: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  const rows = await db.event.findMany({ where: visible, select: { slug: true } });
  return rows.map((r) => ({ slug: r.slug }));
}

export async function getEvent(slug: string): Promise<EventPageData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("events", `event:${slug}`);
  const ev = await db.event.findFirst({
    where: { slug, ...visible },
    include: {
      image: mediaSelect,
      ogImage: mediaSelect,
      agenda: { where: visible, orderBy: [{ startsAt: "asc" }, { sortOrder: "asc" }] },
      speakers: { orderBy: { sortOrder: "asc" }, include: { person: { include: { photo: mediaSelect } } } },
    },
  });
  if (!ev) return null;
  return {
    ...toEventCard(ev),
    id: ev.id,
    body: ev.body,
    capacity: ev.capacity,
    updatedAt: ev.updatedAt.toISOString(),
    isOpen: ev.registrationOpen && eventEnd(ev).getTime() > Date.now(),
    ogImage: toMedia(ev.ogImage),
    seoTitle: ev.seoTitle,
    seoDescription: ev.seoDescription,
    noindex: ev.noindex,
    agenda: ev.agenda.map((a) => ({ id: a.id, startsAt: a.startsAt.toISOString(), title: a.title, body: a.body, needsReview: a.needsReview })),
    speakers: ev.speakers
      .filter((s) => visibleStatuses.includes(s.person.status))
      .map(({ person: p }) => ({ slug: p.slug, name: p.name, role: p.role, bio: p.bio, photo: toMedia(p.photo), linkedinUrl: p.linkedinUrl })),
  };
}

/** Uncached lookup for the registration action: always checks the live state of the event. */
export async function getEventForRegistration(slug: string) {
  const ev = await db.event.findFirst({
    where: { slug, ...visible },
    select: { id: true, slug: true, title: true, startsAt: true, endsAt: true, timezone: true, venueName: true, venueAddress: true, registrationOpen: true },
  });
  if (!ev) return null;
  const open = ev.registrationOpen && eventEnd(ev).getTime() > Date.now();
  return { ...ev, open };
}
