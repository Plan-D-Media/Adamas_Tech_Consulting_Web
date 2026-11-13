import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAboutStats, getCertifications, getMilestones, getPage, getTeam } from "@/lib/data/pages";
import { getBlocks, getOffices } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { heroIntro, pageMetadata } from "@/lib/seo";
import { Placeholder } from "@/components/Placeholder";

const PATH = "/about";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "about"), PATH, "About Us");
}

export default async function AboutPage() {
  const [page, team, certs, stats, blocks, offices, milestones] = await Promise.all([
    getPage(PATH, "about"),
    getTeam(),
    getCertifications(),
    getAboutStats(),
    getBlocks(null),
    getOffices(),
    getMilestones(),
  ]);
  if (!page) notFound();
  const sections = Object.keys(blocks).filter((k) => k.startsWith("about.")).length;
  return (
    <Placeholder
      eyebrow={page.eyebrow}
      title={plain(page.title)}
      intro={heroIntro(page.intro) ?? `${team.length} people, ${certs.length} credentials, ${stats.length} stats, ${milestones.length} milestones, ${offices.length} offices, ${sections} blocks loaded.`}
      links={[
        { label: "Team", href: "/about/team" },
        { label: "Careers", href: "/about/careers" },
        { label: "Credentials & certifications", href: "/credentials" },
      ]}
    />
  );
}
