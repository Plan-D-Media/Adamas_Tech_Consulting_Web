import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { plain } from "@/lib/placeholder";
import { heroIntro, pageMetadata } from "@/lib/seo";
import { Placeholder } from "@/components/Placeholder";

const PATH = "/thank-you";

export async function generateMetadata(): Promise<Metadata> {
  // Confirmation page after a form submission: never indexed.
  return { ...pageMetadata(await getPage(PATH, "thank-you"), PATH, "Thank you"), robots: { index: false, follow: true } };
}

export default async function ThankYouPage() {
  const page = await getPage(PATH, "thank-you");
  if (!page) notFound();
  return <Placeholder eyebrow={page.eyebrow} title={plain(page.title)} intro={heroIntro(page.intro)} links={(page.blocks?.next ?? []).map((n) => ({ label: n.title, href: n.href }))} linksLabel="What next" />;
}
