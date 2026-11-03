import type { CaseStudySeed } from "./types";

/**
 * Case studies: the 18 on /case-studies/ plus the 2 under /case-study/.
 * All DRAFT until the client clears each one for publication (Q5.5, Q5.6).
 * Sources: case-studies.md (label, listing title, card body, metric) and each detail page.
 * One title per case study: the chosen title is noted, with the alternatives, in each editorNote.
 * Not migrated (no field in CaseStudySeed): the detail pages' "More Benefits" bullet lists and the
 * qualitative "BUSINESS BENEFITS" cards. Several of those cards are copied between pages anyway.
 */

const CLEARANCE = "DRAFT until client clearance (Q5.5, Q5.6).";
const NO_REGION = "Client geography not stated: region tag needed for the region filter.";

export const caseStudies: CaseStudySeed[] = [
  // ── Featured on all three homepages ────────────────────────────────
  {
    slug: "face-recognition",
    label: "Smart Cities",
    title: "99% Accurate Real-Time Facial Recognition Across Multiple Individuals",
    headlineMetric: "99%",
    metricLabel: "accurate real-time facial recognition",
    summary:
      "Utilize cutting-edge facial feature extraction and matching techniques for accurate, simultaneous identification across multiple faces in live video streams.",
    overview:
      "Exploring innovative face recognition technology to improve security measures, increase accuracy, and streamline identification processes in various applications.",
    challenge:
      "Develop a real-time facial recognition system capable of accurately detecting and identifying human faces in a live-video feed against a pre-existing image database, providing instant recognition of individuals present within the camera’s field of view.",
    solution: [
      { title: "Utilize advanced facial feature extraction and encoding techniques to accurately identify individuals in real-time." },
      { title: "Create state-of-the-art algorithms that enable smooth face encoding and detection in real-time video streams." },
      { title: "Implement highly efficient matching techniques to compare encoded features against a comprehensive database." },
      { title: "Design a scalable, high-performance system capable of identifying multiple faces simultaneously with precision." },
    ],
    results: [{ value: "99%", label: "Accurate real-time facial recognition across multiple individuals" }],
    industry: "public-sector",
    services: ["ai-services/computer-vision"],
    pillars: ["ai-services"],
    solutions: ["face-recognition"],
    featuredIn: ["IN", "UK", "AE"],
    image: "images/case-studies/face-recognition.webp",
    legacyPath: "/face-recognition/",
    status: "DRAFT",
    sortOrder: 0,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title (trailing full stop removed). Alternatives: homepage card "Effortless Security through AI Recognition"; detail H1 "Enhancing Security: A Case Study in Advanced Face Recognition". Label: listing "SMART CITIES", detail page "Smarter Cities". The 99% appears only in the listing title. /crowd-movement/ duplicates this page and redirects here. Industry mapped to Public sector (smart cities): confirm. ${NO_REGION}`,
  },
  {
    slug: "car-parking-lot",
    label: "Smart Cities",
    title: "Real-Time Parking Spot Detection with 95% Accuracy",
    headlineMetric: "95%",
    metricLabel: "accuracy in parking spot detection",
    summary:
      "Integrate advanced AI to instantly detect available parking spots, offering a user-friendly interface with automatic notifications for seamless parking.",
    overview:
      "Implementing smart solutions to enhance parking efficiency, improve space utilization, and streamline vehicle management in busy parking lots.",
    challenge:
      "Created an intelligent car parking solution to efficiently detect and allocate available parking spaces, minimizing congestion, enhancing the overall parking experience and saving driver’s valuable time by providing real-time information on available parking spots",
    solution: [
      { title: "Integrate a model for real-time detection of available parking spots." },
      { title: "Develop a user-friendly interface to display open and close parking lots" },
      { title: "Enable real-time processing to provide instant updates on parking spot availability" },
      { title: "Valid accuracy and reliability through rigorous testing in various parking environment" },
      { title: "Implement automatic notifications to alert users about available parking spots, enhancing convenience and efficiency." },
    ],
    results: [{ value: "95%", label: "Accuracy in real-time parking spot detection" }],
    industry: "public-sector",
    services: ["ai-services/computer-vision"],
    pillars: ["ai-services"],
    solutions: ["smart-parking"],
    featuredIn: ["IN", "UK", "AE"],
    image: "images/case-studies/car-parking-lot.webp",
    legacyPath: "/car-parking-lot/",
    status: "DRAFT",
    sortOrder: 1,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title. Alternatives: homepage card "Effortless Parking with AI Intelligence"; detail H1 "Maximizing Efficiency: A Case Study in Car Parking Lot Optimization". Label: listing "SMART CITIES", detail "Smarter Cities". Typos fixed: "user- friendly", doubled "rigorous testing". The 95% appears only in the listing title. Industry mapped to Public sector: confirm. ${NO_REGION}`,
  },
  {
    slug: "sap-treasury-cash-forecasting",
    label: "Manufacturing",
    title: "Boosting Cash Forecasting by 30%",
    headlineMetric: "30%",
    metricLabel: "improvement in cash forecasting accuracy",
    summary:
      "Streamline your treasury operations, enhance cash management, and maximize investment efficiency with our proven ASAP implementation approach.",
    clientDescriptor: "An Indian Multinational Conglomerate – amongst the top 10 business houses in India",
    overview:
      "Accelerate your treasury, investment, and cash management processes with streamlined implementation for optimized financial operations and enhanced efficiency.\n\nProject Process Re-organization – An Indian Multinational Conglomerate – amongst the top 10 business houses in India.\n\nIts footprint stretches over a wide range of industries, spanning automobiles (two wheelers manufacturer and three wheelers manufacturer), home appliances, lighting, iron and steel, insurance, travel and finance. The group’s flagship company is ranked as the world’s fourth largest three and two wheeler manufacturer and the brand is well-known across several countries in Latin America, Africa, GCC, South and South East Asia.\n\nProject was to have a harmonize and centralized Treasury process for entire group. Also, to improve cash collection, debt management reporting, the company chose SAP Business Warehouse powered by SAP HANA.",
    solution: [
      { title: "Implementation of SAP-TRM", body: "Loans, investments (Bonds and Debentures), Fixed Deposits, Derivatives and Forward Contracts." },
      { title: "Investment Management", body: "Process for managing investments in Equity Shares, Mutual Fund, Fixed Deposits, Inter-Company Deposits, Bonds and Debentures." },
      { title: "Cash Management", body: "Mapping of Actuals for Cash Flow Planning for the entire group. Reverse Integration with SAP-BPC – to get the actuals" },
      { title: "Inter-Company loans and investment", body: "Limit Tracking for Fund and non-fund based process. Out of Box solution for Non-Fund based Limit as the same not supported in SAP." },
    ],
    results: [
      { value: "30%", label: "Improvement in cash forecasting accuracy" },
      { value: "20%", label: "Decrease in DSO (Days Sale Outstanding) and DPO (Days Payable Outstanding)" },
      { value: "60%", label: "Reduction in manual reconciliation efforts and operational costs" },
      { value: "99%", label: "Faster reporting (from 8 hours to 5 seconds)" },
    ],
    technologies: ["SAP S/4HANA on Cloud", "Treasury Management", "Bank Communication Management"],
    industry: "finance",
    regions: ["IN"],
    services: ["digital-transformation/sap"],
    pillars: ["digital-transformation"],
    solutions: ["cash-forecasting"],
    featuredIn: ["IN", "UK", "AE"],
    image: "images/case-studies/sap-treasury-cash-forecasting.webp",
    legacyPath: "/sap-treasury-investment-and-cash-management-implementation/",
    status: "DRAFT",
    sortOrder: 2,
    needsReview: true,
    editorNote: `${CLEARANCE} CONFLICT resolved by choice: title = homepage card "Boosting Cash Forecasting by 30%" (matches the Cash Forecasting solution). Alternatives: listing "Cut Manual Reconciliation Efforts and Costs by 60% Instantly."; detail H1 "SAP Treasury, Investment and Cash Management Implementation". Label: listing "AUTOMOBILE" vs detail "Manufacturing" (detail used). Technology "MSAP S4 HANA on Cloud" corrected to "SAP S/4HANA on Cloud": confirm. Old URL redirects to /solutions/cash-forecasting (301 map row 17). Region IN from "Indian Multinational Conglomerate". Industry mapped to Finance (treasury): confirm. Overview market list changed from the live wording to "…Latin America, Africa, GCC, South and South East Asia" (region label rule): client sign-off needed before publishing.`,
  },
  {
    slug: "sap-analytics-cloud-liquor",
    label: "Liquor",
    title: "Accelerate Decision-Making by 30% with Real-Time Dashboard Insights",
    headlineMetric: "30%",
    metricLabel: "faster decision-making cycle",
    summary:
      "Empower your team with real-time dashboard reporting, enabling quicker analysis and decision-making for improved efficiency and business outcomes.",
    clientDescriptor: "One of the largest manufacturers of Indian Made Foreign Liquor (IMFL) in India",
    overview:
      "Implement SAP Analytics Cloud for seamless data integration, real-time insights, and advanced analytics, empowering smarter decision-making across your organization.\n\nCustomer is one of the largest manufacturers of Indian Made Foreign Liquor (IMFL) in India. It has a total production capacity of nearly 200 million litres and operates 25+ bottling units across the country. The Key Business verticals include export supply, domestic, and defence supply. One of the largest providers of IMFL to the Canteen Store Departments of GOI.",
    challenge:
      "Need real time data for measurable results. Reporting, Analysis and Dashboard; Accessibility on Desktop, Mobile, Tablet. Streamline integrated processes involving vast amounts of data.",
    solution: [
      {
        title: "Sales Quantity Plan",
        body: "Enables businesses to forecast and manage expected sales volumes, ensuring efficient alignment between production, inventory, and market demand. It supports better decision-making and optimized resource allocation.",
      },
      { title: "Production Quantity Plan", body: "State-wise Cost Cards Plan to calculate MRP of Cases, Net Contribution using Production Mix Ratio" },
      { title: "Overhead Cost Plan" },
      { title: "Royalty and Other Income Plans" },
      { title: "Sales and Distribution Expenses Planning" },
      { title: "Cost of Production Planning" },
      { title: "Tax Logic", body: "Implementation of Complex scenarios considering logic to calculate duties and taxes defined by relevant SGs" },
      { title: "Cost Allocation" },
    ],
    results: [
      { value: "40%", label: "Reduction in overtime costs" },
      { value: "30%", label: "Faster decision making cycle due to real time access of dashboard reporting" },
      { value: "13M", label: "Data points analysed in 10 minutes" },
      { value: "2500", label: "Work days saved on business planning activities" },
    ],
    technologies: ["SAP Analytics Cloud", "SAP BW/4HANA"],
    industry: "supply-chain",
    regions: ["IN"],
    services: ["digital-transformation/sap", "digital-transformation/data-analytics"],
    pillars: ["digital-transformation"],
    featuredIn: ["IN", "UK", "AE"],
    image: "images/case-studies/sap-analytics-cloud-liquor.webp",
    legacyPath: "/sap-analytics-cloud-implementation/",
    status: "DRAFT",
    sortOrder: 3,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title. Alternatives: homepage card "Reducing Cost in Liquor Manufacturing"; detail H1 "SAP Analytics Cloud Implementation". Typo fixed: "litters" → "litres". On the live page several solution items repeat other items' bodies (Overhead Cost Plan, Royalty…, Cost Allocation): those copied bodies are left out. Technologies verbatim: "SAP Analytics Cloud on HANA as a Tool for Automation", "SAP BW 4 HANA as Source System". Region IN stated. Industry mapped to Manufacturing and Supply Chain: confirm.`,
  },

  // ── Featured on IN and UK (strong metrics) ─────────────────────────
  {
    slug: "invoiceai-invoice-processing",
    label: "Financial Automation",
    title: "Reduced Invoice Processing Time by 90% with AI Automation",
    headlineMetric: "90%",
    metricLabel: "less manual processing time",
    summary:
      "Streamline your financial operations by automating data entry and reconciliation, eliminating manual errors and accelerating approval cycles.",
    overview:
      "Revolutionize your financial operations with AI-powered invoice parsing, automated PO reconciliation, and seamless ERP integration.\n\nManual invoice processing is often a bottleneck in financial operations, characterized by data entry errors, lost documents, and lengthy approval cycles. InvoiceAI addresses these challenges by deploying advanced OCR and NLP technologies to automate the entire lifecycle of invoice management—from ingestion to reconciliation—ensuring accuracy and speed.",
    challenge:
      "Financial teams were bogged down by manual data entry and validation processes that were not only time-consuming but also highly error-prone. The lack of automation led to significant delays in PO-Invoice reconciliation, often resulting in payment mismatches and stalled approvals. Furthermore, inconsistent data formats across different vendors made seamless integration with existing accounting systems nearly impossible.",
    solution: [
      {
        title: "AI-Powered Invoice Parsing",
        body: "Utilizes advanced OCR and NLP to automatically extract and structure key data fields (Invoice ID, PO Number, Amount, Tax) from diverse vendor formats.",
      },
      {
        title: "Automated Reconciliation",
        body: "Intelligently matches extracted invoice data against purchase orders to instantly detect discrepancies and flag exceptions without manual intervention.",
      },
      {
        title: "Seamless ERP Integration",
        body: "Syncs structured outputs directly with existing ERP and accounting platforms to enable real-time validation, automated payments, and audit readiness.",
      },
    ],
    results: [
      { value: "90%", label: "Reduced manual processing time: slashed the time required to capture and validate invoice data, freeing up staff for strategic tasks." },
      { value: "100%", label: "Elimination of manual data entry errors: replaced error-prone human typing with high-fidelity AI-powered OCR and parsing." },
      { value: "100%", label: "Of PO-Invoice reconciliation automated: ensured every single line item is matched against purchase orders without human intervention." },
      { value: "5x", label: "Faster approval cycles: transformed the validation process from days to minutes, ensuring on-time vendor payments." },
    ],
    technologies: ["AWS", "OCR (Optical Character Recognition)", "NLP (Natural Language Processing)", "ERP & Accounting API Connectors"],
    industry: "finance",
    services: ["ai-services/generative-ai", "ai-services/ai-ml"],
    pillars: ["ai-services"],
    featuredIn: ["IN", "UK"],
    image: "images/case-studies/invoiceai-invoice-processing.webp",
    legacyPath: "/invoiceai-automated-invoice-processing-reconciliation/",
    status: "DRAFT",
    sortOrder: 4,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title. Alternative: detail H1 "InvoiceAI – Automated Invoice Processing & Reconciliation" (eyebrow "InvoiceAI"). Result labels shortened only by removing the repeated figure. Candidate for AI solution 4–6. Industry Finance: confirm. ${NO_REGION}`,
  },
  {
    slug: "sap-intercompany-reconciliation",
    label: "Real Estate",
    title: "80% Faster Period Closure: Reduce Reporting Time to 2 Days",
    headlineMetric: "80%",
    metricLabel: "faster period closure",
    summary: "Accelerate your period closure process by 80%, reducing reporting time from 8-10 days to just 2-3 days.",
    clientDescriptor: "The largest conglomerate of Vietnam with diversified interests",
    overview:
      "SAP Inter-Company Reconciliation streamlined financial operations by automating the reconciliation of transactions between related company entities.\n\nCustomer is the largest conglomerate of Vietnam with diversified interests. More than 50 legal entities. The group is present into Real Estate, Retail, Hospitality, Education, Hospitals, Automobile etc.",
    solution: [
      {
        title: "Reconciliation Acceleration",
        body: "Additionally, its in-app communication and workflow features reduce delays in resolving intercompany discrepancies, improving the visibility and transparency of reconciliation process.",
      },
      { title: "Close Acceleration", body: "ICMR accelerates intercompany reconciliation process from company close to corporate close." },
      { title: "Workflow Optimization", body: "By setting flexible matching and reconciliation rules, it can achieve high automation and continuous accounting." },
      {
        title: "Real-Time Matching",
        body: "Integrated within SAP S/4HANA, it matches transactions in real time, eliminating the need for ETL (extract, transform, load) processes.",
      },
    ],
    results: [
      { value: "1000+", label: "Work hours saved monthly" },
      { value: "92%", label: "Faster transfer of ledger reporting" },
      { value: "80%", label: "Improvement in period closure reporting (from 8-10 days to 2-3 days)" },
      { value: "3Min", label: "Query times have dropped from 3 hours to 3 min." },
    ],
    technologies: ["SAP Intercompany Reconciliation"],
    industry: "finance",
    services: ["digital-transformation/sap"],
    pillars: ["digital-transformation"],
    featuredIn: ["IN", "UK"],
    image: "images/case-studies/sap-intercompany-reconciliation.webp",
    legacyPath: "/sap-inter-company-reconciliation-functionalities/",
    status: "DRAFT",
    sortOrder: 5,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title (full stop removed). Alternative: detail H1 "SAP Inter-Company Reconciliation functionalities". Label: listing "FINANCIAL PRODUCTIVITY" vs detail "Real Estate" (detail used). Client is in Vietnam: no matching region, so no region tag. Industry mapped to Finance: confirm.`,
  },
  {
    slug: "sap-bank-communication-management",
    label: "Real Estate",
    title: "Achieve 70% Faster Batch Processing for Enhanced Operational Efficiency",
    headlineMetric: "70%",
    metricLabel: "improvement in batch-processing time",
    summary:
      "Optimize your workflow with a 70% improvement in batch processing time, enabling faster operations and increased productivity.",
    clientDescriptor:
      "One of the fastest growing regional full-service real estate firms with iconic developments in the residential, hospitality and commercial sectors",
    overview:
      "Streamline and secure banking communications with SAP Bank Communication Management, ensuring efficient payment processing and enhanced financial control.\n\nOne of the fastest growing regional full-service real estate firms that has several iconic developments in the residential, hospitality and commercial sectors. Implementation of SAP S/4 HANA Bank Communication Management and Multi-Bank Connectivity.",
    challenge:
      "Hybrid (mostly manual) and complex payment processing. Disparate Banking Interfaces. High operation costs. Inefficient workflows with slow processing times for payments, collections, and bank statements. High risk of errors due to manual data entry and lack of automation. Limited visibility into cash flow due to slow and inaccurate bank account information. Difficulty complying with financial regulations due to manual processes and lack of audit trails. Increased risk of fraud due to insecure communication channels and lack of controls. Difficulty in Scaling Operations.",
    solution: [
      { title: "Payment Formatting", body: "Generated Payment Files in Bank Specific Format" },
      { title: "Payment Authorization", body: "Grouping and approval of Payments in BCM with Digital Signatures." },
      { title: "Bank Integration", body: "Integration with Multi-Bank Connectivity for SWIFT integration" },
      { title: "Setting up of EBS", body: "It involved configuring the electronic banking system for seamless transaction processing and reporting" },
    ],
    results: [
      { value: "70%", label: "Improvement in batch-processing time" },
      { value: "40%", label: "Reduction in overtime costs" },
      { value: "80%", label: "Faster report execution, saving time for users and managers" },
      { value: "75%", label: "Improvement in period closure reporting (from 8-10 days to 2-3 days)" },
    ],
    technologies: ["SAP S/4HANA on Cloud", "SAP Bank Communication Management"],
    industry: "finance",
    services: ["digital-transformation/sap"],
    pillars: ["digital-transformation"],
    featuredIn: ["IN", "UK"],
    image: "images/case-studies/sap-bank-communication-management.webp",
    legacyPath: "/sap-bank-communication-management/",
    status: "DRAFT",
    sortOrder: 6,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title (full stop removed). Alternative: detail H1 "SAP Bank Communication Management". Label: listing "BANKING" vs detail "Real Estate" (detail used; client is a real-estate firm). Technologies verbatim: "SAP S4 HANA on Cloud", "BCM Functionality on Cloud". Challenge = the "Business challenges" list from the overview. "75% … (from 8-10 days to 2-3 days)" repeats the inter-company case's 80% figure for the same range: confirm. Industry mapped to Finance (banking): confirm. ${NO_REGION}`,
  },

  // ── Other listing case studies ─────────────────────────────────────
  {
    slug: "rag-knowledge-assistant",
    label: "Knowledge Management",
    title: "Instant Knowledge Retrieval with AI-Powered RAG Chatbot",
    headlineMetric: "50%",
    metricLabel: "less support load",
    summary:
      "Empower employees with immediate, context-aware answers from internal documents, reducing support tickets and boosting productivity.",
    overview:
      "Empower your workforce with instant, context-aware access to organizational knowledge through a secure, AI-driven conversational interface.\n\nIn a data-rich enterprise environment, finding the right information quickly is often harder than it should be. The Information Retriever Chatbot serves as a centralized intelligence hub, allowing employees to query complex internal documents using natural language and receive accurate, cited answers instantly.",
    challenge:
      "Employees were struggling with slow, manual information retrieval across fragmented sources like PDFs, Word documents, and intranets. Traditional keyword-based search tools lacked contextual understanding, often returning incomplete or irrelevant results. This inefficiency led to repetitive queries directed at support teams, increasing their workload and significantly reducing overall organizational productivity.",
    solution: [
      {
        title: "Context-Aware Retrieval",
        body: "Understands the intent behind user queries to deliver accurate, context-rich answers derived directly from organizational documents rather than generic keyword matches.",
      },
      {
        title: "Centralized Knowledge Access",
        body: "Consolidates diverse fragmented data sources (PDFs, Word files, internal wikis) into a unified, searchable platform for all departments.",
      },
      {
        title: "Scalable Architecture",
        body: "Ensures high performance and enterprise-grade security by leveraging robust cloud infrastructure to handle growing knowledge bases effortlessly.",
      },
    ],
    results: [
      { value: "95%", label: "Reduced average search time: from 15-20 minutes of browsing to instant, sub-second responses." },
      { value: "50%", label: "Fewer routine support tickets: half of all standard inquiries deflected from IT and HR support teams through self-service automation." },
      { value: "100%", label: "Of knowledge sources consolidated: disparate silos (PDFs, Wikis, Word docs) unified into a single, searchable vector database." },
      { value: "24/7", label: "Instant availability: no wait times for internal information, ensuring continuous employee productivity regardless of time zone." },
    ],
    technologies: ["AWS", "AWS Bedrock (Foundation Models)", "RAG (Retrieval-Augmented Generation)", "Milvus Vector DB"],
    services: ["ai-services/generative-ai"],
    pillars: ["ai-services"],
    image: "images/case-studies/rag-knowledge-assistant.webp",
    legacyPath: "/information-retriever-chatbot-enterprise-knowledge-assistant/",
    status: "DRAFT",
    sortOrder: 7,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title (full stop removed). Alternative: detail H1 "Information Retriever Chatbot – Enterprise Knowledge Assistant". Headline metric = listing card "50% Less Support Load" (detail also shows 95% faster search). Result labels lightly shortened to remove the repeated figure. Candidate for AI solution 4–6. No industry tab fits: industry needed. ${NO_REGION}`,
  },
  {
    slug: "sap-business-partner-workflow",
    label: "Workflow Management",
    title: "Reduced Data Volume by 97% for Optimal Storage Efficiency",
    headlineMetric: "97%",
    metricLabel: "reduction in overall data volume",
    summary:
      "Efficiently manage your data with a 97% reduction in overall volume, cutting storage needs by three-quarters.",
    clientDescriptor: "A global CPG (Consumer Packaged Goods) company with very complex business processes",
    overview:
      "Streamline business partner creation in SAP S4HANA with integrated workflow management, enhancing efficiency and control across your operations.\n\nThe client is one of the global CPG (Consumer Packaged Goods) giant with very complex business processes. The master data management is a very key parameter for their success. They are using the Workflow management extensible to get the maximum benefit out of the Business Partner Approval Process. They have moved from ECC 6.0 to S4 HANA Private cloud.",
    challenge:
      "In ECC for the client there was no approval process when any kind of master data was created. Now while creating the master data, they are having the approval system as well they are getting the facility for having the decision management capabilities as well as the Live Process Insights of the Business Partner Creation Approval Process.",
    solution: [
      {
        title: "Partner Automation",
        body: "The client is using the Business Partner Creation Approval Process content package for S/4HANA Cloud which enables to automate business partner creation in a flexible and transparent way.",
      },
      {
        title: "Process Flexibility",
        body: "It provides flexibility in executing a specific variant of the process depending on attributes like business partner category, etc.",
      },
      { title: "Decision Management", body: "The business is also using the Decision Management capabilities in the workflow management." },
    ],
    results: [
      { value: "2000", label: "Work hours saved on master data management and governance every month" },
      { value: "97%", label: "Of overall data volume was cut by ¾" },
    ],
    industry: "supply-chain",
    services: ["digital-transformation/sap", "digital-transformation/master-data-governance"],
    pillars: ["digital-transformation"],
    image: "images/case-studies/sap-business-partner-workflow.webp",
    legacyPath: "/sap-s4hana-business-partners-creation-with-workflow-management-functionalities/",
    status: "DRAFT",
    sortOrder: 8,
    needsReview: true,
    editorNote: `${CLEARANCE} CONFLICT: "Reduced Data Volume by 97%" vs "cutting storage needs by three-quarters" / "Of overall data volume was cut by ¾": which figure is right? Title = listing title. Alternative: detail H1 "SAP S4HANA Business Partners Creation with Workflow Management Functionalities". Label: listing "WORKFLOW MANAGEMENT", detail "SAP Case Study". The detail page's Technologies ("SAP Analytics Cloud on HANA…", "SAP BW 4 HANA…") are copied from the liquor case and are left out: technologies needed. Industry mapped to Manufacturing and Supply Chain (CPG): confirm. ${NO_REGION}`,
  },
  {
    slug: "sap-condition-contract-management",
    label: "Consumer Packaged Goods",
    title: "Boosted Sales Revenue by 15% in Just One Year",
    headlineMetric: "15%",
    metricLabel: "improvement in sales revenue in the first year",
    summary:
      "Achieve a 15% increase in sales revenue within the first year, driving growth and enhancing business performance.",
    clientDescriptor: "A major CPG company selling through distributors and resellers",
    overview:
      "Condition Contract Management in SAP Settlement Management enables efficient handling of complex rebate agreements, settlements, and contract-based revenue management.\n\nThe client is one the major CPG industry giant who are using the rebate process in ECC. Now they have moved into SAP S4 HANA cloud edition. The Company that sells its products through various distributors and resellers. The company offers volume-based rebate agreements to incentivize higher sales volumes from these channel partners.",
    challenge:
      "Complex Rebate Agreements: The company manages a variety of rebate agreements with different terms and conditions based on sales volumes, product categories, and customer types.\n\nManual Processes: Previously, rebate calculations were done manually using spreadsheets, leading to errors, disputes, and delayed settlements.\n\nLack of Visibility: Limited visibility into rebate accruals, payments, and performance across different regions and product lines made it challenging to track profitability and assess the effectiveness of rebate programs.",
    solution: [
      {
        title: "Condition Contract Management (CCM)",
        body: "Defines rebate agreements with distributors based on specific criteria (e.g., sales volume, product category).",
      },
      {
        title: "Automated Rebate Calculation",
        body: "Sales data from SAP S/4HANA Sales & Distribution (SD) automatically triggers rebate calculations based on the pre-defined conditions in the CCM.",
      },
      { title: "Real-time Visibility", body: "Distributors can access a self-service portal to view their rebate accruals and estimated payouts in real-time." },
      {
        title: "Simplified Dispute Resolution",
        body: "A transparent audit trail facilitates faster and more efficient resolution of any discrepancies in rebate calculations.",
      },
    ],
    results: [
      { value: "45%", label: "Reduction in dispute resolution time" },
      { value: "33%", label: "Operation and logistics costs savings" },
      { value: "32%", label: "Improvement in cash forecasting accuracy" },
      { value: "15%", label: "Improvement in sales revenue in first year" },
    ],
    technologies: ["SAP S/4HANA on Cloud", "SAP Condition Contract Management", "SD", "FI", "PP", "MM", "Analytics"],
    industry: "retail",
    services: ["digital-transformation/sap"],
    pillars: ["digital-transformation"],
    image: "images/case-studies/sap-condition-contract-management.webp",
    legacyPath: "/condition-contract-management-settlement-management/",
    status: "DRAFT",
    sortOrder: 9,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title (full stop removed). Alternative: detail H1 "Condition Contract Management (Settlement Management)". Label: listing "PREDICTIVE MAINTAINANCE" (wrong for this content) vs detail "Consumer Packaged Goods" (detail used). Industry mapped to Retail (distributor rebates): confirm. ${NO_REGION}`,
  },
  {
    slug: "predictive-machine-health-monitoring",
    label: "Manufacturing",
    title: "Reduce Manual Efforts by 50% with Better Planning and Insights",
    headlineMetric: "50%",
    metricLabel: "savings in manual efforts",
    summary:
      "Achieve 50% savings in manual efforts by overcoming poor planning, preparation, and lack of actionable insights.",
    clientDescriptor: "Manufacturers in steel, fertilizer, shipping and pharma with global operations",
    overview:
      "Implement IoT-enabled proactive and predictive machine health monitoring to optimize maintenance, minimize downtime, and improve operational efficiency.\n\nVarious customers in manufacturing businesses like steel, fertilizer, shipping, pharma with global scale of operations seeking advance and autonomous predictive maintenance and monitoring solutions for today’s smart factory.",
    challenge:
      "To health-check, identify and fix failures in critical assets used in the manufacturing process (like blowers, pumps, motors, associated gear boxes and bearings, conveyors, assemblies and alignments), at shop floor operation plants. To provide IoT based predictive maintenance solution with advanced analytics that detects faults at an early stage and offers a reliable prediction of the useful life of machineries. To reduce maintenance cost and improve overall operation efficiency.",
    solution: [
      {
        title: "Smart Monitoring",
        body: "AI-based cloud solution integration with IoT sensors that captures multiple machine parameters to provide accurate fault and reliability prediction. Wireless IoT sensors versions provides a secure and reliable IoT network, provides the data necessary to anticipate and prevent costly production errors and work stoppages.",
      },
      {
        title: "Data Integration",
        body: "Integration with SAP for advanced analytics on assets life cycle management (ALM). IoT-enabled machines transmit data to SAP ALM in real-time. This data includes operational metrics and performance indicators that are crucial for assessing the health and condition of the machines.",
      },
      {
        title: "Predictive Insights",
        body: "Using machine learning algorithms and predictive models, SAP ALM can analyze historical and current data to predict potential failures or performance degradation. It can detect anomalies, deviations from normal operating conditions, and trigger alerts or notifications for maintenance teams. It recommends maintenance actions based on predicted failure probabilities or degradation trends, optimizing maintenance schedules and minimizing downtime.",
      },
      {
        title: "Predictive Maintenance",
        body: "Temperature sensors, humidity sensors, vibration sensors, accelerometer, ultrasound sensors, magnetic flux sensors make prediction reliable and accurate approach. Sensors measure the conditions of equipment and the atmosphere, comparing it to the baseline for the area/machinery, and making notes of variations from optimal status. Deviations may be captured, analysed, and then turned into timely preventive maintenance savings",
      },
    ],
    results: [
      { value: "50%", label: "Savings in manual efforts caused by poor planning and preparation and lack of insights" },
      { value: "33%", label: "Reduction in overall maintenance cost" },
      { value: "67%", label: "Improvement in asset life-cycle aging and health" },
      { value: "3k+", label: "Work hours saved monthly" },
    ],
    technologies: ["AI Based Cloud Solution", "SAP Cloud Integration", "IoT sensors"],
    industry: "supply-chain",
    services: ["digital-transformation/sap", "ai-services/ai-ml"],
    pillars: ["digital-transformation", "ai-services"],
    image: "images/case-studies/predictive-machine-health-monitoring.webp",
    legacyPath: "/proactive-and-predictive-machine-health-monitoring-with-iot-integration-solution/",
    status: "DRAFT",
    sortOrder: 10,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title (full stop removed). Alternative: detail H1 "Proactive and Predictive Machine Health Monitoring with IoT integration solution". Label: listing "PHARMA" vs detail "Manufacturing" (detail used). Typo fixed: "shot floor" → "shop floor". "Global scale of operations": no single region. ${NO_REGION}`,
  },
  {
    slug: "sap-fiori-btp-capex-real-estate",
    label: "Resource Planning",
    title: "Save 30% in Efforts with Smarter Resource Planning",
    headlineMetric: "30%",
    metricLabel: "savings in operational efforts",
    summary:
      "Achieve 30% savings in operational efforts through improved resource planning and efficient allocation strategies for maximum productivity.",
    clientDescriptor: "One of the largest European universities, with multiple real estate infrastructure projects across its campuses",
    overview:
      "SAP Fiori and BTP Cloud solution streamlines CAPEX project management for real estate, enabling efficient tracking and control.\n\nOne of the largest European University has multiple real state infrastructure within their campuses. Every Infrastructure is treated a CAPEX project which needed budget planning, tracking and end to end execution cycle. The Campus board members wanted to harmonize all these expense sheet in the form of a project management tool which can be accessed over any user devices like desktop, mobile, tablets or web.",
    challenge:
      "All the expense sheets, claims and other expense data were maintained in excel. It was tedious job to update it every time once any new decision were taken. Also, it was very complex to manage the project progress based on assignments.",
    solution: [
      {
        title: "Enterprise Planning",
        body: "The university leverages SAP S/4HANA for robust enterprise resource planning, including project systems capabilities tailored for CAPEX operations.",
      },
      {
        title: "Cloud Integration",
        body: "SAP Business Technology Platform (SAP BTP) provided integration with cloud mobility solutions for seamless access and scalability across different devices.",
      },
      {
        title: "User-Centric Design",
        body: "Provided a modern, user-friendly interface for accessing SAP applications, ensuring intuitive user experiences and efficient workflows.",
      },
      {
        title: "Key features",
        body: "Dashboard overview · Budget Planning and Tracking · Procurement and Resource planning · Project Execution and monitoring · Reporting and Analytics · Mobile Accessibility (responsive design and offline capability)",
      },
    ],
    results: [
      { value: "40%", label: "Reduction in Capital Expenditure (CapEx) expenditures" },
      { value: "30%", label: "Improvement in cash working capital due to insights and intelligence on projects" },
    ],
    technologies: ["SAP S/4HANA Project Systems, MM, SD", "SAP BTP Mobility Solutions", "SAP Fiori Web Applications"],
    industry: "education",
    services: ["digital-transformation/sap", "digital-transformation/application-development"],
    pillars: ["digital-transformation"],
    image: "images/case-studies/sap-fiori-btp-capex-real-estate.webp",
    legacyPath: "/sap-fiori-and-btp-cloud-solution-for-capex-project-management-tool-for-real-estate/",
    status: "DRAFT",
    sortOrder: 11,
    needsReview: true,
    editorNote: `${CLEARANCE} CONFLICT: the 30% headline ("Save 30% in Efforts") does not match the detail page, whose 30% is "Improvement in cash working capital". Title = listing title (full stop removed). Alternative: detail H1 "SAP Fiori and BTP Cloud solution for CAPEX Project management tool for Real Estate". Label: listing "RESOURCE PLANNING" vs detail "Manufacturing" (listing used; the client is a university). "Real state" kept verbatim in the overview (likely "real estate"): confirm. Client is "European": UK region? Not stated, so no region tag. Industry mapped to Education: confirm.`,
  },
  {
    slug: "steel-plate-inspection",
    label: "Manufacturing",
    title: "Detect 80% of Steel Plate Defects with Advanced Computer Vision Algorithms",
    headlineMetric: "80%",
    metricLabel: "of steel plate defects detected",
    summary:
      "Automated inspection system that reduces manual intervention by 80%, ensuring precise detection of cracks, scratches, and dents for timely corrections.",
    overview:
      "Utilizing groundbreaking technology to enhance the accuracy and efficiency of steel plate inspection and severity detection processes.",
    challenge:
      "Traditional steel plate inspection methods are labor-intensive, error-prone, and lack precision, hampering accurate defect detection and quality control, especially in manufacturing and construction.",
    solution: [
      { title: "Advanced Object Detection", body: "Utilizes cutting-edge techniques for identifying defects on steel plates." },
      { title: "Computer Vision Algorithms", body: "Employs sophisticated algorithms to detect cracks, scratches, and dents." },
      { title: "Automated Inspection", body: "Streamlines the inspection process, reducing the need for manual intervention." },
      { title: "High Precision", body: "Ensures accurate identification of defects, maintaining high-quality standards." },
      { title: "Timely Intervention", body: "Facilitates early detection of issues, allowing for prompt corrective actions." },
    ],
    results: [
      { value: "67.2%", label: "Increase in inspection throughput" },
      { value: "32.8%", label: "Decrease in labor cost" },
    ],
    industry: "supply-chain",
    services: ["ai-services/computer-vision"],
    pillars: ["ai-services"],
    image: "images/case-studies/steel-plate-inspection.webp",
    legacyPath: "/advanced-steel-plate-inspection/",
    status: "DRAFT",
    sortOrder: 12,
    needsReview: true,
    editorNote: `${CLEARANCE} CONFLICT: listing title says "Detect 80% of steel plate defects", the card body says it "reduces manual intervention by 80%". Which? Title = listing title (capitalised as a title). Alternative: detail H1 "Advancing Steel Plate Inspection & Severity Detection". Candidate for AI solution 4–6. ${NO_REGION}`,
  },
  {
    slug: "fruit-recognition",
    label: "Retail",
    title: "95% Accurate Fruit Detection with Advanced Computer Vision Algorithms",
    headlineMetric: "95%",
    metricLabel: "accurate fruit detection",
    summary:
      "Advanced CNN algorithms offer real-time, reliable fruit identification, simplifying nutritional tracking for health-conscious users.",
    overview:
      "Implementing smart technology to accurately identify fruits and predict calorie content, transforming dietary tracking and nutritional planning.",
    challenge:
      "Identifying fruits and manually estimating their calorie content is tedious and error-prone. Lack of readily accessible nutritional information hampers informed dietary decisions, causing inefficiencies in meal planning and impeding efforts towards healthier lifestyles. Our solution addresses these challenges by automating fruit recognition and calorie prediction, providing users with instant and accurate nutritional insights, streamlining meal planning, and empowering individuals to make informed dietary choices effortlessly.",
    solution: [
      {
        title: "State-of-the-art computer vision algorithms",
        body: "Detect and identify a broad variety of fruits in photos with an accuracy rate of more than 95%, even in difficult visual environments.",
      },
      { title: "Advanced CNN algorithms", body: "Reliably recognize and classify numerous fruit varieties, ensuring trustworthy identification in real time." },
      { title: "Nutritional tracking", body: "Simplifies managing dietary demands by providing quick and precise fruit identification." },
      {
        title: "Benefits for users",
        body: "Especially advantageous for health-conscious individuals and those monitoring caloric intake, aiding in successful dietary management.",
      },
    ],
    results: [{ value: "95%+", label: "Accuracy in identifying a broad variety of fruits in photos" }],
    industry: "retail",
    services: ["ai-services/computer-vision"],
    pillars: ["ai-services"],
    image: "images/case-studies/fruit-recognition.webp",
    legacyPath: "/fruit-recognition/",
    status: "DRAFT",
    sortOrder: 13,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title. Alternative: detail H1 "Smart Nutrition: Innovating Fruit Recognition and Calorie Prediction". Label "retail" (lower case on the listing) capitalised. ${NO_REGION}`,
  },
  {
    slug: "ppe-detection",
    label: "Smart Cities",
    title: "AI Ensures 95%+ PPE Compliance with 30% Efficiency Boost",
    headlineMetric: "95%+",
    metricLabel: "PPE compliance",
    summary:
      "Real-time monitoring detects non-compliance within seconds, triggering alerts and integrating seamlessly with existing systems for enhanced safety.",
    overview:
      "Leveraging advanced technology to monitor and enforce PPE compliance, enhancing workplace safety and regulatory adherence.",
    challenge:
      "In various industries, especially those involving hazardous environments or infectious disease control, ensuring the safety of personnel is paramount. One significant challenge is monitoring whether individuals are adhering to Personal Protective Equipment (PPE) guidelines, such as wearing complete PPE kits, including items like masks, gloves, goggles, and gowns. Traditional methods of manual inspection are time-consuming, prone to errors, and often not scalable. There is a need for a more efficient and accurate solution to detect compliance with PPE protocols.",
    solution: [
      { title: "AI-driven computer vision algorithms autonomously monitor PPE usage in real-time, ensuring safety compliance." },
      { title: "Recognizes 95%+ of common PPE types, such as helmets, gloves, and safety glasses." },
      { title: "Detects non-compliance within seconds and triggers alerts for immediate action." },
      { title: "Integrates seamlessly with existing systems, enhancing safety, compliance, and efficiency by up to 30%" },
    ],
    results: [
      { value: "95%+", label: "Of common PPE types recognised, such as helmets, gloves, and safety glasses" },
      { value: "30%", label: "Improvement in safety, compliance, and efficiency" },
    ],
    industry: "public-sector",
    services: ["ai-services/computer-vision"],
    pillars: ["ai-services"],
    image: "images/case-studies/ppe-detection.webp",
    legacyPath: "/ppe-detection/",
    status: "DRAFT",
    sortOrder: 14,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title. Alternative: detail H1 "PPE Compliance Monitoring Solution". Label: listing "SMART CITIES", detail "Smarter Cities". Candidate for AI solution 4–6. Industry mapped to Public sector (smart cities): confirm. ${NO_REGION}`,
  },
  {
    slug: "cinema-hall-person-count",
    label: "Smart Cities",
    title: "95% Accurate Real-Time Cinema Analytics with Advanced Computer Vision",
    headlineMetric: "95%",
    metricLabel: "accurate real-time cinema analytics",
    summary:
      "Monitors occupancy and audience behavior under dim lighting, providing instant insights on engagement and demographics through non-invasive analysis.",
    overview:
      "Accurately monitoring person count in cinema halls to optimize operations, enhance safety, and improve audience management.",
    challenge:
      "Cinema operators globally face challenges in accurately monitoring occupancy and understanding audience behaviours due to the dynamic nature of cinema environments, characterized by fluctuating lighting conditions, varying audience sizes, and diverse seating patterns.\n\nTraditional methods of occupancy monitoring and audience analysis often fall short in precision, adaptability, and depth of insights, leading to suboptimal utilization of space, inefficient advertising strategies, and a lack of personalized audience engagement.",
    solution: [
      { title: "Leverages Computer Vision and advanced image processing to offer an innovative analytics system for cinemas." },
      { title: "Accurately monitors real-time occupancy and audience behavior, even under dim lighting conditions." },
      { title: "Analyzes video feeds to discern occupancy levels and interprets anonymized body movements to gauge audience engagement and demographics." },
      { title: "Employs a non-invasive approach that provides cinema operators with instant insights into audience dynamics." },
    ],
    results: [{ value: "95%", label: "Accuracy in real-time cinema occupancy analytics" }],
    industry: "hospitality",
    services: ["ai-services/computer-vision"],
    pillars: ["ai-services"],
    image: "images/case-studies/cinema-hall-person-count.webp",
    legacyPath: "/cinema-hall-person-count/",
    status: "DRAFT",
    sortOrder: 15,
    needsReview: true,
    editorNote: `${CLEARANCE} Title = listing title. Alternative: detail H1 "Optimizing Cinema Operations: Accurate Person Counting for Enhanced Audience Management". Label: listing "SMART CITIES", detail "Smarter Cities". The 95% appears only in the listing title. Two of the detail page's benefit cards are copied from the steel-plate page. Industry mapped to Hospitality (entertainment venues): confirm. ${NO_REGION}`,
  },
  {
    slug: "entry-exit-time-tracker",
    label: "Retail",
    title: "Monitor Crowd Flow with 98.7% Accuracy and 24/7 Real-Time Entry/Exit Tracking",
    headlineMetric: "98.7%",
    metricLabel: "accuracy in crowd-flow monitoring",
    summary: "[Placeholder] One-line summary of the entry/exit tracking case study.",
    overview:
      "Efficiently track and manage employee entry and exit times with real-time monitoring for enhanced security and operational efficiency.",
    challenge:
      "Design a system to count entries and exits accurately and in real-time. Additionally, monitor the rate of entry and exit per unit time to better understand crowd movement and efficiently manage resources.",
    solution: [
      { title: "Track individuals entering and exiting designated areas to monitor crowd flow effectively." },
      { title: "Implement a system to detect individuals entering and exiting designated areas." },
      { title: "Define clear boundaries for entry and exit points." },
      { title: "Track movement and direction of individuals using coordinates." },
      { title: "Record entry and exit events based on movement across boundaries." },
      { title: "Calculate and update entry and exit counts to monitor crowd flow dynamics effectively." },
    ],
    results: [{ value: "98.7%", label: "Accuracy in monitoring crowd flow, with 24/7 real-time entry/exit tracking" }],
    industry: "retail",
    services: ["ai-services/computer-vision"],
    pillars: ["ai-services"],
    image: "images/case-studies/entry-exit-time-tracker.webp",
    legacyPath: "/entry-exit-time-tracker-monitoring-ingress-and-egress-activity/",
    status: "DRAFT",
    sortOrder: 16,
    needsReview: true,
    editorNote: `${CLEARANCE} CONFLICT: the live listing card reuses the PPE card's body text, so the summary is a placeholder: card copy needed. Title = listing title ("tracking" capitalised). Alternative: detail H1 "Entry-Exit Time Tracker: Monitoring Ingress and Egress Activity". Label: listing "Retail", detail "Smarter Spaces AI". The 98.7% appears only in the listing title. The detail page's benefit cards are copied from the steel-plate page and are not migrated. ${NO_REGION}`,
  },
  {
    slug: "ai-traffic-monitoring",
    label: "Smart Cities",
    title: "AI Smarter Spaces: Analysing Traffic with 99% Accuracy, Improving Flow by 30%",
    headlineMetric: "99%",
    metricLabel: "accuracy in traffic analysis",
    summary: "[Placeholder] One-line summary of the traffic monitoring case study.",
    overview:
      "Utilize AI-powered technology for intelligent traffic monitoring, enhancing safety, efficiency, and real-time decision-making in smarter, more connected spaces.",
    challenge:
      "Traditional traffic monitoring frameworks fall short in their ability to gather in-depth data on vehicle characteristics, leading to obstacles in effective traffic management and insightful analysis. The lack of capabilities for real-time, precise vehicle detection and analysis plays a significant role in causing road congestion, elevating accident frequencies, and resulting in inefficient traffic control. Such an innovative system is essential, not just for streamlining traffic and enhancing road safety, but also for mitigating environmental impact by improving traffic flow and decreasing pollution levels.",
    solution: [
      { title: "Collect the vehicle image dataset", body: "Gather different vehicle type images which are not defined by the model." },
      {
        title: "Collect the vehicle number plate and brand recognition dataset",
        body: "Collect different vehicle number plate image dataset and the car brand dataset.",
      },
      { title: "Annotate the images with their respective labels", body: "Using CVAT annotate the images and prepare them for image augmentation." },
      { title: "Image Augmentation", body: "Augmenting the images for generating varieties of images using the original image dataset." },
      {
        title: "Fine-tune the models for training",
        body: "Train two different models one on detecting the type of the vehicle and another one to detect the number plate position and the brand logo on the car.",
      },
      {
        title: "Inference and evaluation of the models",
        body: "Evaluate the models on the testing images and create an evaluation matrix of the fine-tuned model.",
      },
    ],
    results: [
      { value: "99%", label: "Accuracy in analysing traffic" },
      { value: "30%", label: "Improvement in traffic flow" },
    ],
    technologies: ["CVAT"],
    industry: "public-sector",
    services: ["ai-services/computer-vision"],
    pillars: ["ai-services"],
    image: "images/case-studies/ai-traffic-monitoring.webp",
    legacyPath: "/surveillance-system/",
    status: "DRAFT",
    sortOrder: 17,
    needsReview: true,
    editorNote: `${CLEARANCE} CONFLICT: the live listing card reuses the PPE card's body text, so the summary is a placeholder: card copy needed. Duplicate pages /surveillance-system/ and /ai-smarter-spaces-traffic-monitoring/ (same H1 "AI Smarter Spaces - Traffic Monitoring") merged here; both redirect here. Overview taken from /ai-smarter-spaces-traffic-monitoring/ (the /surveillance-system/ intro is the furniture-matching text). Title = listing title, British spelling "Analysing" and title case applied. Typos fixed in the steps ("annoting/annote", "brand log", "the fine-tuned the model"). The 99% and 30% appear only in the listing title. ${NO_REGION}`,
  },

  // ── /case-study/ custom-post-type pages (not on the listing) ───────
  {
    slug: "kubernetes-operations-healthtech",
    label: "HealthTech",
    title: "Modernizing Kubernetes Operations for a Leading HealthTech Company",
    headlineMetric: "[Placeholder]",
    metricLabel: "[Placeholder] metric label",
    summary:
      "Moving from reactive firefighting to a proactive, observable EKS operating model — with clear ownership of incidents, capacity and cost.",
    clientDescriptor: "A leading HealthTech company",
    overview:
      "A proactive, observable EKS operating environment — with the engineering team focused on the product, not the pager.",
    challenge:
      "As the customer’s AWS and Kubernetes environment scaled, managing infrastructure reliability, operational visibility and day-to-day EKS operations became increasingly complex. The team needed to move from a reactive operating model to a proactive, structured cloud operations framework — with centralized monitoring, proactive alerting, EKS lifecycle management, incident response and ongoing AWS cost governance across a growing set of production workloads.",
    solution: [
      {
        title: "AWS Managed Services centred on Amazon EKS",
        body: "Adamas implemented a comprehensive AWS Managed Services model centered on Amazon EKS. We established centralized observability using Amazon CloudWatch, Prometheus and Grafana, giving full visibility across EKS clusters, worker nodes, workloads and application health, and took on the ongoing operational responsibilities that come with running Kubernetes at scale.",
      },
      { title: "Cluster health, lifecycle and patch management" },
      { title: "Node health, capacity monitoring and planning" },
      { title: "Production workload monitoring and troubleshooting" },
      { title: "Structured incident management with defined escalation and runbooks" },
      { title: "Ongoing AWS cost governance and EC2 rightsizing" },
    ],
    technologies: ["Amazon EKS", "Amazon EC2", "Amazon CloudWatch", "AWS IAM", "Amazon VPC", "Prometheus", "Grafana"],
    industry: "healthcare",
    services: ["cloud-services/managed-cloud"],
    pillars: ["cloud-services"],
    image: "images/case-studies/kubernetes-operations-healthtech.webp",
    legacyPath: "/case-study/case-study_kubernetes/",
    status: "DRAFT",
    sortOrder: 18,
    needsReview: true,
    editorNote: `${CLEARANCE} MISSING: the page has no headline number, so headlineMetric/metricLabel are placeholders: a measured outcome is needed. The page's "Business Outcomes" are qualitative with no figures, so no results are seeded: Clear, centralized visibility across Kubernetes workloads and infrastructure health · Standardized EKS operations and lifecycle management · Structured incident response with clear escalation paths · Continuous AWS cost governance and optimization · Reduced day-to-day operational burden on the customer’s engineering team. Summary = the card on /cloud-services/. Title verbatim from the page. Image is only 317×160 px on the live site: higher-resolution image needed. ${NO_REGION}`,
  },
  {
    slug: "sap-disaster-recovery-cement",
    label: "Manufacturing",
    title: "Strengthening SAP Resilience and Disaster Recovery on AWS",
    headlineMetric: "24×7",
    metricLabel: "monitoring across AWS and SAP environments",
    summary:
      "A tested, recovery-ready SAP environment — with validated failover, not just a disaster recovery plan sitting in a document.",
    clientDescriptor: "A leading manufacturing cement company",
    overview:
      "A tested, recovery-ready SAP environment on AWS — validated on a schedule, not assumed until an outage.",
    challenge:
      "As SAP became increasingly critical to business operations, the customer needed to strengthen business continuity and disaster recovery readiness across its AWS environment. This meant establishing a structured approach to SAP HANA recovery, DR infrastructure readiness, failover and failback procedures, and RTO/RPO validation. Without consolidated monitoring, it was difficult to proactively identify issues across SAP, infrastructure, storage, networking, backups and replication health before they affected the business.",
    solution: [
      {
        title: "AWS Managed Services for SAP disaster recovery",
        body: "Adamas designed and operates a comprehensive AWS Managed Services framework spanning SAP disaster recovery, infrastructure monitoring, incident management and infrastructure administration. For DR, the solution uses SAP HANA System Replication between primary and DR environments, backed by continuous replication monitoring, documented recovery runbooks and periodic validation — with RTO/RPO testing built in as a repeatable process rather than a one-time exercise.",
      },
      { title: "Centralized monitoring across EC2 infrastructure, storage and networking" },
      { title: "SAP application and SAP HANA health, replication and backup monitoring" },
      { title: "Documented recovery runbooks and failback procedures" },
      { title: "Periodic DR validation exercises and recovery testing" },
      { title: "EC2 lifecycle management, OS patching and AWS Backup" },
      { title: "Ongoing IAM, VPC and infrastructure health reviews" },
    ],
    results: [{ value: "24×7", label: "Monitoring across AWS and SAP environments" }],
    technologies: [
      "Amazon EC2",
      "Amazon CloudWatch",
      "AWS Backup",
      "Amazon VPC",
      "AWS IAM",
      "Prometheus",
      "Grafana",
      "Alertmanager",
      "SAP HANA System Replication",
    ],
    industry: "supply-chain",
    services: ["cloud-services/managed-cloud", "cloud-services/sap-on-cloud"],
    pillars: ["cloud-services"],
    image: "images/case-studies/sap-disaster-recovery-cement.webp",
    legacyPath: "/case-study/case-study_sap_cement-industry/",
    status: "DRAFT",
    sortOrder: 19,
    needsReview: true,
    editorNote: `${CLEARANCE} No headline number on the page: "24×7" is taken from its Business Outcomes ("24×7 monitoring across AWS and SAP environments"). A measured outcome (e.g. tested RTO/RPO) would be stronger. The other outcomes are qualitative and not seeded as results: Stronger business continuity and disaster recovery readiness · Structured SAP HANA replication and recovery management · Proactive alerting and standardized incident response · Improved infrastructure and cloud governance · Reduced operational overhead for the customer’s IT and SAP teams. Label: page "Leading Manufacturing Cement Company"; /cloud-services/ card "Manufacturing / Cement". Summary = the /cloud-services/ card. Image is only 317×160 px: higher-resolution image needed. Industry mapped to Manufacturing and Supply Chain. ${NO_REGION}`,
  },
];
