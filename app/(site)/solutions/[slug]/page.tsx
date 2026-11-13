import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSolution, getSolutionParams } from "@/lib/data/solutions";
import { isPlaceholder, optionalCopy, plain } from "@/lib/placeholder";
import { Placeholder } from "@/components/Placeholder";

export async function generateStaticParams() {
  return getSolutionParams();
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSolution(slug);
  if (!s) return {};
  const summary = optionalCopy(s.summary);
  return {
    title: s.seoTitle ?? (plain(s.name) || "Solution"),
    description: s.seoDescription ?? (summary && !summary.pending ? summary.text : undefined),
    alternates: { canonical: `/solutions/${slug}` },
    // Placeholder solutions (name still to come) stay out of search until they are written.
    robots: s.noindex || isPlaceholder(s.name) ? { index: false } : undefined,
  };
}

/** Navigations may block (instant = false): params are read outside <Suspense>, so the page is complete without JavaScript. */
export const instant = false;

export default function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  return <Solution params={params} />;
}

async function Solution({ params }: { params: PageProps<"/solutions/[slug]">["params"] }) {
  const { slug } = await params;
  const s = await getSolution(slug);
  if (!s) notFound();
  return <Placeholder eyebrow="Solutions" title={plain(s.name) || "Solution"} intro={plain(s.tagline) || null} links={[{ label: "All solutions", href: "/solutions" }]} />;
}
