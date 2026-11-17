import type { HeroSlideSeed, HomeSeed } from "./types";

/**
 * Regional homepages. Source: docs/source-content/in.md, uk.md (identical to /in/), ae.md, _summary.md §1–2.
 * Hero CTA on every live slide: "Let’s Talk" → /contact.
 */

const CTA = { ctaLabel: "Let’s Talk", ctaHref: "/contact" } as const;

const POSTER_NOTE =
  "Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S3/CloudFront.";

const slideDigitalTransformation: HeroSlideSeed = {
  navLabel: "Digital Transformation",
  headline: "Seeking Digital Transformation?",
  body: "AI/ML Solutions · AWS Services · SAP Solutions · Technology Transformation",
  ...CTA,
  vimeoId: "1143398275",
  poster: "images/hero/digital-transformation.jpg",
  status: "PUBLISHED",
  needsReview: true,
  editorNote: `Headline typo fixed ("Transformation ?" → "Transformation?"). Body is the slide's tag words, joined with "·". ${POSTER_NOTE}`,
};

const slideAws: HeroSlideSeed = {
  navLabel: "AWS",
  headline: "Scale Smarter. Build Faster. On AWS.",
  body: "From cloud migration to AI automation, we help you optimise workloads, boost performance, and drive profitable growth with AWS-certified capabilities.",
  ...CTA,
  vimeoId: "1177633889",
  poster: "images/hero/aws.jpg",
  status: "PUBLISHED",
  needsReview: true,
  editorNote: `"AWS-certified capabilities": confirm the AWS partner tier/competencies before launch. ${POSTER_NOTE}`,
};

const slideOracle: HeroSlideSeed = {
  navLabel: "Oracle NetSuite",
  headline: "Transform Operations with Oracle NetSuite",
  body: "As an Oracle NetSuite Partner, we help enterprises replace fragmented systems with a unified, cloud-native ERP built for growth and governance.",
  ...CTA,
  vimeoId: "1150026207",
  poster: "images/hero/oracle-netsuite.jpg",
  status: "PUBLISHED",
  needsReview: true,
  editorNote: `"Oracle NetSuite Partner": partner status to confirm (credentials). ${POSTER_NOTE}`,
};

const slideSap: HeroSlideSeed = {
  navLabel: "SAP",
  headline: "Reinvent SAP for the Digital Era",
  body: "Modernise legacy systems, integrate business functions, and deliver smarter workflows with our end-to-end SAP transformation services.",
  ...CTA,
  vimeoId: "1142019553",
  poster: "images/hero/sap.jpg",
  status: "PUBLISHED",
  needsReview: true,
  editorNote: POSTER_NOTE,
};

/**
 * Approved design (Figma hero, 13 Nov 2026): the hero carries one headline (ContentBlock "home.hero") and a card
 * carousel of three stories. The cards reuse HeroSlide: navLabel = card category, eyebrow = date line, headline = card
 * title, ctaHref = link, poster = card image. The earlier video slides are kept below for reference and archived.
 */
const FIGMA_CARD = "Card copy from the approved Figma hero (13 Nov 2026).";
const heroCardEvent: HeroSlideSeed = {
  navLabel: "Event",
  eyebrow: "Event, 26 November 2026",
  headline: "Join us at the House of Lords, London",
  ctaLabel: "View event",
  ctaHref: "/insights/events/house-of-lords-2026",
  poster: "images/home/hero-card-event.webp",
  status: "PUBLISHED",
  needsReview: true,
  editorNote: FIGMA_CARD + " Event details are DRAFT (Q6.1-Q6.6).",
};
const heroCardArivoo: HeroSlideSeed = {
  navLabel: "Solutions",
  headline: "Arivoo runs universities, schools and learning programmes",
  ctaLabel: "Explore Arivoo",
  ctaHref: "https://arivoo.in",
  poster: "images/home/hero-card-arivoo.webp",
  status: "PUBLISHED",
  needsReview: true,
  editorNote: FIGMA_CARD + " Typo fixed: Figma says \"Arivoo\" as \"Arivoo runs universities, schools and learning programmes\".",
};
const heroCardTreasury: HeroSlideSeed = {
  navLabel: "Case study",
  headline: "How SAP Treasury improved cash forecasting by 30%",
  ctaLabel: "Read the case study",
  ctaHref: "/case-studies/sap-treasury-cash-forecasting",
  poster: "images/home/hero-card-treasury.webp",
  // DRAFT: BUG-014 sweep, 17 Nov 2026: unverified 30% figure (Q5.5); the card links to a DRAFT case study
  status: "DRAFT",
  needsReview: true,
  editorNote: FIGMA_CARD + " The 30% figure is unverified (case study DRAFT, Q5.5).",
};
const heroCards = [heroCardEvent, heroCardArivoo, heroCardTreasury];

const withOrder = (slides: HeroSlideSeed[]): HeroSlideSeed[] =>
  slides.map((s, i) => ({ ...s, sortOrder: i }));

/** /in/ service cards (live "OUR SERVICES" section). Card bullets have no field and are not migrated. */
const inServiceCards: HomeSeed["serviceCards"] = [
  {
    title: "SAP Services",
    body: "We handle implementation to optimization, aligning your enterprise systems with strategic goals for optimal performance.",
    href: "/services/digital-transformation/sap",
    status: "PUBLISHED",
    sortOrder: 0,
  },
  {
    title: "AWS Services",
    body: "Harness advanced AWS services in AI, automation, and cloud to drive digital transformation, efficiency, and scalable growth across your business.",
    href: "/services/cloud-services",
    status: "PUBLISHED",
    sortOrder: 1,
  },
  {
    title: "AI/ML Services",
    body: "Automate processes to enhance efficiency and reduce operational costs.",
    href: "/services/ai-services/ai-ml",
    status: "PUBLISHED",
    sortOrder: 2,
  },
  {
    title: "Oracle NetSuite Services",
    body: "Unified Cloud ERP for Modern Construction",
    href: "/services/cloud-services/cloud-automation",
    status: "PUBLISHED",
    sortOrder: 3,
    needsReview: true,
    editorNote: "CONFLICT: construction-specific line, unlike the other cards. Keep, or use the /ae/ wording?",
  },
  {
    title: "Open edX® Services",
    body: "Custom development and services for scalable and engaging learning experiences.",
    href: "/services/digital-transformation/edtech-openedx",
    status: "PUBLISHED",
    sortOrder: 4,
  },
  {
    title: "Technology Transformation",
    body: "Enhance efficiency, agility, and scalability in operations by optimize, and transform digitally.",
    href: "/services/digital-transformation",
    status: "PUBLISHED",
    sortOrder: 5,
    needsReview: true,
    editorNote: 'Live wording "by optimize, and transform digitally" is ungrammatical. Kept verbatim: needs client wording.',
  },
];

export const homes: HomeSeed[] = [
  {
    region: "IN",
    // SEO: tagline from the live <title> + the live services intro sentence (no meta description exists on the live site).
    seoTitle: "IT consultancy and solutions | AdamasTech Consulting India",
    seoDescription: "Tailored tech solutions driving growth, efficiency, and reliability with expert, customer-focused, scalable services.",
    status: "PUBLISHED",
    featuredEvent: "house-of-lords-2026",
    eventProminence: "STANDARD",
    showTrustStrip: true,
    showWhyUs: true,
    heroSlides: withOrder([...heroCards, ...[slideDigitalTransformation, slideAws, slideOracle, slideSap].map((x) => ({ ...x, status: "ARCHIVED" as const }))]),
    // Retired: the 3-pillar explorer replaces this grid on /in/ and /uk/ (it duplicated the pillars). ARCHIVED, not
    // DRAFT, so PREVIEW_DRAFTS never shows it; the rows stay in the DB so an editor can restore them.
    serviceCards: inServiceCards?.map((c) => ({ ...c, status: "ARCHIVED" as const })),
  },
  {
    region: "UK",
    // SEO: tagline from the live <title> + the live services intro sentence (no meta description exists on the live site).
    seoTitle: "IT consultancy and solutions | AdamasTech Consulting UK & Ireland",
    seoDescription: "Tailored tech solutions driving growth, efficiency, and reliability with expert, customer-focused, scalable services.",
    status: "PUBLISHED",
    featuredEvent: "house-of-lords-2026",
    eventProminence: "FEATURED",
    showTrustStrip: true,
    showWhyUs: true,
    heroSlides: withOrder([...heroCards, ...[slideDigitalTransformation, slideAws, slideOracle, slideSap].map((x) => ({ ...x, status: "ARCHIVED" as const }))]),
    // Retired: the 3-pillar explorer replaces this grid on /in/ and /uk/ (it duplicated the pillars). ARCHIVED, not
    // DRAFT, so PREVIEW_DRAFTS never shows it; the rows stay in the DB so an editor can restore them.
    serviceCards: inServiceCards?.map((c) => ({ ...c, status: "ARCHIVED" as const })),
    needsReview: true,
    editorNote:
      "Live /uk/ is a copy of /in/. UK content starts from the India homepage; the only UK emphasis is the London office, the +44 phone and the featured House of Lords event. Any UK-specific headline or copy? (Q3.1, Q3.8)",
  },
  {
    region: "GCC",
    // SEO: tagline from the live <title> + the live services intro sentence (no meta description exists on the live site).
    seoTitle: "IT consultancy and solutions | AdamasTech Consulting GCC",
    seoDescription: "Tailored tech solutions driving growth, efficiency, and reliability with expert, customer-focused, scalable services.",
    status: "PUBLISHED",
    featuredEvent: "house-of-lords-2026",
    eventProminence: "STANDARD",
    showTrustStrip: true,
    // The approved Figma homepage shows Tech Excellence on every region (the live /ae/ hid it); shown on GCC since 13 Nov 2026.
    showWhyUs: true,
    needsReview: true,
    editorNote:
      'Live /ae/: 3 slides (no AWS), Tech Excellence hidden (so showWhyUs = false), Partners hidden: the trust strip shows the GCC client logos instead (confirm). Live AE posters are local uploads (/2026/05/Img-1.png, Img_2.png, Img_3.png); the shared Vimeo posters are used here. The promo banner\'s second button "Learn More" → /e-invoicing-uae is not migrated (PromoBanner has one CTA, and the e-invoicing page is draft, Q2.4). The banner\'s three badges (Built for UAE / VAT compliance, Works with any / ERP system, Secure & / Enterprise-ready) have no field.',
    promoBanner: {
      eyebrow: "Deadline approaching: July 2026",
      heading: "UAE E-Invoicing Is Coming. Be Ready Before the Deadline.",
      body: "We seamlessly convert your unstructured invoices—PDFs, paper, and legacy exports—into the FTA-mandated structured digital format, routing them directly through our approved ASP partners for instant compliance.",
      ctaLabel: "Take Assessment",
      ctaHref: "https://adamastech.ae/assessment/",
      external: true,
    },
    heroSlides: withOrder([...heroCards, ...[slideDigitalTransformation, slideOracle, slideSap].map((x) => ({ ...x, status: "ARCHIVED" as const }))]),
    serviceCards: [
      {
        title: "SAP Services",
        body: "Enterprise SAP solutions for UAE organizations seeking better control, visibility, and operational efficiency.",
        href: "/services/digital-transformation/sap",
        status: "PUBLISHED",
        sortOrder: 0,
      },
      {
        title: "Oracle NetSuite Services",
        body: "Cloud ERP solutions for UAE businesses focused on agility, financial visibility, and scalable growth.",
        href: "/services/cloud-services/cloud-automation",
        status: "PUBLISHED",
        sortOrder: 1,
      },
      {
        title: "AI/ML Services",
        body: "AI solutions that automate workflows, improve decisions, and unlock measurable business value.",
        href: "/services/ai-services/ai-ml",
        status: "PUBLISHED",
        sortOrder: 2,
      },
      {
        title: "Mobile App Development",
        body: "Mobile apps designed for seamless customer experiences, workforce productivity, and digital engagement.",
        href: "/services/digital-transformation/application-development",
        status: "PUBLISHED",
        sortOrder: 3,
        needsReview: true,
        editorNote:
          "Unlinked on the live /ae/ page (no Mobile App Development page exists). Linked to Application Development, which lists Mobile App Development as an expertise. Confirm.",
      },
      {
        title: "Open edX® Services",
        body: "Digital learning platforms for institutions and enterprises across the UAE and wider region.",
        href: "/services/digital-transformation/edtech-openedx",
        status: "PUBLISHED",
        sortOrder: 4,
      },
      {
        title: "Technology Transformation",
        body: "Modernize legacy systems and accelerate digital transformation across operations, platforms, and customer experiences.",
        href: "/services/digital-transformation",
        status: "PUBLISHED",
        sortOrder: 5,
      },
    ],
  },
];
