import type { MediaSeed } from "./types";

/**
 * Every media key used in content/. Files live at public/media/<key>.
 * Migrated from the live site (sourceUrl = original), converted to WebP (max 2000px, q80) except hero posters (JPEG).
 * Live images all have empty or generic alt text ("", "Icon", "Play"), so the alts below are written new.
 */

const U = "https://adamastechconsulting.com/wp-content/uploads";

const webp = (key: string, alt: string, sourceUrl: string, extra: Partial<MediaSeed> = {}): MediaSeed => ({
  key,
  alt,
  kind: "IMAGE",
  mimeType: "image/webp",
  sourceUrl,
  ...extra,
});

const logo = (key: string, name: string, sourceUrl: string) => webp(key, `${name} logo`, sourceUrl);

export const media: MediaSeed[] = [
  // ── Hero posters (Vimeo thumbnails, flagged placeholders) ──────────
  ...(
    [
      ["digital-transformation", "1143398275", "Still from the AdamasTech digital transformation video"],
      ["aws", "1177633889", "Still from the AdamasTech AWS video"],
      ["oracle-netsuite", "1150026207", "Still from the AdamasTech Oracle NetSuite video"],
      ["sap", "1142019553", "Still from the AdamasTech SAP video"],
    ] as const
  ).map(
    ([slug, id, alt]): MediaSeed => ({
      key: `images/hero/${slug}.jpg`,
      alt,
      kind: "IMAGE",
      mimeType: "image/jpeg",
      isPlaceholder: true,
      sourceUrl: `https://vimeo.com/${id}`,
    }),
  ),

  // ── Partner and certification logos ────────────────────────────────
  logo("images/partners/aws.webp", "AWS", `${U}/2026/03/Frame-3161.webp`),
  logo("images/partners/sap.webp", "SAP", `${U}/2026/03/SAP-Logo.svg.webp`),
  logo("images/partners/oracle-netsuite.webp", "Oracle NetSuite", `${U}/2026/03/Oracle_NetSuite_2021.webp`),
  logo("images/partners/mignow.webp", "MigNow", `${U}/2026/03/mignow.webp`),
  logo("images/partners/leapwork.webp", "Leapwork", `${U}/2026/03/Partner.webp`),
  logo("images/partners/flipkart.webp", "Flipkart", `${U}/2026/03/flipkart.webp`),
  logo("images/partners/techuk.webp", "techUK", `${U}/2026/03/Frame-3159.webp`),
  logo("images/partners/lcci.webp", "London Chamber of Commerce and Industry", `${U}/2026/03/LCCI-1.webp`),
  logo("images/partners/open-edx.webp", "Open edX", `${U}/2026/03/Frame-3160.webp`),
  webp("images/certifications/iso-9001-bsi.webp", "BSI ISO 9001:2015 Quality Management certification badge", `${U}/2026/03/Frame-31601.webp`),
  webp("images/certifications/iso-27001-dqs.webp", "DQS ISO/IEC 27001 Information Security certification badge", `${U}/2026/03/Frame-31591.webp`),
  webp("images/certifications/cmmi-level-3.webp", "CMMI Maturity Level 3 appraised badge", `${U}/2026/03/Frame-31621-1.webp`),

  // ── Client logos ───────────────────────────────────────────────────
  logo("images/clients/pwc.webp", "PwC", `${U}/2026/03/1-scaled.webp`),
  logo("images/clients/careem.webp", "Careem", `${U}/2026/03/2-scaled.webp`),
  logo("images/clients/united-foods.webp", "United Foods", `${U}/2026/03/3-scaled.webp`),
  logo("images/clients/grse.webp", "GRSE", `${U}/2026/03/4-scaled-e1774249821356.webp`),
  logo("images/clients/workindia.webp", "WorkIndia", `${U}/2026/03/5-scaled.webp`),
  logo("images/clients/aldar-commercial-kitchen.webp", "Aldar Commercial Kitchen", `${U}/2026/03/6.webp`),
  logo("images/clients/infocom.webp", "Infocom", `${U}/2026/03/7-scaled.webp`),
  logo("images/clients/webel.webp", "Webel", `${U}/2026/03/8-scaled.webp`),
  logo("images/clients/iisc.webp", "Indian Institute of Science", `${U}/2026/03/9-e1774249746732.webp`),
  logo("images/clients/gulf-processing-industries.webp", "Gulf Processing Industries", `${U}/2026/03/10-scaled.webp`),
  logo("images/clients/navneet.webp", "Navneet", `${U}/2026/03/11-scaled.webp`),
  logo("images/clients/ajmal.webp", "Ajmal", `${U}/2026/03/12-scaled.webp`),
  logo("images/clients/ncgr.webp", "NCGR", `${U}/2026/03/13-scaled.webp`),
  logo("images/clients/swcc.webp", "Saline Water Conversion Corporation", `${U}/2026/03/14-e1774249906517.webp`),
  logo("images/clients/pi-square-technologies.webp", "Pi-Square Technologies", `${U}/2026/03/pi_square_technologies_cover@1.5x-1.webp`),
  logo("images/clients/emirates-drinking-water.webp", "Emirates drinking water", `${U}/2026/05/Emirates-_logo_grey-and-whote-1.png`),
  logo("images/clients/rain-stella-technologies.webp", "Rain Stella Technologies", `${U}/2026/05/logo-2-1.png`),
  logo("images/clients/koa.webp", "KOA", `${U}/2026/05/Logo_3-1.png`),
  logo("images/clients/avenue-professional-document-clearing.webp", "Avenue Professional Document Clearing", `${U}/2026/05/1_Logo-1-1.png`),

  // ── Industries (the image in each live tab panel; only 384×303 px) ─
  webp("images/industries/education.webp", "Students working on laptops in a classroom", `${U}/2026/03/Frame-2482.webp`),
  webp("images/industries/retail.webp", "Supermarket aisle with fresh produce on display", `${U}/2026/03/Frame-2485.webp`),
  webp("images/industries/healthcare.webp", "Clinician reviewing a medical scan on screen", `${U}/2026/03/Frame-2488.webp`),
  webp("images/industries/finance.webp", "Market charts on a laptop and a smartphone", `${U}/2026/03/Frame-2497.webp`),
  webp("images/industries/hospitality.webp", "Hotel manager talking with a staff member in a lobby", `${U}/2026/03/Frame-2504.webp`),
  webp("images/industries/supply-chain.webp", "Warehouse worker moving boxes on a pallet truck", `${U}/2026/03/Frame-2517-1.webp`),
  webp("images/industries/public-sector.webp", "Domed government building with gardens", `${U}/2026/03/PS.webp`),

  // ── Why us ─────────────────────────────────────────────────────────
  webp("images/why-us.webp", "Application screens on smartphones and a laptop", `${U}/2026/03/tech-Excellence-1.webp`),

  // ── Case studies (listing card images) ─────────────────────────────
  webp("images/case-studies/invoiceai-invoice-processing.webp", "AI-powered invoice processing", `${U}/2025/12/Case-study-1-card.jpg`),
  webp("images/case-studies/rag-knowledge-assistant.webp", "AI knowledge assistant chatbot", `${U}/2025/12/Case-study-2-card.jpg`),
  webp("images/case-studies/sap-analytics-cloud-liquor.webp", "SAP Analytics Cloud dashboards for a liquor manufacturer", `${U}/2024/09/Frame-2801.png`),
  webp("images/case-studies/sap-treasury-cash-forecasting.webp", "SAP Treasury and cash management", `${U}/2024/09/Frame-2617.png`),
  webp("images/case-studies/sap-intercompany-reconciliation.webp", "SAP inter-company reconciliation", `${U}/2024/09/Frame-2818.png`),
  webp("images/case-studies/sap-bank-communication-management.webp", "SAP Bank Communication Management", `${U}/2024/09/Frame-2809.png`),
  webp("images/case-studies/sap-business-partner-workflow.webp", "SAP S/4HANA business partner workflow", `${U}/2024/09/Frame-2845.png`),
  webp("images/case-studies/sap-condition-contract-management.webp", "SAP Condition Contract Management for rebates", `${U}/2024/09/Frame-2865.png`),
  webp("images/case-studies/predictive-machine-health-monitoring.webp", "IoT predictive machine health monitoring", `${U}/2024/09/Frame-2874.png`),
  webp("images/case-studies/sap-fiori-btp-capex-real-estate.webp", "SAP Fiori CAPEX project management", `${U}/2024/09/Frame-2883.png`),
  webp("images/case-studies/steel-plate-inspection.webp", "Computer vision inspection of steel plates", `${U}/2024/09/Frame-3037.png`),
  webp("images/case-studies/car-parking-lot.webp", "AI parking spot detection in a car park", `${U}/2024/09/Frame-3038.png`),
  webp("images/case-studies/fruit-recognition.webp", "Computer vision fruit recognition", `${U}/2024/09/Frame-3074.png`),
  webp("images/case-studies/face-recognition.webp", "Real-time face recognition", `${U}/2024/09/Frame-3040.png`),
  webp("images/case-studies/ppe-detection.webp", "PPE compliance detection", `${U}/2024/09/Frame-3082.png`),
  webp("images/case-studies/cinema-hall-person-count.webp", "Cinema hall audience analytics", `${U}/2024/09/Frame-3042.png`),
  webp("images/case-studies/entry-exit-time-tracker.webp", "Entry and exit tracking of people", `${U}/2024/09/Frame-3082-1.png`),
  webp("images/case-studies/ai-traffic-monitoring.webp", "AI traffic and vehicle monitoring", `${U}/2024/09/Frame-3044.png`),
  webp("images/case-studies/kubernetes-operations-healthtech.webp", "Kubernetes operations for a HealthTech company", `${U}/2026/09/Frame-1000005153-2.png`, {
    isPlaceholder: true,
  }),
  webp("images/case-studies/sap-disaster-recovery-cement.webp", "SAP disaster recovery on AWS for a cement manufacturer", `${U}/2026/09/Rectangle.png`, {
    isPlaceholder: true,
  }),

  // ── Solutions ──────────────────────────────────────────────────────
  webp("images/solutions/face-recognition.webp", "Woman's face being scanned by her smartphone", `${U}/2026/03/2a-1.webp`),
  webp("images/solutions/smart-parking.webp", "Close-up of a car headlight", `${U}/2026/03/1a.webp`),
  webp("images/solutions/cash-forecasting.webp", "Businessman holding banknotes", `${U}/2026/03/2-2.webp`),
  webp("images/solutions/arivoo-lms.webp", "Arivoo LMS on a laptop and smartphone", `${U}/2024/02/Frame-31.png`),
  webp("images/solutions/arivoo-sms.webp", "Arivoo SMS dashboard on a laptop and smartphone", `${U}/2024/02/Frame-32.png`),
  webp("images/solutions/arivoo-ums.webp", "Arivoo UMS admissions screen on a laptop", `${U}/2026/03/Frame-30.webp`),
  webp("images/solutions/testguard.webp", "TestGUARD", `${U}/2024/02/Frame-33.png`),

  // ── People ─────────────────────────────────────────────────────────
  webp("images/people/rajat-subhra-roy.webp", "Rajat Subhra Roy, Director", `${U}/2025/02/Frame-2944-1.png`),
  webp("images/people/saumya-subhra-roy.webp", "Saumya Subhra Roy, Director", `${U}/2024/08/Frame-2945-1.png`),
  webp("images/people/koushik-chatterjee.webp", "Koushik (KayCee) Chatterjee, Chief Executive Officer", `${U}/2026/07/Frame-3364.png`),
];
