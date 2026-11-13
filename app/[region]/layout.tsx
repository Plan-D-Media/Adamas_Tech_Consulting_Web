import { isRegionSlug } from "@/lib/region";
import { SiteChrome } from "@/components/nav/SiteChrome";

/** Regional homepages: the header and footer know the region from the URL, so the switcher label is right without JavaScript. */
export default async function RegionLayout({ children, params }: LayoutProps<"/[region]">) {
  const { region } = await params;
  return <SiteChrome region={isRegionSlug(region) ? region : null}>{children}</SiteChrome>;
}
