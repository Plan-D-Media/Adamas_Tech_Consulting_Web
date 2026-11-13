import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getTeam } from "@/lib/data/pages";
import { plain } from "@/lib/placeholder";
import { heroIntro, pageMetadata } from "@/lib/seo";
import { Placeholder } from "@/components/Placeholder";

const PATH = "/about/team";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "team"), PATH, "Team");
}

export default async function TeamPage() {
  const [page, team] = await Promise.all([getPage(PATH, "team"), getTeam()]);
  if (!page) notFound();
  return <Placeholder eyebrow={page.eyebrow} title={plain(page.title)} intro={heroIntro(page.intro) ?? `${team.length} leadership profiles loaded.`} links={[{ label: "About Us", href: "/about" }]} />;
}
