import type { Metadata } from "next";
import { SiteChrome } from "@/components/nav/SiteChrome";
import { Placeholder } from "@/components/Placeholder";

/** A titled 404 (QA BUG-031); never indexed. */
export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

const LINKS = [
  { label: "Homepage", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Case studies", href: "/case-studies" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Root 404 (also reached through proxy.ts for unknown single-segment paths). Rebuilt to Figma in a later round. */
export default function NotFound() {
  return (
    <SiteChrome region={null}>
      <Placeholder eyebrow="Error 404" title="We couldn’t find that page." intro="The link may be out of date, or the page may have moved as part of our new website." links={LINKS} linksLabel="Start from a section" />
    </SiteChrome>
  );
}
