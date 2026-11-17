import type { NavigationSeed, NavItemSeed } from "./types";

/**
 * Header mega-menus, footer columns, legal and social links.
 * Topbar order (client change, 2 Nov 2026): About Us · Services · Solutions · Case Studies · Insights.
 * Names follow docs/sitemap-latest.csv ("Adamas tech comment" column, 13 Nov 2026) where it renames something.
 * (Previously confirmed 15 Oct: Services · Solutions · Case Studies · Insights · About Us.)
 * Footer columns follow the same order: Company (About) · Services · Solutions · Insights.
 * Descriptors come from the pillar/service intros in content/services.ts and the live Arivoo menu blurbs.
 */

const P = "PUBLISHED" as const;
const D = "DRAFT" as const;

const withOrder = (items: NavItemSeed[]): NavItemSeed[] =>
  items.map((item, i) => ({
    ...item,
    status: item.status ?? P,
    sortOrder: i,
    children: item.children ? withOrder(item.children) : undefined,
  }));

// ── Services ────────────────────────────────────────────────────────────
const servicesMenu: NavItemSeed = {
  key: "header.services",
  label: "Services",
  href: "/services",
  featuredCaseStudy: "sap-treasury-cash-forecasting",
  needsReview: true,
  editorNote:
    "Featured card = the SAP Treasury case study (the live Services mega-menu also featured SAP Treasury). The case study is DRAFT until client clearance, so the card stays hidden until it is published.",
  children: [
    {
      key: "services.cloud-services",
      label: "Cloud Services",
      href: "/services/cloud-services",
      descriptor: "Cloud that Scales your Organisation",
      children: [
        {
          label: "Migration & Modernization",
          href: "/services/cloud-services/migration-modernization",
          descriptor: "Migrate workloads, modernise architecture, and move from legacy systems to scalable AWS-native environments.",
        },
        {
          label: "DevOps & SecOps",
          href: "/services/cloud-services/devops-secops",
          descriptor: "Resilient | Reliable | Cost optimised | Intelligent",
        },
        {
          label: "Managed Services",
          href: "/services/cloud-services/managed-services",
          descriptor: "Improve reliability, security, performance, and cost efficiency with ongoing AWS operations and governance.",
        },
        {
          label: "AI/ML Ops",
          // DRAFT: BUG-014 sweep, 17 Nov 2026: placeholder descriptor; the service page itself is DRAFT (placeholder copy)
          status: "DRAFT",
          href: "/services/cloud-services/ai-ml-ops",
          descriptor: "[Placeholder] One line on AI/ML Ops.",
          needsReview: true,
          editorNote: "Renamed from SAP on Cloud (sitemap comment, 13 Nov 2026); slug renamed, old slug 301s here. MISSING: descriptor and page copy for AI/ML Ops.",
        },
        {
          label: "Cloud Automation",
          href: "/services/cloud-services/cloud-automation",
          descriptor: "[Placeholder] One line on cloud automation.",
          needsReview: true,
          editorNote: "Renamed from Oracle NetSuite / Cloud ERP (sitemap comment, 13 Nov 2026); slug renamed, old slug 301s here. MISSING: descriptor and page copy for Cloud Automation.",
        },
        {
          label: "Cloud Advisory & Consultation",
          href: "/services/cloud-services/cloud-advisory-consultation",
          descriptor: "Strengthen cloud security, access control, compliance posture, and operational governance across AWS estates.",
          needsReview: true,
          editorNote: "Renamed from Cloud Security & FinOps (sitemap comment, 13 Nov 2026); slug renamed (old slug 301s here), descriptor kept. Confirm the descriptor still fits.",
        },
      ],
    },
    {
      key: "services.digital-transformation",
      label: "Digital Transformation",
      href: "/services/digital-transformation",
      descriptor: "Transformative Technology Expertise",
      children: [
        {
          label: "SAP Solutions & Consulting",
          href: "/services/digital-transformation/sap",
          descriptor: "Transforming business for the future",
        },
        {
          label: "Application Development",
          href: "/services/digital-transformation/application-development",
          descriptor: "Transforming Ideas into Powerful Applications",
        },
        {
          label: "Data Science & Analytics",
          href: "/services/digital-transformation/data-analytics",
          descriptor: "Unleashing data's power for smarter strategic business decisions",
        },
        {
          label: "Master Data Governance",
          href: "/services/digital-transformation/master-data-governance",
          descriptor: "Harness the Potential of Data",
        },
        {
          label: "Open edX® / EdTech Platform",
          href: "/services/digital-transformation/edtech-openedx",
          descriptor: "Custom development and services for scalable and engaging learning experiences.",
        },
        {
          label: "UAE E-Invoicing",
          href: "/services/digital-transformation/e-invoicing-uae",
          descriptor: "UAE E-Invoicing Is Coming. Be Ready Before the Deadline.",
          status: D,
          needsReview: true,
          editorNote: "DECISION Q2.4: keep or retire the UAE e-invoicing page, and show it to GCC visitors only? Draft until decided.",
        },
      ],
    },
    {
      key: "services.ai-services",
      label: "Data & AI Services",
      href: "/services/ai-services",
      descriptor: "Empowering businesses to thrive in the digital era through innovative AI and scalable analytics solutions",
      children: [
        {
          label: "AI / ML Solutions",
          href: "/services/ai-services/ai-ml",
          descriptor: "Automate processes to enhance efficiency and reduce operational costs.",
        },
        {
          label: "Agentic AI Solutions",
          href: "/services/ai-services/agentic-ai",
          descriptor: "Agentic AI solution design and orchestration",
        },
        {
          label: "Computer Vision",
          // DRAFT: the service row is DRAFT (placeholder summary), so a PUBLISHED menu row pointed the header
          // at a URL that only answers the unpublished fallback (QA BUG-038, 17 Nov 2026).
          status: "DRAFT",
          href: "/services/ai-services/computer-vision",
          descriptor: "Computer vision and intelligent monitoring solutions",
          needsReview: true,
          editorNote: "Publish together with the computer-vision service page once its summary copy is confirmed.",
        },
        {
          label: "Generative & Applied AI",
          href: "/services/ai-services/generative-ai",
          descriptor: "Generative AI strategy and implementation",
        },
        {
          label: "Data Engineering",
          // DRAFT: BUG-014 sweep, 17 Nov 2026: placeholder descriptor; the service page itself is DRAFT (placeholder copy)
          status: "DRAFT",
          href: "/services/ai-services/data-engineering",
          descriptor: "[Placeholder] One line on data engineering.",
          needsReview: true,
          editorNote: "Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy.",
        },
        {
          label: "Advanced Analytics",
          // DRAFT: BUG-014 sweep, 17 Nov 2026: placeholder descriptor; the service page itself is DRAFT (placeholder copy)
          status: "DRAFT",
          href: "/services/ai-services/advanced-analytics",
          descriptor: "[Placeholder] One line on advanced analytics.",
          needsReview: true,
          editorNote: "Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy.",
        },
        {
          label: "Sovereign AI",
          // DRAFT: BUG-014 sweep, 17 Nov 2026: placeholder descriptor; the service page itself is DRAFT (placeholder copy)
          status: "DRAFT",
          href: "/services/ai-services/sovereign-ai",
          descriptor: "[Placeholder] One line on sovereign AI.",
          needsReview: true,
          editorNote: "Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy.",
        },
        {
          label: "Responsible AI",
          // DRAFT: BUG-014 sweep, 17 Nov 2026: placeholder descriptor; the service page itself is DRAFT (placeholder copy)
          status: "DRAFT",
          href: "/services/ai-services/responsible-ai",
          descriptor: "[Placeholder] One line on responsible AI.",
          needsReview: true,
          editorNote: "Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy.",
        },
        {
          label: "AI Security & Governance",
          // DRAFT: BUG-014 sweep, 17 Nov 2026: placeholder descriptor; the service page itself is DRAFT (placeholder copy)
          status: "DRAFT",
          href: "/services/ai-services/ai-security-governance",
          descriptor: "[Placeholder] One line on AI security and governance.",
          needsReview: true,
          editorNote: "Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy.",
        },
      ],
    },
    { key: "services.overview", label: "Services overview", href: "/services" },
  ],
};

// ── Solutions ───────────────────────────────────────────────────────────
const solutionsMenu: NavItemSeed = {
  key: "header.solutions",
  label: "Solutions",
  href: "/solutions",
  featuredCaseStudy: "face-recognition",
  needsReview: true,
  editorNote: "Featured card = the face-recognition case study (DRAFT until client clearance, so hidden until published).",
  children: [
    {
      key: "solutions.arivoo",
      label: "Arivoo",
      href: "https://arivoo.in",
      external: true,
      descriptor: "Shaping the Future of Education.",
      needsReview: true,
      editorNote:
        "Brief (13 Nov 2026) and the 17 Nov 2026 scope change: the menu item opens arivoo.in in a new tab (Q7.1). Solutions have no pages on this site, so there is no /solutions/arivoo overview page any more.",
      children: [
        {
          key: "solutions.arivoo-ums",
          label: "Arivoo UMS",
          href: "https://arivoo.in/arivoo-ums",
          external: true,
          descriptor: "Efficient campus operations, improved student experience.",
        },
        {
          key: "solutions.arivoo-sms",
          label: "Arivoo SMS",
          href: "https://arivoo.in/arivoo-sms",
          external: true,
          descriptor: "Streamlined school administration, enhanced learning experience.",
        },
        {
          key: "solutions.arivoo-lms",
          label: "Arivoo LMS",
          href: "https://arivoo.in/arivoo-lms",
          external: true,
          descriptor: "Centralised learning, seamless education, enhanced outcomes.",
        },
      ],
    },
    {
      key: "solutions.a-eye",
      // DRAFT until the client supplies the product website URL (17 Nov 2026): solutions link out, so without a
      // URL there is nothing to link to. No URL was guessed.
      status: "DRAFT",
      label: "A-EYE",
      external: true,
      descriptor: "[Placeholder] One-line product descriptor.",
      needsReview: true,
      editorNote: "Name A-EYE from the brief and sitemap (13 Nov 2026). MISSING (Q7.2): the product website URL (set `href`) and the descriptor.",
    },
    {
      key: "solutions.air-mind",
      // DRAFT until the client supplies the product website URL (17 Nov 2026): solutions link out, so without a
      // URL there is nothing to link to. No URL was guessed.
      status: "DRAFT",
      label: "AIR-MIND",
      external: true,
      descriptor: "[Placeholder] One-line product descriptor.",
      needsReview: true,
      editorNote: "Name AIR-MIND from the brief and sitemap (13 Nov 2026). MISSING (Q7.2): the product website URL (set `href`) and the descriptor.",
    },
    {
      key: "solutions.ai-solutions",
      label: "AI Solutions",
      children: [
        {
          key: "solutions.face-recognition",
          // DRAFT until the client supplies the product website URL (17 Nov 2026): no page here, no URL yet.
          status: D,
          label: "Face Recognition Security",
          external: true,
          descriptor: "Effortless Security through AI Recognition",
          needsReview: true,
          editorNote: "MISSING (17 Nov 2026): the product website URL (set `href`). The descriptor is live-site copy and is ready.",
        },
        {
          key: "solutions.industrial-analytics",
          // DRAFT until the client supplies the product website URL (17 Nov 2026): no page here, no URL yet.
          status: D,
          label: "Industrial Analytics",
          external: true,
          descriptor: "Effortless Parking with AI Intelligence",
          needsReview: true,
          editorNote: "MISSING (17 Nov 2026): the product website URL (set `href`). The descriptor is live-site copy and is ready.",
        },
        {
          key: "solutions.asset-tracking",
          // DRAFT: BUG-014 sweep (unverified 30% figure in the descriptor) and no product website URL yet (17 Nov 2026).
          status: "DRAFT",
          label: "Asset Tracking",
          external: true,
          descriptor: "Boosting Cash Forecasting by 30%",
          needsReview: true,
          editorNote:
            'MISSING (17 Nov 2026): the product website URL (set `href`). Also verify the "30%" figure in the descriptor (Q5.5).',
        },
        {
          key: "solutions.ai-solution-4",
          label: "[Placeholder] AI solution 4",
          external: true,
          status: D,
          needsReview: true,
          editorNote: "MISSING (Q5.3): AI solution 4. Candidates: PPE Detection, Steel Plate Inspection, InvoiceAI, RAG chatbot.",
        },
        {
          key: "solutions.ai-solution-5",
          label: "[Placeholder] AI solution 5",
          external: true,
          status: D,
          needsReview: true,
          editorNote: "MISSING (Q5.3): AI solution 5.",
        },
        {
          key: "solutions.ai-solution-6",
          label: "[Placeholder] AI solution 6",
          external: true,
          status: D,
          needsReview: true,
          editorNote: "MISSING (Q5.3): AI solution 6.",
        },
      ],
    },
    // "/solutions" has no page: proxy.ts sends it to the Products & Solutions section of the visitor's regional
    // homepage (one 301, region from the cookie), so this link works with JavaScript off and in every region.
    { key: "solutions.all", label: "All solutions", href: "/solutions" },
  ],
};

// ── Insights / About ────────────────────────────────────────────────────
const insightsMenu: NavItemSeed = {
  key: "header.insights",
  label: "Insights",
  href: "/insights/events",
  featuredEvent: "house-of-lords-2026",
  children: [
    { key: "insights.events", label: "Events", href: "/insights/events" },
    {
      key: "insights.blog",
      label: "Blog",
      href: "/insights/blog",
      comingSoon: true,
      needsReview: true,
      editorNote: "Phase 2 (Q2.9): hidden or 'coming soon' at launch.",
    },
  ],
};

const aboutMenu: NavItemSeed = {
  key: "header.about",
  label: "About Us",
  href: "/about",
  children: [
    { key: "about.company", label: "Company", href: "/about" },
    { key: "about.team", label: "Team", href: "/about/team" },
    {
      key: "about.careers",
      label: "Careers",
      href: "/about/careers",
      comingSoon: true,
      needsReview: true,
      editorNote: "Phase 2 (Q2.9, Q13.1).",
    },
  ],
};

// ── Footer ──────────────────────────────────────────────────────────────
const footer: NavItemSeed[] = [
  {
    key: "footer.company",
    label: "Company",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Team", href: "/about/team" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Credentials", href: "/credentials" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    key: "footer.services",
    label: "Services",
    children: [
      { label: "Cloud Services", href: "/services/cloud-services" },
      { label: "Digital Transformation", href: "/services/digital-transformation" },
      { label: "Data & AI Services", href: "/services/ai-services" },
      { label: "Services overview", href: "/services" },
    ],
  },
  {
    key: "footer.solutions",
    label: "Solutions",
    children: [
      { label: "Arivoo", href: "https://arivoo.in", external: true },
      // The three AI solutions are DRAFT until their website URLs arrive (17 Nov 2026); the rows stay here so that
      // adding a URL and publishing is the only change needed.
      { key: "footer.face-recognition", label: "Face Recognition Security", external: true, status: D, needsReview: true, editorNote: "MISSING: product website URL." },
      { key: "footer.industrial-analytics", label: "Industrial Analytics", external: true, status: D, needsReview: true, editorNote: "MISSING: product website URL." },
      { key: "footer.asset-tracking", label: "Asset Tracking", external: true, status: D, needsReview: true, editorNote: "MISSING: product website URL." },
      {
        key: "footer.testguard",
        label: "TestGUARD",
        href: "https://arivoo.in/testguard",
        external: true,
        needsReview: true,
        editorNote: "DECISION Q7.3: TestGUARD placement. Not in the new Solutions menu; footer link kept as on the live site.",
      },
      { label: "All solutions", href: "/solutions" },
    ],
  },
  {
    key: "footer.insights",
    label: "Insights",
    children: [
      { label: "Events", href: "/insights/events" },
      { label: "Blog", href: "/insights/blog", comingSoon: true },
    ],
  },
];

export const navigation: NavigationSeed = {
  header: withOrder([
    aboutMenu,
    servicesMenu,
    solutionsMenu,
    { key: "header.case-studies", label: "Case Studies", href: "/case-studies" },
    insightsMenu,
  ]),
  footer: withOrder(footer),
  legal: withOrder([
    { key: "legal.privacy", label: "Privacy Policy", href: "/privacy-policy" },
    {
      key: "legal.cookies",
      label: "Cookie Policy",
      href: "/cookie-policy",
      needsReview: true,
      editorNote: "Cookie Policy text drafted on 17 Nov 2026 from the cookies the site actually sets (Q10.2, Q10.3): client legal review before launch.",
    },
    { key: "legal.terms", label: "Terms of Use", href: "/terms-of-use" },
    { key: "legal.credentials", label: "Credentials", href: "/credentials" },
  ]),
  social: withOrder([
    { key: "social.facebook", label: "Facebook", href: "https://www.facebook.com/AdamasTechConsulting/", external: true },
    {
      key: "social.linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/adamas-tech-consulting/",
      external: true,
    },
  ]),
};
