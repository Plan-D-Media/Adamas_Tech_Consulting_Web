import type { EventSeed } from "./types";

/**
 * Events. The House of Lords event is not on the live site at all (/house-of-lords/ returns 404).
 * Only the date (26 Nov) comes from the sitemap; everything else is a flagged placeholder (Q6.1–Q6.6).
 */
export const events: EventSeed[] = [
  {
    slug: "house-of-lords-2026",
    title: "[Placeholder] AdamasTech at the House of Lords",
    eyebrow: "[Placeholder] Event",
    summary: "[Placeholder] One-paragraph summary of the event: purpose, host and audience.",
    body: "[Placeholder] Full event description, host/sponsor wording and what attendees can expect.",
    startsAt: "2026-11-26T18:00:00+00:00",
    timezone: "Europe/London",
    venueName: "House of Lords, Palace of Westminster",
    image: "images/events/house-of-lords-keynote.webp",
    venueAddress: "London SW1A 0PW",
    registrationOpen: true,
    agenda: [
      {
        startsAt: "2026-11-26T18:00:00+00:00",
        title: "[Placeholder] Arrival and registration",
        status: "DRAFT",
        sortOrder: 0,
        needsReview: true,
        editorNote: "Placeholder agenda item: time and content needed (Q6.1–Q6.6).",
      },
      {
        startsAt: "2026-11-26T18:30:00+00:00",
        title: "[Placeholder] Keynote",
        status: "DRAFT",
        sortOrder: 1,
        needsReview: true,
        editorNote: "Placeholder agenda item: time, title and speaker needed (Q6.1–Q6.6).",
      },
      {
        startsAt: "2026-11-26T19:30:00+00:00",
        title: "[Placeholder] Networking reception",
        status: "DRAFT",
        sortOrder: 2,
        needsReview: true,
        editorNote: "Placeholder agenda item: time and content needed (Q6.1–Q6.6).",
      },
    ],
    speakers: [],
    status: "DRAFT",
    sortOrder: 0,
    needsReview: true,
    editorNote:
      "MISSING (Q6.1–Q6.6), launch priority: full title, eyebrow, summary, body, start time (18:00 is a placeholder; only the date 26 Nov comes from the sitemap), end time, venue room and confirmation of the venue name/address, agenda, speakers, capacity, registration fields, host/sponsor wording and imagery. Not on the live site.",
  },
];
