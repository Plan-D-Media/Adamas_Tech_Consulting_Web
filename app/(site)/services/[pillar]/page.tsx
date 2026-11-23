import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPillar, getPillars } from "@/lib/data/services";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { defaultRegion } from "@/lib/region";
import { NO_CONTENT_SLUG, atLeastOne } from "@/lib/static-params";
import { redirectIfUnpublished } from "@/lib/data/unpublished";
import { PillarPage } from "@/components/services/PillarPage";
import { CloudServicesPage } from "@/components/services/cloud/CloudServicesPage";

/**
 * Cloud Services is built to the finalised design `design-ref/exports/new-design/Cloud.svg` (23 Nov 2026) and has
 * its own layout. Every other pillar - Digital Transformation, Data & AI - still renders the shared `PillarPage`
 * template, which this round did not touch. The six Cloud sub-services have their own template, built to
 * `Managed Services.svg`; see `app/(site)/services/[pillar]/[service]/page.tsx`.
 */
const REBUILT = new Set(["cloud-services"]);

/** With no visible pillar the placeholder param keeps the build alive; it renders the 404 page (BUG-001). */
export async function generateStaticParams() {
  const pillars = await getPillars();
  return atLeastOne(
    pillars.map((p) => ({ pillar: p.slug })),
    { pillar: NO_CONTENT_SLUG },
  );
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
  if (!p) {
    await redirectIfUnpublished("services", pillar);
    notFound();
  }
  if (REBUILT.has(pillar)) return <CloudServicesPage contactBlock={blocks["home.contact"] ?? null} fallbackRegion={defaultRegion()} />;
  return <PillarPage pillar={p} blocks={blocks} />;
}
