import type { AnnouncementSeed } from "./types";

/**
 * Hero announcement strip. Nothing here is invented: the only real item is the House of Lords event
 * (date from the sitemap; title still a placeholder, Q6.1). The live site has no news, so the news and
 * partnership rows are clearly marked placeholders until the client supplies 3–5 announcements.
 */
export const announcements: AnnouncementSeed[] = [
  {
    label: "Event",
    text: "[Placeholder] AdamasTech at the House of Lords, 26 November 2026",
    href: "/insights/events/house-of-lords-2026",
    endsAt: "2026-11-26T23:00:00+00:00",
    regions: ["IN", "UK", "AE"],
    status: "DRAFT",
    sortOrder: 0,
    needsReview: true,
    editorNote:
      "Follows the House of Lords event (Q6.1–Q6.6): final event title needed; the date 26 Nov comes from the sitemap. Publish together with the event. Hides itself after the event ends.",
  },
  {
    label: "News",
    text: "[Placeholder] Company news headline",
    regions: ["IN", "UK", "AE"],
    status: "DRAFT",
    sortOrder: 1,
    needsReview: true,
    editorNote: "MISSING: client to provide 3–5 announcements (news, partnerships, awards) with links and date windows.",
  },
  {
    label: "Partnership",
    text: "[Placeholder] Partnership announcement",
    regions: ["IN", "UK", "AE"],
    status: "DRAFT",
    sortOrder: 2,
    needsReview: true,
    editorNote: "MISSING: client to provide 3–5 announcements (news, partnerships, awards) with links and date windows.",
  },
];
