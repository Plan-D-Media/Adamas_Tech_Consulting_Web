import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Blog",
  description: "The AdamasTech Consulting blog is coming soon. Subscribe to hear when it launches.",
  alternates: { canonical: "/insights/blog" },
};

/** Phase 2: the blog is shown as "coming soon" at launch (sitemap row 43). */
export default function BlogPage() {
  return <Placeholder eyebrow="Coming soon" title="Blog" links={[{ label: "Events", href: "/insights/events" }]} />;
}
