import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPillar, getPillars } from "@/lib/data/services";
import { plain } from "@/lib/placeholder";
import { Placeholder } from "@/components/Placeholder";

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
  };
}

/** Navigations may block (instant = false): params are read outside <Suspense>, so the page is complete without JavaScript. */
export const instant = false;

export default function PillarPage({ params }: PageProps<"/services/[pillar]">) {
  return <Pillar params={params} />;
}

async function Pillar({ params }: { params: PageProps<"/services/[pillar]">["params"] }) {
  const { pillar } = await params;
  const p = await getPillar(pillar);
  if (!p) notFound();
  return (
    <Placeholder
      eyebrow="Services"
      title={plain(p.name)}
      intro={plain(p.tagline) || plain(p.summary) || null}
      links={[...p.services.map((s) => ({ label: plain(s.name), href: s.href })), { label: "All services", href: "/services" }]}
      linksLabel="Sub-services"
    />
  );
}
