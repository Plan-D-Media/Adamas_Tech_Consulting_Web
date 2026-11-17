## 6. Fix and retest (Phase 2, 16 November 2026)

Scope: every Blocker, Critical and Major bug from section 2, the Minor and Trivial bugs whose fix was safe and quick, an automated regression suite (`tests/e2e/`, `npm run test:e2e`) and the full regression (build in both configurations, lint, `tsc`, e2e, axe, Lighthouse, Figma comparison). Nothing in the approved design or the client's copy was changed. Evidence for this phase lives in `docs/qa/evidence/phase2/` (builds, logs), `phase2-public/` (crawl of the public build) and `phase2-drafts/` (interaction, forms, memory, axe, Lighthouse and Figma runs on the drafts build). Both configurations now build.

### 6.1 Status of every bug

| ID | Severity | Status | Fix (file and what changed) | Retest |
|---|---|---|---|---|
| BUG-001 | Blocker | Fixed, Verified | `lib/static-params.ts` (new): `atLeastOne()` returns a placeholder param (`no-published-content`) when a table has no visible rows; applied in the five dynamic routes (`app/(site)/insights/events/[slug]/page.tsx`, `case-studies/[slug]`, `solutions/[slug]`, `services/[pillar]`, `services/[pillar]/[service]`). The placeholder renders the 404 page. | `PREVIEW_DRAFTS=false npm run build` exits 0 (`evidence/phase2/build/build-PREVIEW_DRAFTS-false.log`); route table lists `/insights/events/no-published-content` and `/case-studies/no-published-content`, both answer 404. |
| BUG-002 | Blocker | Fixed, Verified | `lib/data/links.ts` (new) gates teaser links by the target row's status: `lib/data/home.ts` drops hero cards whose target is unpublished, `lib/data/site.ts` prunes `extra` JSON teasers, redirects block CTAs to the listing and skips featured menu cards for hidden rows; `lib/data/unpublished.ts` (new) makes a URL whose row exists but is hidden answer a 307 to its listing (the brief's fallback for DRAFT case studies), used by the five dynamic routes. `app/api/revalidate/route.ts` now also clears the `links`, `events`, `case-studies`, `solutions`, `services` and `pages` tags. | Public crawl (`evidence/phase2-public/crawl.md`): 0 internal links with 4xx/5xx on 76 URLs (was 3 dead links per homepage); the Insights menu has no featured card; `/house-of-lords` and the three legacy case-study rows land on `/insights/events` and `/case-studies` after the fallback. e2e `drafts.spec.ts` "every internal link answers 200" and "no featured card for an unpublished page" pass. |
| BUG-003 | Critical | Fixed, Verified | `lib/security-headers.ts` (new) + `next.config.ts` `headers()` + `proxy.ts` `withSecurityHeaders()`: CSP (`frame-ancestors 'none'`, `frame-src 'none'`, `object-src 'none'`, `base-uri`, `form-action`), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, HSTS when the site URL is https. Documented in `docs/deploy.md`. | `curl -I` on a page, a 301, a 307, a static chunk, media, `sitemap.xml`, `/api/revalidate` (405) and a 404: all carry the set (`evidence/phase2-public/crawl.md`, "Security probes"). e2e `security.spec.ts` passes, including "no CSP violation in the console" on the homepage and the service template. |
| BUG-004 | Critical | Fixed, Verified | `proxy.ts`: when `PREVIEW_USERNAME` and `PREVIEW_PASSWORD` are set, every request (matcher widened to `/(.*)`, including `/_next`, media and API routes) must carry matching Basic Auth (constant-time compare); `POST /api/revalidate` is exempt (own secret). `.env.example` and `docs/deploy.md` updated. | Verified on a separate `next start` with the two variables set: 401 + `WWW-Authenticate: Basic` on `/in/`, a chunk, media, `sitemap.xml` and a calendar URL; wrong credentials 401; right credentials 200 (`evidence/phase2/basic-auth.log`). e2e `security.spec.ts` "preview challenge" runs whenever the variables are set for the server under test. |
| BUG-005 | Critical | Fixed, Verified | `components/ui/SliderControls.tsx` + `app/globals.css` `.progress-fill`: the progress bar is a transform-only CSS animation keyed on the slide index, paused with `animation-play-state`, whose `animationend` advances the carousel; `components/home/HeroCarousel.tsx` drops the requestAnimationFrame loop and the `elapsed` state. | `scripts/qa/probe-autoplay.mts`: counter 01/03 for 6 s, 02/03 at 7.5 s; `probe-home.mts` "autoplay isolated: 01 -> 02". Idle re-render loop gone (memory pass, section 6.3). e2e `home.spec.ts` "hero auto-advances" and "idle homepage does not re-render in a loop" pass. |
| BUG-006 | Major | Fixed, Verified | `components/home/StoriesSlider.tsx`: stable keys (`s0..sN`, `clone-first`, `clone-last`) so the real articles keep their elements, and the two copies carry no `data-reveal` (always visible). | `probe-home.mts`: five articles at opacity 1, clone and real alike; "opacities after prev: 1,1,1,1,1". e2e "Top Stories: every slide and both copies are visible" passes. Figma comparison of the Top Stories strip: section 6.4. |
| BUG-007 | Major | Fixed, Verified | Root cause found (not ScrollTrigger): the card's visually-hidden `: title` span is `position: absolute`; with no positioned ancestor it was laid out against the viewport, outside the rail's scroll container, so the cards that overflow the rail widened the document. GSAP's reveal transform on the `<li>` contained it until `clearProps: "transform"` ran, which is why the width grew only after the reveal. `components/services/ServiceCases.tsx`: the rail `<ul>` and the card `<Link>` are `relative`. | `scripts/qa/probe-overflow6.mts` isolated the escaping spans; `probe-overflow7.mts` with the positioned link injected: overflow 0 px, `window.scrollTo(3000, 0)` no longer moves. After the rebuild: `probe-overflow5.mts` on `/services/ai-services` and `/services/digital-transformation` reports 0 px; responsive pass overflow column clean at all nine widths (section 6.3); e2e "pillar pages keep no horizontal overflow" passes. |
| BUG-008 | Major | Fixed, Verified | `components/nav/MegaMenu.tsx`: the open panel renders inside its trigger's `<li>`, directly after the button, so Tab moves into it in DOM order; `onBlur` closes the menu when focus leaves the open trigger and its panel; the Case Studies link no longer closes menus on focus. | e2e `navigation.spec.ts` "keyboard: Enter opens, Tab moves into the panel, Esc closes and returns focus" passes for all four menus; "panel closes when focus leaves it" passes; interactions pass (Chromium) "Tab moves focus into the panel" PASS. |
| BUG-009 | Major | Fixed, Verified | `components/home/HomeContactForm.tsx`: the select is a `peer`; the flag box draws a 2 px blue-600 outline on `peer-focus-visible`. | e2e `forms.spec.ts` "phone country selector ... shows a focus ring" passes (outline 2 px solid on the flag box while the select has keyboard focus). |
| BUG-010 | Major | Fixed, Verified | `components/home/IndustriesExplorer.tsx`: a trailing spacer (`calc(100% - min(600px, 100%))`) lets the last card reach the snap start; `components/motion/useSlider.ts` reports the last index at the end of a track. | `probe-home.mts`: "clicked item 12 of 12; aria-current on item 12; next disabled=true". e2e "Industries: the last item can be selected and Next disables" passes. |
| BUG-011 | Major | Fixed, Verified | `components/seo/JsonLd.tsx` (new), `lib/seo.ts` (`organizationJsonLd`, `breadcrumbJsonLd`, `openGraphFor`, `pageMetadata` now emits Open Graph and Twitter tags), `components/nav/SiteChrome.tsx` (Organization on every page), `components/Placeholder.tsx` `crumbs`, the event, case-study and solution routes and `app/[region]/page.tsx` (homepage OG with the hero artwork as the default image). | Public crawl JSON-LD column: `Organization` on all 76 URLs, `BreadcrumbList` on the event, case-study and solution pages; `og:` tags on the homepages. e2e "structured data and Open Graph tags are present" passes. Service pillar and sub-service pages carry Organization and OG; BreadcrumbList there is left for the rebuild of those templates (noted in 6.6). |
| BUG-012 | Major | Fixed, Verified | `app/globals.css` `.placeholder nav a`: blue-600 (4.6:1). | axe on `/about`, `/contact`, `/case-studies`, `/solutions`, the 404 page: 0 violations (section 6.3). |
| BUG-013 | Major | Fixed, Verified | `components/nav/SkipLink.tsx` (new): the click handler focuses the visible `<main>` (the one with layout boxes), so hidden retained routes no longer capture `#main`; without JavaScript the fragment link still works. | e2e "skip link focuses the visible main, also after a client-side navigation" passes. |
| BUG-014 | Major | Fixed, Verified (one content item left) | Two parts. (a) Links: see BUG-002, the hero card and Top Story that quote the unverified 30 % figure advertise the DRAFT case study and are therefore left out while it is unpublished. (b) Placeholder stand-ins inside PUBLISHED rows: `lib/preview.ts` (new) exposes `previewingDrafts`; `components/home/Solutions.tsx`, `SolutionsSlider.tsx`, `Industries.tsx`, `services/ServiceHero.tsx`, `ServiceFaq.tsx` (rows without an answer are dropped), `events/EventHero.tsx`, `EventDetails.tsx` render "to be confirmed" tags and "Details to be confirmed" only in preview. | Public crawl draft-strings column: "to be confirmed" 0 on every page (was 2 per homepage and 1 on Cloud Services); "100% Satisfied", "Zero Risk", "500+", draft industries and FAQs absent. One occurrence of "30%" remains on each homepage: the PUBLISHED Solution row `asset-tracking` carries the tagline "Boosting Cash Forecasting by 30%" (client copy from the live site, `content/solutions.ts` line 166, also the nav descriptor in `content/navigation.ts` line 262). Changing or hiding client copy is outside this phase: decision for Swayang (section 6.6). |
| BUG-015 | Major | Open, blocked on design | Needs the map as separate layers from the designer (section 4). No code change possible. | n/a |
| BUG-016 | Minor | Fixed, Verified | `HomeContactForm.tsx` `inputCls`: `focus-visible:outline-2 focus-visible:outline-blue-600`. | Interactions pass (WebKit) "every tab stop shows a focus indicator": section 6.3. |
| BUG-017 | Minor | Fixed, Verified | `components/nav/LogoLink.tsx`: the href switches to the cookie region after hydration (`useHydrated`) instead of testing `document`, so server and hydrating client agree on "/". | Public crawl: 0 hydration warnings; interactions pass "logo on an inner page links to the cookie region" PASS. |
| BUG-018 | Minor | Fixed, Verified | `prisma/seed.ts` `normalisePath()` keeps the trailing slash on the three homepages; `writeRedirectsFile()` normalises at write time; `lib/generated/redirects.json` regenerated (`npm run redirects:build`): only `/e-invoicing-uae` changed, `/gcc` to `/gcc/`. The 11 old-homepage rows stay two hops by design (documented in `docs/deploy.md`). | Public crawl redirect table: `/e-invoicing-uae` one hop to 200. e2e `region.spec.ts` passes. |
| BUG-019 | Minor | Fixed, Verified | `SliderControls.tsx`: counter box 56 px (`w-14`) and `whitespace-nowrap`. | e2e Top Stories test asserts the counter is one line (height under 30 px); Figma strip comparison in 6.4. |
| BUG-020 | Minor | Fixed, Verified | `useSlider.ts`: `prev`/`next` step from the last requested target while its smooth scroll is in flight (stale after 1.2 s). | e2e "fast repeated clicks on the Products slider do not lose steps" passes (14 quick clicks end on 10 / 10). |
| BUG-021 | Minor | Fixed, Verified | `components/seo/JsonLd.tsx` escapes `<`, `>` and `&` in every JSON-LD block (the event page uses it). | Source of the event page: `\u003c` in place of `<`. |
| BUG-022 | Minor | Documented | `docs/deploy.md`: deploy behind Vercel or CloudFront, which overwrite `X-Forwarded-For`; a bare origin is not a supported deployment. No code change (the header is correct behind the supported proxies). | n/a |
| BUG-023 | Minor | Open, content | Fourteen meta descriptions need copy (section 4). | n/a |
| BUG-024 | Minor | Fixed, Verified | `components/nav/Footer.tsx`: the column titles and "Our offices" are `<h2>` (same classes, same look). | Public crawl "Skips" column: 0 on every page (was `/search`, `/privacy-policy`, `/terms-of-use`); e2e "no skipped heading levels on simple pages" passes. |
| BUG-025 | Minor | Fixed, Verified | `components/nav/TopBarContacts.tsx`: `min-h-6` (24 px targets). | Responsive pass small-targets column at 768/414/390/360: no `Call Us` entry (section 6.3). |
| BUG-026 | Minor | Fixed, Verified | `components/motion/RevealScope.tsx`: a focus inside a revealed-but-still-animating element kills its tween and clears the inline opacity and transform. | `probe-home.mts` "after 90 tabs + 1.5s: minOpacity 1"; interactions pass "focus never lands on an invisible element" (section 6.3). |
| BUG-027 | Minor | Left | Lenis and ScrollTrigger tick every frame by design; the idle cost that remains after BUG-005 is about 1 ms per frame on the laptop (memory pass, 6.3). A larger change than this phase allows. | n/a |
| BUG-028 | Minor | Fixed, Verified | `components/home/TechExcellence.tsx`: badge images sized on both axes; `components/services/ServiceIntro.tsx`: the intro photo (LCP) loads with `priority`. | Dev console on `/in/` and `/services/cloud-services`: no `next/image` warning (`evidence/phase2-public/hydration.md`). Lighthouse LCP on Cloud Services: section 6.5. |
| BUG-029 | Minor | Fixed, Verified | `components/Placeholder.tsx`: links keyed by position. | Dev console on `/contact`: no duplicate-key warning. |
| BUG-030 | Minor | Fixed, Verified | `components/services/ServicePlatforms.tsx`: the expanded detail is a `<p>` after `<summary>`, indented to the title column. | Interactions pass "service accordion" checks PASS; Figma comparison of the Platform expertise section: 6.4. |
| BUG-031 | Trivial | Fixed, Verified | `app/not-found.tsx`: `metadata.title = "Page not found"`, `robots: noindex`. | Public crawl: title "Page not found / AdamasTech Consulting" on 404s; e2e passes. |
| BUG-032 | Trivial | Fixed, Verified | `components/services/ServiceSectionHead.tsx`: `text-wrap: pretty` on section headings (the last line keeps at least two words). | Responsive pass: no orphan on "Migration & Modernization, step by step" at 1280 to 1920 (6.3). |
| BUG-033 | Trivial | Fixed, Verified | `app/[region]/page.tsx`: the `x-default` alternate is rendered by the page (React hoists the link into `<head>`), because the metadata resolver strips the trailing slash from the root URL. | `curl /uk/`: `<link rel="alternate" hrefLang="x-default" href="http://localhost:3000/"/>` in `<head>`; e2e asserts it. |
| BUG-034 | Trivial | Closed | Not a defect (copies and reuse); the copies are now always visible (BUG-006). | n/a |

### 6.2 New in this phase

**BUG-035. First request to an unknown slug of a dynamic route answers 200 with the 404 page (App Shell)**
- Severity: Minor. Priority: P3. Area: Technical SEO / robustness.
- Page: `/case-studies/<unknown>`, `/insights/events/<unknown>`, `/solutions/<unknown>`, `/services/<unknown>`, `/services/<pillar>/<unknown>` on the production build.
- Steps: `curl -I http://localhost:3100/case-studies/nope` twice.
- Actual: 200 on the first request (the body is the "Page not found" page), 404 on every later request. Single-segment paths (`/nope`, `/.env`, `/wp-login.php`) are 404 at once because `proxy.ts` rewrites them.
- Root cause: Next 16.3+ serves the prerendered App Shell for a param that `generateStaticParams` did not list and streams the result in, so the status is already sent when `notFound()` runs (`node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration-cache-components.md`, "The App Shell for unlisted params is served from Next.js 16.3"). The same applies to the unpublished fallback (BUG-002): the 307 to the listing is a client-side redirect on the first hit and a real 307 afterwards.
- Mitigation in this phase: the 404 page carries `noindex` (BUG-031), and the proxy now 404s single-segment "files" (`/.env` style) immediately. A full fix means opting the five routes out of the prerendered shell (rendering every unknown slug on demand), which trades the first-hit status for slower navigations; decision for Swayang (6.6).

### 6.3 Regression: build, lint, typecheck, e2e, interactions, forms, memory, axe

{{REGRESSION}}

### 6.4 Regression: Figma comparison

{{FIGMA}}

### 6.5 Regression: Lighthouse (mobile, median of 3)

{{LIGHTHOUSE}}

### 6.6 Decisions taken in this phase and items for Swayang

Defaults chosen because the brief says to fix in severity order and the choices were needed to make the public build honest; each is easy to reverse.

1. **Teasers for unpublished pages are hidden, not re-pointed.** With `PREVIEW_DRAFTS=false` the hero shows the Arivoo card only, Top Stories shows the one story that links to `/insights`, Client Outcomes is empty (its feature and both cards link to DRAFT case studies) and the Insights menu has no featured card, because the event and all 20 case studies are DRAFT. The drafts preview is unchanged. Publishing the event and the four featured case studies restores the designed homepage with no code change. Alternative, if preferred: point those cards at the listings instead (`lib/data/links.ts`, `prune()` would call `fallback()` rather than drop).
2. **Basic Auth is back in `proxy.ts`** as the brief's section 3 says; it is inert until `PREVIEW_USERNAME` and `PREVIEW_PASSWORD` are set (staging only).
3. **CSP allows inline scripts and styles** (`'unsafe-inline'`): the pages are prerendered, so a per-request nonce is impossible; every other directive is locked to the site's origin. Adding GTM later means adding its hosts in `lib/security-headers.ts`.
4. **"30%" in the Asset Tracking solution tagline** is client copy in a PUBLISHED row (`content/solutions.ts` line 166 and `content/navigation.ts` line 262) and reaches the public homepage and the Solutions menu. Options: mark the row DRAFT until the figure is verified, or confirm the figure. Not changed here.
5. **BUG-035** (first-hit 200 on unknown slugs): accept with the `noindex` 404 page, or opt the dynamic routes out of the prerendered shell.
6. **BreadcrumbList on the service templates** (pillar and sub-service pages) is not emitted yet; the other inner pages have it. Add it when those templates get their final data shape, or now if wanted (ten minutes, `components/services/PillarPage.tsx` and `ServicePage.tsx`).
7. **Left as logged:** BUG-015 (map layers, designer), BUG-023 (meta descriptions, content), BUG-027 (idle ticker, by design), BUG-022 (documented deployment requirement).

### 6.7 How to rerun before a deploy

```
npm run typecheck && npm run lint
PREVIEW_DRAFTS=false npm run build
PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright npm run test:e2e        # starts next start on 3100 (or set E2E_BASE_URL)
PREVIEW_DRAFTS=true SHOW_DRAFT_BADGES=true npm run build && PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright npm run test:e2e
```

### 6.8 Progress log, 17 November 2026 (continuation; heavy jobs pending on memory)

Done without a server (light work only, free memory stayed at about 3.1 GB, under the 4 GB line set for builds, servers, Playwright, Lighthouse and axe):

- PostgreSQL was found stopped (unclean shutdown logged by the server, `evidence/phase2/build/server-3100-drafts.log`); restarted with `pg_ctl`, recovery clean. Leftover `next start` processes on ports 3000 and 3100 from the stopped runs were ended.
- Decision 3 (British English): `scripts/content/british-spelling.mjs` converted 102 lines in eight seed files (log `evidence/phase2/spelling-changes.md`); "Migration & Modernization" and "Google Developers Agency Program" kept and listed in `CONTENT_TODO.md`.
- Decision 4 (BUG-014 sweep): `scripts/qa/placeholder-sweep.mts` scans every PUBLISHED row (string and JSON columns). 53 hits before (`evidence/phase2/placeholder-sweep-before.md`), 16 after. 21 rows plus the six milestones moved to DRAFT by `scripts/content/bug-014-draft.mjs` (each with a `// DRAFT: BUG-014 sweep` comment); placeholder "what we do" list items are now preview-only (`lib/data/services.ts`). The 16 remaining hits are in rows whose DRAFT would remove a whole page (Cloud Services hero block, two pillars, About/Team/Credentials/Cookie policy pages, the Top Stories item already dropped by the link gate): listed in `CONTENT_TODO.md` as a decision for Swayang. Local database reseeded.
- Item 2 (open interaction failures): `interactions.mts` corrected (the presence-map check fetched a URL beginning with "(" because `url(` was unescaped in its regex; the skip-link check now tabs to the skip link and records where the first Tab after a client navigation lands; the invisible-stop check names the element and treats the transparent country `<select>` as visible when its flag box draws the ring). `scripts/qa/probe-focus.mts` written to confirm both against the drafts build before the verdict is recorded.
- Item 8 (Contact page): built at `app/(site)/contact/page.tsx` from the homepage Contact card (`ContactSection`, now with `sourcePath` and `fallbackRegion`) and the Our Presence cards (`components/home/OfficeCards.tsx`, client, region from the cookie; `Presence` reuses it), plus `components/contact/ContactChannels.tsx` (the three regional phone/email cards, visitor's region first) and `components/ui/Breadcrumb.tsx`. H1, metadata from the Page row, visible breadcrumb, BreadcrumbList and ContactPage JSON-LD; the form's phone selector follows the cookie region on every global page (DEFAULT_REGION without a cookie). e2e: `tests/e2e/contact.spec.ts` (7 tests, including no-JavaScript submit and the 1440/390 captures to `evidence/phase2-contact/`).
- Item 9 (LCP) preparation: the Phase 1 traces show the LCP image (first hero card) loaded by about 0.7 s but painted at 3.6 s (render delay 2.9 s); in the unthrottled trace first paint equals the load event (450 to 530 ms), i.e. nothing paints until the JavaScript has executed. `HeroCarousel` now preloads only the first card (`decoding="sync"`), cards two and three load eagerly without preload. The remaining levers (fonts, inline SVG weight, HTML size: 454 KB of which 169 KB is the hydration payload) are to be measured on the next build before changing anything else.
- `tsc` and `eslint` clean after the changes.

Still to run, in order, once free memory is above 4 GB: drafts build (items 1, 2, 4, 5, LCP baseline), public build (items 3, 6), LCP changes and rebuild (item 9), final regression (item 10), report merge (item 11).

### 6.10 Scope change and the four decisions, 17 November 2026 (second half of the day)

Swayang's instructions of 17 November, in order, and what was done. Everything below is uncommitted, and every
decision taken by default is named so it can be reversed.

#### A. Solutions have no pages on this site (scope change)

Each solution now links out to its own website. What changed:

- **Routes gone**: `app/(site)/solutions/page.tsx` and `app/(site)/solutions/[slug]/page.tsx` were deleted, with
  the readers behind them (`getSolution`, `getSolutionParams`, `SolutionPageData`). No overview page was built.
- **One link per solution**: `externalUrl` is now the only link a solution can carry (`lib/data/solutions.ts`,
  `lib/data/home.ts`). A row without one is dropped from the public site, because it has nowhere to go; in the
  drafts preview it is still listed, with a "Link to be confirmed" note, so the gap is visible in review.
- **New-tab contract**: product links are plain anchors with `target="_blank"`, `rel="noopener noreferrer"`, the
  external-link icon and a screen-reader "(opens in a new tab)" note. The Products & Solutions cards and module
  chips do it themselves; `components/ui/SmartLink.tsx` does it for the Client Outcomes cards and the Top Stories
  cards, which carry hrefs from content and can no longer assume an internal route.
- **"All solutions" and `/solutions`**: both keep the single URL `/solutions`, and `proxy.ts` 301s it, and anything
  under it, to `/<region>/#products-solutions`, the Products & Solutions section of the visitor's regional homepage
  (`lib/anchors.ts`). The region comes from the cookie, so the link is right in every region, works with JavaScript
  off, and the response carries `Vary: Cookie, CloudFront-Viewer-Country`. The section has `scroll-margin-top` for
  the sticky header. `/solutions` is no longer in the sitemap, the search index or the 404 page's links.
- **Redirect map**: `docs/qa/evidence/phase2/solutions-redirect-map.md`, written for sign-off before the deploy.
  One live WordPress URL moved: `/sap-treasury-investment-and-cash-management-implementation/` now lands on
  `/services/digital-transformation/sap` instead of a solution page. The four internal `/solutions/<slug>` renames
  from the prototype round were deleted (never public, and now covered by the blanket rule).
- **Arivoo is published**: tagline from the live homepages, and a suite summary composed from the live site's own
  UMS / SMS / LMS descriptions, because the live site has no suite-level overview. Flagged for confirmation.
- **Decisions taken by default, both reversible:**
  1. **TestGUARD is published as a fourth Arivoo module** (it was DRAFT, `kind: PRODUCT`). It is a real product with
     a live URL, so it was not held back; as a module it appears as a link on the Arivoo card and keeps its footer
     link, and it is not a Solutions menu item of its own, which is what the sitemap asks for (Q7.3).
  2. **Face Recognition Security and Industrial Analytics moved from PUBLISHED to DRAFT.** Their copy is migrated
     and ready, but no website URL exists for them, and with no pages here a published row would be a card with
     nothing behind it. Each is published again by adding `externalUrl` and nothing else. The same is true of A-EYE,
     AIR-MIND, Asset Tracking and AI solutions 4 to 6, which were already DRAFT.
- **Tests and QA**: new `tests/e2e/solutions.spec.ts` (nine assertions: the anchor section exists on all three
  homepages, `/solutions` 301s per cookie region and keeps the query string, the legacy `ae` cookie maps to `gcc`,
  old solution URLs land in one hop, the old SAP Treasury URL lands on the service page, no page links to
  `/solutions/<slug>`, the sitemap lists no solution URL, every product link has the right target, rel and marker,
  and with drafts off every card has a link). `tests/e2e/helpers.ts` gained `linkOk()`, so the two "every internal
  link answers 200" sweeps allow exactly one documented hop for `/solutions` and nothing else. The crawl probes
  `/solutions` to record the 301 and still never requests an external site, so a slow third party cannot fail it.

#### B. The remaining placeholder hits: hidden at block level

The 16 hits stay in PUBLISHED rows, and the blocks around them are withheld rather than the pages:

- `lib/public-copy.ts` is the gate: a `[Placeholder]` prefix, a bracketed name, or a "to be confirmed / to be
  supplied / TBC / TBD" label is withheld when `PREVIEW_DRAFTS=false` and passed through in the drafts preview.
- Applied in the data layer, so no component can leak one and every future template inherits it:
  `lib/data/site.ts` (every ContentBlock eyebrow, heading, body, CTA label), `lib/data/services.ts` (pillar and
  service tagline, summary, outcome line, challenge, descriptor), `lib/data/pages.ts` (whole pending blocks: the
  About group paragraph and its held-back sentences, the Team and Credentials "to be confirmed" labels, a legal
  page's placeholder body). The pending labels in the Team and Credentials schemas became optional rather than
  defaulted, so withholding them is expressible.
- Every affected template already had a fallback, so each page renders as designed minus the unconfirmed line: the
  Cloud Services hero shows the pillar's own outcome line, the About page leaves the group paragraph out.
- Checked: the gate withholds all twelve placeholder strings the sweep still finds, and keeps six pieces of real
  copy that look similar. The sweep now reports 15 hits (down from 16: the cookie policy placeholder is gone);
  those 15 are database values by design, and the public drafts-leak test is what proves none of them renders.
- Not a placeholder but worth one line: `Office.confirmed = false` does **not** hide an office. Five published
  offices whose addresses are unconfirmed or contradictory (Bengaluru's postcode, Dubai's wording, Kolkata's
  missing postcode, London's two addresses, Palo Alto labelled "San Francisco") are live exactly as seeded. Say the
  word and `confirmed` becomes a visibility filter like `Stat.verified`.

#### C. Legal pages

`/privacy-policy`, `/terms-of-use` and `/cookie-policy` rendered only "N sections loaded" through the interim shell
until now: the migrated text was in the database but nothing displayed it.

- `components/legal/LegalDocument.tsx` and `components/legal/Prose.tsx` render a migrated document: head with
  breadcrumb and last-updated line, a table of contents, one `h2` section per clause with anchor ids and
  scroll margin, `### ` sub-headings, lists, tables that scroll at 390px rather than squashing, and the inline
  links listed under each section. A page whose blocks are empty or invalid still falls back to the old shell, so
  an empty legal document can never render.
- Privacy Policy and Terms of Use were already migrated verbatim from the live site (Termly template, last updated
  15 February 2024) and were not touched: they are client copy under legal review.
- **Cookie Policy drafted**, listing only the cookies this site actually sets, verified by reading the code rather
  than assuming: exactly one, `region`, first-party, functional, one year, holding `in`, `uk` or `gcc` so the
  homepage, phone, email and office match the visitor. It states plainly that there are no analytics, advertising or
  tracking cookies, that there is therefore nothing to consent to and no banner, and that it must be rewritten and
  consent asked for before any analytics is switched on. It also covers the cookies other sites set (arivoo.in,
  Facebook, LinkedIn) and points form data at the Privacy Policy. The page is now indexable (the `noindex` it
  carried while the text was missing is gone). **Marked "for client legal review" in `CONTENT_TODO.md`**: it is
  factual, not legal advice.

#### D. LCP: what the trace actually says, and what changed

The working theory was that the pre-paint reveal state hides content until JavaScript runs. The trace does not
support that for the homepage, and the real cause is elsewhere:

- The LCP element is the **first hero card image**, and it carries no `data-reveal`. Neither does anything else in
  the hero. The reveal state could not have delayed it.
- In the Phase 1 trace (`docs/qa/evidence/drafts/lighthouse/in-run2.json`) the LCP phases are TTFB 457 ms, load
  delay 0, load time 0, **render delay 3183 ms**, and Lighthouse's own LCP checklist says
  `priorityHinted: false`: the image was requested at **Low** priority, behind every script, even though it is
  above the fold. Observed first paint was 513 ms against a load event at 396 ms, so first paint came *after* load
  because the main thread was busy with script evaluation (1499 ms of it), not because anything was hidden.
- Already in place from this morning: only the first hero card is preloaded, with `fetchPriority=high` and
  `decoding="sync"`; cards two and three load eagerly without preload.
- New in this round, and what the instruction asked for: nothing above the fold waits for JavaScript any more.
  `data-reveal="now"` is a second reveal state for above-the-fold elements. It is fully opaque at first paint and
  only rises into place, as a CSS-only animation, and `RevealScope` skips those elements entirely. Applied to the
  Contact page's heading block and the new legal pages' heading block, which are the two above-the-fold reveal
  elements in the finished templates. Separately, a plain `[data-reveal]` below the fold now un-hides itself after
  1.6 s through a CSS animation instead of depending on the 6 s JavaScript safety net, so a blocked or failed
  bundle can no longer leave content invisible. Both animations are skipped under reduced motion.
- **Not yet measured.** The before-and-after Lighthouse runs need a build, and free memory has been between 2.6 and
  3.7 GB all day, under the 4 GB line the brief sets. See F.

#### E. Everything hidden when PREVIEW_DRAFTS=false

Two documents, regenerated from the database after the reseed:

- `docs/qa/evidence/phase2/hidden-when-public.md`, from the new `scripts/qa/hidden-inventory.mts`. It reads the
  route files, the link gate and the redirect rules at run time rather than hard-coding them, so it stays honest as
  the build changes, and it is deterministic, so reruns diff cleanly. Current state: **37 hidden routes** (20 case
  studies, 8 service pages, 8 product and AI-solution entries, the House of Lords event), **18 hidden menu items**,
  1 visible menu item whose target is hidden (Computer Vision, a DRAFT service, which 307s to `/services`), 3
  dropped featured mega-menu cards, 7 pruned teasers, 69 hidden sections inside published pages, and, in
  "published but invisible anyway", 10 unverified stats, 5 unconfirmed offices and 3 unverified certifications.
- `docs/qa/evidence/phase2/client-content-request.md`: the same ground in client-facing British English, grouped by
  area, with questionnaire references where the seed notes carry one and a short "decisions we need" list. No
  internal jargon. **This is the one content request to send.** It needs a read-through before it goes: the area
  grouping and the legal-review flags are editorial judgement, not data.

#### F. Memory: the heavy jobs are still pending

Free memory was 3.67 GB when this round started and 2.65 to 2.72 GB for the rest of it, against the brief's 4 GB
floor for builds, servers, Playwright, Lighthouse and axe. The light work was done instead, and it is complete:
`tsc` and `eslint` are clean across the project, the database is reseeded, and the two inventory documents are
regenerated.

Still to run, in this order, once free memory is above 4 GB (Chrome was holding about 1.4 GB and Edge 0.4 GB):

1. **Drafts build** (`PREVIEW_DRAFTS=true SHOW_DRAFT_BADGES=true`) on port 3100: BUG-007 widths in Chromium then
   Firefox, `probe-focus`, forms, memory, axe, Firefox and WebKit interactions, and the **Lighthouse LCP baseline**.
2. **Public build** (`PREVIEW_DRAFTS=false`): the e2e suite including the new solutions spec, the decision-1
   checks, Basic Auth with and without credentials, and the crawl.
3. **LCP measurement**: three Lighthouse runs per URL, alone, before and after, and the median reported. The
   before-and-after comparison is the one remaining open item on the LCP work.
4. Final regression, then the report merge.

### 6.12 Offices, analytics consent and the LCP fixes, 17 November 2026 (third round)

#### A. Offices: the approved design decides the address

`confirmed` stays a review flag, not a visibility filter, so the five published offices keep rendering. The
addresses now have one source of truth, the approved Figma design (Home Page 236:1395 and the footer), and the five
office records already matched it line for line, including the "Palo Alto" label the live site calls
"San Francisco". Nothing had to change in the rendered data; what changed is the record of why it is right. Each
office's `editorNote` now says that the design decides the address, names the live-site variant it overrides, and
keeps the open question for the client. The same questions stay in `CONTENT_TODO.md` and in
`docs/qa/evidence/phase2/client-content-request.md`, because most of them also affect the legal pages, which carry
different addresses and are under legal review.

| Office | Rendered as the design shows | Live-site variant it overrides | Still with the client |
|---|---|---|---|
| London | Golden Cross House, 8 Duncannon Street, WC2N 4JF | 39 Roxborough Road, Harrow HA1 1NS | Is Harrow an office or only the UK representative's address? |
| Palo Alto | Palo Alto, 530 Lytton Avenue, CA 94301 | labelled "San Francisco" | Is the US office still active? |
| Dubai | Latifa Tower, near Trade Centre, Sheikh Zayed Road, Dubai, UAE | shorter form on /about-us/ and /contact/ | Confirm the full wording |
| Bengaluru | 27th Main Rd, 1st Sector, HSR Layout, Karnataka 560102 | 560068 with a different street on the legal pages | Which postcode, including in the legal pages? |
| Kolkata | Haute Street, Topsia Road, West Bengal 700046 | house number 86 A, no postcode | Does the house number belong in the address? |

#### B. Google Tag Manager with a consent banner

One switch, `NEXT_PUBLIC_GTM_ID`, read at build time. Empty means no analytics at all: no Google script, no
`dataLayer`, no consent cookie, no banner, no footer control, and the Google hosts stay out of the
Content-Security-Policy, so a Google script could not load even if one were injected. Every QA build so far has run
in that state.

With a container ID set:

- **Nothing loads until the visitor agrees.** `components/consent/TagManager.tsx` renders nothing at all until the
  `consent` cookie says at least one category is allowed. There is no "load GTM with denied defaults" step: the
  container itself is not requested.
- **Consent Mode v2 in the right order.** On agreement the page creates `dataLayer`, pushes
  `consent default` with all four signals denied plus `wait_for_update: 500`, pushes `consent update` with the
  visitor's choice, and only then requests `gtm.js`, `afterInteractive`, so it stays off the critical path. Two
  categories map onto the four signals: analytics to `analytics_storage`, advertising to `ad_storage`,
  `ad_user_data` and `ad_personalization`.
- **The banner** (`components/consent/ConsentBanner.tsx`) offers Accept all, Reject all and Manage cookies, the
  last opening the two categories with the strictly necessary group shown as always on. It is deliberately not a
  modal: it does not trap focus or block the page, because a visitor who ignores it gets no tags, which is the safe
  default. Reopening it from the footer moves focus to its heading.
- **The choice** is stored in the `consent` cookie, first party, `SameSite=Lax`, six months, holding only the
  version, the two answers and the date, e.g. `1:a1m0:2026-11-17`. An unreadable or older-version value is treated
  as no choice, so the banner asks again rather than guessing. Withdrawing consent reloads the page, because a
  script that is already running cannot be unloaded, and the banner says so.
- **Reopenable** from "Cookie settings" beside the footer's legal links, on every page. It renders only when a
  container ID is configured, because with no tags there is nothing to manage.
- **Cookie Policy** now describes three cookies: `region`, `consent`, and the Google Analytics cookies. The row
  carries both a "Measurement cookies, only if you agree" section and the "No analytics, advertising or tracking
  cookies" section, and the page renders whichever matches the build, so the page can never be wrong about what the
  site does. It stays marked for client legal review: the Google cookie names and retention periods come from
  Google's documentation, not from a measured container.
- **Checked without a browser:** the cookie round-trips, a version bump and six malformed values are all rejected,
  the default signals are all `denied`, and analytics-only grants `analytics_storage` while leaving the three
  advertising signals denied. `tests/e2e/consent.spec.ts` covers the rest in a browser and adapts to whichever
  state the build carries: it watches the network and asserts that no Google host is requested before a choice.

#### C. LCP

The baseline is extracted mechanically by the new `scripts/qa/lcp-report.mjs`, from the Phase 1 runs, so the
before-and-after comparison uses the same numbers from the same place
(`docs/qa/evidence/phase2/lcp-drafts.md`). It confirms the diagnosis on all five measured URLs: Lighthouse's own
LCP checklist says `fetchpriority=high` was **not applied** to the above-the-fold hero image anywhere, and render
delay is almost the whole of LCP.

| URL | LCP | TTFB | Load delay | Load time | Render delay | fetchpriority=high |
|---|---|---|---|---|---|---|
| /in/ | 3639 ms | 457 ms | 0 ms | 0 ms | 3183 ms | not applied |
| /uk/ | 3635 ms | 457 ms | 0 ms | 0 ms | 3179 ms | not applied |
| /gcc/ | 3645 ms | 457 ms | 0 ms | 0 ms | 3188 ms | not applied |
| /services/cloud-services | 3164 ms | 457 ms | 0 ms | 0 ms | 1872 ms | not applied |
| /insights/events/house-of-lords-2026 | 3015 ms | 457 ms | 0 ms | 0 ms | 2474 ms | not applied |

What changed, in the order the browser meets it:

1. **The LCP image is preloaded at high priority.** Only the first hero card carries `priority`, so next/image emits
   `fetchpriority="high"` with a preload and decodes it synchronously; cards two and three load eagerly without
   competing for the preload slot. The after-run must show `fetchpriority=high applied`.
2. **Nothing above the fold waits for JavaScript.** `data-reveal="now"` is opaque at first paint and only rises,
   as a CSS animation, and `RevealScope` skips those elements. Below the fold, a plain `[data-reveal]` un-hides
   itself after 1.6 s in CSS, so a blocked bundle can no longer leave content invisible.
3. **Less to hydrate.** The Products & Solutions cards are now server components passed to the slider as children
   (`components/home/SolutionCard.tsx`), so only the slider's own controls are client-side. GSAP and Lenis were
   already dynamic imports fetched on idle or first interaction, in their own chunks, and the build confirms they
   are not in the first-load chunk; zod is not in the client bundle either, as the field checks are hand-written.

What was ruled out rather than guessed: the pre-paint reveal state was never hiding the LCP element. The element is
the first hero card image, which carries no `data-reveal`, and the trace shows first paint at about 513 ms with the
load event at about 396 ms, i.e. the main thread was busy with roughly 1.5 s of script evaluation, not waiting on a
hidden element.

The remaining lever, if the after-run still misses the target, is the one deliberately not pulled yet: hydrating the
below-the-fold islands (the stories rail, the industries explorer, the mega menu, the contact form) only on
visibility or first interaction. That is an architectural change to ten components and it needs its own measurement
round, so it is proposed rather than done.

### 6.13 How to rerun before a deploy (supersedes 6.7 and 6.9)

The suite (`tests/e2e/`): `navigation.spec.ts` (header, four mega menus by mouse and keyboard, drawer focus trap, skip link, homepage links), `region.spec.ts` (eleven country cases, cookie precedence, `/ae/`, canonical slashes, the switcher, every legacy redirect row), `forms.spec.ts` (contact validation, country selector focus, honeypot, double submit, HTML escaping, event registration and duplicate, `.ics`), `nojs.spec.ts` (sections visible, drawer and accordions, both forms, the switcher), `drafts.spec.ts` (sitemap 200s, draft-string leak check when drafts are off, every internal link 200, featured menu cards) and `security.spec.ts` (headers on every response type, CSP console, Basic Auth when configured, probes, secrets in chunks), `consent.spec.ts` (nothing from Google before a choice, accept, reject, reopen from the footer, and the cookie policy matching the build), `solutions.spec.ts` (solutions link out: the homepage anchor section, the `/solutions` 301 per region, old solution URLs, link target and rel, and no card without a link) and `home.spec.ts` for the behaviours fixed in this phase. Form rows the suite creates (`@e2e.invalid` addresses) and the rate-limit windows are deleted at the end of each run.

### 6.14 Inner-pages round, 17 November 2026: five bugs found by the chain

Found while building the inner pages (`docs/INNER_PAGES.md`) and running `npm run qa:chain` end to end. The last
two had never been reachable in an earlier QA run.

| ID | Severity | Status | Fix (file and what changed) | Retest |
|---|---|---|---|---|
| BUG-036 | Major | Fixed, Verified | Contact form, `components/home/HomeContactForm.tsx`. Blur fires on the mousedown that begins the *next* click, so validating there added or removed an error line and moved everything below it between mousedown and mouseup: the consent box (and, after correcting a field, the submit button) slid out from under the pointer and the click never landed. Measured: the checkbox centre moved 24 px up between mousedown and mouseup and `elementFromPoint` then returned the error `<p>`. Blur validation is now deferred until pointerup (a keyboard Tab still reports immediately), and a message clears while typing instead. | `scripts/qa/probe-interactions.mjs` (the probe that measured the shift) and e2e `contact.spec.ts` "validates, then stores the enquiry…" and `forms.spec.ts` "HTML in a field is escaped where it is shown back", both of which had failed since the suite was written. |
| BUG-037 | Major | Fixed, Verified | Skip link, `components/nav/SkipLink.tsx`. After a client-side navigation `document.activeElement` is `<body>`, but the browser's *sequential focus navigation starting point* stays on the link that was activated, so the first Tab continued from the middle of the header and never reached "Skip to content". The component now focuses `<body>` on every pathname change, which moves that starting point back to the top of the document. | e2e `navigation.spec.ts` "skip link focuses the visible main, also after a client-side navigation (BUG-013)". |
| BUG-038 | Major | Fixed, Verified | A PUBLISHED "Computer Vision" menu row pointed at a DRAFT service, so the header linked to a URL that only answers the unpublished fallback. `lib/data/links.ts` now gates `/services/<pillar>[/<service>]` the same way it gates case studies and events (a hidden sub-service falls back to its pillar, a hidden pillar to `/services`), and `content/navigation.ts` marks the row DRAFT like its siblings. | e2e `drafts.spec.ts` and `navigation.spec.ts` link sweeps: 0 internal links that are not a 200 in one hop. |
| BUG-039 | Major | Fixed, Verified | `redirect()` inside a prerendered, streaming route emits a **307 with no `Location` header** and a 105 KB HTML body (`next/dist/docs/01-app/03-api-reference/04-functions/redirect.md`: "When used in a streaming context, this will insert a meta tag to emit the redirect on the client side"). Every legacy WordPress URL that points at a DRAFT case study therefore ended on a dead redirect for anything that does not run JavaScript. The docs' own remedy is to redirect before the render: `prisma/seed.ts` now writes `lib/generated/unpublished.json` (also by `npm run redirects:build`) and `proxy.ts` answers a real 307 with a `Location`, `Cache-Control: no-store`, and skipped entirely in a drafts build. `lib/data/unpublished.ts` stays as the backstop for a row that changed since. | `curl -I` on `/case-studies/sap-intercompany-reconciliation` (307 with Location, no body) and e2e `region.spec.ts` "every row resolves in one hop to a 200". |
| BUG-040 | Critical | Fixed, Verified | Cookie consent, `components/consent/consentClient.ts`. `useSyncExternalStore` compares snapshots by identity; `getSnapshot` decoded a **new** object from the cookie on every call, so once a choice existed React re-rendered forever and stopped with error #185 ("Maximum update depth exceeded"), tearing down the whole page the moment the visitor pressed Accept or Reject. The snapshot is now cached against the raw cookie value. Only reachable when `NEXT_PUBLIC_GTM_ID` is set, which is why no earlier QA run met it. | `scripts/qa/probe-consent.mjs` against the dummy-container build (no page error; the footer control survives and reopens the banner) and chain step 4b, `consent.spec.ts`, 5 passed. |

The chain (`npm run qa:chain`) now runs green end to end: check:config, drafts build, public build, the full e2e
suite (67 passed, 6 skipped), the dummy-container build and the consent suite, then the review server on port 3000.

**axe on the new pages** (drafts build, 1280 px and 390 px, menus and drawer opened): `/about`, `/about/team`,
`/credentials`, `/case-studies` and `/case-studies/sap-treasury-cash-forecasting` - 0 critical, 0 serious, 0
moderate, 0 minor. Two contrast failures and two heading-order failures were fixed to get there: the review-only
"Held:" and "to be confirmed" notes were `#B4600A` on a 10% orange tint (4.18:1) and are now `#9A5208` (5.38:1),
the DRAFT badge is the solid orange badge the service hero already uses (7.69:1), the certifications group label
follows the page's heading level, and the case-studies grid has a visually hidden `<h2>` so the card `<h3>`s do not
skip a level. The same `#B4600A`-on-tint pairing was corrected in the contact and event registration forms, where
it affected real visitors seeing a validation message.
