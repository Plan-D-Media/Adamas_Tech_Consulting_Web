import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCertifications, getPage } from "@/lib/data/pages";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { breadcrumbJsonLd, heroIntro, pageMetadata, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealScope } from "@/components/motion/RevealScope";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactSection } from "@/components/home/ContactSection";
import { AboutCredentials } from "@/components/about/AboutCredentials";

const PATH = "/credentials";
const CRUMBS: Crumb[] = [
  { name: "About Us", path: "/about" },
  { name: "Credentials", path: PATH },
];

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "credentials"), PATH, "Credentials");
}

/**
 * Credentials: the About page's certification band with the certificate details shown (INNER_PAGES.md section 2).
 * Certificate numbers, validity and partner tiers that are still stand-ins are withheld from the public build by
 * lib/data/pages.ts, so this page shows only what the client has evidenced.
 */
export default async function CredentialsPage() {
  const [page, certs, blocks] = await Promise.all([getPage(PATH, "credentials"), getCertifications(), getBlocks(null)]);
  if (!page) notFound();
  return (
    <RevealScope>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />
      <div className="container-site pt-8">
        <Breadcrumb crumbs={CRUMBS} />
      </div>
      <AboutCredentials
        headingLevel="h1"
        eyebrow={page.eyebrow ? plain(page.eyebrow) : null}
        heading={plain(page.title)}
        body={heroIntro(page.intro)}
        items={certs}
        withDetail
      />
      {blocks["home.contact"] && <ContactSection block={blocks["home.contact"]} regionSlug={null} />}
    </RevealScope>
  );
}
