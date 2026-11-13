import type { OfficeSeed, RegionSeed } from "./types";

/**
 * Regions and offices.
 * Source: docs/source-content/_global.md (header/footer contact), _summary.md §6–7 ("Our Presence" and /contact/).
 */

const SHARED_EMAIL = "marketing@adamastech.in";

export const regions: RegionSeed[] = [
  {
    code: "IN",
    slug: "in",
    label: "India",
    locale: "en-IN",
    hreflang: ["en-IN"],
    phone: "+91-6296680677",
    phoneHref: "tel:+916296680677",
    // whatsapp: MISSING (Q3.6). Left empty on purpose.
    email: SHARED_EMAIL,
    featuredOffice: "bengaluru",
    sortOrder: 0,
  },
  {
    code: "UK",
    slug: "uk",
    label: "UK & Ireland",
    locale: "en-GB",
    hreflang: ["en-GB", "en-IE"],
    phone: "+44 7768 706988",
    phoneHref: "tel:+447768706988",
    email: SHARED_EMAIL,
    featuredOffice: "london",
    sortOrder: 1,
  },
  {
    code: "GCC",
    slug: "gcc",
    label: "GCC",
    locale: "en-AE",
    hreflang: ["en-AE", "en-SA", "en-QA", "en-KW", "en-BH", "en-OM"],
    phone: "+971 4 705 6001",
    phoneHref: "tel:+97147056001",
    email: SHARED_EMAIL,
    featuredOffice: "dubai",
    sortOrder: 2,
  },
];

/**
 * Review flags for the regions themselves (RegionSeed has no editorNote field).
 * Mirrored in CONTENT_TODO.md.
 */
export const regionNotes: Record<RegionSeed["code"], string> = {
  IN: "Email marketing@adamastech.in is shared by all regions: confirm one inbox per region. WhatsApp missing. Featured office Bengaluru, or Kolkata? Confirm.",
  UK: "Email marketing@adamastech.in is shared by all regions: confirm one inbox per region. WhatsApp missing. Phone is the London mobile (no UK landline on the site).",
  GCC: "Email marketing@adamastech.in is shared by all regions: confirm one inbox per region (adamastech.ae domain also in use). WhatsApp missing.",
};

const PIN = "Map pin is approximate (geocoded from the address, city/street level). Confirm.";

export const offices: OfficeSeed[] = [
  // ── "Our Presence" offices (live on /in/, /uk/, /ae/, /about-us/, /contact/) ──
  {
    slug: "london",
    city: "London",
    label: "London",
    country: "United Kingdom",
    region: "UK",
    addressLines: ["Golden Cross House", "8 Duncannon Street", "London WC2N 4JF"],
    phone: "+44 7768 706988",
    phoneHref: "tel:+447768706988",
    lat: 51.5085,
    lng: -0.1265,
    confirmed: false,
    status: "PUBLISHED",
    sortOrder: 0,
    needsReview: true,
    editorNote: `CONFLICT: /contact/ and the privacy policy give a second London address (39 Roxborough Road, Harrow HA1 1NS). Which is the office? ${PIN}`,
  },
  {
    slug: "palo-alto",
    city: "Palo Alto",
    label: "Palo Alto",
    country: "United States",
    region: "UK",
    addressLines: ["530 Lytton Avenue, 2nd Floor", "Palo Alto, CA 94301"],
    lat: 37.4485,
    lng: -122.159,
    confirmed: false,
    status: "PUBLISHED",
    sortOrder: 1,
    needsReview: true,
    editorNote: `Labelled "San Francisco" on the live site; the address is Palo Alto. Region "UK" is only a technical placeholder: the US office belongs to no current region (the type requires one). Confirm the office is still active (sitemap: "US office to confirm"). No US phone. ${PIN}`,
  },
  {
    slug: "dubai",
    city: "Dubai",
    label: "Dubai",
    country: "United Arab Emirates",
    region: "GCC",
    addressLines: ["B-2101, 1601 & 801 Latifa Tower", "near Trade Centre, Sheikh Zayed Road", "Dubai, UAE"],
    phone: "+971 4 705 6001",
    phoneHref: "tel:+97147056001",
    lat: 25.2216,
    lng: 55.2817,
    confirmed: false,
    status: "PUBLISHED",
    sortOrder: 2,
    needsReview: true,
    editorNote: `CONFLICT: homepages show "…Latifa Tower near Trade Centre, Sheikh Zayed Road, Dubai, UAE."; /about-us/ and /contact/ omit "near Trade Centre" and "UAE". Dubai is also missing from the /contact/ Locations list and from About Us ("four countries"). ${PIN}`,
  },
  {
    slug: "bengaluru",
    city: "Bengaluru",
    label: "Bengaluru",
    country: "India",
    region: "IN",
    addressLines: ["27th Main Rd, 1st Sector", "HSR Layout, Bengaluru", "Karnataka 560102"],
    lat: 12.9177,
    lng: 77.648,
    confirmed: false,
    status: "PUBLISHED",
    sortOrder: 3,
    needsReview: true,
    editorNote: `CONFLICT: legal pages give "2nd Floor, Vallabha Pamadi, 2727, 16th Cross, 27th Main Rd, HSR Layout, Bengaluru, Karnataka 560068". Postcode 560102 vs 560068. No office phone on the live site (the India number is shown at region level). ${PIN}`,
  },
  {
    slug: "kolkata",
    city: "Kolkata",
    label: "Kolkata",
    country: "India",
    region: "IN",
    addressLines: ["Haute Street, Topsia Road", "Kolkata, West Bengal 700046"],
    lat: 22.541,
    lng: 88.392,
    confirmed: false,
    status: "PUBLISHED",
    sortOrder: 4,
    needsReview: true,
    editorNote: `CONFLICT: /contact/ gives "Haute Street, 86 A, Topsia Road," (house number 86 A, no postcode). No office phone on the site. ${PIN}`,
  },

  // ── Offices shown only in the /contact/ second list (draft until the client confirms) ──
  {
    slug: "harrow",
    city: "Harrow",
    label: "London (Harrow)",
    country: "United Kingdom",
    region: "UK",
    addressLines: ["39 Roxborough Road", "Harrow, London HA1 1NS"],
    lat: 51.5815,
    lng: -0.339,
    confirmed: false,
    status: "DRAFT",
    sortOrder: 5,
    needsReview: true,
    editorNote: `Only on /contact/ ("39 Roxborough Road, Harrow, London") and the privacy policy (UK representative address, postcode HA1 1NS). Is this an office, or only the UK representative's address? ${PIN}`,
  },
  {
    slug: "riyadh",
    city: "Riyadh",
    label: "Riyadh",
    country: "Saudi Arabia",
    region: "GCC",
    addressLines: ["Riyadh", "Saudi Arabia"],
    lat: 24.7136,
    lng: 46.6753,
    confirmed: false,
    status: "DRAFT",
    sortOrder: 6,
    needsReview: true,
    editorNote: `Only on /contact/, with no street address ("Riyadh"). Show it? Full address needed. Pin is city-centre only. ${PIN}`,
  },
  {
    slug: "bhubaneswar",
    city: "Bhubaneswar",
    label: "Bhubaneswar",
    country: "India",
    region: "IN",
    addressLines: ["Arch Bishop House, Saheed Nagar", "Khurda"],
    lat: 20.288,
    lng: 85.844,
    confirmed: false,
    status: "DRAFT",
    sortOrder: 7,
    needsReview: true,
    editorNote: `Only on /contact/ ("Arch Bishop House, Saheed nagar, Khurda"). Show it? Postcode needed. ${PIN}`,
  },
];
