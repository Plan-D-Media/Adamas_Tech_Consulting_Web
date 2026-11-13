import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { plain } from "@/lib/placeholder";
import { heroIntro, pageMetadata } from "@/lib/seo";
import { Placeholder } from "@/components/Placeholder";

const PATH = "/about/careers";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "coming-soon"), PATH, "Careers");
}

export default async function CareersPage() {
  const page = await getPage(PATH, "coming-soon");
  if (!page) notFound();
  return <Placeholder eyebrow={page.blocks?.status ?? "Coming soon"} title={plain(page.title)} intro={heroIntro(page.intro)} links={page.blocks?.links ?? [{ label: "About Us", href: "/about" }]} />;
}
