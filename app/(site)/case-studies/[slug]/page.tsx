import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudy, getCaseStudyParams } from "@/lib/data/caseStudies";
import { getBlocks } from "@/lib/data/site";
import { optionalCopy, plain } from "@/lib/placeholder";
import { NO_CONTENT_SLUG, atLeastOne } from "@/lib/static-params";
import { redirectIfUnpublished } from "@/lib/data/unpublished";
import { articleJsonLd, breadcrumbJsonLd, openGraphFor, type Crumb } from "@/lib/seo";
import { defaultRegion } from "@/lib/region";
import { awsCaseStudies } from "@/lib/aws-case-studies";
import { JsonLd } from "@/components/seo/JsonLd";
import { CaseStudyPage } from "@/components/cases/CaseStudyPage";
import { AwsCaseStudyPage } from "@/components/cases/AwsCaseStudyPage";

/**
 * The two client-supplied AWS case studies have their own designs (23 Nov 2026) and render
 * `AwsCaseStudyPage`; the other eighteen still render the generic `CaseStudyPage`, untouched.
 */

/** With no visible case study (all DRAFT) the placeholder param keeps the build alive; it renders the 404 page (BUG-001). */
export async function generateStaticParams() {
  return atLeastOne(await getCaseStudyParams(), { slug: NO_CONTENT_SLUG });
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) return {};
  const summary = optionalCopy(c.summary);
  const title = c.seoTitle ?? plain(c.title);
  const description = c.seoDescription ?? (summary && !summary.pending ? summary.text : undefined);
  return {
    title,
    description,
    alternates: { canonical: `/case-studies/${slug}` },
    robots: c.noindex ? { index: false } : undefined,
    ...openGraphFor(title, description, `/case-studies/${slug}`, c.image?.url ?? null),
  };
}

/** Navigations may block (instant = false): params are read outside <Suspense>, so the page is complete without JavaScript. */
export const instant = false;

export default function CaseStudyRoute({ params }: PageProps<"/case-studies/[slug]">) {
  return <CaseStudy params={params} />;
}

async function CaseStudy({ params }: { params: PageProps<"/case-studies/[slug]">["params"] }) {
  const { slug } = await params;
  const [c, blocks] = await Promise.all([getCaseStudy(slug), getBlocks(null)]);
  if (!c) {
    await redirectIfUnpublished("case-studies", slug);
    notFound();
  }
  const path = `/case-studies/${c.slug}`;
  const crumbs: Crumb[] = [
    { name: "Case studies", path: "/case-studies" },
    { name: plain(c.title), path },
  ];
  const summary = optionalCopy(c.summary);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={articleJsonLd({
          headline: plain(c.title),
          description: c.seoDescription ?? (summary && !summary.pending ? summary.text : null),
          path,
          image: c.image?.url ?? null,
          published: c.publishedAt ?? null,
          modified: c.updatedAt ?? null,
        })}
      />
      {awsCaseStudies[c.slug] ? (
        <AwsCaseStudyPage
          study={c}
          extra={awsCaseStudies[c.slug]}
          contactBlock={blocks["home.contact"] ?? null}
          fallbackRegion={defaultRegion()}
          crumbs={crumbs}
        />
      ) : (
        <CaseStudyPage study={c} blocks={blocks} crumbs={crumbs} />
      )}
    </>
  );
}
