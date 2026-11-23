import "server-only";

/**
 * Content for the six Cloud sub-service pages, which share one template built to the finalised design
 * `design-ref/exports/new-design/Managed Services.svg` (1440x7252, supplied 23 November 2026).
 *
 * **Managed Services is the design's own page**, so every string in `managed-services` below is transcribed from
 * that render word for word. Its text is outlined to paths and the Figma frame for it (8476:3840) is an older
 * draft at 5997 tall, so the transcription is from the render and is listed for proofreading in
 * `docs/qa/evidence/cloud-final/SUB_SERVICES.md`.
 *
 * **The other five pages use the same structure with their own content.** Nothing is ever copied from Managed
 * Services onto another page. Each slot is filled from, in the brief's order of preference:
 *
 *   1. the page's own frame on Figma page 7586:47704 - only `migration-modernization` has one (7669:44187,
 *      "Migration"), and only the parts of it that are real copy: that frame's case-study band repeats
 *      "Data & Analytics" four times, its use-case bodies all read "Outcome-led service framing for <title> on
 *      AWS", and one paragraph is a note to the designer ("Messaging should lead with business outcomes..."),
 *      so none of those are used;
 *   2. the content structure the client shared;
 *   3. the page's existing database copy, fitted to the slots.
 *
 * A slot with no real content for that service is `null`, which the template renders as a Draft note: visible in
 * the drafts preview with a badge, hidden in the public build. `docs/qa/evidence/cloud-final/SUB_SERVICES.md`
 * has the per-page, per-section source table.
 *
 * British English throughout, per the standing rule. The design writes "optimizes", "utilization",
 * "Modernization", "Recognized", "Optimization" and - a straight typo - "Application Mordernazation".
 */

export interface SubCard {
  title: string;
  body: string | null;
}

export interface SubIconCard extends SubCard {
  image: string;
}

export interface SubServiceContent {
  /** The pillar-level route segment is always cloud-services; this is the second segment. */
  slug: string;
  hero: {
    badge: string;
    title: string;
    intro: string | null;
    competencies: readonly string[];
    ctaLabel: string;
  };
  overview: {
    eyebrow: string;
    heading: string;
    paragraphs: readonly string[];
  } | null;
  benefits: {
    heading: string;
    body: string | null;
    cards: readonly SubIconCard[];
  } | null;
  manage: {
    eyebrow: string;
    heading: string;
    hubLabel: string;
    items: readonly SubCard[];
  } | null;
  value: {
    eyebrow: string;
    heading: string;
    body: string | null;
    cards: readonly SubIconCard[];
  } | null;
  /** Related cards, as the design draws them. The template drops any card that points at the current page. */
  related: readonly { title: string; body: string; href: string; image: string }[];
  cta: { eyebrow: string; heading: string; body: string; label: string };
}

const WHY_ICONS = [
  "images/services/managed/why-1.webp",
  "images/services/managed/why-2.webp",
  "images/services/managed/why-3.webp",
  "images/services/managed/why-4.webp",
  "images/services/managed/why-5.webp",
  "images/services/managed/why-6.webp",
] as const;

const VALUE_IMAGES = [
  "images/services/managed/value-1.webp",
  "images/services/managed/value-2.webp",
  "images/services/managed/value-3.webp",
  "images/services/managed/value-4.webp",
] as const;

/**
 * The hero's competency line, the related-services row and the closing CTA are page furniture in the design: the
 * same four cards and the same CTA appear on the Managed Services and Migration frames alike, so they are shared
 * rather than repeated per page. The related row's wording is the design's; "Application Mordernazation" is the
 * design's spelling of Modernisation and is corrected here under the British-English rule (reported).
 */
const COMPETENCIES = ["AWS AI Services Competency", "AWS Education Consulting Competency"] as const;

const RELATED = [
  {
    title: "Data & Analytics",
    body: "Create data platforms that support reporting, forecasting, operational visibility, and AI-ready decision-making.",
    href: "/services/digital-transformation/data-analytics",
    image: "images/services/managed/related-1.webp",
  },
  {
    title: "Managed Cloud & Optimisation",
    body: "Improve reliability, security, performance, and cost efficiency with ongoing AWS operations and governance.",
    href: "/services/cloud-services/managed-services",
    image: "images/services/managed/related-2.webp",
  },
  {
    title: "DevOps & Automation",
    body: "Reduce release friction and operational overhead through infrastructure automation and cloud-native delivery practices.",
    href: "/services/cloud-services/devops-secops",
    image: "images/services/managed/related-3.webp",
  },
  {
    title: "Application Modernisation",
    body: "Replatform legacy applications, improve agility, and prepare business systems for scalable digital growth on AWS.",
    href: "/services/cloud-services/migration-modernization",
    image: "images/services/managed/related-4.webp",
  },
] as const;

const CTA = {
  eyebrow: "Our team",
  heading: "Ready to accelerate your AWS journey?",
  body: "Talk to the Adamas team about cloud modernisation, AI, or education transformation on AWS.",
  label: "Book an appointment with our experts now",
} as const;

/** The two published case studies, shown on every sub-service page as the design draws them. */
export const SUB_CASES = {
  eyebrow: "Case study",
  // "How we helping Business" is the design's heading, here as on the Cloud page. Built as drawn; reported.
  heading: "How we helping Business",
  items: [
    {
      label: "HealthTech",
      title: "Modernising Kubernetes Operations for a Leading HealthTech Company",
      body: "Moving from reactive firefighting to a proactive, observable EKS operating model - with clear ownership of incidents, capacity and cost.",
      tags: ["Amazon EKS", "CloudWatch", "Incident Management"],
      image: "images/case-studies/kubernetes-operations-healthtech.webp",
      href: "/case-studies/kubernetes-operations-healthtech",
    },
    {
      label: "Manufacturing / Cement",
      title: "Strengthening SAP Resilience and Disaster Recovery on AWS",
      body: "A tested, recovery-ready SAP environment on AWS - with validated failover, not just a disaster recovery plan on paper.",
      tags: ["SAP HANA", "Disaster Recovery", "24x7 Monitoring"],
      image: "images/case-studies/sap-disaster-recovery-cement.webp",
      href: "/case-studies/sap-disaster-recovery-cement",
    },
  ],
} as const;

/* ── 1. Managed Services: the design's own page, word for word ─────────── */
const managedServices: SubServiceContent = {
  slug: "managed-services",
  hero: {
    badge: "AWS Advanced Tier Partner",
    title: "Run AWS with the operational discipline your infrastructure deserves",
    intro:
      "Adamas Tech Consulting manages, monitors and optimises production AWS environments - so your engineering team spends its time on the product, not patching, paging and cost surprises.",
    competencies: COMPETENCIES,
    ctaLabel: "Talk to our Managed cloud team",
  },
  overview: {
    eyebrow: "Service overview",
    heading: "AWS Managed Services",
    paragraphs: [
      "A managed service provider (MSP) takes ongoing responsibility for running and supporting a piece of a customer's technology - monitoring it, maintaining it, and resolving problems as they come up - so the customer's own team doesn't have to carry that load.",
      "An AWS MSP does this specifically for infrastructure running on Amazon Web Services. Instead of your team owning day-to-day operations - patching, monitoring, incident response, backups, cost tracking - an AWS MSP takes that on, following AWS's own recommended operational practices, while your team stays focused on the applications and features that actually move your business forward.",
    ],
  },
  benefits: {
    heading: "Why businesses work with an AWS MSP",
    body: "Running AWS well is a full-time discipline, not a side task for an already-stretched engineering team.",
    cards: [
      { title: "More engineering time on your product", body: "Patching, on-call rotations and routine upkeep move off your team's plate.", image: WHY_ICONS[0] },
      { title: "Fewer surprises", body: "A second set of eyes catches configuration drift, security gaps and cost creep before they become incidents.", image: WHY_ICONS[1] },
      { title: "Recovery you've actually tested", body: "DR plans are exercised on a schedule, so you know your RTO and RPO before an outage forces you to find out.", image: WHY_ICONS[2] },
      { title: "Predictable cloud spend", body: "Ongoing rightsizing and utilisation reviews keep AWS costs aligned to what you actually use.", image: WHY_ICONS[3] },
      { title: "Specialist expertise, without the hiring cycle", body: "Access to AWS operational depth you'd otherwise need to build in-house.", image: WHY_ICONS[4] },
      { title: "24x7 coverage", body: "Round-the-clock monitoring and response, without building an internal on-call rotation.", image: WHY_ICONS[5] },
    ],
  },
  manage: {
    eyebrow: "What we manage",
    heading: "Six areas of AWS operations",
    hubLabel: "AWS operations control hub",
    items: [
      { title: "Cloud Migration & Workload Modernisation", body: "Database migration, serverless automation and application modernisation that move critical workloads onto AWS with minimal disruption." },
      { title: "Managed Operations & 24x7 Observability", body: "24x7 monitoring across infrastructure and Kubernetes, with proactive alerting and incident response before customers notice." },
      { title: "Disaster Recovery & Resilience", body: "DR built on tested runbooks, replication monitoring and validated recovery times - not just a plan sitting in a document." },
      { title: "Security, Backup & Compliance Management", body: "Managed backup, IAM and network configuration reviews that reduce risk without adding to your team's workload." },
      { title: "Cost Governance & Optimisation", body: "Ongoing rightsizing, utilisation reviews and trend analysis that keep AWS spend aligned to what you actually use." },
      { title: "AI & Data Infrastructure on AWS", body: "Data foundations and retrieval pipelines for generative AI, built on AWS services designed for production use." },
    ],
  },
  value: {
    eyebrow: "Why Adamas Tech",
    heading: "How this service creates value",
    body: "Anyone can call themselves an AWS MSP. What sets us apart is the AWS Advanced Tier standing behind that claim, and the kind of workloads we're trusted to run.",
    cards: [
      { title: "Recognised by AWS at the Advanced Tier", body: "A standing AWS awards to partners with a proven track record of delivering AWS solutions at scale - not a self-assigned label.", image: VALUE_IMAGES[0] },
      { title: "Experience with mission-critical workloads", body: "SAP systems, Kubernetes platforms and healthcare data - environments where downtime is not an option.", image: VALUE_IMAGES[1] },
      { title: "Structured operations, not ad hoc support", body: "Documented runbooks, escalation paths and regular operational reviews - the same discipline behind every engagement.", image: VALUE_IMAGES[2] },
      { title: "Engineers who understand the stack", body: "From EKS internals to SAP HANA replication - the people designing your operations model are the ones who run it.", image: VALUE_IMAGES[3] },
    ],
  },
  related: RELATED,
  cta: CTA,
};

/* ── 2. Migration & Modernisation ───────────────────────────────────────
   Hero and overview from the page's own Figma frame 7669:44187 ("Migration"); delivery areas from the same
   frame, which match the database's whatWeDo. The frame's four use-case cards have real titles but filler
   bodies ("Outcome-led service framing for <title> on AWS"), so the bodies are left for the client. */
const migrationModernisation: SubServiceContent = {
  slug: "migration-modernization",
  hero: {
    badge: "AWS Advanced Tier Partner",
    // The frame reads "on AWS Web Services"; AWS is Amazon Web Services, so this is the frame's own slip. Reported.
    title: "Accelerate cloud migration and modernisation on AWS Web Services",
    intro:
      "Move from legacy infrastructure to resilient, scalable AWS environments designed for performance, governance, and long-term growth.",
    competencies: COMPETENCIES,
    // The frame carries the Managed Services label on this page too. Built as drawn; reported.
    ctaLabel: "Talk to our Managed cloud team",
  },
  overview: {
    eyebrow: "Service overview",
    heading: "Cloud Migration & Modernisation",
    paragraphs: [
      "Adamas supports organisations that need to modernise legacy systems without disrupting operations. Its AWS positioning emphasises modernisation, cloud-first architecture, scalable hosting, and cost-optimised environments.",
    ],
  },
  benefits: null,
  manage: {
    eyebrow: "What we deliver",
    heading: "Delivery areas",
    hubLabel: "AWS migration control hub",
    items: [
      { title: "Migration planning and cloud readiness assessment", body: null },
      { title: "AWS landing zone and environment design", body: null },
      { title: "Application rehosting, replatforming, or modernisation", body: null },
      { title: "Performance, security, and cost optimisation", body: null },
      { title: "Post-migration operations and improvement", body: null },
    ],
  },
  value: {
    eyebrow: "Use cases",
    heading: "How this service creates value",
    body: null,
    cards: [
      { title: "Legacy infrastructure modernisation", body: null, image: VALUE_IMAGES[0] },
      { title: "Data centre exit or workload migration", body: null, image: VALUE_IMAGES[1] },
      { title: "Multi-environment AWS foundation buildout", body: null, image: VALUE_IMAGES[2] },
      { title: "Scale-up for growing digital platforms", body: null, image: VALUE_IMAGES[3] },
    ],
  },
  related: RELATED,
  cta: CTA,
};

/* ── 3. DevOps & SecOps ─────────────────────────────────────────────────
   From the existing database copy (/cloud-transformation/): the "Engagement Benefits to Customer" list fills the
   benefits cards and the "Our Engagement Model" steps fill the delivery areas. */
const devopsSecops: SubServiceContent = {
  slug: "devops-secops",
  hero: {
    badge: "AWS Advanced Tier Partner",
    title: "Cloud that scales your organisation",
    intro:
      "Adamas Tech is one of the preferred partners of AWS, enabling businesses to migrate, optimise and scale on cloud with speed and security. Whether you are a fast-scaling startup or a complex enterprise, we deliver a tailored cloud journey backed by certified AWS architects and industry expertise with proven methodologies.",
    competencies: COMPETENCIES,
    ctaLabel: "Talk to our cloud team",
  },
  overview: {
    eyebrow: "Service overview",
    heading: "DevOps & SecOps",
    paragraphs: [
      "CI/CD pipelines, infrastructure as code and shift-left security built into every release - so compliance is a by-product of shipping, not a separate project.",
    ],
  },
  benefits: {
    heading: "Engagement benefits to your team",
    body: null,
    cards: [
      { title: "Engagement models", body: "Flexible options including fixed project and retainer-based.", image: WHY_ICONS[0] },
      { title: "Co-creation", body: "Customer involved in discovery, design, testing and rollout phase.", image: WHY_ICONS[1] },
      { title: "CCoE support", body: "Enables governance models and self-sufficiency after deployment.", image: WHY_ICONS[2] },
      { title: "Certifications & SLAs", body: "Certified team, fast response time and monthly SLA reports.", image: WHY_ICONS[3] },
      { title: "Post-launch support", body: "Optimisation review, audits and access to cloud solution architects.", image: WHY_ICONS[4] },
    ],
  },
  manage: {
    eyebrow: "What we deliver",
    heading: "Our engagement model",
    hubLabel: "AWS delivery control hub",
    items: [
      { title: "Discovery", body: "Cloud readiness - application mapping - security posture check." },
      { title: "Design", body: "Architecture blueprint - TCO/risk analysis - migration wave planning." },
      { title: "Migration", body: "Pilot apps and databases migrated - DNS cutover - DR and backup enablement." },
      { title: "Modernisation", body: "DevOps automation - containerisation - data modernisation." },
      { title: "Manage", body: "24/7 NOC - SLA-driven support - billing governance - monthly performance review." },
    ],
  },
  value: null,
  related: RELATED,
  cta: CTA,
};

/* ── 4. AI/ML Ops ───────────────────────────────────────────────────────
   The page has no old site page and no frame; its database row is still placeholder text and DRAFT. Only the
   hero's title and the capability card's line from the Cloud page are real, so everything else is left for the
   client. */
const aiMlOps: SubServiceContent = {
  slug: "ai-ml-ops",
  hero: {
    badge: "AWS Advanced Tier Partner",
    title: "AI/ML Ops",
    intro:
      "Deploy, monitor and retrain models in production with proper versioning, drift detection and cost guardrails - the part most pilots never reach.",
    competencies: COMPETENCIES,
    ctaLabel: "Talk to our cloud team",
  },
  overview: null,
  benefits: null,
  manage: null,
  value: null,
  related: RELATED,
  cta: CTA,
};

/* ── 5. Cloud Automation ────────────────────────────────────────────────
   The database row for this page is the Oracle NetSuite for Construction copy from /oracle-netsuite-solutions/,
   which is a different service and is flagged in its own editorNote. It is NOT used here. The hero line is the
   one the Cloud page's capability card carries; the rest is left for the client. */
const cloudAutomation: SubServiceContent = {
  slug: "cloud-automation",
  hero: {
    badge: "AWS Advanced Tier Partner",
    title: "Cloud Automation",
    intro:
      "Infrastructure-as-code, policy-as-code and self-healing runbooks that remove the repetitive manual work quietly consuming your team's capacity.",
    competencies: COMPETENCIES,
    ctaLabel: "Talk to our cloud team",
  },
  overview: null,
  benefits: null,
  manage: null,
  value: null,
  related: RELATED,
  cta: CTA,
};

/* ── 6. Cloud Advisory & Consultation ───────────────────────────────────
   From the existing database copy (/security-governance/). */
const cloudAdvisory: SubServiceContent = {
  slug: "cloud-advisory-consultation",
  hero: {
    badge: "AWS Advanced Tier Partner",
    title: "Independent cloud advice, before you commit the budget",
    intro:
      "Independent architecture reviews, cost audits and adoption roadmaps - delivered before you commit budget, headcount or a multi-year contract.",
    competencies: COMPETENCIES,
    ctaLabel: "Talk to our cloud team",
  },
  overview: {
    eyebrow: "Service overview",
    heading: "Cloud Advisory & Consultation",
    paragraphs: [
      "Improve cloud security, access control, compliance posture, and operational governance across AWS estates.",
    ],
  },
  benefits: null,
  manage: {
    eyebrow: "What we deliver",
    heading: "Delivery areas",
    hubLabel: "AWS governance control hub",
    items: [
      { title: "AWS security baseline design", body: null },
      { title: "IAM and access governance controls", body: null },
      { title: "Cloud monitoring and policy enforcement", body: null },
      { title: "Compliance-oriented architecture support", body: null },
      { title: "Operational governance across AWS environments", body: null },
    ],
  },
  value: null,
  related: RELATED,
  cta: CTA,
};

export const subServices: Record<string, SubServiceContent> = {
  "managed-services": managedServices,
  "migration-modernization": migrationModernisation,
  "devops-secops": devopsSecops,
  "ai-ml-ops": aiMlOps,
  "cloud-automation": cloudAutomation,
  "cloud-advisory-consultation": cloudAdvisory,
};

/** The sub-services that render the design built to `Managed Services.svg`. */
export const SUB_SERVICE_SLUGS = Object.keys(subServices);
