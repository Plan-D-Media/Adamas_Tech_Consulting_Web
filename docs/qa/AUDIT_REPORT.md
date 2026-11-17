# AdamasTech website: QA audit report (Phase 1 of 3)

Audit date: 16 November 2026. Target: production build (`next build && next start`, port 3100) of commit `b8f2376` against the local PostgreSQL database `adamas`. Engines: Playwright 1.64 Chromium, Firefox and WebKit; Lighthouse 12.8 (mobile); axe-core. Scripts live in `scripts/qa/` and every result referenced below is under `docs/qa/evidence/`.

Nothing was changed in the product code during this phase. Only QA scripts (`scripts/qa/*`), this report and the evidence folder were added (`git status`: `docs/qa/` and `scripts/qa/` untracked; the evidence folder is about 350 MB of full-page captures, so consider ignoring `docs/qa/evidence/**/*.png` before committing). Both test servers (ports 3100 and 3101) were stopped at the end of the phase. The local database keeps no QA rows: every test submission and rate-limit window was deleted by the scripts.

No bugs were pasted into the "Bugs Swayang has already found" section of the brief (the placeholder was left empty), so every item below was found by this audit.

---

## 1. Summary

### Bugs by severity

| Severity | Count |
|---|---|
| Blocker | 2 |
| Critical | 3 |
| Major | 10 |
| Minor | 15 |
| Trivial | 4 |
| **Total** | **34** |

### Pass / fail by test area

| Area | Result | Notes |
|---|---|---|
| 1. Visual fidelity (Figma) | Pass with exceptions | Homepage sections 90.6 to 99.1 % pixel match at 1920, Cloud Services 81 to 96 %; the two low scores are content (real case studies, invisible Top Stories slide: BUG-006). 1440 reviewed by eye: consistent. |
| 2. Responsive layout | **Fail** | Pillar pages gain 1.5 to 3.2 k px of horizontal scroll after the reveal (BUG-007); otherwise no overflow (one 1 px case at 360) at any of the nine viewports in three engines, no clipped text, no aspect-ratio breaks. |
| 3. Functional | **Fail** | Hero autoplay dead (BUG-005), Top Stories slide 3 blank (BUG-006), Industries last item unselectable (BUG-010). Navigation, mega menus (mouse/touch), drawer, region switcher, routing, redirects, forms, `.ics` all pass. |
| 4. Content | **Fail** | Public configuration cannot even be built (BUG-001); DRAFT figure "30%" and placeholder solution names sit in PUBLISHED rows (BUG-014); American spellings on inner pages (not a bug: client copy, see section 4). No "Middle East", "Lorem" or "TBD" anywhere. |
| 5. Accessibility (WCAG 2.2 AA) | **Fail** | axe: 0 violations on the homepages, service template and event page; serious contrast failures on the placeholder pages (BUG-012). Manual: mega-menu panels unreachable by keyboard (BUG-008), invisible focus on the country selector (BUG-009), skip link broken after a client-side navigation (BUG-013). |
| 6. Performance | Pass with conditions | See section 1.4 and `evidence/drafts/lighthouse/lighthouse.md`. CLS 0, TBT under 200 ms; LCP above 2.5 s on the lab device; a 60 fps render loop runs on every homepage (BUG-005). No memory leak over 21 navigations. |
| 7. Technical SEO | **Fail** | No Organization or BreadcrumbList JSON-LD on any page; no Open Graph tags on the homepages or placeholder pages (BUG-011); 14 pages without a meta description (BUG-023). Sitemap, canonicals, hreflang and robots are correct. |
| 8. Security | **Fail** | No security headers at all (BUG-003); Basic Auth from the brief is not in the code (BUG-004). No secrets in the client bundle, `/api/revalidate` rejects requests without the secret, `/figma-fixture` is a 404, error pages show no stack traces, bogus server actions get a 400. |
| 9. Robustness | Pass with exceptions | No console errors or page errors on any of the 76 crawled URLs (the only console entry is the 404 status of 404 pages). Empty optional fields render cleanly. No-JS: every section visible on all templates, both forms work. Long image names: `next/image` URLs, no layout impact. |

### Top five risks for 24 November

1. **The public configuration does not build.** With `PREVIEW_DRAFTS=false` the only event is DRAFT, `generateStaticParams` returns nothing and Cache Components abort `next build` (BUG-001). Until the event (and the case studies it links to) are PUBLISHED, launch is impossible, and once they are, the event page goes live with "title to be confirmed" placeholders.
2. **Homepage conversion paths lead nowhere.** The "Talk to an expert" CTA (header, hero, every service page) lands on the `/contact` placeholder, which has no form, only mailto links. The only working enquiry form is at the bottom of the homepages.
3. **Two of the first three homepage sections are visibly broken**: the hero never auto-advances and its progress bar stays empty (BUG-005); the Top Stories slider shows a blank third slide and loses its right-hand peek card (BUG-006).
4. **No security headers and no preview protection** (BUG-003, BUG-004): clickjacking and MIME sniffing are open, and the staging site is public unless Vercel Deployment Protection is switched on.
5. **Keyboard users cannot open three of the four mega menus** (BUG-008) and screen-reader/keyboard users lose the skip link after the first navigation (BUG-013): a WCAG 2.2 AA failure on the global navigation.

### Release recommendation for 24 November: **No-go** as the build stands today; **Go with conditions** if the Blockers and Criticals are fixed and retested by 21 November.

Reasons: BUG-001 alone prevents a public build. BUG-003 to BUG-006 are visible or security-relevant on the first screen every visitor sees. All of them are code fixes of a few hours each (root causes identified below) and the regression suite planned for Phase 2 covers them, so a conditional Go is realistic if the content decisions in section 4 (publish the event, publish or unlink the draft case studies, confirm the 30 % figure) are taken this week.

### 1.4 Performance (mobile Lighthouse, median of 3)

See `evidence/drafts/lighthouse/lighthouse.md` for the full table, contributors and per-run numbers.

| URL | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI | DOM | Script | Images | Fonts |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /in/ | 89 | 100 | 100 | 69 | 3639 ms | 0.000 | 94 ms | 1520 ms | 1878 ms | 1608 | 214 KB | 297 KB | 81 KB |
| /uk/ | 89 | 100 | 100 | 69 | 3635 ms | 0.000 | 124 ms | 1518 ms | 1898 ms | 1608 | 214 KB | 297 KB | 81 KB |
| /gcc/ | 89 | 100 | 100 | 69 | 3645 ms | 0.001 | 62 ms | 1518 ms | 1921 ms | 1606 | 214 KB | 297 KB | 81 KB |
| /services/cloud-services | 93 | 100 | 96 | 69 | 3164 ms | 0.000 | 80 ms | 1514 ms | 1514 ms | 1213 | 219 KB | 54 KB | 81 KB |
| /insights/events/house-of-lords-2026 | 94 | 100 | 96 | 69 | 3015 ms | 0.000 | 50 ms | 1365 ms | 1365 ms | 604 | 170 KB | 32 KB | 81 KB |

Targets from the brief: Performance 90 or higher, LCP under 2.5 s, CLS under 0.1, TBT under 200 ms, Accessibility 95 or higher. Met: CLS, TBT, Accessibility (100) and Best Practices. Not met: Performance 89 on the three homepages (93 and 94 on the service and event pages) and LCP 3.0 to 3.6 s on every page. Round 7 measured 69/72/69 on the same laptop, so the homepages have improved by about 20 points since then. SEO 69 is the staging noindex (expected until launch). Run to run the Performance score varied by at most 4 points and TBT by up to 140 ms, so the medians above are the reliable figures.

Largest contributors (median runs): the homepage document is 450 KB of HTML with 1,645 DOM elements; 10 script chunks totalling about 670 KB uncompressed (two large shared chunks of 229 KB and 164 KB carry React, Next and the client components); hero card AVIF/WebP images are the LCP element; three self-hosted variable fonts. INP is a field metric and is not reported by lab Lighthouse; the only interaction-time risk found is the 60 fps re-render loop in the hero carousel (BUG-005), which also costs about 36 ms of script per second while idle.

Memory: heap after GC 5.6 MB at load, 9.5 MB after 21 client-side navigations across 11 routes (three routes stay retained hidden by Next's Activity, by design), listeners 706 to 1,392; no growth on repeated returns to `/in/`. No render loop other than BUG-005 (`evidence/drafts/memory.md`).

---

## 2. Bug log

Columns: ID, Title, Severity, Priority, Area, Page/URL, Browser and viewport, Steps, Expected, Actual, Evidence, Suspected root cause. Sorted by severity.

### Blocker

**BUG-001. Public build fails: no static params for the events route**
- Severity: Blocker. Priority: P1. Area: Build / content status.
- Page: `/insights/events/[slug]` (whole site, build time).
- Browser: n/a (build).
- Steps: `PREVIEW_DRAFTS=false npm run build`.
- Expected: the build succeeds and the public site contains only PUBLISHED content.
- Actual: `Error: When using Cache Components, all generateStaticParams functions must return at least one result` at `app/(site)/insights/events/[slug]/page.tsx:11`; the build exits 1. With drafts on it builds.
- Evidence: `evidence/build/build-PREVIEW_DRAFTS-false.log`, `evidence/build/build-PREVIEW_DRAFTS-true.log`.
- Root cause: the only Event row (`house-of-lords-2026`) is `status: DRAFT` (`content/events.ts`), so `getEventParams()` returns `[]` under `visible`. Two fixes are needed: publish the event (content decision) and make the route robust to zero visible rows (Next 16 requires at least one param or opting the route out of static generation) so the next DRAFT-only table cannot break the build.

**BUG-002. The House of Lords event and every case study it links to are DRAFT, so the public site has no event page and dead homepage links**
- Severity: Blocker. Priority: P1. Area: Content status / navigation.
- Page: `/insights/events/house-of-lords-2026`, `/in/`, `/uk/`, `/gcc/`, mega menu Insights, footer Events.
- Browser: Chromium 1440 (dev server on port 3101 with `PREVIEW_DRAFTS=false`, because the production build cannot be made in that configuration).
- Steps: run the site with `PREVIEW_DRAFTS=false`; open a homepage; follow the hero card "Join us at the House of Lords", the Events section button, the hero card "How SAP Treasury improved cash forecasting by 30%", the Top Stories "Read full story" links and the Client Outcomes "Read Case Study" links.
- Expected: no public link resolves to a 404; the brief's redirect note says DRAFT case-study targets should fall back to `/case-studies`.
- Actual: with drafts off the event page and every case-study page answer **500** (the same `generateStaticParams` error is thrown at request time in dev), and each homepage carries three dead links: the hero/Events links to `/insights/events/house-of-lords-2026`, and the Top Stories / Client Outcomes links to `/case-studies/sap-treasury-cash-forecasting` and `/case-studies/kubernetes-operations-healthtech`. The public sitemap (44 URLs) lists no event and no case study, so the mega menu Insights panel and footer "Events" also point at a dead page. `/calendar` for the event answers 404.
- Evidence: `evidence/public/crawl.md` (status column), `evidence/public/dead-links.md`.
- Root cause: Event and all 20 CaseStudy rows are DRAFT, but the HeroSlide, `home.topStories` and `home.outcomes` rows that link to them are PUBLISHED; nothing filters links by the target's status and there is no fallback route.

### Critical

**BUG-003. No security headers on any response**
- Severity: Critical. Priority: P1. Area: Security.
- Page: every route, including `/_next/static/*`, `/api/revalidate`, `/sitemap.xml`.
- Browser: curl / fetch.
- Steps: `curl -I http://localhost:3100/in/` (and any other URL).
- Expected: `Content-Security-Policy` (with `frame-ancestors`), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, and `Strict-Transport-Security` in production.
- Actual: none of them is set. `X-Powered-By` is correctly off.
- Evidence: `evidence/drafts/crawl.md`, "Security probes" section (all header values `null`), and the per-page `security headers` lines.
- Root cause: `next.config.ts` has no `headers()` and `proxy.ts` sets no headers on `NextResponse.next()`.

**BUG-004. Basic Auth for the preview is gone**
- Severity: Critical. Priority: P1. Area: Security / staging.
- Page: every route.
- Browser: curl.
- Steps: request any page without credentials.
- Expected: brief section 3 lists `PREVIEW_USERNAME` / `PREVIEW_PASSWORD` as Basic Auth "in `proxy.ts`" that must keep working, protecting every route including `/_next` data routes and API routes.
- Actual: 200 without a `WWW-Authenticate` challenge. The variables are referenced nowhere in the code (`grep PREVIEW_USERNAME` returns nothing) and are absent from `.env.example`.
- Evidence: `evidence/drafts/crawl.md` ("GET /in/" probe: `www-authenticate: null`); `grep` in `proxy.ts`.
- Root cause: the prototype's middleware was replaced by the current `proxy.ts` (region routing and redirects only) without carrying the auth block over. Decision for Swayang: restore it in `proxy.ts`, or rely on Vercel Deployment Protection and remove the flags from the brief.

**BUG-005. Hero carousel never auto-advances; progress bar stays empty; a 60 fps React re-render loop runs instead**
- Severity: Critical. Priority: P1. Area: Functional / performance.
- Page: `/in/`, `/uk/`, `/gcc/` (hero).
- Browser: Chromium 1440×900 and 390×844 (same in Firefox/WebKit, see interactions logs).
- Steps: load a homepage, do not touch anything, wait 9 seconds.
- Expected: the active progress bar fills over 7 s and the carousel moves to slide 2 (design note 18).
- Actual: counter stays "01 / 03", bar width stays 0 % for the whole wait; `performance` metrics show about 60 layouts and 60 style recalcs per second while idle (603 in 10 s).
- Evidence: `evidence/drafts/interactions/interactions-chromium.md` ("hero auto-advances" FAIL, "pause stops" vacuous), `scripts/qa/probe-autoplay.mts` output (sampled every 1.5 s), `evidence/drafts/memory.md` (idle layouts).
- Root cause: `components/home/HeroCarousel.tsx` `useEffect` depends on `wrapNext`, which `useSlider` recreates on every render. Each `setElapsed()` re-renders, the effect re-runs, `start.current = performance.now()` resets the timer and the elapsed fraction never reaches 1. The same loop is the idle CPU cost.

### Major

**BUG-006. Top Stories slider: the third story and the trailing clone are invisible, so the slider shows a blank slide**
- Severity: Major (borderline Critical: second section of every homepage). Priority: P1. Area: Functional / visual.
- Page: `/in/`, `/uk/`, `/gcc/`.
- Browser: Chromium 1440 (also WebKit and Firefox: the reduced-motion check reports the same two hidden elements).
- Steps: load the page, scroll down to Top Stories (so the reveal runs), press "Next stories" twice to reach "03 / 03"; or press "Previous" once from the first story.
- Expected: every slide shows a card and the neighbours peek in on both sides (Figma Frame 50).
- Actual: slide 3 is an empty track; the card to the right of slide 2 is missing. The fourth and fifth `<article>` elements (the third story and the trailing clone) stay at `opacity: 0`: they carry `data-reveal` but never receive `data-revealed` and GSAP never touches them. The first story and the leading clone are fine.
- Evidence: `evidence/drafts/interactions/probe-stories-clones.png`, `probe-stories-after-prev.png` (empty track), `scripts/qa/probe-home.mts` output (`[{clone,opacity 1},{s1,1},{s2,1},{s3,opacity 0,revealed false},{clone,opacity 0}]`), `evidence/drafts/figma/home-compare/top-stories.png` (75.8 % match, lowest on the page).
- Root cause: `components/home/StoriesSlider.tsx` inserts the two clones after hydration with index keys (`key={i}`), so React re-uses the first three `<article>` elements for shifted content and creates two new elements at the end. `components/motion/RevealScope.tsx` captured its `[data-reveal]` list at mount, so the two new elements are never revealed and the CSS pre-state (`opacity: 0`) stays. Note: the QA screenshots that show the slider at "03 / 03" on load (`responsive/`, `figma/` strips) are an artefact of the capture scripts forcing the reveal state; `scripts/qa/probe-resnap.mts` confirms a real visitor starts on "01 / 03".

**BUG-007. Pillar pages gain a horizontal scrollbar after the page is scrolled**
- Severity: Major. Priority: P1. Area: Responsive / layout.
- Page: `/services/digital-transformation`, `/services/ai-services`, `/services/ai-services/computer-vision`, `/services/digital-transformation/sap` (any page whose case-study rail has more cards than fit).
- Browser: Chromium and Firefox, every viewport from 360 to 1920 (overflow 1.5 k to 3.2 k px).
- Steps: load the page, scroll to the bottom and back to the top; drag the page sideways or look at the scrollbar.
- Expected: no horizontal scroll (`document.scrollWidth === clientWidth`).
- Actual: `document.documentElement.scrollWidth` becomes 3,191 px (DT) and 4,529 px (Data & AI) at 1280; `window.scrollTo(3000, 0)` works. At load (before scrolling) it is 1,280. Cloud Services (3 cards, fits) is unaffected.
- Evidence: `evidence/drafts/responsive/responsive.md` (overflow column), `evidence/drafts/responsive/probe-overflow--services-ai-services.png` (4,529 px wide capture), `scripts/qa/probe-overflow2.mts` / `probe-overflow3.mts` output.
- Root cause (partly confirmed): the overflow appears only after the scroll-triggered reveal pass runs (GSAP ScrollTrigger loads on first scroll). Pre-revealing the rail items does not avoid it, it happens without Lenis and with plain `window.scrollTo` (no injected styles), and the homepages never show it, so the trigger is ScrollTrigger's own refresh/measurement with `[data-reveal]` items inside the `overflow-x: auto` case-study rail (`components/services/ServiceCases.tsx`). Setting `overflow-x: clip` on `main` or `html`, or moving `data-reveal` off the rail items, are the two candidate fixes to test in Phase 2.

**BUG-008. Keyboard users cannot reach the About Us, Services and Solutions mega-menu panels**
- Severity: Major. Priority: P1. Area: Accessibility (WCAG 2.1.1 Keyboard).
- Page: header on every page.
- Browser: Chromium 1440.
- Steps: Tab to "About Us", press Enter (panel opens), press Tab.
- Expected (brief section 8): "Tab moves through the panel".
- Actual: focus moves to the "Services" trigger, then "Solutions", then "Case Studies", and the Case Studies link's `onFocus={close}` closes the open panel before focus ever reaches it. Sequence recorded: `Services (open) -> Solutions (open) -> Case Studies (closed)`. Only "Insights" (the last trigger) works, because its panel follows it in DOM order.
- Evidence: `scripts/qa/probe-switch.mts` output ("about Tab sequence"), `evidence/drafts/interactions/interactions-chromium.md` ("Tab moves focus into the panel" FAIL).
- Root cause: `components/nav/MegaMenu.tsx` renders all triggers in one `<ul>` and the single panel after it; keyboard order is DOM order. Fix options: render the open panel immediately after its trigger (or move focus into the panel on open), and do not close on focus of a sibling trigger.

**BUG-009. Phone country selector has no visible focus indicator**
- Severity: Major. Priority: P1. Area: Accessibility (WCAG 2.4.7 / 2.4.11).
- Page: homepage contact form (`/in/`, `/uk/`, `/gcc/`), and the same form on every service page.
- Browser: all.
- Steps: Tab into the form until the "Country" select is focused.
- Expected: a visible focus ring around the flag control.
- Actual: the `<select>` is `opacity: 0` (overlaying the flag), so its focus outline is invisible; a keyboard user has no indication where focus is.
- Evidence: `evidence/drafts/interactions/probe-country-select-focus.png`, probe output `country select focused: {"opacity":"0","outline":"solid"}`.
- Root cause: `components/home/HomeContactForm.tsx` select `className="absolute ... opacity-0"`; a `:focus-visible` ring on the wrapper (`has(:focus-visible)`) is needed.

**BUG-010. Industries selector: the last industry cannot be selected; Next never disables**
- Severity: Major. Priority: P2. Area: Functional.
- Page: `/in/`, `/uk/`, `/gcc/` (Industries).
- Browser: Chromium 1440.
- Steps: click the last side-menu item ("Startups"); or click "Next industry" repeatedly.
- Expected: the clicked item is highlighted and its card shown; Next disables on the last item.
- Actual: clicking item 12 highlights item 11; Next stays enabled at the end; the rail can only scroll to 6,401 of the 6,754 px needed (max 6,432).
- Evidence: `scripts/qa/probe-home.mts` output, `evidence/drafts/interactions/interactions-chromium.md` ("industry next disabled at the end" FAIL and two related).
- Root cause: `useSlider` derives the index from `scrollLeft / itemWidth`; the rail has no trailing padding so the last card can never reach the snap start, and the index rounds to the previous card.

**BUG-011. Structured data and Open Graph missing**
- Severity: Major. Priority: P2. Area: Technical SEO (brief section 10).
- Page: Organization JSON-LD: every page. BreadcrumbList: every inner page. Open Graph: `/in/`, `/uk/`, `/gcc/`, `/about`, `/contact`, `/services`, `/solutions`, `/case-studies`, `/insights`, `/search`, `/thank-you`, legal pages (every route that uses `pageMetadata`).
- Browser: curl.
- Steps: view source; look for `application/ld+json` and `og:` meta tags.
- Expected: Organization on every page, BreadcrumbList on inner pages, `og:title`/`og:description`/`og:image` everywhere.
- Actual: the only JSON-LD on the site is the Event schema on the event page (valid). The homepages have no `og:*` tag at all (`openGraph` is only set when a RegionHome has an `ogImage`, and none has one); service, solution, case-study and event pages do emit OG and Twitter tags.
- Evidence: `evidence/drafts/crawl.md`, per-page `og:` and `JSON-LD` lines.
- Root cause: never implemented (`lib/seo.ts` `pageMetadata` has no `openGraph`; no JSON-LD component).

**BUG-012. Link colour on the placeholder pages fails contrast (3.59:1)**
- Severity: Major. Priority: P2. Area: Accessibility (WCAG 1.4.3).
- Page: `/about`, `/contact`, `/case-studies`, `/solutions`, `/thank-you`, `/insights/events`, the 404 page (every `Placeholder` page with a link list).
- Browser: Chromium 1280 and 390 (axe).
- Steps: run axe.
- Expected: 4.5:1 for 16 px regular text.
- Actual: `.placeholder nav a` uses `blue-500` (#1C85FF) on white, 3.59:1; axe reports "serious" on 3 to 20 nodes per page. The homepages, service template and event page have zero axe violations.
- Evidence: `screenshots/qa-audit/axe/summary.txt` and the per-page JSON files (copied to `evidence/drafts/axe/`).
- Root cause: `app/globals.css` `.placeholder nav a { color: var(--color-blue-500) }`; blue-600 (#1167D8) passes.

**BUG-013. Skip link stops working after a client-side navigation (duplicate `#main`)**
- Severity: Major. Priority: P2. Area: Accessibility.
- Page: any page reached by a client-side navigation, e.g. switch region `/in/` to `/uk/`, or follow any header link.
- Browser: Chromium 1440.
- Steps: on `/in/` switch to UK with the region switcher; press Tab (skip link appears), press Enter.
- Expected: focus lands on the visible `<main>`.
- Actual: `document.getElementById("main")` resolves to the hidden, retained copy of the previous page, so the skip link does nothing visible. After three navigations the DOM holds three `<header>`, three `<main id="main">` and three `<h1>` (hidden with `display:none`).
- Evidence: `evidence/drafts/interactions/interactions-chromium.md` ("skip link still reaches the visible main" FAIL, "DOM holds one header" FAIL), `scripts/qa/probe-switch.mts` output.
- Root cause: Next 16 Cache Components keep up to three routes mounted in hidden `<Activity>` boundaries (documented behaviour, `node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md`), so ids on the page shell are no longer unique. The skip link needs to target the visible main (for example a `useLayoutEffect` that removes the id when hidden, or a click handler that focuses `main:not([hidden])`).

**BUG-014. Unverified "30%" figure and placeholder solution copy are in PUBLISHED rows and reach the public configuration**
- Severity: Major. Priority: P1. Area: Content.
- Page: `/in/`, `/uk/`, `/gcc/`.
- Browser: Chromium 1440, dev server on port 3101 with `PREVIEW_DRAFTS=false`.
- Steps: open a homepage with drafts off; search the page for "30%", "to be confirmed".
- Expected (brief): with `PREVIEW_DRAFTS=false` no DRAFT item may appear: not "100% Satisfied", "Zero Risk", "30%", the draft industries, the draft FAQs or the "500+" stats.
- Actual: each homepage still shows "30%" four times (the hero card "How SAP Treasury improved cash forecasting by 30%", the Top Stories card "Boosting cash forecasting by 30% with SAP Treasury" and its body, and the slider clone) and "Details to be confirmed" twice (A-EYE and AIR-MIND solution cards). The Cloud Services page shows the "TITLE TO BE CONFIRMED" tag on its hero pill. Correctly hidden with drafts off: "100% Satisfied", "Zero Risk", the Outcomes "30%" metric, the draft industries, draft FAQs, the "500+" stats, draft solutions (`/solutions/ai-solution-4` is a 404) and every draft badge.
- Evidence: `evidence/public/crawl.md` (draft strings column), `content/home.ts` line 90 (PUBLISHED HeroSlide "How SAP Treasury improved cash forecasting by 30%"), `content/blocks.ts` line 237 (PUBLISHED `home.topStories` story "Boosting cash forecasting by 30% with SAP Treasury"), `content/solutions.ts` (A-EYE and AIR-MIND are PUBLISHED with placeholder taglines, rendered as "Details to be confirmed").
- Root cause: the brief's rule is implemented for Stat rows (the hero claims and the Outcomes metric are hidden), but the same figure is repeated in free-text rows that have no DRAFT status of their own.

**BUG-015. "Your nearest office" map pin is Bengaluru on all three homepages**
- Severity: Major (visual, against brief section 8). Priority: P3. Area: Visual / content.
- Page: `/uk/`, `/gcc/` (Our Presence).
- Browser: all.
- Steps: open `/uk/`; look at the map highlight versus the "Your nearest office" card.
- Expected: London highlighted on `/uk/`, Dubai on `/gcc/`.
- Actual: the map artwork has the Bengaluru pin baked in on every region; only the card order changes.
- Evidence: `evidence/drafts/figma/home-uk-1440.png`, `home-gcc-1440.png`.
- Root cause: known limitation (design note 28): the designer has not supplied the map as separate layers. Listed again under section 4 for the designer.

### Minor

**BUG-016. Contact-form inputs rely on a border colour change as their only focus indicator**
- Severity: Minor. Priority: P3. Area: Accessibility (WCAG 2.4.11 focus appearance).
- Page: homepage contact form (and the same form on service pages).
- Browser: WebKit and Chromium.
- Steps: Tab into "Full Name".
- Expected: a focus ring at least 2 px thick with 3:1 contrast against the surroundings (the registration form has `focus-visible:ring-2`).
- Actual: `focus:outline-none` with the 1 px border changing from #EDF5F8 to blue-500; visible but thin.
- Evidence: `evidence/drafts/interactions/interactions-webkit.md` ("every tab stop shows a focus indicator" FAIL: four inputs).
- Root cause: `components/home/HomeContactForm.tsx` `inputCls`.

**BUG-017. Logo link hydration mismatch on inner pages**
- Severity: Minor. Priority: P2. Area: Robustness / hydration.
- Page: every global inner page (`/about`, `/services/...`, etc.) with a region cookie set.
- Browser: Chromium 1440.
- Steps: set the region to UK on a homepage, open `/about`, inspect the logo `href` after hydration (or run `next dev` and read the console).
- Expected: `/uk/`, and no hydration warning.
- Actual: the attribute stays `/` (server value): React 19 does not patch attribute mismatches during hydration and never re-renders the unchanged prop. Clicking the logo goes to `/`, which redirects by cookie (one extra hop, full page load instead of a client navigation). The dev server logs the mismatch on every inner page: `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up` (`evidence/public/hydration.md`: `/services/cloud-services`, `/about`, `/contact`, `/solutions`, `/case-studies`, `/insights/events`, pillar pages). The homepages (region known server-side) are clean.
- Evidence: `evidence/drafts/interactions/interactions-chromium.md` ("logo on an inner page links to the cookie region" FAIL: `/`).
- Root cause: `components/nav/LogoLink.tsx` computes `href` from `typeof document` instead of from the hydrated cookie snapshot (`useRegionCookie` already returns `null` during hydration; use it alone).

**BUG-018. `/e-invoicing-uae` redirects in two hops**
- Severity: Minor. Priority: P3. Area: Redirects.
- Page: `/e-invoicing-uae/` (WordPress URL).
- Steps: follow the redirect chain.
- Expected: one 301 to a 200.
- Actual: `301 -> /gcc` then `308 -> /gcc/` then 200. The 11 old-homepage rows (`/home-old` and friends) also take two hops by design (`301 -> /` then `307 -> /<region>/`), which is acceptable because the second hop is the geo decision; the brief should record that exception.
- Evidence: `evidence/drafts/crawl.md`, redirect table (12 rows marked NO).
- Root cause: the redirect loader strips trailing slashes from targets, including the homepages which are canonical with the slash.

**BUG-019. Slider counter wraps onto two lines ("03 /" "03")**
- Severity: Minor. Priority: P3. Area: Visual.
- Page: Top Stories controls on every homepage; hero counter at narrow widths.
- Browser: all widths (seen at 1920, 1440, 1024, 360).
- Evidence: `evidence/drafts/figma/strip-home-in-1440-00.png`, `evidence/drafts/responsive/strip-in-360-1.png`.
- Root cause: `components/ui/SliderControls.tsx` fixes the counter box at `w-12` (48 px) while "03 / 03" in Manrope 16 px needs about 56 px.

**BUG-020. Fast repeated clicks on the sliders lose steps**
- Severity: Minor. Priority: P3. Area: Functional.
- Page: Products & Solutions, Top Stories, hero.
- Steps: click "Next solutions" 15 times quickly.
- Expected: the slider ends on the last card (10 / 10), as it does with slow clicks.
- Actual: ends on 07 / 10; 15 quick "Previous" clicks end on 02 / 10. Slow clicks work.
- Evidence: `evidence/drafts/interactions/interactions-chromium.md`, `scripts/qa/probe-home.mts` ("after 12 slow next clicks: 10 / 10").
- Root cause: `useSlider.goTo` uses the index from the last render while the scroll listener keeps overwriting it mid-animation; a target ref would fix it.

**BUG-021. JSON-LD is injected without escaping `<`**
- Severity: Minor (hardening; becomes Major once the Phase 2 CMS lets editors write titles). Priority: P2. Area: Security.
- Page: `/insights/events/[slug]`.
- Root cause: `JSON.stringify(jsonLd)` into `dangerouslySetInnerHTML`; a title containing `</script>` would break out of the script. Replace `<` with `\u003c` in the serialised JSON.

**BUG-022. Rate limit can be bypassed with a spoofed `X-Forwarded-For` header on a bare origin**
- Severity: Minor. Priority: P3. Area: Security.
- Steps: after being rate-limited, resend the registration with `X-Forwarded-For: 203.0.113.9`.
- Actual: the registration is accepted ("REGISTRATION RECEIVED"). Harmless behind Vercel or CloudFront, which overwrite the header, but it should be documented in `docs/deploy.md` as a deployment requirement.
- Evidence: `evidence/drafts/forms/forms.md`, last INFO line (the script's wording "still applied" is wrong: its regex was case-sensitive; the message shown is the success panel).
- Root cause: `lib/forms.ts` `clientIpHash` trusts the first `x-forwarded-for` value.

**BUG-023. Fourteen pages have no meta description**
- Severity: Minor. Priority: P3. Area: SEO / content.
- Pages: `/services/cloud-services/ai-ml-ops`, five Data & AI sub-services (data-engineering, advanced-analytics, sovereign-ai, responsible-ai, ai-security-governance), `/solutions/arivoo`, `/solutions/a-eye`, `/solutions/air-mind`, `/solutions/ai-solution-4/5/6`, `/case-studies/entry-exit-time-tracker`, `/case-studies/ai-traffic-monitoring`.
- Evidence: `evidence/drafts/crawl.md`, "Desc" column.
- Root cause: those rows have placeholder descriptors/summaries, which `plain()` correctly refuses to use as a description. Content needed (section 4).

**BUG-024. Heading order skips H1 to H3 on pages without an H2**
- Severity: Minor. Priority: P3. Area: Accessibility.
- Page: `/search`, `/privacy-policy`, `/terms-of-use` (crawl "Skips" column), axe moderate on `/search`.
- Root cause: the footer column titles are `<h3>`; pages with no H2 before the footer skip a level. Make the footer titles `<h2>` or non-heading labels.

**BUG-025. Top-bar links are 16 px tall on tablet and phone**
- Severity: Minor. Priority: P3. Area: Accessibility (WCAG 2.5.8 target size, 24 px minimum).
- Page: header top bar ("Call Us", email) at 768 and below.
- Evidence: `evidence/drafts/responsive/responsive.md` small-targets column (`a.inline-flex.min-h-4 "Call Us +44 7768 706988"` 16 px).
- Root cause: `TopBarContacts` uses `min-h-4`; the touch target needs 24 px of padding even if the text stays 14 px.

**BUG-026. Keyboard focus can land on an element that is still invisible for up to 0.9 s**
- Severity: Minor. Priority: P3. Area: Accessibility / motion.
- Steps: load a homepage, let GSAP load (move the mouse), then Tab through the page.
- Actual: 40 of 120 tab stops were at `opacity < 0.1` at the moment of focus (the reveal animation then fades them in over 0.9 s). After 1.5 s every stop was visible, so nothing is permanently hidden; the `focusin` safeguard in `RevealScope` only works before GSAP takes over the inline opacity.
- Evidence: `evidence/drafts/interactions/interactions-chromium.md`, `scripts/qa/probe-home.mts` ("after 90 tabs + 1.5s: minOpacity 1").
- Root cause: `RevealScope` `onFocus` sets the attribute but cannot undo `gsap.set(opacity: 0)`; call `gsap.set(el, {clearProps: "all"})` or play the tween immediately on focus.

**BUG-027. Idle main-thread work from Lenis and ScrollTrigger**
- Severity: Minor. Priority: P3. Area: Performance.
- Actual: with the pointer parked, 10 s of idle costs about 360 ms of script, 600 layouts and 600 style recalcs on the homepage. Most of it is BUG-005; the remainder is the Lenis/ScrollTrigger ticker that runs every frame even when nothing scrolls.
- Evidence: `evidence/drafts/memory.md`.

**BUG-028. next/image warnings on every homepage and the Cloud Services page**
- Severity: Minor. Priority: P3. Area: Robustness / performance.
- Page: `/in/`, `/uk/`, `/gcc/` (Tech Excellence certification badges), `/services/cloud-services` (intro photo).
- Actual (dev console, `evidence/public/hydration.md`): the three certification images (`iso-9001-bsi.webp`, `iso-27001-dqs.webp`, `cmmi`) "have either width or height modified, but not the other", and the Cloud Services intro image "was detected as the Largest Contentful Paint (LCP). Please add the loading=\"eager\" property". Lighthouse confirms the intro photo is the LCP element on that page (LCP 3.2 s).
- Root cause: `components/home/TechExcellence.tsx` sizes the badges with a CSS height only; `components/services/ServiceIntro.tsx` renders the LCP image lazily.

**BUG-029. Duplicate React keys on the contact placeholder page**
- Severity: Minor. Priority: P3. Area: Robustness.
- Page: `/contact`.
- Actual (dev console): `Encountered two children with the same key` twice. The placeholder lists one mailto link per region keyed by `href`, and all three regions share `marketing@adamastech.in` (CONTENT_TODO: one enquiry inbox per region is still a decision), so three list items share one key.
- Evidence: `evidence/public/hydration.md` (`/contact`).
- Root cause: `components/Placeholder.tsx` `key={l.href}`; key by index or label.

**BUG-030. Platform accordion: the expanded text sits inside `<summary>`**
- Severity: Minor. Priority: P3. Area: Accessibility / UX.
- Page: `/services/cloud-services` "Platform expertise".
- Actual: the whole row, including the expanded detail paragraph, is inside `<summary>`, so clicking the text to read or select it collapses the row, and screen readers announce the detail as part of the button. Keyboard and `<details name>` behaviour are otherwise correct.
- Root cause: `components/services/ServicePlatforms.tsx` renders `it.detail` inside the summary span.

### Trivial

**BUG-031. 404 page title is just "AdamasTech Consulting"** (no "Page not found"); description and canonical absent (absent is fine). `app/not-found.tsx` sets no metadata.

**BUG-032. Orphaned last word in "Migration & Modernization, step by step"** (H2 on sub-service pages at 1280 to 1920, "step" alone). `evidence/drafts/responsive/responsive.md`.

**BUG-033. `hreflang="x-default"` on the homepages points at `http://host` without the trailing slash** while the sitemap uses `http://host/`. Harmless but inconsistent (`app/[region]/page.tsx` `"/"` is normalised by `metadataBase`).

**BUG-034. Duplicated paragraphs on the homepages** flagged by the crawl ("How a connected treasury implementation..." and "Discover how Adamas Tech Consulting is leveraging...") are the Top Stories clones (`aria-hidden`) and the same story reused in Client Outcomes; nothing to fix beyond BUG-006.

### Cross-browser notes (WebKit and Firefox interaction passes)

- Firefox (`evidence/drafts/interactions/interactions-firefox.md`): the same real failures as Chromium (BUG-005, BUG-008, BUG-010, BUG-013, BUG-017, BUG-020) and nothing Firefox-specific. A first Firefox run made while the dev server was compiling reported mega-menu timing failures; rerun alone every menu check passed, so those were load artefacts (`interactions-firefox-run1.log` kept for the record).
- WebKit (`interactions-webkit.md`): same real failures, plus keyboard checks that fail because Playwright WebKit follows Safari's default of skipping links on Tab (skip link not reached, drawer focus trap "escapes" to buttons outside). Those are platform behaviour, not site bugs, and were not logged; Safari users reach links with Option+Tab. WebKit additionally surfaced BUG-016 (thin focus indicator on the contact inputs).
- The "presence map artwork loads" failure in all three engines is a script defect (its URL regex), not a site bug: the map responds 200 (127 KB WebP, `curl`).
- The "no-JS tab panel hidden" failures are transient: the measurement caught the active panel's 240 ms CSS fade; the panels are `display: block` and finish at opacity 1 (`scripts/qa/probe-home.mts`).

### Passed checks worth recording

- Mega menus with the mouse: hover intent (closed at 60 ms, open by 320 ms), close delay (open at 80 ms, closed by 400 ms), gap crossing, one panel at a time, zero flicker in 20 samples, click toggles, Enter/Space open, Esc closes and returns focus, focus-out closes, external links `rel="noopener noreferrer"`. Tap opens and closes at 1280 with touch.
- Mobile drawer: opens, body scroll locked, focus moves in, focus trapped over 80 Tabs and 30 Shift+Tabs, Esc closes and returns focus, closes on navigation, region links set the cookie, accordions work (also without JavaScript).
- Region switcher: order India, UK & Ireland, GCC; cookie `region=uk` (SameSite=Lax, one year); client navigation in 69 ms; label, top-bar phone and `lang` follow the region; footer switcher works; bare `/` then follows the cookie. No "Middle East" anywhere.
- Region routing: IN to `/in/`; GB and IE to `/uk/`; AE, SA, QA, KW, BH, OM to `/gcc/`; US, FR and no header to `/uk/` (DEFAULT_REGION); cookie beats country; legacy `region=ae` cookie to `/gcc/`; invalid cookie ignored; query string preserved; `Vary` and `Cache-Control: private, no-store` set; `/ae`, `/ae/`, `/ae/anything?x=1` are single 301s to `/gcc/` (query kept); `/in` 308 to `/in/`; `/services/` 308 to `/services`; `/IN/`, `/xx/`, `/in/extra` are 404s.
- Redirect table: 124 rows, every one lands on a 200; 112 in one hop (see BUG-018 for the 12).
- Links: 0 internal links on any page return 4xx/5xx or take more than one hop (drafts on).
- Forms (63 checks, `evidence/drafts/forms/forms.md`): required fields, email/phone formats, inline validation on blur, consent, `aria-invalid` and `aria-describedby`, `role="alert"` summary on the registration form, honeypot (fake success, nothing stored, excluded from the tab order), double submit (one row), duplicate registration with a different-case email refused, HTML and Unicode (Hindi, Arabic, emoji) stored intact and never executed, 121/5,001/1,001-character inputs rejected with the right messages, rows saved with region, sourcePath and country, `mailedAt` set, both mails logged by the console mailer (the attendee mail carries the `.ics` attachment), closed registration refused by the action, rate limit engages on both forms, no-JS contact submit lands on `/thank-you`, no-JS registration shows the confirmation (`scripts/qa/probe-nojs-register.mts`).
- `.ics`: `text/calendar` attachment, CRLF, VCALENDAR/VEVENT/UID/DTSTAMP/DTSTART/SUMMARY/LOCATION/URL, lines under 75 octets, no DTEND (no confirmed end time), no placeholder brackets in SUMMARY. Structurally valid for Google Calendar and Outlook (both accept METHOD:PUBLISH files without DTEND); a manual import was not possible from this machine.
- Security probes: no `postgresql://`, `figd_`, `REVALIDATE_SECRET` or `.env` values in the 18 client chunks; `/api/revalidate` GET 405, POST without or with a wrong secret 401, malformed JSON 401; `/figma-fixture` 404; `/.env`, `/prisma/schema.prisma`, `/media/..%2Fpackage.json` 404; bogus server action id 400 "Invalid Server Action"; 404 and error pages carry no stack traces; `X-Powered-By` off.
- Robustness: 0 console errors, 0 page errors, 0 hydration errors in production on 76 URLs; 0 broken images; every `<img>` has an `alt` attribute; images keep their aspect ratio at all viewports.
- Reduced motion: no element left hidden, marquee and diagram pulse stopped, hero does not auto-advance (correct). 200 % zoom (640 px): no horizontal overflow on the homepage, Cloud Services or the event page.
- No-JS: all 15 homepage sections, 13 Cloud Services sections, event page, placeholder pages visible; drawer, accordions and region switcher work; both forms submit.
- `npm run typecheck` and `npm run lint`: zero errors, including the new QA scripts (`evidence/build/typecheck.log`, `lint.log`).

---

## 3. Severity definitions

| Severity | Meaning |
| --- | --- |
| Blocker | Site or key flow unusable; data loss; security hole; legal risk |
| Critical | A main feature broken for many users, with no workaround |
| Major | A feature partly broken, a clear visual break, or an accessibility fail |
| Minor | Small visual or behaviour issue, with a workaround |
| Trivial | Cosmetic |

Priority: P1 fix before launch; P2 fix before launch if time allows, otherwise first patch; P3 backlog.

---

## 4. Items that are not bugs

### Missing client content (client, via Swayang)

1. House of Lords event: title, eyebrow, summary, body, end time, agenda, speakers, capacity, imagery. Today the page shows "Title to be confirmed" and three "to be confirmed" agenda rows. Needed before the event can be PUBLISHED (BUG-001/002).
2. Case-study clearance: all 20 case studies are DRAFT; the homepages link to four of them.
3. The "30 %" cash-forecasting figure, "100 % Satisfied" and "Zero Risk" (hero claims) need verification or replacement.
4. Meta descriptions for the 14 pages in BUG-023.
5. Real figures for the four "500+" Cloud Services stat cards (DRAFT today).
6. A-EYE and AIR-MIND: product taglines and details ("Details to be confirmed" shows today even though the rows are PUBLISHED).
7. Industry copy: 8 of 12 industries are DRAFT ("Details to be confirmed" in preview).
8. FAQ answers: 9 of 10 Cloud Services FAQs are DRAFT.
9. Spelling: the client copy uses American spellings on inner pages ("modernization" x17, "optimize/optimized" x19, "organization(s)" x4, "behavior" x3, "analyze" x3, "Center" x2, "Customized"). The brief asks for British English on inner pages but also says not to rewrite the client's copy, and the sitemap itself names "Migration & Modernization". Decision needed: convert spellings (except product/sitemap names) or keep.
10. Contact page content: `/contact` is a placeholder (no form, three mailto links). The "Talk to an expert" CTA everywhere points at it.

### Design questions for Mithu

1. World map: separate layers (pins, arcs, labels) are needed so the nearest office can be highlighted per region and animated in Phase 3 (BUG-015).
2. Latest Perspectives uses the same eyebrow "TOP STORIES" as the Top Stories section (as in Figma). Intended?
3. Mega-menu panel is frosted white (round 7 decision) instead of Figma's #CCCDCF: the 78.8 % panel match is this difference.
4. FAQ rows use 13 px questions and 12 px answers (Figma values). Confirm they are intended at these sizes; they are the smallest text on the site.
5. Placeholder pages (About, Contact, Case studies, Solutions, Insights, legal, 404) have no Figma frames yet; the link colour will be changed to blue-600 for contrast (BUG-012) unless a design arrives first.

### Decisions for Swayang

1. Preview protection: restore Basic Auth in `proxy.ts` (BUG-004) or document reliance on Vercel Deployment Protection.
2. Security headers: agree a CSP policy for Phase 2 (script sources: self plus the `next/script` inline flag; `frame-ancestors 'none'`). An initial header set without CSP can ship immediately.
3. Build safety: should the events route (and any list that can be empty) opt out of static generation when there are no visible rows, so content status can never break a build (BUG-001)?
4. DRAFT case-study links: hide the linking cards, point them at `/case-studies`, or publish the four featured studies (BUG-002).
5. Old WordPress homepage redirects (`/home-old` etc.) resolve in two hops via `/` on purpose; accept or point them at `DEFAULT_REGION` directly (BUG-018).
6. Next 16 keeps up to three routes mounted and hidden during client navigation. It is documented behaviour, but it triples the DOM after a few clicks and breaks id-based skip links (BUG-013). Accept with the skip-link fix, or disable via the Fragment-key pattern in the docs.
7. Phase 3 motion: the hero progress bar and the Top Stories clones must be rebuilt before GSAP timelines are added on top of them (BUG-005, BUG-006).

---

## 5. Evidence index

| Path | Content |
|---|---|
| `evidence/build/build-PREVIEW_DRAFTS-false.log` | failed public build (BUG-001) |
| `evidence/build/build-PREVIEW_DRAFTS-true.log` | successful preview build, route table |
| `evidence/build/server-3100.log` | production server log including the console-mailer output for every form test |
| `evidence/build/typecheck.log`, `lint.log` | `tsc --noEmit`, `eslint` |
| `evidence/drafts/crawl.md`, `crawl.json` | 76 URLs: status, head tags, JSON-LD, landmarks, images, links, console; link check; 124 redirects; region routing; security probes; robots |
| `evidence/drafts/responsive/responsive.md`, `responsive.json`, `chromium/*.png`, `firefox/*.png`, `webkit/*.png` | 11 pages x 9 viewports (Chromium) and 3 viewports (Firefox, WebKit) with full-page captures |
| `evidence/drafts/interactions/interactions-{chromium,webkit,firefox}.md` and `*.png` (the Firefox file is the run log: the script timed out in its last no-JS drawer step after 133 passes) | menus, drawer, switcher, sliders, tabs, industries, keyboard, reduced motion, zoom, no-JS |
| `evidence/drafts/forms/forms.md`, `*.png`, `house-of-lords-2026.ics` | 63 form checks, screenshots, the calendar file |
| `evidence/drafts/memory.md` | 21 navigations, heap, nodes, listeners, idle script |
| `evidence/drafts/lighthouse/lighthouse.md`, `*-run{1,2,3}.json` | mobile Lighthouse, medians and contributors |
| `evidence/drafts/figma/` | Cloud Services section comparison (Figma, build, diff), 1920 and 1440 full pages, mega menu at 1440, strips used for the visual review |
| `screenshots/qa-audit/compare/` | homepage section comparison at 1920 (`results.txt`) |
| `evidence/drafts/axe/` | axe JSON per page and `summary.txt` |
| `evidence/public/` | public configuration (`PREVIEW_DRAFTS=false`) checks on the dev server: draft leaks, dead links, hydration warnings |

Note on the captures: `responsive.mts`, `compare-cloud.mts` and `scripts/compare-figma.mts` force the reveal state (`data-revealed` plus `transform:none`) before capturing, which also moves the Top Stories rail to "03 / 03" in those images; that position is a capture artefact (see BUG-006), the blank third slide is not.

Scripts: `scripts/qa/crawl.mts`, `responsive.mts`, `interactions.mts`, `forms.mts`, `memory.mts`, `compare-cloud.mts`, `lighthouse.mjs`, plus the probes (`probe-*.mts`) used to confirm individual bugs. All run with `PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/qa/<name>.mts http://localhost:3100 <label>`.
