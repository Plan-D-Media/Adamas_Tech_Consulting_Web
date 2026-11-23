import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getServiceParams } from "@/lib/data/services";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { NO_CONTENT_SLUG, atLeastOne } from "@/lib/static-params";
import { redirectIfUnpublished } from "@/lib/data/unpublished";
import { defaultRegion } from "@/lib/region";
import { subServices } from "@/lib/sub-service-content";
import { ServicePage } from "@/components/services/ServicePage";
import { SubServicePage } from "@/components/services/sub/SubServicePage";

/**
 * The six Cloud sub-services share a template built to the finalised design
 * `design-ref/exports/new-design/Managed Services.svg` (23 Nov 2026). Every other sub-service - the Digital
 * Transformation and Data & AI children - still renders the shared `ServicePage`, which this round did not touch.
 */

/** With no visible service the placeholder param keeps the build alive; it renders the 404 page (BUG-001). */
export async function generateStaticParams() {
  return atLeastOne(await getServiceParams(), { pillar: NO_CONTENT_SLUG, service: NO_CONTENT_SLUG });
}

export async function generateMetadata({ params }: PageProps<"/services/[pillar]/[service]">): Promise<Metadata> {
  const { pillar, service } = await params;
  const s = await getService(pillar, service);
  if (!s) return {};
  return {
    title: s.seoTitle ?? plain(s.name),
    description: s.seoDescription ?? (plain(s.descriptor) || undefined),
    alternates: { canonical: `/services/${pillar}/${service}` },
    robots: s.noindex ? { index: false } : undefined,
    openGraph: s.image ? { images: [{ url: s.image.url }] } : undefined,
  };
}

/** Navigations may block (instant = false): params are read outside <Suspense>, so the page is complete without JavaScript. */
export const instant = false;

export default function ServiceRoute({ params }: PageProps<"/services/[pillar]/[service]">) {
  return <Service params={params} />;
}

async function Service({ params }: { params: PageProps<"/services/[pillar]/[service]">["params"] }) {
  const { pillar, service } = await params;
  const [s, blocks] = await Promise.all([getService(pillar, service), getBlocks(null)]);
  if (!s) {
    await redirectIfUnpublished("services", service);
    notFound();
  }
  const sub = pillar === "cloud-services" ? subServices[service] : undefined;
  if (sub) return <SubServicePage content={sub} contactBlock={blocks["home.contact"] ?? null} fallbackRegion={defaultRegion()} />;
  return <ServicePage service={s} blocks={blocks} />;
}
