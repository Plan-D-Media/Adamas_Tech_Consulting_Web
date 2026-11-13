import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPillar, getPillars } from "@/lib/data/services";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { PillarPage } from "@/components/services/PillarPage";

export async function generateStaticParams() {
  const pillars = await getPillars();
  return pillars.map((p) => ({ pillar: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[pillar]">): Promise<Metadata> {
  const { pillar } = await params;
  const p = await getPillar(pillar);
  if (!p) return {};
  return {
    title: p.seoTitle ?? p.name,
    description: p.seoDescription ?? (plain(p.summary) || undefined),
    alternates: { canonical: p.href },
    robots: p.noindex ? { index: false } : undefined,
    openGraph: p.image ? { images: [{ url: p.image.url }] } : undefined,
  };
}

/** Navigations may block (instant = false): params are read outside <Suspense>, so the page is complete without JavaScript. */
export const instant = false;

export default function PillarRoute({ params }: PageProps<"/services/[pillar]">) {
  return <Pillar params={params} />;
}

async function Pillar({ params }: { params: PageProps<"/services/[pillar]">["params"] }) {
  const { pillar } = await params;
  const [p, blocks] = await Promise.all([getPillar(pillar), getBlocks(null)]);
  if (!p) notFound();
  return <PillarPage pillar={p} blocks={blocks} />;
}
