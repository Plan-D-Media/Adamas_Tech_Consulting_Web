import type { IconName } from "@/components/ui/Icon";

/** One outline glyph per subject, used for card icons and branded artwork where there is no photography. */
const bySlug: Record<string, IconName> = {
  "cloud-services": "cloud",
  "digital-transformation": "layers",
  "ai-services": "spark",
  "cloud-migration": "cloud",
  "cloud-transformation": "layers",
  "managed-cloud": "cpu",
  "sap-on-cloud": "cloud",
  "oracle-netsuite": "chart",
  "cloud-security-finops": "shield",
  sap: "layers",
  "application-development": "cpu",
  "data-analytics": "chart",
  "master-data-governance": "doc",
  "edtech-openedx": "cap",
  "e-invoicing-uae": "doc",
  "ai-ml": "cpu",
  "agentic-ai": "spark",
  "computer-vision": "scan",
  "generative-ai": "spark",
};

export function glyphFor(slug: string, fallback: IconName = "layers"): IconName {
  return bySlug[slug] ?? fallback;
}
