import type { PersonSeed } from "./types";

/**
 * Leadership, from /about-us/ ("LEADERSHIP / Our Company Leading Members"). Names and roles verbatim.
 * DRAFT until the client confirms who is listed on /about/team (Q5.7). The live site has no bios or LinkedIn URLs.
 */
const TEAM_NOTE = "DECISION Q5.7: who is listed on /about/team. MISSING: bio and LinkedIn URL. Photo is the live /about-us/ image (alt=\"\"); higher-resolution portrait welcome.";

export const people: PersonSeed[] = [
  {
    slug: "rajat-subhra-roy",
    name: "Rajat Subhra Roy",
    role: "Director",
    photo: "images/people/rajat-subhra-roy.webp",
    showOnTeam: true,
    status: "DRAFT",
    sortOrder: 0,
    needsReview: true,
    editorNote: TEAM_NOTE,
  },
  {
    slug: "saumya-subhra-roy",
    name: "Saumya Subhra Roy",
    role: "Director",
    photo: "images/people/saumya-subhra-roy.webp",
    showOnTeam: true,
    status: "DRAFT",
    sortOrder: 1,
    needsReview: true,
    editorNote: TEAM_NOTE,
  },
  {
    slug: "koushik-chatterjee",
    name: "KayCee (Koushik Chatterjee)",
    role: "Chief Executive Officer",
    photo: "images/people/koushik-chatterjee.webp",
    showOnTeam: true,
    status: "DRAFT",
    sortOrder: 2,
    needsReview: true,
    editorNote: `${TEAM_NOTE} Name shown verbatim as on the site; preferred display form ("Koushik “KayCee” Chatterjee"?) to confirm.`,
  },
];
