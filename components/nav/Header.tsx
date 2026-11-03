import { getNavigation, getRegions } from "@/lib/data/site";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const [nav, regions] = await Promise.all([getNavigation(), getRegions()]);
  return (
    <HeaderClient
      items={nav.header}
      regions={regions.map((r) => ({ slug: r.slug, label: r.label, phone: r.phone, phoneHref: r.phoneHref }))}
    />
  );
}
