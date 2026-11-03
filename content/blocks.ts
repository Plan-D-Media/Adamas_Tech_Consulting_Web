import type { ContentBlockSeed } from "./types";

/**
 * Homepage section headers. Source: docs/source-content/in.md (section headers), ae.md, contact.md, _global.md (footer CTA band).
 * Eyebrows are stored in title case; the live site renders them in capitals via CSS.
 */
export const contentBlocks: ContentBlockSeed[] = [
  {
    key: "home.trust",
    eyebrow: "Partners & Certifications",
    heading: "Trusted Partners & Certified Excellence",
    body: "Adamas Tech Consulting collaborates with industry-leading partners and holds key certifications, ensuring top-tier solutions and expertise for every project.",
    status: "PUBLISHED",
    sortOrder: 0,
  },
  {
    key: "home.trust",
    region: "AE",
    eyebrow: "Clients",
    heading: "Trusted by organisations across the GCC",
    ctaLabel: "View All",
    ctaHref: "/case-studies",
    status: "PUBLISHED",
    sortOrder: 0,
    needsReview: true,
    editorNote:
      "INTERIM HEADING (design round 2, client sign-off): live /ae/ hides Partners & Certifications and shows a client-logo strip with no heading (only a 'View All' button to /clients, now redirected to /case-studies). Neutral heading shown until the client supplies wording or confirms the strip should run without one.",
  },
  {
    key: "home.whatWeDo",
    eyebrow: "Our Services",
    heading: "Driving Growth Through Innovative Solutions",
    body: "Tailored tech solutions driving growth, efficiency, and reliability with expert, customer-focused, scalable services.",
    ctaLabel: "View All",
    ctaHref: "/services",
    status: "PUBLISHED",
    sortOrder: 1,
    needsReview: true,
    editorNote:
      'The live site has no 3-pillar "What we do" section; this is the live "OUR SERVICES" header, reused for the pillar explorer. Confirm.',
  },
  {
    key: "home.solutions",
    eyebrow: "Solutions",
    heading: "Products and AI solutions",
    ctaLabel: "All solutions",
    ctaHref: "/solutions",
    status: "PUBLISHED",
    sortOrder: 2,
    needsReview: true,
    editorNote:
      'INTERIM HEADING (design round 2, client sign-off): no visible Solutions section on the live homepages (the "Discover Arivoo" products block on /ae/ is hidden on all devices and was not migrated). Neutral heading "Products and AI solutions" shown; intro line still needed.',
  },
  {
    key: "home.industries",
    eyebrow: "Industries",
    heading: "Empowering growth in diverse industries",
    status: "PUBLISHED",
    sortOrder: 3,
  },
  {
    key: "home.caseStudies",
    eyebrow: "Success Stories",
    heading: "Results-Driven projects that deliver excellence",
    body: "Discover the remarkable projects that highlight our innovation, expertise, and commitment to delivering excellence.",
    ctaLabel: "View all case studies",
    ctaHref: "/case-studies",
    status: "PUBLISHED",
    sortOrder: 4,
    needsReview: true,
    editorNote: 'Typo fixed: "Results- Driven" → "Results-Driven". Live button label is "View All".',
  },
  {
    key: "home.whyUs",
    eyebrow: "Tech Excellence",
    heading: "Develop Innovations That Propel Your Business",
    status: "PUBLISHED",
    sortOrder: 5,
    extra: {
      image: "images/why-us.webp",
      items: [
        {
          title: "Customized Solutions",
          body: "A client-centric approach that emphasizes collaboration, understanding goals, and creating custom solutions for growth.",
        },
        {
          title: "Proven Expertise",
          body: "Extensive experience across multiple sectors, delivering tailored solutions that drive measurable results.",
        },
        {
          title: "Certified Quality",
          body: "ISO 9001, ISO 27001 certified, and CMMI Level 3, ensuring top standards of quality, security, and compliance.",
        },
        {
          title: "Comprehensive Services",
          body: "Offering full-cycle support from consultation to deployment, ensuring seamless integration and long-term success.",
        },
      ],
    },
    needsReview: true,
    editorNote:
      '"Certified Quality" states ISO 9001, ISO 27001 and CMMI Level 3: certificates, numbers and validity still to be supplied (Q5.9). Hidden on the live /ae/ page.',
  },
  {
    key: "home.events",
    eyebrow: "Events",
    heading: "Upcoming events",
    ctaLabel: "All events",
    ctaHref: "/insights/events",
    status: "PUBLISHED",
    sortOrder: 6,
    needsReview: true,
    editorNote: "INTERIM HEADING (design round 2, client sign-off): no events section on the live site. Neutral heading \"Upcoming events\" shown until the client supplies wording (House of Lords event, Q6.1–Q6.6).",
  },
  {
    key: "home.presence",
    eyebrow: "Our Presence",
    heading: "Explore our global presence around the world",
    status: "PUBLISHED",
    sortOrder: 7,
    needsReview: true,
    editorNote:
      'Live homepages show only the eyebrow "Our Presence". Heading taken from the /contact/ "Locations" section. Confirm.',
  },
  {
    key: "home.cta",
    heading: "Let’s get started on something great",
    body: "Our team of IT experts looks forward to meeting with you and providing valuable insights tailored to your business.",
    ctaLabel: "Get an appointment now",
    ctaHref: "/contact",
    status: "PUBLISHED",
    sortOrder: 8,
    extra: {
      contactEyebrow: "Contact",
      contactHeading: "Let’s get in touch",
      contactBody: "You can reach us anytime via marketing@adamastech.in",
    },
    needsReview: true,
    editorNote:
      'Live footer CTA band. The band\'s stats (5 Mins / 99% / 26.8k Hours) are seeded as unverified Stats, not here. extra.contact* is the live contact-section header ("Lets get in touch" typo fixed to "Let’s get in touch").',
  },
];
