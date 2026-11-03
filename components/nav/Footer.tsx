import Link from "next/link";
import { cacheLife } from "next/cache";
import { getNavigation, getOffices, getRegions, type NavLink } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { LogoLink } from "./LogoLink";
import { RegionSwitcher } from "./RegionSwitcher";

function FooterLink({ link }: { link: NavLink }) {
  const cls = "inline-flex items-center gap-1.5 py-1 text-[0.9375rem] text-on-navy-muted transition-colors hover:text-white";
  if (link.comingSoon || !link.href) {
    return (
      <span className="inline-flex items-center gap-2 py-1 text-[0.9375rem] text-on-navy-muted/70">
        {link.label}
        {link.comingSoon && <span className="text-xs">(coming soon)</span>}
      </span>
    );
  }
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener" className={cls}>
        {link.label}
        <Icon name="arrowUpRight" size={14} />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={link.href} className={cls}>
      {link.label}
    </Link>
  );
}

export async function Footer() {
  const [nav, offices, regions] = await Promise.all([getNavigation(), getOffices(), getRegions()]);

  return (
    <footer className="bg-navy-950 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container-site pt-16 md:pt-24">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <LogoLink tone="dark" />
            <div className="mt-8 grid gap-3">
              {regions
                .filter((r) => r.phone || r.email)
                .map((r) => (
                  <div key={r.code} className="text-[0.9375rem]">
                    <p className="font-semibold">{r.label}</p>
                    <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-on-navy-muted">
                      {r.phone && (
                        <a href={r.phoneHref ?? `tel:${r.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-2 hover:text-white">
                          <Icon name="phone" size={16} />
                          {r.phone}
                        </a>
                      )}
                      {r.email && (
                        <a href={`mailto:${r.email}`} className="inline-flex items-center gap-2 hover:text-white">
                          <Icon name="mail" size={16} />
                          {r.email}
                        </a>
                      )}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <nav aria-label="Footer" className="col-span-4 grid grid-cols-2 gap-x-6 gap-y-10 md:col-span-12 md:grid-cols-4 lg:col-span-8">
            {nav.footer.map((col) => (
              <div key={col.key ?? col.label}>
                <h3 className="eyebrow text-sky-400">{col.label}</h3>
                <ul className="mt-4 grid gap-1">
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

        {/* Offices */}
        <div className="mt-16 border-t border-navy-700 pt-10">
          <h3 className="eyebrow text-sky-400">Our offices</h3>
          <ul className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {offices.map((o) => (
              <li key={o.slug} className="text-sm leading-relaxed">
                <p className="font-display text-base font-bold [font-stretch:110%]">{o.label}</p>
                <address className="mt-2 not-italic text-on-navy-muted">
                  {o.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                {o.phone && (
                  <a href={o.phoneHref ?? `tel:${o.phone.replace(/[^+\d]/g, "")}`} className="mt-2 inline-block text-on-navy-muted hover:text-white">
                    {o.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-6 border-t border-navy-700 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-on-navy-muted">
            <span>© <CopyrightYear /> AdamasTech Consulting</span>
            {nav.legal.map((l) => (
              <FooterLink key={l.key ?? l.label} link={l} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ul className="flex items-center gap-2">
              {nav.social.map((s) => (
                <li key={s.key ?? s.label}>
                  <a
                    href={s.href ?? "#"}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-11 items-center rounded-btn border border-navy-700 px-3 text-sm text-on-navy-muted hover:border-white hover:text-white"
                  >
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <FooterRegion regions={regions.map((r) => ({ slug: r.slug, label: r.label, phone: r.phone, phoneHref: r.phoneHref }))} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterRegion({ regions }: { regions: { slug: string; label: string; phone: string | null; phoneHref: string | null }[] }) {
  return (
    <div className="[&_button]:border-navy-700 [&_button]:text-white">
      <RegionSwitcher regions={regions} tone="dark" className="[&>div]:bottom-[calc(100%+0.5rem)] [&>div]:top-auto" />
    </div>
  );
}

/** Current year, cached so the footer stays in the static shell. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
