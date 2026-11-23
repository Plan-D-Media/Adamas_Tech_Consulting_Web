import "server-only";

/**
 * Content for /services/cloud-services, built to the FINALISED design:
 * `design-ref/exports/new-design/Cloud.svg` (1440x8480, supplied 23 November 2026).
 *
 * `Cloud.svg` supersedes every earlier Cloud reference - Figma frames 292:24608 and 8705:3814, `Cloud_Services.svg`,
 * `Cloud (1).svg` and `Frame 1000005184.svg`. Where they differ, this file follows `Cloud.svg`. Its text is
 * outlined to paths and the Figma frame on page 7586:47704 is an older draft (6695 tall against 8480), so every
 * string below was transcribed from the render and is listed for proofreading in
 * `docs/qa/evidence/cloud-final/CLOUD.md`.
 *
 * This is the client's own copy, so it is PUBLISHED: it renders in the public build as well as the drafts preview
 * and carries no Draft markers. Three things the design shows are repeated or ungrammatical; they are built as
 * drawn, per "don't improve anything", and each is flagged in the report rather than silently corrected.
 *
 * It lives here rather than in ContentBlock rows so that this deploy needs no schema change and no new seed data
 * for the page. When the Phase 2 CMS takes over these fields move into `content/blocks.ts` under
 * `services.cloud-services.*` keys.
 *
 * British English throughout, per the standing rule: the design writes "Modernizing", "Optimize", "Optimizes",
 * "modernize", "centralized" and "standardized".
 */

export interface CloudCard {
  title: string;
  body: string;
  href: string;
  /** The finalised design puts a photograph at the top of each card, where the earlier draft had an icon tile. */
  image: string;
}

export interface CloudPhase {
  number: string;
  name: string;
  summary: string;
  /** The services that deliver the phase. Only phase 01 carries one in the design. */
  service?: { title: string; body: string; image?: string };
}

export interface CloudCase {
  label: string;
  title: string;
  body: string;
  tags: string[];
  image: string;
  href: string;
}

export interface CloudBadge {
  title: string;
  body: string;
  badge: string;
  href: string;
  wide?: boolean;
}

export interface CloudTestimonial {
  quote: string;
  body: string;
  name: string;
  role: string;
  avatar: string;
}

export interface CloudClientLogo {
  name: string;
  image: string;
  /** Intrinsic width at the 32px row height the supplied files allow. */
  width: number;
}

export const cloudServices = {
  hero: {
    eyebrow: "Multi-cloud engineering partner",
    title: "Cloud Services",
    intro:
      "From first migration to day-2000 operations, Adamas builds and runs cloud environments that stay secure, predictable and affordable - across AWS, Azure and Google Cloud.",
    ctaLabel: "Talk to our cloud team",
    ctaHref: "/contact",
  },

  /**
   * The clientele strip. The logos are the fourteen files the client supplied in `client-logos/` (23 Nov 2026),
   * NOT the seven in the design, which are the older set already in the Logo table (United Foods, GRSE,
   * WorkIndia, Aldar, Webel, IISc, Gulf Processing). The brief says to use only the supplied files, so the
   * design's order cannot be followed; they run in the order the folder lists them. Reported.
   *
   * Every supplied file is 60px tall and already desaturated, which caps the row at 32px for a true 2x and means
   * the design's "greyscale to full colour" hover has nothing to reveal. Also reported.
   */
  clients: {
    label: "Our clients",
    items: [
      { name: "AAF International", image: "images/clients/aaf-international.webp", width: 65 },
      { name: "AmritHub", image: "images/clients/amrithub.webp", width: 44 },
      { name: "DavaIndia Generic Pharmacy", image: "images/clients/davaindia.webp", width: 162 },
      { name: "Eloquent Solutions", image: "images/clients/eloquent-solutions.webp", width: 32 },
      { name: "GTPL", image: "images/clients/gtpl.webp", width: 87 },
      { name: "Healync", image: "images/clients/healync.webp", width: 202 },
      { name: "Humanize", image: "images/clients/humanize.webp", width: 210 },
      { name: "JMR Infotech", image: "images/clients/jmr-infotech.webp", width: 96 },
      { name: "Kofuku Technologies", image: "images/clients/kofuku-technologies.webp", width: 117 },
      { name: "Saatvik Green Energy", image: "images/clients/saatvik-green-energy.webp", width: 138 },
      { name: "Senco Gold & Diamonds", image: "images/clients/senco-gold-diamonds.webp", width: 95 },
      { name: "Star Cement", image: "images/clients/star-cement.webp", width: 32 },
      { name: "SteelMint", image: "images/clients/steelmint.webp", width: 144 },
      { name: "University of Kalyani", image: "images/clients/university-of-kalyani.webp", width: 32 },
    ] satisfies CloudClientLogo[],
  },

  techStack: {
    eyebrow: "Our tech stack",
    heading: "The platforms and tools we run in production",
    body:
      "We work natively across all three hyperscalers and the open-source tooling your engineers already know. No proprietary lock-in, no unfamiliar layer between your team and the infrastructure.",
    tiles: [
      { name: "Amazon Web Services", image: "images/services/cloud/stack-aws.webp" },
      { name: "Microsoft Azure", image: "images/services/cloud/stack-azure.webp" },
      { name: "Google Cloud Platform", image: "images/services/cloud/stack-gcp.webp" },
      { name: "Cloudflare", image: "images/services/cloud/stack-cloudflare.webp" },
      { name: "HashiCorp Terraform", image: "images/services/cloud/stack-terraform.webp" },
      { name: "Grafana", image: "images/services/cloud/stack-grafana.webp" },
      { name: "Prometheus", image: "images/services/cloud/stack-prometheus.webp" },
    ],
  },

  /**
   * The design repeats the eyebrow "Our tech stack" from the band above. It was corrected to "What we do" in the
   * previous round; the finalised design still reads "Our tech stack", so it is built as drawn and flagged again.
   */
  capabilities: {
    eyebrow: "Our tech stack",
    heading: "Six ways we take cloud work off your plate",
    cards: [
      {
        title: "Migration & Modernisation",
        body: "Move workloads off ageing infrastructure and re-platform applications for cloud-native scale, with rehearsed cutovers and a rollback path at every step.",
        href: "/services/cloud-services/migration-modernization",
        image: "images/services/cloud/card-migration.webp",
      },
      {
        title: "DevOps & SecOps",
        body: "CI/CD pipelines, infrastructure as code and shift-left security built into every release - so compliance is a by-product of shipping, not a separate project.",
        href: "/services/cloud-services/devops-secops",
        image: "images/services/cloud/card-devops.webp",
      },
      {
        title: "Managed Services",
        body: "24x7 monitoring, patching and incident response against agreed SLAs, so your engineers spend their week on product rather than pager duty.",
        href: "/services/cloud-services/managed-services",
        image: "images/services/cloud/card-managed.webp",
      },
      {
        title: "AI/ML Ops",
        body: "Deploy, monitor and retrain models in production with proper versioning, drift detection and cost guardrails - the part most pilots never reach.",
        href: "/services/cloud-services/ai-ml-ops",
        image: "images/services/cloud/card-aiml.webp",
      },
      {
        title: "Cloud Automation",
        body: "Infrastructure-as-code, policy-as-code and self-healing runbooks that remove the repetitive manual work quietly consuming your team's capacity.",
        href: "/services/cloud-services/cloud-automation",
        image: "images/services/cloud/card-automation.webp",
      },
      {
        title: "Cloud Advisory & Consultation",
        body: "Independent architecture reviews, cost audits and adoption roadmaps - delivered before you commit budget, headcount or a multi-year contract.",
        href: "/services/cloud-services/cloud-advisory-consultation",
        image: "images/services/cloud/card-advisory.webp",
      },
    ] satisfies CloudCard[],
  },

  /**
   * The heading reads "How we helping Business" in the finalised design, as it did in the earlier draft. It was
   * corrected to "How we help businesses" last round; the client has signed this design off, so it is built as
   * drawn and flagged at the top of the report. One word fixes it.
   *
   * The two real case studies link to their own pages. The design's card titles are transcribed as drawn, which
   * means card 2 reads "... on cloud" here and "... on AWS" on the Managed Services page and on the case study
   * itself. Flagged.
   */
  cases: {
    eyebrow: "Case study",
    heading: "How we helping Business",
    items: [
      {
        label: "HealthTech",
        title: "Modernising Kubernetes Operations for a Leading HealthTech Company",
        body: "Moving from reactive firefighting to a proactive, observable EKS operating model - with clear ownership of incidents, capacity and cost.",
        tags: ["Amazon EKS", "CloudWatch", "Incident management", "Cost visibility"],
        image: "images/services/cloud/case-healthtech.webp",
        href: "/case-studies/kubernetes-operations-healthtech",
      },
      {
        label: "Manufacturing / Cement",
        title: "Strengthening SAP resilience and disaster recovery on cloud",  // "on AWS" elsewhere; see the docblock
        body: "A tested, recovery-ready SAP environment - with validated failover, not just a disaster recovery plan sitting in a document.",
        tags: ["SAP HANA", "Disaster recovery", "24x7 monitoring", "Failover testing"],
        image: "images/services/cloud/case-cement.webp",
        href: "/case-studies/sap-disaster-recovery-cement",
      },
      {
        label: "Retail",
        title: "Cutting peak-season cloud spend without losing uptime",
        body: "Right-sizing autoscaling policies and storage tiers ahead of a festive sales spike, so spend tracked real demand instead of worst-case guesswork.",
        tags: ["FinOps", "Auto scaling", "Storage tiering", "Budget alerts"],
        image: "images/services/cloud/case-cement.webp",
        href: "/case-studies",
      },
    ] satisfies CloudCase[],
  },

  framework: {
    eyebrow: "Our framework",
    heading: "One framework, from first assessment to day-two operations.",
    body: "Pick a phase to see the services that deliver it.",
    phases: [
      {
        number: "01",
        name: "Plan",
        summary: "Decide what moves, and how",
        service: {
          title: "Cloud Advisory",
          body: "Guiding businesses through adoption strategy, architecture review and platform selection - before a single workload moves.",
          image: "images/services/cloud/framework-advisory.webp",
        },
      },
      { number: "02", name: "Migrate", summary: "Move it without disruption" },
      { number: "03", name: "Run", summary: "Build, release and operate" },
      { number: "04", name: "Optimise", summary: "Get more from what you run" },
      { number: "05", name: "Protect", summary: "Always on, across every phase" },
    ] satisfies CloudPhase[],
  },

  credentials: {
    eyebrow: "Our expertise",
    heading: "Credentials that back up what we tell you",
    body: "Every badge below is independently validated by AWS against delivered customer work - not self-declared.",
    badges: [
      {
        title: "Advanced Tier Service Partner",
        // The design's body for this badge describes a government offering rather than the partner tier the badge
        // is for. It was replaced last round; the finalised design keeps it, so it is built as drawn and flagged.
        body: "We empower governments to achieve true digital sovereignty on AWS through secure, compliant and scalable solutions.",
        badge: "images/services/cloud/badge-advanced-tier.webp",
        href: "/credentials",
        wide: true,
      },
      {
        title: "AI / ML Services",
        body: "Design and deploy AI, generative AI and agentic AI solutions that move beyond experimentation into production.",
        badge: "images/services/cloud/badge-ai-ml.webp",
        href: "/credentials",
      },
      {
        title: "Education Consulting",
        body: "Help institutions modernise learning, administration and digital platforms with AWS-aligned transformation services.",
        badge: "images/services/cloud/badge-education.webp",
        href: "/credentials",
      },
      {
        title: "Storage Consulting",
        // Identical to Managed Services Provider below, in the design. Built as drawn; flagged.
        body: "Optimises AWS production, allowing your engineering team to focus on the product instead of patching and surprise costs.",
        badge: "images/services/cloud/badge-storage.webp",
        href: "/credentials",
      },
      {
        title: "Managed Services Provider",
        body: "Optimises AWS production, allowing your engineering team to focus on the product instead of patching and surprise costs.",
        badge: "images/services/cloud/badge-managed-services.webp",
        href: "/credentials",
      },
    ] satisfies CloudBadge[],
    validations: {
      heading: "Our Delivery Validations",
      // The design repeats the section body here verbatim. Built as drawn; flagged.
      body: "Every badge below is independently validated by AWS against delivered customer work - not self-declared.",
      items: [
        { name: "Amazon DynamoDB", badge: "images/services/cloud/badge-delivery.webp" },
        { name: "Amazon API Gateway", badge: "images/services/cloud/badge-delivery.webp" },
        { name: "AWS Lambda", badge: "images/services/cloud/badge-delivery.webp" },
        { name: "AWS Database Migration", badge: "images/services/cloud/badge-delivery.webp" },
        { name: "Amazon RDS", badge: "images/services/cloud/badge-delivery.webp" },
      ],
    },
  },

  industries: {
    eyebrow: "Industries",
    heading: "Empowering growth in diverse industries",
    /**
     * The design draws seven tabs but only fills in Education; the other six have no copy, no photograph and no
     * fact chips, in the finalised design as in the draft. They are listed so the tab row matches, and each says
     * so until the client sends the copy (reported).
     */
    tabs: [
      {
        key: "education",
        label: "Education",
        title: "Education Technology Solutions",
        body:
          "We help educational institutions run learning management, student records and campus systems on cloud infrastructure that holds up during admissions peaks and exam season - backed by our AWS Education Consulting Competency.",
        image: "images/services/cloud/industry-education.webp",
        facts: [
          { title: "Peak-ready", body: "Admission surges" },
          { title: "FERPA-aware", body: "Data handling" },
        ],
      },
      { key: "retail", label: "Retail" },
      { key: "healthcare", label: "Healthcare" },
      { key: "finance", label: "Finance" },
      { key: "hospitality", label: "Hospitality" },
      { key: "supply-chain", label: "Supply chain" },
      { key: "public-sector", label: "Public sector" },
    ],
  },

  testimonials: {
    eyebrow: "Testimonial approach",
    heading: "What it's like to work with Adamas",
    items: [
      {
        quote: "Clean transition from legacy stacks",
        body: "Migrating fifty legacy enterprise applications out of local data centres seemed impossible. Adamas delivered the roadmap, executed the migration, and now runs the entire day-2 stack with flawless metrics.",
        name: "Sunita Kulkarni",
        role: "Director, IT",
        avatar: "images/services/cloud/avatar-3.webp",
      },
      {
        quote: "No-crew high-capacity engineering",
        body: "Adamas completely rewrote our cloud pipeline. We went from manual, stressful deploys twice a week to zero-touch continuous releases backed by rock-solid Kubernetes topology. They are true partners.",
        name: "Anjali Trivedi",
        role: "Engineering Lead",
        avatar: "images/services/cloud/avatar-2.webp",
      },
      {
        quote: "Predictable, transparent cloud spends",
        body: "Adamas helped us modernise our AWS environment with a structured, low-risk approach and stronger operational visibility.",
        name: "Aditya Sharma",
        role: "Head of IT Infrastructure",
        avatar: "images/services/cloud/avatar-1.webp",
      },
      {
        quote: "Real disaster recovery testing",
        body: "We spent years declaring we had DR ready, but never actually completed a full-scale failover test. Adamas engineered a simulated regional black-out and brought our stateful systems back in 8 minutes flat.",
        name: "Raghavendra M.S.",
        role: "VP Technology",
        avatar: "images/services/cloud/avatar-4.webp",
      },
    ] satisfies CloudTestimonial[],
  },

  credits: {
    eyebrow: "Our team",
    heading: "Interested in free cloud credits?",
    /**
     * "$5,000*" is the design's figure. It was held back last round as a provider-set amount; the client has
     * signed this design off, so it is published as drawn and listed as a figure to confirm.
     */
    body: "Get up to $5,000* in credits to test a migration, prove out a workload or pilot an AI use case before you commit budget.",
    footnote: "Eligibility and award amount are determined by the cloud provider and assessed case by case.",
    ctaLabel: "Book an appointment with our experts now",
    ctaHref: "/contact",
  },
} as const;
