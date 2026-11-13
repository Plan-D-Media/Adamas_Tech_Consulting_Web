import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudy, getCaseStudyParams } from "@/lib/data/caseStudies";
import { optionalCopy, plain } from "@/lib/placeholder";
import { Placeholder } from "@/components/Placeholder";

export async function generateStaticParams() {
  return getCaseStudyParams();
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) return {};
  const summary = optionalCopy(c.summary);
  return {
    title: c.seoTitle ?? plain(c.title),
    description: c.seoDescription ?? (summary && !summary.pending ? summary.text : undefined),
    alternates: { canonical: `/case-studies/${slug}` },
    robots: c.noindex ? { index: false } : undefined,
    openGraph: c.image ? { images: [{ url: c.image.url }] } : undefined,
  };
}

/** Navigations may block (instant = false): params are read outside <Suspense>, so the page is complete without JavaScript. */
export const instant = false;

export default function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  return <CaseStudy params={params} />;
}

async function CaseStudy({ params }: { params: PageProps<"/case-studies/[slug]">["params"] }) {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) notFound();
  return <Placeholder eyebrow={plain(c.label)} title={plain(c.title)} intro={optionalCopy(c.summary)?.text ?? null} links={[{ label: "All case studies", href: "/case-studies" }]} />;
}
