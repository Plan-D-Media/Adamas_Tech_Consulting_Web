import type { IndustrySeed } from "./types";

/**
 * The 12 industries of the approved Figma design (Home Page 236:1395, "All Industries" menu), 13 Nov 2026.
 * The sitemap has no industry pages, so "Explore Industry" links to /contact (brief section 7).
 * Copy sources (nothing here was written for the client):
 *   - Healthcare, Financial Services: the approved Figma copy (PUBLISHED).
 *   - Retail, Education: the live site's tab copy and image, same name (PUBLISHED, needs review).
 *   - Manufacturing, Government: the live site's "Supply chain" / "Public sector" tab copy reused under the Figma name
 *     (DRAFT until the client confirms the reuse).
 *   - Technology, Energy, Legal (Law Firms), Software Development, Marketing Agencies, Startups: no copy anywhere; a
 *     "[Placeholder]" body renders as "Details to be confirmed" (DRAFT).
 * DRAFT rows show only with PREVIEW_DRAFTS=true (the preview), badged with SHOW_DRAFT_BADGES=true. Hospitality (live
 * tab) is not in the design and was dropped: see CONTENT_TODO.md.
 */
export const industries: IndustrySeed[] = [
  {
    slug: "healthcare",
    tabLabel: "Healthcare",
    title: "Healthcare",
    body: "We help healthcare providers improve patient care and manage hospital operations with smart digital solutions.\n\nOur technology helps organise patient records, simplify daily tasks, and keep healthcare data secure.",
    image: "images/industries/healthcare-card.webp",
    status: "PUBLISHED",
    sortOrder: 0,
    needsReview: true,
    editorNote: "Copy from the approved Figma Home Page (236:1395), 13 Nov 2026.",
  },
  {
    slug: "financial-services",
    tabLabel: "Financial Services",
    title: "Financial Services",
    body: "We help banks, financial institutions, and financial service providers improve their operations with reliable digital solutions.\n\nOur technology helps protect financial data, simplify transactions, manage information, and deliver better customer experiences.",
    image: "images/industries/finance.webp",
    status: "PUBLISHED",
    sortOrder: 1,
    needsReview: true,
    editorNote: "Copy from the approved Figma Home Page (236:1395), 13 Nov 2026. Image from the live site.",
  },
  {
    slug: "retail",
    tabLabel: "Retail",
    title: "Retail",
    body: "Drive growth in the retail and e-commerce sector with scalable platforms that support online storefronts, personalised marketing, inventory management, and CRM integration.\n\nOur solutions enhance customer experience, streamline operations, and provide actionable insights for data-driven decision-making.",
    image: "images/industries/retail.webp",
    status: "PUBLISHED",
    sortOrder: 2,
    needsReview: true,
    editorNote: "Figma names the industry; copy and image from the live site tab.",
  },
  {
    slug: "education",
    tabLabel: "Education",
    title: "Education",
    body: "Empower educational institutions with advanced Learning Management Systems (LMS), University Management Systems (UMS), and School Management Systems (SMS).\n\nOur solutions streamline operations, enhance student engagement, and support digital learning, ensuring an efficient and engaging educational experience.",
    image: "images/industries/education.webp",
    status: "PUBLISHED",
    sortOrder: 3,
    needsReview: true,
    editorNote: "Figma names the industry; copy and image from the live site tab.",
  },
  {
    slug: "technology",
    tabLabel: "Technology",
    title: "Technology",
    body: "[Placeholder] Two short paragraphs on how AdamasTech supports technology companies.",
    status: "DRAFT",
    sortOrder: 4,
    needsReview: true,
    editorNote: "DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6).",
  },
  {
    slug: "manufacturing",
    tabLabel: "Manufacturing",
    title: "Manufacturing",
    body: "Increase efficiency and productivity in manufacturing with solutions that optimise supply chain management, production planning, and inventory control.\n\nOur technology-driven approach enhances operational efficiency, reduces costs, and supports data-driven decision-making across the supply chain.",
    image: "images/industries/supply-chain.webp",
    status: "DRAFT",
    sortOrder: 5,
    needsReview: true,
    editorNote: "DRAFT: Figma names the industry but designs no copy. The live site's \"Supply chain\" tab copy and image are reused under the new name until the client confirms them or supplies new copy (CONTENT_TODO, round 6).",
  },
  {
    slug: "government",
    tabLabel: "Government",
    title: "Government",
    body: "Transform public services with digital solutions that enhance transparency, improve citizen engagement, and streamline processes.\n\nOur offerings include e-governance platforms, data management systems, and analytics solutions, all designed to support effective and efficient government operations.",
    image: "images/industries/public-sector.webp",
    status: "DRAFT",
    sortOrder: 6,
    needsReview: true,
    editorNote: "DRAFT: Figma names the industry but designs no copy. The live site's \"Public sector\" tab copy and image are reused under the new name until the client confirms them or supplies new copy (CONTENT_TODO, round 6).",
  },
  {
    slug: "energy",
    tabLabel: "Energy",
    title: "Energy",
    body: "[Placeholder] Two short paragraphs on how AdamasTech supports energy companies.",
    status: "DRAFT",
    sortOrder: 7,
    needsReview: true,
    editorNote: "DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6).",
  },
  {
    slug: "legal",
    tabLabel: "Legal (Law Firms)",
    title: "Legal (Law Firms)",
    body: "[Placeholder] Two short paragraphs on how AdamasTech supports law firms.",
    status: "DRAFT",
    sortOrder: 8,
    needsReview: true,
    editorNote: "DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6).",
  },
  {
    slug: "software-development",
    tabLabel: "Software Development",
    title: "Software Development",
    body: "[Placeholder] Two short paragraphs on how AdamasTech supports software companies.",
    status: "DRAFT",
    sortOrder: 9,
    needsReview: true,
    editorNote: "DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6).",
  },
  {
    slug: "marketing-agencies",
    tabLabel: "Marketing Agencies",
    title: "Marketing Agencies",
    body: "[Placeholder] Two short paragraphs on how AdamasTech supports marketing agencies.",
    status: "DRAFT",
    sortOrder: 10,
    needsReview: true,
    editorNote: "DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6).",
  },
  {
    slug: "startups",
    tabLabel: "Startups",
    title: "Startups",
    body: "[Placeholder] Two short paragraphs on how AdamasTech supports startups.",
    status: "DRAFT",
    sortOrder: 11,
    needsReview: true,
    editorNote: "DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6).",
  },
];
