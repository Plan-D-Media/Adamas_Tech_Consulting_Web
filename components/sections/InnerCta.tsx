import { emptyBlock, getBlocks } from "@/lib/data/site";
import { CtaBand } from "./CtaBand";

/**
 * Closing "Talk to an expert" band for inner pages. Inner pages are global (no region), so the band uses the
 * global copy and no regional phone; `heading` lets a page tailor the line (e.g. "Talk to our SAP team").
 */
export async function InnerCta({ heading }: { heading?: string }) {
  const blocks = await getBlocks(null);
  const block = blocks["home.cta"] ?? emptyBlock;
  return <CtaBand block={heading ? { ...block, heading } : block} region={null} />;
}
