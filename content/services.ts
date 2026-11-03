import type { PillarSeed } from "./types";

/**
 * Service pillars and sub-services (approved IA: docs/sitemap.pdf rows 7–26).
 * Copy is migrated from the old page that feeds each new URL (301 map), kept verbatim apart from obvious typos.
 * "Did you know?" figures are third-party claims from the old pages: kept verbatim and flagged as unverified.
 * The old pages' "TECHNOLOGIES" sections are unlabelled logo images, so `technologies` is only set where tools are named in text.
 */

const UNVERIFIED_STATS =
  '"Did you know?" figures are verbatim from the old page with no source cited: verify (and confirm the +/- signs) before launch.';

export const pillars: PillarSeed[] = [
  // ────────────────────────────────────────────────────────────────────
  {
    slug: "cloud-services",
    name: "Cloud Services",
    tagline: "Resilient | Reliable | Cost optimized | Intelligent",
    summary:
      "Adamas Tech Consulting helps enterprises, institutions, and public-sector organizations design modern cloud foundations, optimize operations, and apply AI on AWS for measurable business outcomes.",
    outcomeLine: "Cloud that Scales your Organisation",
    challenge:
      "AWS is no longer only a hosting platform; it is the backbone for modernization, intelligent automation, data-led decisions, and industry transformation. Adamas helps clients move from fragmented infrastructure and isolated pilots to secure, scalable, and production-ready AWS environments.",
    status: "PUBLISHED",
    sortOrder: 0,
    needsReview: true,
    editorNote:
      'Summary and challenge from /aws-solutions/ (intro and "Positioning"); tagline and outcome line from /cloud-transformation/. AWS-only wording on a pillar named "Cloud Services": confirm. The "AWS Advanced Tier Partner" and competency claims on /aws-solutions/ are not migrated until the partner tier is confirmed. Sub-service names to confirm (Q5.3).',
    services: [
      {
        slug: "cloud-migration",
        name: "Cloud Migration",
        descriptor:
          "Migrate workloads, modernize architecture, and move from legacy systems to scalable AWS-native environments.",
        summary:
          "Move from legacy infrastructure to resilient, scalable AWS environments designed for performance, governance, and long-term growth.",
        whoFor: "Adamas supports organizations that need to modernize legacy systems without disrupting operations.",
        whatWeDo: [
          { title: "Migration planning and cloud readiness assessment" },
          { title: "AWS landing zone and environment design" },
          { title: "Application rehosting, replatforming, or modernization" },
          { title: "Performance, security, and cost optimization" },
          { title: "Post-migration operations and improvement" },
        ],
        legacyPath: "/cloud-migration-modernisation/",
        status: "PUBLISHED",
        sortOrder: 0,
        needsReview: true,
        editorNote:
          "Not in the 301 map; copy from the unlinked page /cloud-migration-modernisation/ (descriptor from the /aws-solutions/ hub card). That page also carries wireframe text and a template testimonial (\"Katya Tognazzini\"), not migrated. Name to confirm (Q5.3).",
      },
      {
        slug: "cloud-transformation",
        name: "Cloud Transformation",
        descriptor: "Cloud that Scales your Organisation",
        summary:
          "Adamas Tech is one of the preferred partners of AWS, enabling businesses to migrate, optimize & scale on cloud with speed & security. Whether you are a fast-scaling startup or a complex enterprise, we deliver a tailored cloud journey backed by certified AWS architects & industry expertise with proven methodologies.",
        whatWeDo: [
          { title: "Engagement Models", body: "Flexible options including fixed project and retainer-based" },
          { title: "Co-creation", body: "Customer involved in discovery, design, testing & rollout phase" },
          { title: "CCoE Support", body: "Enables Governance models and self-sufficiency after deployment." },
          { title: "Certifications & SLAs", body: "Certified team, Fast response time & monthly SLA reports." },
          { title: "Post-Launch Support", body: "Optimisation review, audits & access to cloud solution architects." },
        ],
        steps: [
          { title: "Discovery", body: "Cloud readiness · Application mapping · Security posture check", sortOrder: 0 },
          { title: "Design", body: "Architecture blueprint · TCO/Risk analysis · Migration wave planning", sortOrder: 1 },
          { title: "Migration", body: "Pilot apps/DBs migration · DNS cutover · DR/backup enablement", sortOrder: 2 },
          { title: "Modernisation", body: "DevOps automation · Containerisation · Data modernisation", sortOrder: 3 },
          { title: "Manage", body: "24/7 NOC · SLA-driven support · Billing governance · Monthly Performance Review", sortOrder: 4 },
        ],
        legacyPath: "/cloud-transformation/",
        status: "PUBLISHED",
        sortOrder: 1,
        needsReview: true,
        editorNote:
          'From /cloud-transformation/. Typos fixed in the overview ("a one of preferred partner of AWS , enabling business" → "is one of the preferred partners of AWS, enabling businesses"; "fast scaling startup" → "a fast-scaling startup"; "tailored cloud journey" → "a tailored cloud journey"). "Preferred partner of AWS" and "certified AWS architects": confirm. Steps are the "Our Engagement Model" items; whatWeDo is "Engagement Benefits to Customer". The "Industry wise Solution" block (Retail / BFSI / Manufacturing / Healthcare) has no field and is not migrated. Name to confirm (Q5.3).',
      },
      {
        slug: "managed-cloud",
        name: "Managed Cloud & Cloud Reselling (CSP)",
        descriptor:
          "Improve reliability, security, performance, and cost efficiency with ongoing AWS operations and governance.",
        summary:
          "Improve reliability, security, performance, and cost efficiency with ongoing AWS operations and governance.",
        whatWeDo: [
          { title: "24/7 environment monitoring and operational support" },
          { title: "Cost optimization and rightsizing reviews" },
          { title: "Security posture and governance controls" },
          { title: "Performance tuning and availability improvement" },
          { title: "Ongoing improvement planning and reporting" },
          { title: "[Placeholder] Cloud reselling (CSP)" },
        ],
        legacyPath: "/managed-cloud-optimization/",
        status: "PUBLISHED",
        sortOrder: 2,
        needsReview: true,
        editorNote:
          "Not in the 301 map; copy from the unlinked page /managed-cloud-optimization/ (\"Managed Cloud & Optimization\"). MISSING: any copy on cloud reselling / CSP (sitemap row 11). Related unlinked page: /aws-managed-services/. Name to confirm (Q5.3).",
      },
      {
        slug: "sap-on-cloud",
        name: "SAP on Cloud",
        descriptor: "[Placeholder] One line on running SAP on the cloud.",
        summary: "[Placeholder] Short introduction to SAP on Cloud services.",
        status: "PUBLISHED",
        sortOrder: 3,
        needsReview: true,
        editorNote:
          'MISSING: no old page. Case-study-backed facts available: "Strengthening SAP Resilience and Disaster Recovery on AWS" (SAP HANA System Replication, AWS Backup, CloudWatch). Copy needed. Name to confirm (Q5.3).',
      },
      {
        slug: "oracle-netsuite",
        name: "Oracle NetSuite / Cloud ERP",
        descriptor: "Unified Cloud ERP for Modern Construction",
        summary:
          "Adamas Tech Consulting helps Construction, Engineering, EPC, and Contracting companies transform their operations with Oracle NetSuite — the world’s #1 true cloud ERP. Built for end-to-end project visibility and designed to eliminate fragmentation, NetSuite delivers real-time financial, operational, and project control for GCC companies.",
        whoFor:
          "NetSuite includes purpose-built capabilities for contractors, EPC firms, MEP providers, and engineering organizations.",
        whatWeDo: [
          {
            title: "Project Costing & WIP",
            body: "Real-time cost-to-complete · Automated WIP calculation · Labor, material, subcontractor cost flow · Variance analysis & proactive budget control",
          },
          {
            title: "Procurement & Subcontractor Management",
            body: "POs linked to job cost codes · Vendor scorecards · Subcontractor contract & retention tracking · Change orders tied directly to billing",
          },
          {
            title: "Inventory & Material Management",
            body: "Multi-location warehouse & site stores · Materials planning based on BOQs & project timelines · Mobile receiving with photo proof · Equipment tracking & utilization visibility",
          },
          {
            title: "Field Mobility",
            body: "Mobile timesheets & field approvals · Photo capture for site documentation · Digital work orders",
          },
          {
            title: "Financial Governance",
            body: "IFRS + GCC VAT compliant · Multi-currency & multi-entity consolidation · Automated intercompany",
          },
        ],
        highlights: [
          {
            title: "USD 3.4M",
            body: "NetSuite saves nearly USD 3.4M over five years for a 150-user deployment (Financials + Projects + Procurement).",
          },
        ],
        steps: [
          { title: "Discovery & Scoping", body: "2–3 weeks", sortOrder: 0 },
          { title: "Solution Design", body: "3 weeks", sortOrder: 1 },
          { title: "SuiteSuccess Implementation", body: "12–18 weeks", sortOrder: 2 },
          { title: "UAT & Go-Live", body: "4 weeks", sortOrder: 3 },
          { title: "Hypercare", body: "4 weeks", sortOrder: 4 },
        ],
        technologies: ["Oracle NetSuite", "SuiteSuccess"],
        legacyPath: "/oracle-netsuite-solutions/",
        status: "PUBLISHED",
        sortOrder: 4,
        needsReview: true,
        editorNote:
          'From /oracle-netsuite-solutions/, which is written for Construction & Engineering in the GCC: confirm that focus for a global page. Descriptor is the /in/ homepage card line. Unverified claims: "the world’s #1 true cloud ERP", "USD 3.4M" saving (from "our comparison matrix"), "NetSuite-certified consultants". The "Why NetSuite Outperforms SAP for Construction" comparison is not migrated (sensitive next to the SAP practice): confirm. Placement and name to confirm (Q2.3, Q5.3).',
      },
      {
        slug: "cloud-security-finops",
        name: "Cloud Security & FinOps",
        descriptor:
          "Strengthen cloud security, access control, compliance posture, and operational governance across AWS estates.",
        summary:
          "Improve cloud security, access control, compliance posture, and operational governance across AWS estates.",
        whatWeDo: [
          { title: "AWS security baseline design" },
          { title: "IAM and access governance controls" },
          { title: "Cloud monitoring and policy enforcement" },
          { title: "Compliance-oriented architecture support" },
          { title: "Operational governance across AWS environments" },
          { title: "[Placeholder] FinOps and cloud cost governance" },
        ],
        legacyPath: "/security-governance/",
        status: "PUBLISHED",
        sortOrder: 5,
        needsReview: true,
        editorNote:
          'Not in the 301 map; copy from the unlinked page /security-governance/ (descriptor from the /aws-solutions/ hub card). MISSING: FinOps copy. A separate unlinked /cybersecurity/ page ("Securing the Enterprise. From Threat to Resilience.") also exists: use it here? Name to confirm (Q5.3).',
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  {
    slug: "digital-transformation",
    name: "Digital Transformation",
    tagline: "Transformative Technology Expertise",
    summary:
      "Embrace the future with our comprehensive technology transformation services that will help businesses upgrade their tech stack, align with industry standards, and integrate emerging technologies for enhanced digital capabilities and success.",
    outcomeLine: "[Placeholder] One-line outcome for the Digital Transformation pillar.",
    challenge: "[Placeholder] The business challenge this pillar addresses.",
    status: "PUBLISHED",
    sortOrder: 1,
    needsReview: true,
    editorNote:
      'Summary and tagline from /technology-transformation/ ("BRIEF"). Its hero ("Innovate, Optimize, Succeed: Your Journey with AI and Data Begins Here") duplicates the AI page, so it is not reused. MISSING: outcome line and challenge. Not migrated: its benefits/expertise cards (one body is copied from another card, another describes the MEAN stack) and its "Did you know?" stats. Sub-service list proposed (Q5.2).',
    services: [
      {
        slug: "sap",
        name: "SAP Solutions & Consulting",
        descriptor: "Transforming business for the future",
        summary:
          "Our end to end SAP comprehensive services and consulting expertise in advance cloud based solutions empowers business for smarter and faster cloud adoption, propels digital transformation journeys and enables readiness for future challenges.\n\nAt Adamas Tech Consulting, we specialize in SAP solutions and consulting services that enable businesses to drive their digital transformation journeys. With our deep expertise in SAP Technologies, we help organizations harness the power of SAP’s robust suite of solutions to optimize operations, enhance productivity, and achieve sustainable growth.",
        whatWeDo: [
          {
            title: "SAP Implementation & Upgrades",
            body: "We assist businesses in implementing SAP systems or upgrading to the latest versions, ensuring a seamless transition and minimal disruption to operations.",
          },
          {
            title: "SAP Application Development",
            body: "Automate tasks, eliminate paperwork, and optimize processes, resulting in improved efficiency and cost savings.",
          },
          {
            title: "SAP Customisation & Integration",
            body: "Our team of experts tailor SAP solutions to meet unique business requirements and seamlessly integrate them with existing systems and processes.",
          },
          {
            title: "SAP Analytics & Reporting",
            body: "Gain real-time insights through data analytics empowering informed decision-making and agile responsiveness.",
          },
        ],
        highlights: [
          { title: "-23%", body: "Companies using SAP technologies saw a 23% reduction in IT costs and a 29% boost in employee productivity." },
          { title: "-50%", body: "SAP HANA accelerates data processing by 100,000 times, cutting storage costs by 50% and boosting speed by 60%." },
          { title: "-25%", body: "Implementing SAP S/4HANA reduced financial closing time by 25% and improved on-time delivery performance by 15%." },
          { title: "+48%", body: "SAP Analytics Cloud delivers 260% ROI, cutting reporting costs by 82% and boosting analysis speed by 48%." },
        ],
        legacyPath: "/sap-solution-consulting/",
        status: "PUBLISHED",
        sortOrder: 0,
        needsReview: true,
        editorNote: `From /sap-solution-consulting/ (summary = hero intro + "BRIEF" paragraph; whatWeDo = "OUR EXPERTISE"). ${UNVERIFIED_STATS} SAP PartnerEdge status to confirm. Proposed sub-service (Q5.2).`,
      },
      {
        slug: "application-development",
        name: "Application Development",
        descriptor: "Transforming Ideas into Powerful Applications",
        summary:
          "At Adamas Tech Consulting, we specialize in Application Development Solutions that drive innovation and accelerate business growth. Our team of skilled developers and designers are committed to creating tailored applications that meet your unique requirements and exceed your expectations.",
        whatWeDo: [
          {
            title: "Custom Application Development",
            body: "We design and develop custom applications that align with your business objectives, providing you with a competitive edge",
          },
          {
            title: "Web Application Development",
            body: "Our web applications are built using cutting-edge technologies, ensuring optimal performance, scalability, and security.",
          },
          {
            title: "Mobile App Development",
            body: "We create intuitive and feature-rich mobile applications that enable seamless user experiences across various platforms.",
          },
          {
            title: "Enterprise Application Development",
            body: "We develop robust and scalable enterprise applications that streamline processes and enhance productivity.",
          },
        ],
        highlights: [
          { title: "$935B", body: "Global mobile app revenues are projected to hit $935 billion by 2025, highlighting vast business opportunities." },
          { title: "80%", body: "80% percent of customers value company experience as much as products, underscoring the need for well-designed applications." },
          { title: "$259B", body: "The global enterprise application market will reach $259.51 billion by 2028, highlighting the rising demand for customized business solutions." },
        ],
        legacyPath: "/application-development/",
        status: "PUBLISHED",
        sortOrder: 1,
        needsReview: true,
        editorNote: `From /application-development/. Its hero sub-line is truncated on the live page ("Transforming ideas into innovative, efficient, and user-friendly), so the summary uses the "BRIEF" paragraph. ${UNVERIFIED_STATS} The "$935B by 2025" figure is now dated. Proposed sub-service (Q5.2).`,
      },
      {
        slug: "data-analytics",
        name: "Data Science & Analytics",
        descriptor: "Unleashing data's power for smarter strategic business decisions",
        summary:
          "Leverage data-driven insights to make informed, strategic decisions. Unlock valuable information and drive smarter business outcomes with confidence.\n\nAt Adamas Tech Consulting, we harness the potential of data through advanced analytics and Data Science Techniques. Our expert team leverages cutting-edge technologies and methodologies to transform raw data into actionable insights, empowering your business to make informed decisions and stay ahead in today’s data-driven world.",
        whatWeDo: [
          {
            title: "Advanced Statistical Modelling & Predictive Analytics",
            body: "Utilize advanced statistical modeling and predictive analytics to uncover trends, forecast future outcomes, and drive data-informed decisions effectively.",
          },
          {
            title: "Natural Language Processing & Text Analytics",
            body: "Utilize natural language processing and text analytics to extract insights, understand sentiments, and analyze textual data for actionable intelligence.",
          },
          {
            title: "Machine Learning Algorithms & Techniques",
            body: "Apply machine learning algorithms and techniques to uncover patterns, optimize processes, and enhance decision-making with data-driven precision.",
          },
          {
            title: "Data Visualization & Storytelling",
            body: "Transform data into compelling visuals and narratives with data visualization and storytelling to communicate insights and drive impactful decisions.",
          },
        ],
        highlights: [
          { title: "2.5x", body: "Organizations effectively leveraging data analytics are 2.5 times more likely to make faster decisions and execute them successfully." },
          { title: "-86%", body: "Eighty-six percent see data analytics as a competitive edge; 89% plan to compete on it." },
          { title: "+5%", body: "Data-driven companies are 5% more productive and 6% more profitable than their competitors." },
          { title: "6%", body: "Organizations adopting data-driven decision-making see a 5-6% productivity boost and a 4-5% increase in profitability on average." },
        ],
        legacyPath: "/data-science-analytics/",
        status: "PUBLISHED",
        sortOrder: 2,
        needsReview: true,
        editorNote: `From /data-science-analytics/. Stray "4o" removed after the 86% stat. "-86%" is a positive figure written with a minus sign: confirm. ${UNVERIFIED_STATS} An unlinked AWS page /data-analytics/ also exists. Proposed sub-service (Q5.2).`,
      },
      {
        slug: "master-data-governance",
        name: "Master Data Governance",
        descriptor: "Harness the Potential of Data",
        summary:
          "Ensure data quality, consistency, and compliance with master data governance.\n\nHarness the potential of your data with Adamas Tech Consulting’s comprehensive Master Data Governance solutions. Our expert team, in collaboration with functional experts, helps businesses establish robust data models, achieve data consistency, and create a governance framework using cutting-edge technologies.",
        whatWeDo: [
          {
            title: "Streamline Data Management",
            body: "Streamline data management in master data governance by ensures data accuracy, consistency, and compliance, leading to efficient operations and better decision-making.",
          },
          { title: "Informed Decision Making" },
          {
            title: "Ensure Data Security",
            body: "Protect sensitive information, maintaining compliance, and safeguarding against unauthorized access and data breaches.",
          },
          { title: "Agility & Innovation" },
        ],
        highlights: [
          { title: "+50%", body: "Mature data governance programs deliver 50% higher data quality, enabling more accurate insights and better decision-making." },
          { title: "-40%", body: "Effective data governance reduces data management costs by 20-40%, enhancing overall operational efficiency." },
          { title: "+20%", body: "Businesses using master data governance see up to a 20% revenue increase through improved data accuracy and decision-making." },
        ],
        legacyPath: "/master-data-governance/",
        status: "PUBLISHED",
        sortOrder: 3,
        needsReview: true,
        editorNote: `From /master-data-governance/. Typo fixed: "Steamline" → "Streamline". The live bodies of "Informed Decision Making" (cloud security text) and "Agility & Innovation" (cloud-native text) were copied from another page and are left out: body copy needed. ${UNVERIFIED_STATS} Proposed sub-service (Q5.2).`,
      },
      {
        slug: "edtech-openedx",
        name: "Open edX® / EdTech Platform",
        descriptor: "Custom development and services for scalable and engaging learning experiences.",
        summary: "Unlocking Potential – Get tailored Open edX® Solutions for Learning Excellence",
        whatWeDo: [
          {
            title: "E-Commerce Support",
            body: "Empower your education business with our Open edX® E-commerce support. Seamlessly integrate and sell courses online, leveraging a robust platform. Elevate your e-learning experience and maximize revenue effortlessly.",
          },
          {
            title: "Simplify Course Management",
            body: "Our integrated edX and LMS solution offers a centralized platform to effortlessly create, update, and organize your courses, streamlining the educational content management process. Experience the convenience of a single hub for all your learning materials.",
          },
          {
            title: "Content Management",
            body: "Simplify content organization and enhance educational materials with Open edX® Content Management. Deliver a polished, efficient online learning experience, optimizing a diverse array of content for maximum impact and engagement in your courses.",
          },
          {
            title: "Exam Management",
            body: "Streamline exam processes effortlessly with Open edX® Exam Management. Our professional platform ensures efficient administration, creating a seamless and organized experience for online assessments, enhancing the learning journey.",
          },
          {
            title: "Interactive Learning Pathways",
            body: "Empower your courses with interactive learning pathways. Our integrated Open edX® and arivoo LMS solution offers diverse content integration, allowing you to seamlessly include text, multimedia, assessments, and interactive activities. This dynamic approach enhances engagement and learning outcomes, all within a unified platform.",
          },
          {
            title: "Great Performance Tracking",
            body: "Efficiently evaluate and monitor learner progress with our integrated solution. Leverage grading and assessment tools offered by select LMS platforms, seamlessly integrated with Open edX® courses. This ensures comprehensive tracking of learner performance, streamlining the evaluation process.",
          },
          {
            title: "Online Class Integration",
            body: "Optimize your online meetings and collaborative learning with our integrated meeting platform feature. Seamlessly connect your courses to popular meeting platforms, making it easy for educators and learners to schedule, join, and engage in live sessions.",
          },
          {
            title: "Integration with other Business Suites",
            body: "Integrate with industry giants – Apple, Facebook, Microsoft, and Google. Expand your reach and streamline operations through effortless compatibility with leading business suites.",
          },
        ],
        technologies: ["Open edX"],
        legacyPath: "/openedx/",
        status: "PUBLISHED",
        sortOrder: 4,
        needsReview: true,
        editorNote:
          'From /openedx/ (descriptor is the /in/ homepage card line). The page\'s "Open edX® Solutions Suite" list has no field, so it is kept here for the designer: Open edX® Instance Implementation, Deployment and Scalable Hosting · Custom feature development · Customization, Theming and Branding · Third-party software or ERP/CRM integration · E-commerce development and payment gateway integration · XBlock development and implementation · Analytics Integration · App development for iOS and Android · 24/7 Technical Support · Open edX® Platform Consultancy. The visible theme pricing block ("30/year") is not migrated. Placement to confirm (Q2.3); list Q5.2.',
      },
      {
        slug: "e-invoicing-uae",
        name: "UAE E-Invoicing",
        descriptor: "UAE E-Invoicing Is Coming. Be Ready Before the Deadline.",
        summary:
          "We seamlessly convert your unstructured invoices—PDFs, paper, and legacy exports—into the FTA-mandated structured digital format, routing them directly through our approved ASP partners for instant compliance.",
        whoFor: "Tailored guidance for CFOs & Tax Consultants.",
        whatWeDo: [
          {
            title: "Format conversion",
            body: "Converts PDFs, paper scans, legacy EDI, and flat files into PINT-AE structured XML — no ERP upgrade required.",
          },
          {
            title: "Data Dictionary mapping",
            body: "Every mandatory field in the UAE e-Invoice Data Dictionary is mapped, validated, and enriched before transmission — rejections caught before they reach the ASP.",
          },
          {
            title: "Real-time status monitoring",
            body: "Finance teams see submission status, MLS responses, FTA acknowledgements, and failures on a single dashboard — no manual chasing.",
          },
          {
            title: "Audit-ready archival",
            body: "Tamper-proof storage of all e-invoices, credit notes, and transmission logs for the statutory 5-year retention period, with on-demand FTA retrieval support.",
          },
          {
            title: "System-Agnostic Connectivity",
            body: "Connects seamlessly via API or middleware to Oracle, SAP, Dynamics, and legacy ERPs. No complete system overhaul required.",
          },
          {
            title: "Peppol & XML Validation",
            body: "Transforms raw data into compliant UBL/XML formats, enriching missing fields to meet the strict UAE Data Dictionary rules.",
          },
          {
            title: "Advanced CFO Dashboards",
            body: "Real-time alerts, error management, and comprehensive MIS reporting giving your finance team complete visibility of submissions.",
          },
        ],
        highlights: [
          {
            title: "What is in scope?",
            body: "All B2B and B2G commercial transactions in the UAE — including free zone entities — regardless of VAT registration status. PDFs, scanned documents, and paper invoices are explicitly excluded.",
          },
          {
            title: "Penalty structure",
            body: "Cabinet Decision No. 106 of 2025 defines monthly penalties of up to AED 5,000 for failing to implement e-invoicing, appoint an ASP, or maintain compliant records after your mandatory date.",
          },
          {
            title: "Pilot window opportunity",
            body: "The July–December 2026 pilot phase allows Phase 1 businesses to test integrations, validate data against the UAE Data Dictionary, and train finance teams — before the January 2027 go-live.",
          },
        ],
        steps: [
          {
            title: "ASP Selection Workshop",
            body: "A structured evaluation to shortlist and contract the right FTA-Accredited Service Provider for your business. We benchmark candidate ASPs on PINT-AE coverage, MLS performance, ERP-connector maturity, pricing, SLAs, and free-zone handling — and deliver a board-ready recommendation, scorecard, and signed-off ASP onboarding plan. (3 weeks. Output: ASP scorecard · signed onboarding plan)",
            sortOrder: 0,
          },
          {
            title: "Tax & Regulatory Advisory",
            body: "A focused review of your VAT, free-zone, and cross-border invoicing positions against Cabinet Decision No. 106 of 2025 and the UAE Data Dictionary. We resolve the grey areas — reverse charge, designated zones, self-billing, credit/debit notes, RCM scenarios — and hand over a written position paper your finance and tax leadership can defend to the FTA. (2–4 weeks. Output: FTA-defensible tax position paper)",
            sortOrder: 1,
          },
          {
            title: "Discovery & Assessment",
            body: "Full readiness diagnostic across six critical dimensions: master data, ERP fitment, tax setup, invoice formats in circulation, integration landscape, and finance-team capability. Output is a gap report, risk register, and a costed roadmap to your mandatory go-live date. (4–6 weeks. Output: Gap report & costed roadmap)",
            sortOrder: 2,
          },
          {
            title: "Solution Design",
            body: "Target-state blueprint: ERP-to-ASP integration architecture, Peppol 5-corner data flow, exception-handling design, MLS response routing, archival approach, and CFO dashboard wireframes. A signed-off design document becomes the single source of truth for build. (3–4 weeks. Output: Signed-off design document)",
            sortOrder: 3,
          },
          {
            title: "Development & Build",
            body: "Build of the integration layer, format-conversion engine (PDF, paper, legacy EDI, flat-file → PINT-AE XML), Data Dictionary validators, enrichment rules, and dashboards. Delivered against a sprint plan with weekly demos to your finance and IT stakeholders. (6–10 weeks. Output: Integration layer & conversion engine)",
            sortOrder: 4,
          },
          {
            title: "Integration & Configuration",
            body: "Wire-up to your ERP — SAP, Oracle, Dynamics, or legacy — the appointed ASP, your archival store, and downstream reporting. Includes master-data cleansing, TRN validation, customer/vendor enrichment, and end-to-end connectivity testing across the 5-corner network. (3–4 weeks. Output: ERP ⇄ ASP live connectivity)",
            sortOrder: 5,
          },
          {
            title: "Testing (TaaS)",
            body: "Test-as-a-Service covering functional, integration, UAT, volume, negative, and FTA-scenario testing. Every mandatory field validated against the UAE Data Dictionary; defect triage and re-test cycles managed by us so your team stays focused on month-end. (1–5 weeks. Output: Signed UAT & FTA-scenario test pack)",
            sortOrder: 6,
          },
          {
            title: "Go-Live & Cutover",
            body: "Controlled cutover with a documented runbook, parallel-run option, rollback plan, hyper-care command centre, and day-one war-room support. We don’t leave the room until invoices are clearing the ASP and reaching the FTA cleanly. (1–2 weeks. Output: Successful production cutover)",
            sortOrder: 7,
          },
          {
            title: "Hypercare & 18-Month Application Managed Services (AMS)",
            body: "Post-go-live application managed services covering incident response, regulatory-change updates, ASP relationship management, monthly compliance reporting, and continuous improvement. Fixed-fee, SLA-backed, and aligned to the FTA’s 5-year retention obligation. Your finance team focuses on the business — we keep the compliance engine running. (18 months. Output: SLA-backed managed compliance · monthly MIS)",
            sortOrder: 8,
          },
        ],
        technologies: ["Peppol", "PINT-AE", "UBL/XML"],
        legacyPath: "/e-invoicing-uae/",
        status: "DRAFT",
        sortOrder: 5,
        needsReview: true,
        editorNote:
          'DECISION Q2.4: keep or retire, and show to GCC visitors only? Built from /e-invoicing-uae/ as a draft; /e-invoicing-uae/ redirects to /ae/ for now. Regulatory facts (Cabinet Decision No. 106 of 2025, AED 5,000 penalties, July 2026 ASP deadline, pilot July–December 2026, January 2027 go-live) must be re-checked before publishing. Not migrated: the mandate intro, the DCTCE 5-corner model text, the "Start Free Assessment" CTA (→ https://adamastech.ae/assessment/, typo "Assesment" fixed) and Form B (Full name, Work email, Phone, Company name, Existing ERP System). Steps are the 2 advisory tracks + 7 delivery phases; durations and outputs are appended in brackets.',
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  {
    slug: "ai-services",
    name: "AI Services",
    tagline: "Empowering businesses to thrive in the digital era through innovative AI and scalable analytics solutions",
    summary:
      "At Adamas Tech Consulting, we empower businesses with AI and data analytics, specializing in computer vision technologies. We provide tailored solutions to optimize decision-making, streamline operations, and enhance customer experiences. Our focus is on helping clients achieve sustainable growth and maintain a competitive edge in the digital era.",
    outcomeLine: "Innovate, Optimize, Succeed: Your Journey with AI and Data Begins Here",
    challenge: "[Placeholder] The business challenge this pillar addresses.",
    status: "PUBLISHED",
    sortOrder: 2,
    needsReview: true,
    editorNote:
      "Tagline, summary and outcome line from /ai-data-analytics/. MISSING: challenge copy and pillar FAQs. Sub-service list proposed (Q5.2).",
    services: [
      {
        slug: "ai-ml",
        name: "AI / ML Solutions",
        descriptor: "Automate processes to enhance efficiency and reduce operational costs.",
        summary: "Empowering businesses to thrive in the digital era through innovative AI and scalable analytics solutions",
        whatWeDo: [
          {
            title: "Drive Business Growth with Predictive Insights",
            body: "Harness the power of AI to anticipate trends, identify opportunities, and make data-driven decisions that propel your business forward.",
          },
          {
            title: "Enhance Customer Experience through Personalization",
            body: "Leverage analytics to understand customer behavior and preferences, delivering personalized experiences that foster loyalty and satisfaction.",
          },
          { title: "Optimize Operations and Increase Efficiency" },
          {
            title: "Innovate with Next-Generation AI Solutions",
            body: "Utilize state-of-the-art technologies such as Computer Vision and Generative AI to innovate your offerings, positioning your business at the forefront of the market with a distinct competitive advantage.",
          },
        ],
        highlights: [
          { title: "50%", body: "By 2027, 50% of companies will adopt AI vision systems for warehouses, boosting inventory accuracy and cutting costs." },
          { title: "-37%", body: "Companies adopting generative AI can reduce operational costs by up to 37%, boosting profitability and efficiency, reports Forbes." },
          { title: "+28%", body: "Organizations using advanced data visualization tools gain 28% more actionable insights, leading to faster, more accurate decision-making." },
          { title: "+25%", body: "Businesses using machine learning for predictive analytics boost forecasting accuracy by up to 25%, enhancing strategic planning and resource allocation." },
        ],
        legacyPath: "/ai-data-analytics/",
        status: "PUBLISHED",
        sortOrder: 0,
        needsReview: true,
        editorNote: `From /ai-data-analytics/ ("BENEFITS" cards; descriptor = /in/ homepage card line). The live body of "Optimize Operations and Increase Efficiency" talks about SAP solutions (copied card) and is left out. The page's "OUR EXPERTISE" cards (Data Visualization and Actionable Insights · Computer Vision - Act and Interpret · Machine Learning – Predict & Recommend · Gen AI – Create and Innovate) all carry bodies copied from the SAP page, so they are not migrated. ${UNVERIFIED_STATS} Proposed sub-service (Q5.2).`,
      },
      {
        slug: "agentic-ai",
        name: "Agentic AI Solutions",
        descriptor: "Agentic AI solution design and orchestration",
        summary:
          "Streamline operations using Amazon Bedrock Agents. By automating routine tasks, you free up resources to focus on business growth and innovation.",
        whatWeDo: [
          { title: "Bedrock Integration", body: "Expert implementation of Bedrock Agents for AI-driven workflows." },
          { title: "Custom Workflows", body: "Tailored automation to suit your business processes." },
          { title: "Security & Control", body: "Ensure automation aligns with compliance policies." },
          { title: "Performance Monitoring", body: "We continuously track agent performance for improvement." },
        ],
        highlights: [
          { title: "80%", body: "80% of leaders expect AI automation to improve efficiency by 25%." },
          { title: "74%", body: "74% of businesses investing in AI have seen improved operations." },
          { title: "75%", body: "75% of AI users seek to automate tasks using AI-driven agents" },
        ],
        technologies: ["Amazon Bedrock Agents"],
        legacyPath: "/aws-for-automated-workflows/",
        status: "PUBLISHED",
        sortOrder: 1,
        needsReview: true,
        editorNote: `No page in the 301 map. Copy from the unlinked page /aws-for-automated-workflows/ ("Automate Workflows with Bedrock Agents"); descriptor from the /ai-ml-services/ delivery areas. Its "BRIEF" paragraph is a copy of the generative-AI page and is not used. Sitemap positions this page as "strategic positioning": positioning copy needed. ${UNVERIFIED_STATS} Proposed sub-service (Q5.2).`,
      },
      {
        slug: "computer-vision",
        name: "Computer Vision",
        descriptor: "Computer vision and intelligent monitoring solutions",
        summary: "[Placeholder] Short introduction to AdamasTech's computer vision services.",
        whatWeDo: [
          { title: "Real-time face recognition" },
          { title: "Parking spot detection" },
          { title: "PPE compliance monitoring" },
          { title: "Steel plate defect inspection" },
          { title: "Fruit recognition and calorie prediction" },
          { title: "Cinema occupancy and audience analytics" },
          { title: "Entry/exit tracking and crowd flow" },
          { title: "Traffic and vehicle monitoring" },
        ],
        status: "PUBLISHED",
        sortOrder: 2,
        needsReview: true,
        editorNote:
          'MISSING: no old page. Descriptor from the /ai-ml-services/ delivery areas; whatWeDo lists the 8 computer-vision case studies (titles shortened from the case studies). Summary copy needed. Proposed sub-service (Q5.2).',
      },
      {
        slug: "generative-ai",
        name: "Generative & Applied AI",
        descriptor: "Generative AI strategy and implementation",
        summary:
          "Establish a robust data platform to fuel generative AI initiatives. Centralize data, ensure quality and governance, and unlock deeper insights.\n\nIn generative AI, quality data is the foundation for success. We help you build a robust AWS data architecture that ensures data is clean, governed, and AI-ready for impactful insights.",
        whatWeDo: [
          { title: "Data Lake Design", body: "Expert architecture for structured and unstructured data readiness." },
          { title: "ETL & Integration", body: "Efficient pipelines using AWS Glue for automated data flow." },
          { title: "AWS Best Practices", body: "Proven solutions for data security and performance optimization." },
          { title: "AI Data Preparation", body: "Expertise in data cleaning and feature engineering for accurate AI models." },
        ],
        highlights: [
          { title: "85%", body: "85% of AI projects fail due to poor data quality." },
          { title: "80%", body: "Data scientists spend 80% of their time on data preparation." },
          { title: "97%", body: "97% of enterprises investing in AI risk poor results without robust data foundations." },
        ],
        technologies: ["AWS Glue"],
        legacyPath: "/aws-for-generative-ai/",
        status: "PUBLISHED",
        sortOrder: 3,
        needsReview: true,
        editorNote: `No page in the 301 map. Copy from the unlinked page /aws-for-generative-ai/ ("Data Foundations for Generative AI"); descriptor from the /ai-ml-services/ delivery areas. It covers data foundations only: copy on applied/generative AI use cases (e.g. the InvoiceAI and RAG chatbot case studies) needed. ${UNVERIFIED_STATS} Proposed sub-service (Q5.2).`,
      },
    ],
  },
];
