import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getTeam } from "@/lib/data/pages";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { breadcrumbJsonLd, heroIntro, pageMetadata, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealScope } from "@/components/motion/RevealScope";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactSection } from "@/components/home/ContactSection";
import { AboutPeople } from "@/components/about/AboutPeople";

const PATH = "/about/team";
const CRUMBS: Crumb[] = [
  { name: "About Us", path: "/about" },
  { name: "Team", path: PATH },
];

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "team"), PATH, "Team");
}

/**
 * Team: the About page's leadership grid with the biographies shown (INNER_PAGES.md section 2 - a simple page on the
 * same components and tokens, not a second design). Every leadership row is DRAFT until the client confirms it, so
 * the public build shows the page with no profiles; the drafts preview shows them with their badge.
 */
export default async function TeamPage() {
  const [page, team, blocks] = await Promise.all([getPage(PATH, "team"), getTeam(), getBlocks(null)]);
  if (!page) notFound();
  return (
    <RevealScope>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />
      <div className="container-site pt-8">
        <Breadcrumb crumbs={CRUMBS} />
      </div>
      <AboutPeople
        headingLevel="h1"
        eyebrow={page.eyebrow ? plain(page.eyebrow) : null}
        heading={plain(page.title)}
        body={heroIntro(page.intro)}
        people={team}
        withBio
        keepWhenEmpty
        emptyLabel={page.blocks?.emptyLabel ?? null}
      />
      {blocks["home.contact"] && <ContactSection block={blocks["home.contact"]} regionSlug={null} />}
    </RevealScope>
  );
}
