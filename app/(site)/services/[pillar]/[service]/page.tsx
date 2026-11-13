import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getServiceParams } from "@/lib/data/services";
import { plain } from "@/lib/placeholder";
import { Placeholder } from "@/components/Placeholder";

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
  };
}

/** Navigations may block (instant = false): params are read outside <Suspense>, so the page is complete without JavaScript. */
export const instant = false;

export default function ServicePage({ params }: PageProps<"/services/[pillar]/[service]">) {
  return <Service params={params} />;
}

async function Service({ params }: { params: PageProps<"/services/[pillar]/[service]">["params"] }) {
  const { pillar, service } = await params;
  const s = await getService(pillar, service);
  if (!s) notFound();
  return (
    <Placeholder
      eyebrow={plain(s.pillar.name)}
      title={plain(s.name)}
      intro={plain(s.descriptor) || plain(s.summary) || null}
      links={[{ label: plain(s.pillar.name), href: s.pillar.href }, ...s.siblings.map((x) => ({ label: plain(x.name), href: x.href }))]}
      linksLabel="Related services"
    />
  );
}
