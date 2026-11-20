import "server-only";

/**
 * Content for the rebuilt /services/cloud-services (Figma "ATC Website Revamp" IldSD5373EYodtZ2XH17uk,
 * frame 8705:3814 "Cloud ", 1440x6695, fetched 20 November 2026).
 *
 * This is the client's own copy, so it is PUBLISHED: it renders in the public build as well as the drafts preview,
 * and carries no Draft markers. Everything that looked unverified or unfinished in the frame was left out of this
 * module and written up for the client instead (docs/qa/evidence/inner-pages/CLOUD_SERVICES_V2.md); the notes
 * below say which fields that affected.
 *
 * It lives here rather than in ContentBlock rows so that this deploy needs no schema change and no new seed data
 * for the page - the only seed change this round is the withdrawn Top Stories row. When the Phase 2 CMS takes over
 * these fields move into `content/blocks.ts` under `services.cloud-services.*` keys.
 *
 * British English throughout, per the standing rule: the frame writes "Modernizing", "Optimize", "Optimizes" and
 * "modernize".
 */

export interface CloudCard {
  title: string;
  body: string;
  href: string;
  icon: "migration" | "devops" | "managed" | "aiml" | "automation" | "advisory";
}

export interface CloudPhase {
  number: string;
  name: string;
  summary: string;
  /** The services that deliver the phase. Only phase 01 carries one in the frame. */
  service?: { title: string; body: string };
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

export const cloudServices = {
  hero: {
    eyebrow: "Multi-cloud engineering partner",
    title: "Cloud Services",
    intro:
      "From first migration to day-2000 operations, Adamas builds and runs cloud environments that stay secure, predictable and affordable - across AWS, Azure and Google Cloud.",
    ctaLabel: "Talk to our cloud team",
    ctaHref: "/contact",
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
   * The frame repeats the eyebrow "Our tech stack" here, which is a copy-and-paste from the band above (reported
   * to the client). "What we do" is used until they confirm the wording.
   */
  capabilities: {
    eyebrow: "What we do",
    heading: "Six ways we take cloud work off your plate",
    cards: [
      {
        title: "Migration & Modernisation",
        body: "Move workloads off ageing infrastructure and re-platform applications for cloud-native scale, with rehearsed cutovers and a rollback path at every step.",
        href: "/services/cloud-services/migration-modernization",
        icon: "migration",
      },
      {
        title: "DevOps & SecOps",
        body: "CI/CD pipelines, infrastructure as code and shift-left security built into every release - so compliance is a by-product of shipping, not a separate project.",
        href: "/services/cloud-services/devops-secops",
        icon: "devops",
      },
      {
        title: "Managed Services",
        body: "24x7 monitoring, patching and incident response against agreed SLAs, so your engineers spend their week on product rather than pager duty.",
        href: "/services/cloud-services/managed-services",
        icon: "managed",
      },
      {
        title: "AI/ML Ops",
        body: "Deploy, monitor and retrain models in production with proper versioning, drift detection and cost guardrails - the part most pilots never reach.",
        href: "/services/cloud-services/ai-ml-ops",
        icon: "aiml",
      },
      {
        title: "Cloud Automation",
        body: "Infrastructure-as-code, policy-as-code and self-healing runbooks that remove the repetitive manual work quietly consuming your team's capacity.",
        href: "/services/cloud-services/cloud-automation",
        icon: "automation",
      },
      {
        title: "Cloud Advisory & Consultation",
        body: "Independent architecture reviews, cost audits and adoption roadmaps - delivered before you commit budget, headcount or a multi-year contract.",
        href: "/services/cloud-services/cloud-advisory-consultation",
        icon: "advisory",
      },
    ] satisfies CloudCard[],
  },

  /** The frame's heading reads "How we helping Business"; corrected and reported to the client. */
  cases: {
    eyebrow: "Case study",
    heading: "How we help businesses",
    items: [
      {
        label: "HealthTech",
        title: "Modernising Kubernetes operations for a leading HealthTech company",
        body: "Moving from reactive firefighting to a proactive, observable EKS operating model - with clear ownership of incidents, capacity and cost.",
        tags: ["Amazon EKS", "CloudWatch", "Incident management", "Cost visibility"],
        image: "images/services/cloud/case-healthtech.webp",
        href: "/case-studies",
      },
      {
        label: "Manufacturing / Cement",
        title: "Strengthening SAP resilience and disaster recovery on cloud",
        body: "A tested, recovery-ready SAP environment - with validated failover, not just a disaster recovery plan sitting in a document.",
        tags: ["SAP HANA", "Disaster recovery", "24x7 monitoring", "Failover testing"],
        image: "images/services/cloud/case-cement.webp",
        href: "/case-studies",
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
        // The frame's body for this badge is about government digital sovereignty, which does not describe the
        // tier. Reported to the client; the tier's own description is used until they supply one.
        body: "AWS's Advanced Tier, awarded on delivered customer work, trained and certified staff and validated technical capability.",
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
        body: "Design, migrate and run AWS storage estates - capacity, tiering and lifecycle policies sized to what the workload actually needs.",
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
      // The frame repeats the section body here verbatim; reported. This line describes the delivery programme.
      body: "Service Delivery designations are granted after AWS reviews live customer deployments of a specific service.",
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
     * The frame draws seven tabs but only fills in Education; the other six have no copy, no photograph and no
     * fact chips. They are listed so the tab row matches the design, and each says so until the client sends the
     * copy (reported).
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
     * The frame says "Get up to $5,000* in credits ...". The amount is set by the cloud provider, not by us, so
     * the figure is held back until the client confirms it is current and which programme it belongs to
     * (reported). The offer and its footnote are the frame's.
     */
    body: "Get cloud provider credits to test a migration, prove out a workload or pilot an AI use case before you commit budget.",
    footnote: "Eligibility and award amount are determined by the cloud provider and assessed case by case.",
    ctaLabel: "Book an appointment with our experts now",
    ctaHref: "/contact",
  },
} as const;
