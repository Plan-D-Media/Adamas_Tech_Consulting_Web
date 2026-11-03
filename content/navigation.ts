import type { NavigationSeed, NavItemSeed } from "./types";

/**
 * Header mega-menus, footer columns, legal and social links.
 * Topbar order (client change, 2 Nov 2026): About Us · Services · Solutions · Case Studies · Insights.
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
          label: "Cloud Migration",
          href: "/services/cloud-services/cloud-migration",
          descriptor: "Migrate workloads, modernize architecture, and move from legacy systems to scalable AWS-native environments.",
        },
        {
          label: "Cloud Transformation",
          href: "/services/cloud-services/cloud-transformation",
          descriptor: "Resilient | Reliable | Cost optimized | Intelligent",
        },
        {
          label: "Managed Cloud & Cloud Reselling (CSP)",
          href: "/services/cloud-services/managed-cloud",
          descriptor: "Improve reliability, security, performance, and cost efficiency with ongoing AWS operations and governance.",
        },
        {
          label: "SAP on Cloud",
          href: "/services/cloud-services/sap-on-cloud",
          descriptor: "[Placeholder] One line on running SAP on the cloud.",
          needsReview: true,
          editorNote: "MISSING: no old page for SAP on Cloud. Descriptor needed.",
        },
        {
          label: "Oracle NetSuite / Cloud ERP",
          href: "/services/cloud-services/oracle-netsuite",
          descriptor: "Unified Cloud ERP for Modern Construction",
          needsReview: true,
          editorNote: "Descriptor is the construction-specific /in/ homepage card line. Confirm.",
        },
        {
          label: "Cloud Security & FinOps",
          href: "/services/cloud-services/cloud-security-finops",
          descriptor: "Strengthen cloud security, access control, compliance posture, and operational governance across AWS estates.",
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
      label: "AI Services",
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
          href: "/services/ai-services/computer-vision",
          descriptor: "Computer vision and intelligent monitoring solutions",
        },
        {
          label: "Generative & Applied AI",
          href: "/services/ai-services/generative-ai",
          descriptor: "Generative AI strategy and implementation",
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
      href: "/solutions/arivoo",
      descriptor: "Shaping the Future of Education.",
      needsReview: true,
      editorNote: "DECISION Q7.1: /solutions/arivoo page vs a direct link to arivoo.in. Built as a page.",
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
          descriptor: "Centralized learning, seamless education, enhanced outcomes.",
        },
      ],
    },
    {
      key: "solutions.ai-product-a",
      label: "[AI Product A]",
      href: "/solutions/ai-product-a",
      descriptor: "[Placeholder] One-line product descriptor.",
      status: D,
      needsReview: true,
      editorNote: "MISSING (Q7.2): product name and page. Hidden until published.",
    },
    {
      key: "solutions.ai-product-b",
      label: "[AI Product B]",
      href: "/solutions/ai-product-b",
      descriptor: "[Placeholder] One-line product descriptor.",
      status: D,
      needsReview: true,
      editorNote: "MISSING (Q7.2): product name and page. Hidden until published.",
    },
    {
      key: "solutions.ai-solutions",
      label: "AI Solutions",
      href: "/solutions",
      children: [
        {
          key: "solutions.face-recognition",
          label: "Face Recognition Security",
          href: "/solutions/face-recognition",
          descriptor: "Effortless Security through AI Recognition",
        },
        {
          key: "solutions.smart-parking",
          label: "Smart Parking",
          href: "/solutions/smart-parking",
          descriptor: "Effortless Parking with AI Intelligence",
        },
        {
          key: "solutions.cash-forecasting",
          label: "Cash Forecasting (SAP Treasury)",
          href: "/solutions/cash-forecasting",
          descriptor: "Boosting Cash Forecasting by 30%",
        },
        {
          key: "solutions.ai-solution-4",
          label: "[Placeholder] AI solution 4",
          href: "/solutions/ai-solution-4",
          status: D,
          needsReview: true,
          editorNote: "MISSING (Q5.3): AI solution 4. Candidates: PPE Detection, Steel Plate Inspection, InvoiceAI, RAG chatbot.",
        },
        {
          key: "solutions.ai-solution-5",
          label: "[Placeholder] AI solution 5",
          href: "/solutions/ai-solution-5",
          status: D,
          needsReview: true,
          editorNote: "MISSING (Q5.3): AI solution 5.",
        },
        {
          key: "solutions.ai-solution-6",
          label: "[Placeholder] AI solution 6",
          href: "/solutions/ai-solution-6",
          status: D,
          needsReview: true,
          editorNote: "MISSING (Q5.3): AI solution 6.",
        },
      ],
    },
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
    { key: "about.credentials", label: "Credentials", href: "/credentials" },
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
      { label: "AI Services", href: "/services/ai-services" },
      { label: "Services overview", href: "/services" },
    ],
  },
  {
    key: "footer.solutions",
    label: "Solutions",
    children: [
      { label: "Arivoo", href: "/solutions/arivoo" },
      { label: "Face Recognition Security", href: "/solutions/face-recognition" },
      { label: "Smart Parking", href: "/solutions/smart-parking" },
      { label: "Cash Forecasting (SAP Treasury)", href: "/solutions/cash-forecasting" },
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
      editorNote: "MISSING (Q10.2, Q10.3): Cookie Policy text. New page; placeholder until supplied.",
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
