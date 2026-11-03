import type { RedirectSeed } from "./types";

/**
 * 301 redirects from the WordPress site. One form per URL (the loader normalises the trailing slash).
 * Part 1 is the approved map (docs/sitemap.pdf, "301 REDIRECT MAP"); part 2 covers every other URL in
 * docs/source-content/_summary.md §9 so that no old URL ends in a 404 (Q2.6, Q9.4).
 *
 * Old URLs whose path is unchanged are NOT listed, because a redirect to the same normalised path would loop:
 * /contact/, /services/, /privacy-policy/, /terms-of-use/, /in/, /uk/, /ae/, /case-studies/, /solutions/ (and / itself).
 *
 * Case-study targets (/case-studies/<slug>) are DRAFT until client clearance (Q5.5): until a target is published,
 * the router should fall back to /case-studies rather than 404.
 */

const r = (fromPath: string, toPath: string, decisionRef?: string, note?: string): RedirectSeed => ({
  fromPath,
  toPath,
  statusCode: 301,
  active: true,
  ...(decisionRef ? { decisionRef } : {}),
  ...(note ? { note } : {}),
});

const CS_NOTE = "Case study is DRAFT until client clearance (Q5.5): fall back to /case-studies until published.";
const DEMO = "Theme demo / backup page.";

export const redirects: RedirectSeed[] = [
  // ── 1. Approved 301 map (sitemap.pdf) ──────────────────────────────
  r("/about-us/", "/about", "Confirmed"),
  r("/consulting/", "/services", "Q2.2", "DECISION Q2.2: /services or /services/digital-transformation. Set to /services for now."),
  r("/sap-solution-consulting/", "/services/digital-transformation/sap", "Q2.5"),
  r("/ai-data-analytics/", "/services/ai-services/ai-ml", "Q2.5"),
  r("/openedx/", "/services/digital-transformation/edtech-openedx", "Q2.3, Q2.5"),
  r("/aws-solutions/", "/services/cloud-services", "Q2.5"),
  r("/aws-solutions-old/", "/services/cloud-services", "Q2.6", "Old page still linked in the current footer."),
  r("/technology-transformation/", "/services/digital-transformation", "Q2.5"),
  r("/application-development/", "/services/digital-transformation/application-development", "Q2.5"),
  r("/cloud-transformation/", "/services/cloud-services/cloud-transformation", "Q2.5"),
  r("/master-data-governance/", "/services/digital-transformation/master-data-governance", "Q2.5"),
  r("/data-science-analytics/", "/services/digital-transformation/data-analytics", "Q2.5"),
  r("/oracle-netsuite-solutions/", "/services/cloud-services/oracle-netsuite", "Q2.3, Q2.5"),
  r(
    "/e-invoicing-uae/",
    "/ae",
    "Q2.4",
    "DECISION Q2.4: /services/digital-transformation/e-invoicing-uae if the page is kept, /ae/ if retired. Set to /ae/ for now (the new page is a draft).",
  ),
  r("/sap-treasury-investment-and-cash-management-implementation/", "/solutions/cash-forecasting", "Q2.5"),
  r("/clients/", "/case-studies", "Q2.6"),

  // ── 2a. Case studies → /case-studies/<new slug> ────────────────────
  r("/invoiceai-automated-invoice-processing-reconciliation/", "/case-studies/invoiceai-invoice-processing", "Q2.6", CS_NOTE),
  r("/information-retriever-chatbot-enterprise-knowledge-assistant/", "/case-studies/rag-knowledge-assistant", "Q2.6", CS_NOTE),
  r("/sap-analytics-cloud-implementation/", "/case-studies/sap-analytics-cloud-liquor", "Q2.6", CS_NOTE),
  r("/sap-inter-company-reconciliation-functionalities/", "/case-studies/sap-intercompany-reconciliation", "Q2.6", CS_NOTE),
  r(
    "/sap-inter-company-reconciliation/",
    "/case-studies/sap-intercompany-reconciliation",
    "Q2.6",
    `Not in the WordPress sitemap, but linked from the old /sap-solution-consulting/ page. ${CS_NOTE}`,
  ),
  r("/sap-bank-communication-management/", "/case-studies/sap-bank-communication-management", "Q2.6", CS_NOTE),
  r(
    "/sap-s4hana-business-partners-creation-with-workflow-management-functionalities/",
    "/case-studies/sap-business-partner-workflow",
    "Q2.6",
    CS_NOTE,
  ),
  r("/condition-contract-management-settlement-management/", "/case-studies/sap-condition-contract-management", "Q2.6", CS_NOTE),
  r(
    "/proactive-and-predictive-machine-health-monitoring-with-iot-integration-solution/",
    "/case-studies/predictive-machine-health-monitoring",
    "Q2.6",
    CS_NOTE,
  ),
  r(
    "/sap-fiori-and-btp-cloud-solution-for-capex-project-management-tool-for-real-estate/",
    "/case-studies/sap-fiori-btp-capex-real-estate",
    "Q2.6",
    CS_NOTE,
  ),
  r("/advanced-steel-plate-inspection/", "/case-studies/steel-plate-inspection", "Q2.6", CS_NOTE),
  r("/car-parking-lot/", "/case-studies/car-parking-lot", "Q2.6", CS_NOTE),
  r("/fruit-recognition/", "/case-studies/fruit-recognition", "Q2.6", CS_NOTE),
  r("/face-recognition/", "/case-studies/face-recognition", "Q2.6", CS_NOTE),
  r("/ppe-detection/", "/case-studies/ppe-detection", "Q2.6", CS_NOTE),
  r("/cinema-hall-person-count/", "/case-studies/cinema-hall-person-count", "Q2.6", CS_NOTE),
  r("/entry-exit-time-tracker-monitoring-ingress-and-egress-activity/", "/case-studies/entry-exit-time-tracker", "Q2.6", CS_NOTE),
  r("/surveillance-system/", "/case-studies/ai-traffic-monitoring", "Q2.6", CS_NOTE),
  r("/ai-smarter-spaces-traffic-monitoring/", "/case-studies/ai-traffic-monitoring", "Q2.6", `Duplicate of /surveillance-system/. ${CS_NOTE}`),
  r("/crowd-movement/", "/case-studies/face-recognition", "Q2.6", `Duplicate of /face-recognition/ (same H1). ${CS_NOTE}`),
  r("/case-study/case-study_kubernetes/", "/case-studies/kubernetes-operations-healthtech", "Q2.6", CS_NOTE),
  r("/case-study/case-study_sap_cement-industry/", "/case-studies/sap-disaster-recovery-cement", "Q2.6", CS_NOTE),
  r("/casestudy/healthcare/", "/case-studies", "Q2.6", "Case-study category archive."),
  r("/casestudy/manufacturing-cement/", "/case-studies", "Q2.6", "Case-study category archive."),
  r("/case-studies-backup/", "/case-studies", "Q2.6", DEMO),
  r("/clients-old/", "/case-studies", "Q2.6", "Old clients page (/clients/ → /case-studies per the map)."),
  r("/success-stories/", "/case-studies", "Q2.6", "Already a 404 on the live site; redirect added for safety."),

  // Case-study pages that are live but not on the listing: not migrated as case studies (see CONTENT_TODO).
  r("/furniture-similarity/", "/services/ai-services/computer-vision", "Q2.6", "Case study not on the listing; not migrated. Nearest page."),
  r("/sap-advanced-available-to-promise-solution-implementation/", "/services/digital-transformation/sap", "Q2.6", "Case study not on the listing; not migrated."),
  r("/sap-finance-group-consolidation/", "/services/digital-transformation/sap", "Q2.6", "Case study not on the listing; not migrated."),
  r("/sap-finance-supply-chain-management/", "/services/digital-transformation/sap", "Q2.6", "Case study not on the listing; not migrated."),
  r("/sap-fiori-based-mobility-application-for-supply-chain-and-logistics/", "/services/digital-transformation/sap", "Q2.6", "Case study not on the listing; not migrated."),
  r("/transforming-higher-education-with-aws-cloud/", "/services/cloud-services", "Q2.6", "AWS case study not on the listing; not migrated."),
  r("/resilient-backup-recovery-with-aws/", "/services/cloud-services/managed-cloud", "Q2.6", "AWS case study not on the listing; not migrated."),

  // ── 2b. Unlinked service / landing pages → nearest service ─────────
  r("/cloud-services/", "/services/cloud-services", "Q2.6"),
  r("/cloud-migration-modernisation/", "/services/cloud-services/cloud-migration", "Q2.6", "Copy migrated to Cloud Migration."),
  r("/managed-cloud-optimization/", "/services/cloud-services/managed-cloud", "Q2.6", "Copy migrated to Managed Cloud."),
  r("/aws-managed-services/", "/services/cloud-services/managed-cloud", "Q2.6"),
  r("/security-governance/", "/services/cloud-services/cloud-security-finops", "Q2.6", "Copy migrated to Cloud Security & FinOps."),
  r("/cybersecurity/", "/services/cloud-services/cloud-security-finops", "Q2.6", "Nearest page; the old page's copy was not migrated."),
  r("/devops-automation/", "/services/cloud-services/cloud-transformation", "Q2.6", "Nearest page (DevOps automation is part of the Modernisation step)."),
  r("/application-modernization/", "/services/cloud-services/cloud-migration", "Q2.6", "Nearest page (replatforming)."),
  r("/data-analytics/", "/services/digital-transformation/data-analytics", "Q2.6"),
  r("/ai-ml-services/", "/services/ai-services/ai-ml", "Q2.6"),
  r("/intelligent-automation/", "/services/ai-services/ai-ml", "Q2.6", "Old service page (\"Automate. Optimize. Excel\"); copy not migrated. Nearest page."),
  r("/education-services/", "/services/digital-transformation/edtech-openedx", "Q2.6", "Nearest page (AWS for education)."),
  r("/aws-for-ec2-hosting/", "/services/cloud-services", "Q2.6"),
  r("/aws-for-reducing-tech-debt/", "/services/cloud-services/cloud-migration", "Q2.6", "Nearest page (Amazon Q Developer modernisation)."),
  r("/aws-for-operational-insights/", "/services/cloud-services/managed-cloud", "Q2.6", "Nearest page (Amazon DevOps Guru operations)."),
  r("/aws-for-generative-ai/", "/services/ai-services/generative-ai", "Q2.6", "Copy migrated to Generative & Applied AI."),
  r("/aws-for-automated-workflows/", "/services/ai-services/agentic-ai", "Q2.6", "Copy migrated to Agentic AI Solutions."),
  r("/ai-value/", "/services/ai-services", "Q2.6", "Insight article; nearest page until the blog launches."),
  r("/outgrowing-your-accounting-software/", "/services/digital-transformation/sap", "Q2.6", "SAP Business One landing page."),
  r("/sap-ecc-end-of-life/", "/services/digital-transformation/sap", "Q2.6", "SAP ECC to S/4HANA advisory article."),
  r("/services-backup/", "/services", "Q2.6", DEMO),

  // ── 2c. Old homepages, test pages, Elementor header/footer ─────────
  r("/home-old/", "/", "Q2.6", "Old homepage; / sends visitors to their regional homepage."),
  r("/home-old-1/", "/", "Q2.6", "Old homepage."),
  r("/home-new/", "/", "Q2.6", "Old homepage."),
  r("/home-6/", "/", "Q2.6", DEMO),
  r("/home-version1-2-2/", "/", "Q2.6", DEMO),
  r("/home-version2/", "/", "Q2.6", DEMO),
  r("/test-page/", "/", "Q2.6", "Test page."),
  r("/smart-slider-page/", "/", "Q2.6", "Test page."),
  r("/elementor-hf/home-v2-header/", "/", "Q2.6", "Elementor template URL (already 301s to /in/)."),
  r("/elementor-hf/home-footer/", "/", "Q2.6", "Elementor template URL (already 301s to /in/)."),
  r("/elementor-hf/home-v1-header/", "/", "Q2.6", "Elementor template URL (already 301s to /in/)."),

  // ── 2d. Theme demo pages ───────────────────────────────────────────
  r("/about-us-backup/", "/about", "Q2.6", DEMO),
  r("/company/", "/about", "Q2.6", DEMO),
  r("/overview/", "/about", "Q2.6", DEMO),
  r("/how-we-do/", "/about", "Q2.6", DEMO),
  r("/how-we-do-single/", "/about", "Q2.6", DEMO),
  r("/our-field-details/", "/services", "Q2.6", DEMO),
  r("/features/", "/services", "Q2.6", DEMO),
  r("/portfolio/", "/case-studies", "Q2.6", DEMO),
  r("/portfolio-detail/", "/case-studies", "Q2.6", DEMO),
  r("/our-pricing/", "/contact", "Q2.6", DEMO),
  r("/faq/", "/contact", "Q2.6", DEMO),
  r("/events/", "/insights/events", "Q2.6", DEMO),
  r("/event-single/", "/insights/events", "Q2.6", DEMO),
  r("/house-of-lords/", "/insights/events/house-of-lords-2026", "Q2.6", "Already a 404 on the live site; likely URL for the event."),

  // ── 2e. Blog, posts, archives → blog (coming soon at launch) ───────
  r("/blog/", "/insights/blog", "Q2.6", DEMO),
  r("/blogs/", "/insights/blog", "Q2.6", DEMO),
  r("/blog-with-sidebar/", "/insights/blog", "Q2.6", DEMO),
  r("/new-releases/", "/insights/blog", "Q2.6", DEMO),
  r("/consulted-admitting-is-power-acuteness/", "/insights/blog", "Q2.6", "Theme demo post."),
  r("/consulted-admitting-is-power-acuteness-2/", "/insights/blog", "Q2.6", "Theme demo post."),
  r("/consulted-admitting-is-power-acuteness-3/", "/insights/blog", "Q2.6", "Theme demo post."),
  r("/atc-blog/", "/insights/blog", "Q2.6"),
  r("/atc-blog/the-transformative-power-of-ai-in-2024-key-trends-and-innovations/", "/insights/blog", "Q2.6", "Blog post; not migrated (blog is Phase 2)."),
  r("/atc-blog/the-transformative-power-of-ai-in-2024-key-trends-and-innovations-2/", "/insights/blog", "Q2.6", "Blog post; not migrated (blog is Phase 2)."),
  r(
    "/atc-blog/openai-launches-new-alignment-division-to-tackle-risks-of-superintelligent-ai/",
    "/insights/blog",
    "Q2.6",
    "Blog post; not migrated (blog is Phase 2).",
  ),
  r("/atcblog/analytics-including-sac/", "/insights/blog", "Q2.6", "Blog category archive."),
  r("/atcblog/machine-learning/", "/insights/blog", "Q2.6", "Blog category archive."),
  r("/atcblog/web-development/", "/insights/blog", "Q2.6", "Blog category archive."),
  r("/category/uncategorized/", "/insights/blog", "Q2.6", "Category archive."),
  r("/tag/development/", "/insights/blog", "Q2.6", "Tag archive."),
  r("/tag/saas/", "/insights/blog", "Q2.6", "Tag archive."),
  r("/author/atc-usercontrol/", "/insights/blog", "Q2.6", "Author archive."),
];
