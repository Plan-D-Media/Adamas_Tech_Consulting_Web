import "server-only";

/**
 * The parts of the two AWS case-study designs that the `CaseStudy` table has no column for.
 *
 * Designs: `design-ref/exports/new-design/Case Study_SAP_Cement industry.svg` (1440x4262) and
 * `Case Study_Kubernetes.svg` (1440x4867), supplied 23 November 2026.
 *
 * Everything the table already holds is read from it, unchanged - the title, the challenge, the solution
 * paragraph and its ticked list, the pull quote (`overview`) and the technology chips all match the designs word
 * for word, because both rows were transcribed from the same live pages in an earlier round. What is here is
 * only what the schema has no field for: the read time, the three hero meta cards, the Business Outcomes list,
 * and the closing CTA. Keeping them in code rather than adding columns means **this deploy needs no migration**.
 *
 * The Business Outcomes were previously recorded in each row's `editorNote` because they are qualitative and the
 * old template had nowhere to show them; the new design has a band for them, so they become real content here.
 * The Kubernetes design lists six, where the note recorded five - "Earlier detection of infrastructure and
 * application issues" is new in the design.
 *
 * British English, per the standing rule: the designs write "centralized", "standardized" and "optimization".
 */

export interface AwsCaseStudy {
  readTime: string;
  /** The three cards under the hero title. */
  meta: { label: string; value: string }[];
  outcomes: string[];
  stackIntro: string;
  cta: { eyebrow: string; heading: string; body: string; label: string };
}

const CTA_LABEL = "Book an appointment with our experts now";
const STACK_INTRO = "The AWS services and supporting technologies behind this engagement.";

export const awsCaseStudies: Record<string, AwsCaseStudy> = {
  "sap-disaster-recovery-cement": {
    readTime: "4 min",
    meta: [
      { label: "Industry", value: "Leading Manufacturing / Cement Company" },
      { label: "Engagement", value: "AWS Managed Services" },
      { label: "Key technologies", value: "SAP HANA Replication, CloudWatch, AWS Backup" },
    ],
    outcomes: [
      "Stronger business continuity and disaster recovery readiness",
      "Structured SAP HANA replication and recovery management",
      "24x7 monitoring across AWS and SAP environments",
      "Proactive alerting and standardised incident response",
      "Improved infrastructure and cloud governance",
      "Reduced operational overhead for the customer's IT and SAP teams",
    ],
    stackIntro: STACK_INTRO,
    cta: {
      eyebrow: "Our team",
      heading: "Running SAP on AWS?",
      body: "Let's talk about what a tested, recovery-ready SAP environment could look like for you.",
      label: CTA_LABEL,
    },
  },

  "kubernetes-operations-healthtech": {
    readTime: "5 min",
    meta: [
      { label: "Industry", value: "HealthTech" },
      { label: "Engagement", value: "AWS Managed Services" },
      { label: "Key technologies", value: "Amazon EKS, CloudWatch, Grafana" },
    ],
    outcomes: [
      "Clear, centralised visibility across Kubernetes workloads and infrastructure health",
      "Earlier detection of infrastructure and application issues",
      "Standardised EKS operations and lifecycle management",
      "Structured incident response with clear escalation paths",
      "Continuous AWS cost governance and optimisation",
      "Reduced day-to-day operational burden on the customer's engineering team",
    ],
    stackIntro: STACK_INTRO,
    cta: {
      eyebrow: "Our team",
      heading: "Running something similar on Kubernetes?",
      body: "Let's talk about what proactive EKS operations could look like for your environment.",
      label: CTA_LABEL,
    },
  },
};

/** The banner each design puts under the hero, at the design's 1200x230. */
export const awsCaseBanner: Record<string, string> = {
  "sap-disaster-recovery-cement": "images/case-studies/sap-disaster-recovery-cement-banner.webp",
  "kubernetes-operations-healthtech": "images/case-studies/kubernetes-operations-healthtech-banner.webp",
};

/** The in-page rail, in the designs' order. */
export const AWS_CASE_SECTIONS = [
  { id: "challenge", label: "Business Challenge" },
  { id: "solution", label: "Adamas Solution" },
  { id: "outcomes", label: "Business Outcomes" },
  { id: "stack", label: "Technology Stack" },
] as const;
