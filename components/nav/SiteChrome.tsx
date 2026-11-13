import type { ReactNode } from "react";
import { getNavigation, getOffices, getRegions } from "@/lib/data/site";
import { defaultRegion, type RegionSlug } from "@/lib/region";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

interface Props {
  /** The page's region when it is a regional homepage; null on global inner pages (resolved from the cookie in the browser). */
  region: RegionSlug | null;
  children: ReactNode;
}

/** Header, main and footer. Navigation, regions and offices come from the database (cached, tag-revalidated). */
export async function SiteChrome({ region, children }: Props) {
  const [nav, regions, offices] = await Promise.all([getNavigation(), getRegions(), getOffices()]);
  const fallback = defaultRegion();
  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-sm bg-white px-4 py-2 font-ui text-button font-bold text-navy-950 shadow-lift">
        Skip to content
      </a>
      <Header nav={nav.header} social={nav.social} regions={regions} region={region} fallbackRegion={fallback} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer nav={nav.footer} legal={nav.legal} social={nav.social} regions={regions} offices={offices} region={region} fallbackRegion={fallback} />
      <SmoothScroll />
    </>
  );
}
