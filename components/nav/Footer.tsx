import Link from "next/link";
import { cacheLife } from "next/cache";
import type { NavLink, OfficeInfo, RegionInfo } from "@/lib/data/site";
import type { RegionSlug } from "@/lib/region";
import { Icon } from "@/components/ui/Icon";
import { LogoLink } from "@/components/nav/LogoLink";
import { RegionSwitcher } from "@/components/nav/RegionSwitcher";

interface Props {
  nav: NavLink[];
  legal: NavLink[];
  social: NavLink[];
  regions: RegionInfo[];
  offices: OfficeInfo[];
  region: RegionSlug | null;
  fallbackRegion: RegionSlug;
}

function FooterLink({ link }: { link: NavLink }) {
  const cls = "inline-flex min-h-9 items-center gap-1.5 font-body text-small text-grey-300 transition-colors duration-(--duration-fast) hover:text-white";
  if (link.comingSoon || !link.href) {
    return (
      <span className={cls}>
        {link.label}
        {link.comingSoon && <span className="text-[0.75rem]">(coming soon)</span>}
      </span>
    );
  }
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {link.label}
        <Icon name="external" size={12} />
      </a>
    );
  }
  return (
    <Link href={link.href} className={cls}>
      {link.label}
    </Link>
  );
}

const telHref = (n: string) => `tel:${n.replace(/[^+\d]/g, "")}`;

/** Cached for a day, so the prerendered footer is allowed to read the clock (cacheComponents forbids a bare new Date()). */
async function copyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/**
 * Global footer (Figma: Footer frame, navy-900). Logo and regional contacts, four link columns, the five offices,
 * then legal links, social buttons and the region switcher. Every item comes from the database.
 */
export async function Footer({ nav, legal, social, regions, offices, region, fallbackRegion }: Props) {
  const year = await copyrightYear();
  return (
    <footer className="bg-navy-900 text-white" data-compare="footer">
      <div className="container-chrome pt-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[384px_minmax(0,1fr)] lg:gap-8">
          <div>
            <LogoLink regions={regions} region={region} fallbackRegion={fallbackRegion} width={178} height={52} />
            <ul className="mt-8 grid gap-3" role="list">
              {regions.map((r) => (
                <li key={r.code}>
                  <p className="font-body text-small font-semibold text-white">{r.label}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-5 gap-y-1">
                    {r.phone && (
                      <a href={r.phoneHref ?? telHref(r.phone)} className="inline-flex min-h-8 items-center gap-2 font-body text-small text-grey-300 hover:text-white">
                        <Icon name="phone" size={14} className="shrink-0" />
                        {r.phone}
                      </a>
                    )}
                    {r.email && (
                      <a href={`mailto:${r.email}`} className="inline-flex min-h-8 items-center gap-2 font-body text-small text-grey-300 hover:text-white [overflow-wrap:anywhere]">
                        <Icon name="mail-small" size={14} className="shrink-0" />
                        {r.email}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {nav.map((col) => (
              <div key={col.key ?? col.label}>
                <h3 className="label-caps font-body text-sky-400">{col.label}</h3>
                <ul className="mt-3 grid gap-1" role="list">
                  {col.children.map((l) => (
                    <li key={l.key ?? l.label}>
                      <FooterLink link={l} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {offices.length > 0 && (
          <section aria-labelledby="footer-offices" className="mt-16 border-t border-navy-700 pt-10">
            <h3 id="footer-offices" className="label-caps font-body text-sky-400">
              Our offices
            </h3>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5" role="list">
              {offices.map((o) => (
                <li key={o.slug}>
                  <p className="font-heading text-[1rem] font-bold text-white">{o.label}</p>
                  <address className="mt-2 font-body text-caption not-italic leading-relaxed text-grey-300">
                    {o.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    {o.phone && (
                      <a href={o.phoneHref ?? telHref(o.phone)} className="mt-2 inline-flex min-h-8 items-center gap-2 hover:text-white">
                        <Icon name="phone" size={14} className="shrink-0" />
                        {o.phone}
                      </a>
                    )}
                  </address>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-14 flex flex-col gap-6 border-t border-navy-700 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="font-body text-caption text-grey-300">&copy; {year} AdamasTech Consulting</p>
            <ul className="flex flex-wrap items-center gap-x-6" role="list" aria-label="Legal">
              {legal.map((l) => (
                <li key={l.key ?? l.label}>
                  <FooterLink link={l} />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {social.length > 0 && (
              <ul className="flex items-center gap-2" role="list" aria-label="Social media">
                {social.map((s) =>
                  s.href ? (
                    <li key={s.key ?? s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-xs border border-navy-700 px-4 font-body text-caption text-grey-300 transition-colors duration-(--duration-fast) hover:border-grey-300 hover:text-white">
                        {s.label}
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            )}
            <RegionSwitcher regions={regions} region={region} fallbackRegion={fallbackRegion} variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
