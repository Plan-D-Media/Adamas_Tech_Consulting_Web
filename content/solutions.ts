import type { SolutionSeed } from "./types";

/**
 * Solutions (sitemap rows 27–38). Sources: _global.md (header "Products" mega menu and footer),
 * the "Discover Arivoo" block on the old homepages (/home-new/, /home-old/; hidden on /ae/),
 * and the matching case-study pages.
 */
export const solutions: SolutionSeed[] = [
  // ── Arivoo ─────────────────────────────────────────────────────────
  {
    slug: "arivoo",
    kind: "PRODUCT",
    name: "Arivoo",
    image: "images/solutions/arivoo-card.webp",
    tagline: "Shaping the Future of Education.",
    summary: "[Placeholder] Short overview of the Arivoo education suite: UMS, SMS and LMS.",
    externalUrl: "https://arivoo.in",
    status: "PUBLISHED",
    sortOrder: 0,
    needsReview: true,
    editorNote:
      'DECISION Q7.1/Q7.4: built as /solutions/arivoo (short overview) with UMS / SMS / LMS linking out to arivoo.in. Tagline from "Discover Arivoo: Shaping the Future of Education." (old homepages). MISSING: overview copy for the suite as a whole, and product screenshots. externalUrl https://arivoo.in is the domain used in every live link: confirm the landing URL.',
  },
  {
    slug: "arivoo-ums",
    kind: "ARIVOO_MODULE",
    parent: "arivoo",
    name: "Arivoo UMS",
    tagline: "Efficient campus operations, improved student experience.",
    summary:
      "Arivoo UMS is an integrated university management system that simplifies student enrollment, administrative tasks, and data analytics. It provides higher education institutions with a comprehensive solution to efficiently manage resources and academic processes for improved outcomes.",
    externalUrl: "https://arivoo.in/arivoo-ums",
    image: "images/solutions/arivoo-ums.webp",
    status: "PUBLISHED",
    sortOrder: 1,
    needsReview: true,
    editorNote:
      'Header menu labels UMS "Coming soon" with no link; the footer links https://arivoo.in/arivoo-ums (sitemap URL used). Is UMS live?',
  },
  {
    slug: "arivoo-sms",
    kind: "ARIVOO_MODULE",
    parent: "arivoo",
    name: "Arivoo SMS",
    tagline: "Streamlined school administration, enhanced learning experience.",
    summary:
      "Arivoo SMS optimizes school management by streamlining class schedules, teacher assignments, and student records. This powerful system enhances operational efficiency, providing a seamless experience for administrators, teachers, and students to support educational excellence.",
    externalUrl: "https://arivoo.in/arivoo-sms",
    image: "images/solutions/arivoo-sms.webp",
    status: "PUBLISHED",
    sortOrder: 2,
    needsReview: true,
    editorNote: "CONFLICT: header menu links https://arivoo.in/sms, footer https://arivoo.in/arivoo-sms. Sitemap URL used.",
  },
  {
    slug: "arivoo-lms",
    kind: "ARIVOO_MODULE",
    parent: "arivoo",
    name: "Arivoo LMS",
    tagline: "Centralized learning, seamless education, enhanced outcomes.",
    summary:
      "Arivoo LMS is a dynamic learning management system that enhances the educational experience with features like course management, online exams, and interactive content. Its customizable and user-friendly interface supports educators and students in achieving academic success.",
    externalUrl: "https://arivoo.in/arivoo-lms",
    image: "images/solutions/arivoo-lms.webp",
    status: "PUBLISHED",
    sortOrder: 3,
    needsReview: true,
    editorNote: "CONFLICT: header menu links https://arivoo.in/lms, footer https://arivoo.in/arivoo-lms. Sitemap URL used.",
  },

  // ── AI products (names to come) ────────────────────────────────────
  {
    slug: "a-eye",
    kind: "PRODUCT",
    name: "A-EYE",
    image: "images/solutions/a-eye-card.webp",
    tagline: "[Placeholder] One-line product tagline.",
    summary: "[Placeholder] Product overview.",
    status: "PUBLISHED",
    sortOrder: 4,
    needsReview: true,
    editorNote: "Name A-EYE from the brief and sitemap (13 Nov 2026); published so the menu and page exist. MISSING (Q7.2): tagline, page copy, features and screenshots; Not on the live site.",
  },
  {
    slug: "air-mind",
    kind: "PRODUCT",
    name: "AIR-MIND",
    image: "images/solutions/air-mind-card.webp",
    tagline: "[Placeholder] One-line product tagline.",
    summary: "[Placeholder] Product overview.",
    status: "PUBLISHED",
    sortOrder: 5,
    needsReview: true,
    editorNote: "Name AIR-MIND from the brief and sitemap (13 Nov 2026); published so the menu and page exist. MISSING (Q7.2): tagline, page copy, features and screenshots; Not on the live site.",
  },

  // ── AI solutions (case-study backed) ───────────────────────────────
  {
    slug: "face-recognition",
    kind: "AI_SOLUTION",
    name: "Face Recognition Security",
    tagline: "Effortless Security through AI Recognition",
    summary:
      "Exploring innovative face recognition technology to improve security measures, increase accuracy, and streamline identification processes in various applications.",
    body: "Develop a real-time facial recognition system capable of accurately detecting and identifying human faces in a live-video feed against a pre-existing image database, providing instant recognition of individuals present within the camera’s field of view.",
    image: "images/solutions/face-recognition-card.webp",
    features: [
      {
        title: "Secure Identification",
        body: "Strengthening security measures by implementing precise identification technology, ensuring accurate access control and minimizing unauthorized entry risks.",
        sortOrder: 0,
      },
      {
        title: "Fraud Prevention",
        body: "Minimizing fraud risks by enhancing authentication protocols, leading to more secure transactions and protecting against unauthorized activities.",
        sortOrder: 1,
      },
      {
        title: "Operational Excellence",
        body: "Boosting operational efficiency while fostering customer trust by streamlining processes and delivering consistent, reliable services.",
        sortOrder: 2,
      },
    ],
    status: "PUBLISHED",
    sortOrder: 6,
    needsReview: true,
    editorNote:
      'Copy from /face-recognition/ (intro, challenge as body, "BUSINESS BENEFITS" as features); tagline = homepage card. MISSING: product screenshots. Full list of 6 AI solutions: Q5.3.',
  },
  {
    slug: "industrial-analytics",
    kind: "AI_SOLUTION",
    name: "Industrial Analytics",
    tagline: "Effortless Parking with AI Intelligence",
    summary:
      "Implementing smart solutions to enhance parking efficiency, improve space utilization, and streamline vehicle management in busy parking lots.",
    body: "Created an intelligent car parking solution to efficiently detect and allocate available parking spaces, minimizing congestion, enhancing the overall parking experience and saving driver’s valuable time by providing real-time information on available parking spots",
    image: "images/solutions/industrial-analytics-card.webp",
    features: [
      {
        title: "Parking Excellence",
        body: "Enhance customer satisfaction and loyalty through efficient parking solution.",
        sortOrder: 0,
      },
      {
        title: "Innovative Advantage",
        body: "Competitive edge in the parking management industry through innovation and convenience.",
        sortOrder: 1,
      },
      {
        title: "Revenue Optimization",
        body: "Increased revenue potential through dynamic pricing models and value-added services.",
        sortOrder: 2,
      },
    ],
    status: "PUBLISHED",
    sortOrder: 7,
    needsReview: true,
    editorNote:
      'Copy from /car-parking-lot/ (intro, challenge as body, "BUSINESS BENEFITS" as features); tagline = homepage card. MISSING: product screenshots. Full list of 6 AI solutions: Q5.3.',
  },
  {
    slug: "asset-tracking",
    kind: "AI_SOLUTION",
    name: "Asset Tracking",
    tagline: "Boosting Cash Forecasting by 30%",
    summary:
      "Accelerate your treasury, investment, and cash management processes with streamlined implementation for optimized financial operations and enhanced efficiency.",
    image: "images/solutions/cash-forecasting.webp",
    features: [
      {
        title: "Implementation of SAP-TRM",
        body: "Loans, investments (Bonds and Debentures), Fixed Deposits, Derivatives and Forward Contracts.",
        sortOrder: 0,
      },
      {
        title: "Investment Management",
        body: "Process for managing investments in Equity Shares, Mutual Fund, Fixed Deposits, Inter-Company Deposits, Bonds and Debentures.",
        sortOrder: 1,
      },
      {
        title: "Cash Management",
        body: "Mapping of Actuals for Cash Flow Planning for the entire group. Reverse Integration with SAP-BPC – to get the actuals",
        sortOrder: 2,
      },
      {
        title: "Inter-Company loans and investment",
        body: "Limit Tracking for Fund and non-fund based process. Out of Box solution for Non-Fund based Limit as the same not supported in SAP.",
        sortOrder: 3,
      },
    ],
    integrations: ["SAP S/4HANA on Cloud", "Treasury Management", "Bank Communication Management"],
    status: "PUBLISHED",
    sortOrder: 8,
    needsReview: true,
    editorNote:
      'Replaces the old /sap-treasury-investment-and-cash-management-implementation/ page (301 map row 17). Copy from that page ("Solutions Offered" as features, "Technologies Leveraged" as integrations). The live page describes an SAP Treasury implementation, not an AI product: confirm it belongs under AI solutions (sitemap row 37). The visible theme pricing block ("30/year") is not migrated. MISSING: product screenshots.',
  },
  {
    slug: "ai-solution-4",
    kind: "AI_SOLUTION",
    name: "[Placeholder] AI solution 4",
    summary: "[Placeholder] Solution overview.",
    status: "DRAFT",
    sortOrder: 9,
    needsReview: true,
    editorNote:
      "MISSING (Q5.3): remaining AI solutions 4–6. Candidates from existing case studies: PPE Detection (ppe-detection), Steel Plate Inspection (steel-plate-inspection), InvoiceAI (invoiceai-invoice-processing), RAG knowledge assistant (rag-knowledge-assistant).",
  },
  {
    slug: "ai-solution-5",
    kind: "AI_SOLUTION",
    name: "[Placeholder] AI solution 5",
    summary: "[Placeholder] Solution overview.",
    status: "DRAFT",
    sortOrder: 10,
    needsReview: true,
    editorNote:
      "MISSING (Q5.3): remaining AI solutions 4–6. Candidates from existing case studies: PPE Detection, Steel Plate Inspection, InvoiceAI, RAG knowledge assistant.",
  },
  {
    slug: "ai-solution-6",
    kind: "AI_SOLUTION",
    name: "[Placeholder] AI solution 6",
    summary: "[Placeholder] Solution overview.",
    status: "DRAFT",
    sortOrder: 11,
    needsReview: true,
    editorNote:
      "MISSING (Q5.3): remaining AI solutions 4–6. Candidates from existing case studies: PPE Detection, Steel Plate Inspection, InvoiceAI, RAG knowledge assistant.",
  },

  // ── TestGUARD ──────────────────────────────────────────────────────
  {
    slug: "testguard",
    kind: "PRODUCT",
    name: "TestGUARD",
    tagline: "Secure online exams, integrity ensured remotely.",
    summary:
      "Arivoo TestGuard ensures exam integrity with AI-driven remote proctoring. It offers secure online assessments through live proctoring, identity verification, and real-time analytics, maintaining academic honesty and fairness in testing environments for institutions worldwide.",
    externalUrl: "https://arivoo.in/testguard",
    image: "images/solutions/testguard.webp",
    status: "DRAFT",
    sortOrder: 12,
    needsReview: true,
    editorNote:
      'DECISION Q7.3: placement of TestGUARD (not in the new Solutions menu; footer link kept). Spelling varies on the live site: "TestGUARD" (nav, footer), "Arivoo TestGUARD" (product tabs), "Arivoo TestGuard" (body copy).',
  },
];
