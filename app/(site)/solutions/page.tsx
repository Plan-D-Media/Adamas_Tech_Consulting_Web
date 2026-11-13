import type { Metadata } from "next";
import { getSolutions } from "@/lib/data/solutions";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Products and AI solutions from AdamasTech Consulting.",
  alternates: { canonical: "/solutions" },
};

export default async function SolutionsPage() {
  const [solutions, blocks] = await Promise.all([getSolutions(), getBlocks(null)]);
  const header = blocks["solutions.overview"];
  return (
    <Placeholder
      eyebrow={header?.eyebrow}
      title={plain(header?.heading) || "Solutions"}
      intro={plain(header?.body) || null}
      links={solutions.map((s) => ({ label: plain(s.name) || "Solution", href: s.href, external: s.external }))}
      linksLabel="Solutions"
    />
  );
}
