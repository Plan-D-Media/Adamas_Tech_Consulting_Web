import type { NavLink, RegionInfo } from "@/lib/data/site";
import type { RegionSlug } from "@/lib/region";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { HeaderShell } from "@/components/nav/HeaderShell";
import { LogoLink } from "@/components/nav/LogoLink";
import { MegaMenu } from "@/components/nav/MegaMenu";
import { MobileNav } from "@/components/nav/MobileNav";
import { RegionSwitcher } from "@/components/nav/RegionSwitcher";
import { TopBarContacts } from "@/components/nav/TopBarContacts";

interface Props {
  nav: NavLink[];
  social: NavLink[];
  regions: RegionInfo[];
  region: RegionSlug | null;
  fallbackRegion: RegionSlug;
}

const SOCIAL_ICONS: Record<string, IconName> = { facebook: "facebook", linkedin: "linkedin", twitter: "twitter", x: "twitter", youtube: "youtube" };

/**
 * Global header (Figma: Group 21303). A 35px top bar (phone, email, social) over the navy band, then the 70px
 * glass bar (white at 80% with a 1px white stroke, radius 10) holding the logo, main nav, region switcher and CTA.
 */
export function Header({ nav, social, regions, region, fallbackRegion }: Props) {
  return (
    <HeaderShell>
      {/* data-menu-anchor: the mega-menu panels are portalled to <body> and take their left edge and width from this
          1312px box (Figma: panel x 304-1616). See components/nav/MegaMenuPortal.tsx. */}
      <div className="container-chrome relative" data-menu-anchor>
        <div className="topbar flex h-(--topbar-h) items-center justify-between gap-6 overflow-hidden pt-[17px] transition-[height,padding,opacity] duration-(--duration-base) ease-(--ease-out)">
          <TopBarContacts regions={regions} region={region} fallbackRegion={fallbackRegion} />
          {social.length > 0 && (
            <ul className="-mr-1 flex items-center gap-0.5" aria-label="Social media" role="list">
              {social.map((s) => {
                const icon = SOCIAL_ICONS[s.label.toLowerCase()];
                if (!icon || !s.href) return null;
                return (
                  <li key={s.key ?? s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex h-6 w-6 items-center justify-center text-white/90 hover:text-white" aria-label={`${s.label} (opens in a new tab)`}>
                      <Icon name={icon} size={16} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* The glass is a pseudo-element: a backdrop-filter on the bar itself would become the containing block for the
            drawer's fixed panel (components/nav/MobileNav.tsx). */}
        <div className="headerbar relative isolate mt-[13px] flex h-[70px] items-center gap-4 rounded-md border border-white px-[11px] before:absolute before:inset-0 before:-z-10 before:rounded-[9px] before:bg-white/80 before:shadow-[0_1px_0_rgb(255_255_255/0.6)_inset] before:backdrop-blur-md">
          <LogoLink regions={regions} region={region} fallbackRegion={fallbackRegion} priority />
          <MegaMenu items={nav} />
          {/* Figma: the nav ends 42px before the switcher's flag (the summary has 12px of padding and so 30px of gap); switcher and CTA are 18px apart. */}
          <div className="ml-auto flex shrink-0 items-center gap-3 nav:ml-6">
            <div className="hidden nav:block">
              <RegionSwitcher regions={regions} region={region} fallbackRegion={fallbackRegion} />
            </div>
            <div className="hidden sm:block">
              <ButtonLink href="/contact" size="sm" className="min-w-[174px]">
                Talk to an expert
              </ButtonLink>
            </div>
            <MobileNav items={nav} regions={regions} region={region} fallbackRegion={fallbackRegion} />
          </div>
        </div>
      </div>
    </HeaderShell>
  );
}
