import type { MilestoneSeed } from "./types";

/**
 * Company journey on /about (year-by-year timeline). PLACEHOLDERS ONLY.
 * The current site gives conflicting founding dates ("1995", "2021", "22+ years", "3+ years"), so no years or
 * history are invented here. `year` stays null (rendered as "Milestone 0N" + "Year to be confirmed") until the
 * client supplies year, title, 1–2 lines and an optional photo for each milestone (CONTENT_TODO: About).
 */
const note = "PLACEHOLDER: client to provide year, title, 1–2 lines and optional photo (CONTENT_TODO: About → journey).";

export const milestones: MilestoneSeed[] = Array.from({ length: 6 }, (_, i) => ({
  year: null,
  title: "Milestone title to be confirmed",
  description: "A short description of this milestone will be added once the details are confirmed.",
  status: "PUBLISHED" as const,
  sortOrder: i,
  needsReview: true,
  editorNote: note,
}));
