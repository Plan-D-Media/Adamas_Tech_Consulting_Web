import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCertifications, getPage } from "@/lib/data/pages";
import { plain } from "@/lib/placeholder";
import { heroIntro, pageMetadata } from "@/lib/seo";
import { Placeholder } from "@/components/Placeholder";

const PATH = "/credentials";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "credentials"), PATH, "Credentials");
}

export default async function CredentialsPage() {
  const [page, certs] = await Promise.all([getPage(PATH, "credentials"), getCertifications()]);
  if (!page) notFound();
  return <Placeholder eyebrow={page.eyebrow} title={plain(page.title)} intro={heroIntro(page.intro) ?? `${certs.length} certifications and partner programmes loaded.`} links={[{ label: "About Us", href: "/about" }]} />;
}
