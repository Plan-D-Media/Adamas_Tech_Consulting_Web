import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getServiceParams } from "@/lib/data/services";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { ServicePage } from "@/components/services/ServicePage";

export async function generateStaticParams() {
  return getServiceParams();
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
  if (!s) notFound();
  return <ServicePage service={s} blocks={blocks} />;
}
