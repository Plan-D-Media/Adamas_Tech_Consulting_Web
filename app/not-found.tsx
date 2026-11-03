import { PageHero } from "@/components/layout/PageHero";
import { LinkCard } from "@/components/cards/LinkCard";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

const QUICK_LINKS = [
  { href: "/services", title: "Services", icon: "layers" },
  { href: "/solutions", title: "Solutions", icon: "spark" },
  { href: "/case-studies", title: "Case studies", icon: "chart" },
  { href: "/about", title: "About Us", icon: "globe" },
] as const;

/** 404: the inner-page hero (same copy as before) plus a site search box and the main sections. */
export default function NotFound() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Page not found" }]}
        eyebrow="Error 404"
        title="We couldn’t find that page."
        intro="The link may be out of date, or the page may have moved as part of our new website."
        art="search"
        artVariant={2}
        size="md"
        actions={
          <>
            <ButtonLink href="/" arrow>
              Go to the homepage
            </ButtonLink>
            <ArrowLink href="/contact" tone="dark">
              Talk to an expert
            </ArrowLink>
          </>
        }
      />
      <section aria-labelledby="nf-h" className="section-y tone-white">
        <div className="container-site">
          <SectionHeader id="nf-h" eyebrow="Find your way" heading="Search the site or start from a section" />
          {/* A plain GET form: /search reads ?q= in the browser. */}
          <form role="search" action="/search" method="get" className="relative mt-10 max-w-3xl">
            <label htmlFor="nf-q" className="sr-only">
              Search the site
            </label>
            <Icon name="search" size={22} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-brand-600" />
            <input
              id="nf-q"
              name="q"
              type="search"
              placeholder="Search services, solutions, case studies…"
              className="block h-16 w-full rounded-card border border-grey-300 bg-white pl-14 pr-32 text-base text-navy-950 transition-[border-color] duration-(--duration-base) placeholder:text-grey-500 hover:border-grey-500 focus:border-brand-600"
            />
            <button type="submit" className="btn absolute right-2 top-1/2 inline-flex min-h-12 -translate-y-1/2 items-center rounded-btn bg-orange-500 px-5 font-semibold text-navy-950 hover:bg-orange-600">
              Search
            </button>
          </form>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <LinkCard href={l.href} title={l.title} icon={l.icon} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
