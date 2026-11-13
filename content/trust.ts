import type { CertificationSeed, LogoSeed, StatSeed } from "./types";

/**
 * Trust: stats, logos, certifications.
 * Sources: _summary.md §3 (logos) and §5 (stats table), in.md, ae.md, about-us.md, _global.md.
 */

// ── Stats (Q5.8) ────────────────────────────────────────────────────────
// Every figure found on the site, each as its own record. None is verified, so none renders.
// The versions conflict with each other; no version has been picked.
const STAT_NOTE = "Unverified (Q5.8): does not render until the client confirms it.";

export const stats: StatSeed[] = [
  // Claims in the approved Figma design (brief section 7): built as designed, stored as DRAFT until the client confirms.
  {
    key: "hero-satisfied-100",
    value: "100%",
    numeric: 100,
    suffix: "%",
    label: "Satisfied",
    verified: false,
    sourceNote: "Figma hero trust row. Unverified claim.",
    placements: ["hero-trust"],
    status: "DRAFT",
    sortOrder: 0,
    needsReview: true,
    editorNote: "UNVERIFIED (Figma hero): confirm or replace \"100% Satisfied\".",
  },
  {
    key: "hero-zero-risk",
    value: "Zero Risk",
    label: "",
    verified: false,
    sourceNote: "Figma hero trust row. Unverified claim.",
    placements: ["hero-trust"],
    status: "DRAFT",
    sortOrder: 1,
    needsReview: true,
    editorNote: "UNVERIFIED (Figma hero): confirm or replace \"Zero Risk\".",
  },
  {
    key: "cash-forecasting-improvement-30",
    value: "30%",
    numeric: 30,
    suffix: "%",
    label: "improvement in cash forecasting",
    verified: false,
    sourceNote: "Figma Client Outcomes card; matches the SAP Treasury case-study metric (DRAFT, Q5.5).",
    placements: ["outcome"],
    status: "DRAFT",
    sortOrder: 2,
    needsReview: true,
    editorNote: "UNVERIFIED (Figma Client Outcomes): the 30% figure needs client clearance with the SAP Treasury case study.",
  },
  {
    key: "response-time-5-mins",
    value: "5 Mins",
    numeric: 5,
    suffix: " Mins",
    label: "Response Time",
    verified: false,
    sourceNote: 'Visible in the footer CTA band on every page: "5 Mins / Response Time". Conflicts with the hidden "2 Mins / Response Time".',
    placements: ["cta-band", "trust-strip"],
    status: "PUBLISHED",
    sortOrder: 0,
    needsReview: true,
    editorNote: `${STAT_NOTE} CONFLICT with response-time-2-mins.`,
  },
  {
    key: "response-time-2-mins",
    value: "2 Mins",
    numeric: 2,
    suffix: " Mins",
    label: "Response Time",
    verified: false,
    sourceNote:
      'Hidden (display:none) stats block on /in/, /uk/, /ae/, /about-us/, /contact/, /services/, /clients/: "2 Mins / Response Time". Conflicts with the visible footer "5 Mins".',
    placements: ["cta-band", "trust-strip"],
    status: "PUBLISHED",
    sortOrder: 1,
    needsReview: true,
    editorNote: `${STAT_NOTE} CONFLICT with response-time-5-mins.`,
  },
  {
    key: "client-satisfaction-99",
    value: "99%",
    numeric: 99,
    suffix: "%",
    label: "Client Satisfaction",
    verified: false,
    sourceNote:
      'Visible in the footer on every page ("99% / Client Satisfaction"); also in the hidden stats block on the homepages, about-us, contact, services and clients. Not contradicted, but no source given.',
    placements: ["trust-strip", "cta-band"],
    status: "PUBLISHED",
    sortOrder: 2,
    needsReview: true,
    editorNote: `${STAT_NOTE} How is it measured?`,
  },
  {
    key: "field-experience-26-8k-hours",
    value: "26.8k Hours",
    numeric: 26.8,
    suffix: "k Hours",
    label: "Field Experience",
    verified: false,
    sourceNote: 'Visible in the footer on every page: "26.8k Hours / Field Experience". Conflicts with the hidden "22+ Years / Field Experience".',
    placements: ["trust-strip", "cta-band"],
    status: "PUBLISHED",
    sortOrder: 3,
    needsReview: true,
    editorNote: `${STAT_NOTE} CONFLICT with field-experience-22-years.`,
  },
  {
    key: "field-experience-22-years",
    value: "22+ Years",
    numeric: 22,
    suffix: "+ Years",
    label: "Field Experience",
    verified: false,
    sourceNote:
      'Hidden (display:none) stats block on the homepages, about-us, contact, services and clients: "22+ Years / Field Experience". Conflicts with the visible footer "26.8k Hours" and with "Founded in 2021".',
    placements: ["trust-strip", "about"],
    status: "PUBLISHED",
    sortOrder: 4,
    needsReview: true,
    editorNote: `${STAT_NOTE} CONFLICT with field-experience-26-8k-hours and founded-2021.`,
  },
  {
    key: "projects-950",
    value: "950+ Projects",
    numeric: 950,
    suffix: "+ Projects",
    label: "Done Around World",
    verified: false,
    sourceNote: 'Hidden (display:none) stats block only: "950+ Projects / Done Around World". Never visible on the live site.',
    placements: ["trust-strip"],
    status: "PUBLISHED",
    sortOrder: 5,
    needsReview: true,
    editorNote: STAT_NOTE,
  },
  {
    key: "established-1995",
    value: "1995+ Year",
    numeric: 1995,
    suffix: "+ Year",
    label: "Established On",
    verified: false,
    sourceNote:
      'Hidden (display:none) stats block: "1995+ Year / Established On"; also "1995 / We Established On" on the theme demo pages /company/ and /about-us-backup/. Conflicts with "Founded in 2021" (/about-us/, visible).',
    placements: ["about", "trust-strip"],
    status: "PUBLISHED",
    sortOrder: 6,
    needsReview: true,
    editorNote: `${STAT_NOTE} CONFLICT with founded-2021. Probably theme demo content.`,
  },
  {
    key: "founded-2021",
    value: "2021",
    numeric: 2021,
    label: "Founded in",
    verified: false,
    sourceNote: '/about-us/ body, visible: "Founded in 2021, Adamas Tech Consulting has rapidly expanded…" (a hidden copy is on /clients/). Conflicts with "1995+ Year Established On" and "22+ Years Field Experience".',
    placements: ["about"],
    status: "PUBLISHED",
    sortOrder: 7,
    needsReview: true,
    editorNote: `${STAT_NOTE} CONFLICT with established-1995 and field-experience-22-years.`,
  },
  {
    key: "team-size-100",
    value: "100+",
    numeric: 100,
    suffix: "+",
    label: "Experts",
    verified: false,
    sourceNote: '/about-us/ body, visible: "With a team of over 100 experts, we blend deep industry knowledge…".',
    placements: ["about", "trust-strip"],
    status: "PUBLISHED",
    sortOrder: 8,
    needsReview: true,
    editorNote: `${STAT_NOTE} "over 100 experts" written as "100+".`,
  },
  {
    key: "experience-3-years",
    value: "3+",
    numeric: 3,
    suffix: "+",
    label: "Years Experience",
    verified: false,
    sourceNote: '/ae/ only, inside a block hidden on all devices ("INNOVATION … 3+ Years Experience / Meet Our Experts"). Never visible.',
    placements: ["about"],
    regions: ["GCC"],
    status: "PUBLISHED",
    sortOrder: 9,
    needsReview: true,
    editorNote: `${STAT_NOTE} Probably theme demo content.`,
  },
];

// ── Logos ───────────────────────────────────────────────────────────────

const IN_UK = ["IN", "UK"] as LogoSeed["regions"];
const ALL = ["IN", "UK", "GCC"] as LogoSeed["regions"];

/** The partner and certification logos ("PARTNERS & CERTIFICATIONS"). The live /ae/ hid the strip; the approved design shows it on every region, so GCC is included since 13 Nov 2026. */
const partnerLogos: LogoSeed[] = [
  // Partner logos as shown in the approved Figma design (13 Nov 2026). Cloudera and the Google Developers Agency Program are not on the live site: DRAFT until confirmed.
  { kind: "PARTNER", name: "AWS Partner Network", logo: "images/partners/aws-partner-network.webp", needsReview: true, editorNote: "Figma partner strip. Tier to confirm (Q5.3)." },
  { kind: "PARTNER", name: "Cloudera", logo: "images/partners/cloudera.webp", status: "DRAFT", needsReview: true, editorNote: "In the Figma partner strip but not on the live site: confirm the partnership before publishing." },
  { kind: "PARTNER", name: "SAP Partner Open Ecosystem", logo: "images/partners/sap-partner-open-ecosystem.webp", needsReview: true, editorNote: "Figma partner strip. Programme to confirm (Q5.3)." },
  { kind: "PARTNER", name: "Google Developers Agency Program", logo: "images/partners/google-developers-agency.webp", status: "DRAFT", needsReview: true, editorNote: "In the Figma partner strip but not on the live site: confirm before publishing." },
  { kind: "PARTNER", name: "AWS", logo: "images/partners/aws.webp" },
  { kind: "PARTNER", name: "SAP", logo: "images/partners/sap.webp" },
  { kind: "PARTNER", name: "Oracle NetSuite", logo: "images/partners/oracle-netsuite.webp" },
  { kind: "PARTNER", name: "MigNow", logo: "images/partners/mignow.webp" },
  { kind: "PARTNER", name: "Leapwork", logo: "images/partners/leapwork.webp" },
  { kind: "PARTNER", name: "Flipkart", logo: "images/partners/flipkart.webp" },
  { kind: "PARTNER", name: "techUK", logo: "images/partners/techuk.webp" },
  { kind: "PARTNER", name: "London Chamber of Commerce and Industry (LCCI)", logo: "images/partners/lcci.webp" },
  { kind: "PARTNER", name: "Open edX", logo: "images/partners/open-edx.webp" },
  { kind: "CERTIFICATION", name: "BSI ISO 9001:2015 Quality Management", logo: "images/certifications/iso-9001-bsi.webp" },
  { kind: "CERTIFICATION", name: "DQS ISO/IEC 27001 Information Security", logo: "images/certifications/iso-27001-dqs.webp" },
  { kind: "CERTIFICATION", name: "CMMI ML3 Appraised", logo: "images/certifications/cmmi-level-3.webp" },
].map((l, i) => ({
  ...(l as LogoSeed),
  regions: ALL,
  status: "PUBLISHED" as const,
  sortOrder: i,
  needsReview: true,
  editorNote:
    'Live image has alt=""; name identified from the image. ' +
    (l.kind === "CERTIFICATION"
      ? "Certificate, number and validity still to be supplied (Q5.9)."
      : "Nature of the relationship (partner / member / marketplace) and any tier to confirm before it is called a partnership."),
}));

/** Client logos. /in/ + /uk/ strip: 15 logos (the first image there is a partner badge banner, not a client). /ae/ strip: 11 logos. */
const clientLogos: LogoSeed[] = (
  [
  // Shown on /in/, /uk/ and /ae/
  { kind: "CLIENT", name: "PwC", logo: "images/clients/pwc.webp", regions: ALL },
  { kind: "CLIENT", name: "Careem", logo: "images/clients/careem.webp", regions: ALL },
  { kind: "CLIENT", name: "United Foods", logo: "images/clients/united-foods.webp", regions: ALL },
  { kind: "CLIENT", name: "Aldar Commercial Kitchen", logo: "images/clients/aldar-commercial-kitchen.webp", regions: ALL },
  { kind: "CLIENT", name: "Gulf Processing Industries LLC", logo: "images/clients/gulf-processing-industries.webp", regions: ALL },
  { kind: "CLIENT", name: "Ajmal", logo: "images/clients/ajmal.webp", regions: ALL },
  { kind: "CLIENT", name: "NCGR", logo: "images/clients/ncgr.webp", regions: ALL },
  // /in/ and /uk/ only
  {
    kind: "CLIENT",
    name: "GRSE (Garden Reach Shipbuilders & Engineers)",
    logo: "images/clients/grse.webp",
    regions: IN_UK,
    editorNote: 'Name read from the logo (white "GRSE" hexagon emblem; file 4-scaled-e1774249821356.webp). Confirm.',
  },
  { kind: "CLIENT", name: "WorkIndia", logo: "images/clients/workindia.webp", regions: IN_UK },
  { kind: "CLIENT", name: "Infocom (An ABP initiative)", logo: "images/clients/infocom.webp", regions: IN_UK },
  { kind: "CLIENT", name: "Webel", logo: "images/clients/webel.webp", regions: IN_UK },
  {
    kind: "CLIENT",
    name: "Indian Institute of Science (IISc)",
    logo: "images/clients/iisc.webp",
    regions: IN_UK,
    editorNote: "Name read from the white seal (file 9-e1774249746732.webp); /clients/ also has IISc_Master_Seal-1.png. Confirm.",
  },
  { kind: "CLIENT", name: "Navneet", logo: "images/clients/navneet.webp", regions: IN_UK },
  {
    kind: "CLIENT",
    name: "Saline Water Conversion Corporation (SWCC)",
    logo: "images/clients/swcc.webp",
    regions: IN_UK,
    editorNote:
      "Name read from the white logo (file 14-e1774249906517.webp); /clients/ also has the SWCC vector logo. A Saudi client shown on the India/UK strip: add AE? Confirm.",
  },
  { kind: "CLIENT", name: "Pi-Square Technologies", logo: "images/clients/pi-square-technologies.webp", regions: IN_UK },
  // /ae/ only
  {
    kind: "CLIENT",
    name: "Emirates (bottled drinking water)",
    logo: "images/clients/emirates-drinking-water.webp",
    regions: ["GCC"],
    editorNote: 'Name read from the logo ("Emirates", "Since 1979", drinking water). Confirm the company name.',
  },
  { kind: "CLIENT", name: "Rain Stella Technologies", logo: "images/clients/rain-stella-technologies.webp", regions: ["GCC"] },
  { kind: "CLIENT", name: "KOA", logo: "images/clients/koa.webp", regions: ["GCC"] },
  {
    kind: "CLIENT",
    name: "Avenue Professional Document Clearing LLC",
    logo: "images/clients/avenue-professional-document-clearing.webp",
    regions: ["GCC"],
  },
  ] as LogoSeed[]
).map((l, i) => ({
  ...l,
  status: "PUBLISHED" as const,
  sortOrder: 100 + i,
  needsReview: true,
  editorNote:
    (l.editorNote ? l.editorNote + " " : 'Live image has alt=""; name identified from the image. ') +
    "Client permission to show the logo to confirm (Q5.5).",
}));

export const logos: LogoSeed[] = [...partnerLogos, ...clientLogos];

// ── Certifications (Q5.9) ───────────────────────────────────────────────

const CERT_FLAG = "MISSING: certificate PDF, certificate number and validity date (Q5.9). verified = false until supplied.";

export const certifications: CertificationSeed[] = [
  {
    slug: "iso-9001",
    name: "ISO 9001:2015 Quality Management",
    issuer: "BSI",
    standard: "ISO 9001:2015",
    badge: "images/certifications/iso-9001-bsi.webp",
    verified: false,
    status: "PUBLISHED",
    sortOrder: 0,
    needsReview: true,
    editorNote: `${CERT_FLAG} Issuer read from the badge ("BSI ISO 9001:2015 Quality Management"). Also stated on /about-us/ and in "Certified Quality".`,
  },
  {
    slug: "iso-27001",
    name: "ISO/IEC 27001 Information Security",
    issuer: "DQS",
    standard: "ISO/IEC 27001",
    badge: "images/certifications/iso-27001-dqs.webp",
    verified: false,
    status: "PUBLISHED",
    sortOrder: 1,
    needsReview: true,
    editorNote: `${CERT_FLAG} Issuer read from the badge ("DQS ISO/IEC 27001"). Edition year (2013 or 2022) not shown: confirm.`,
  },
  {
    slug: "cmmi-level-3",
    name: "CMMI Maturity Level 3",
    standard: "CMMI ML3",
    badge: "images/certifications/cmmi-level-3.webp",
    verified: false,
    status: "PUBLISHED",
    sortOrder: 2,
    needsReview: true,
    editorNote: `${CERT_FLAG} Badge reads "CMMI ML3 Appraised"; /about-us/ says "CMMI Level 3 certification holder". Appraisal model/version, appraising body and expiry needed.`,
  },
  {
    slug: "aws-partner",
    name: "AWS Partner",
    issuer: "Amazon Web Services",
    badge: "images/partners/aws.webp",
    verified: false,
    status: "DRAFT",
    sortOrder: 3,
    needsReview: true,
    editorNote:
      'DECISION: tier to confirm. The live client-strip banner reads "AWS Partner Advanced Tier Services", and /aws-solutions/ claims "AWS Advanced Tier Partner", "AWS AI Services Competency" and "AWS Education Consulting Competency". Not stated as a credential until confirmed with evidence.',
  },
  {
    slug: "sap-partner",
    name: "SAP PartnerEdge",
    issuer: "SAP",
    badge: "images/partners/sap.webp",
    verified: false,
    status: "DRAFT",
    sortOrder: 4,
    needsReview: true,
    editorNote: "DECISION: SAP PartnerEdge status and level to confirm (shown on the live partner badge banners).",
  },
  {
    slug: "oracle-netsuite-partner",
    name: "Oracle NetSuite Partner",
    issuer: "Oracle NetSuite",
    badge: "images/partners/oracle-netsuite.webp",
    verified: false,
    status: "DRAFT",
    sortOrder: 5,
    needsReview: true,
    editorNote:
      'DECISION: partner programme and tier to confirm. Live hero slide: "As an Oracle NetSuite Partner"; Vimeo video title "Oracel Netsuite Alliance Partner".',
  },
];
