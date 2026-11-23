# Design notes: approved Figma build

Started 13 Nov 2026 with the rebuild to the approved Figma file. The earlier prototype notes were removed with the prototype. Each entry is a decision the design does not settle, for the designer (Adwitiya) or Swayang to confirm. Tokens are in `docs/design-tokens.md`, assets in `docs/asset-manifest.md`.

## Figma inventory

- Page "v2 uPDATED" (236:1394): **Home Page** 236:1395 (1920x13566), **Mega Menu** 236:4658 (1920x961, Services panel), **Cloud Services** 292:24608 (1920x11313). Also present: "v2" 262:71 (a copy of the homepage), About us 274:1617, Carrer 274:2667, CASE STUDY 274:8299, and the HCLTech reference frame (ignored).
- No variants exist for: sticky header, hover states, UK/GCC homepages, mobile.
- Section order on the homepage matches the brief exactly (Hero, Top Stories, Partners & Certifications, About Adamas, Our Services, Products & Solutions, Client Outcomes, Industries, Why Organisations Choose Adamas, Events & Insights, Latest Perspectives, Tech Excellence, Our Presence, Contact, Footer).

## Decisions made without a Figma value

1. **Fonts.** The file mixes Manrope, Roboto, Figtree (bulk of the text) with Archivo (10 nodes: partners heading, footer office names, mega-menu metric, counter), Inter (3 buttons), Poppins (hero supporting line), 42dot Sans (Industries section) and Degulardisplay (one "ALL INDUSTRIES" label; not on Google Fonts). Loaded: Manrope, Roboto, Figtree. Mapping: Archivo and Degulardisplay to Manrope, Inter to Roboto, Poppins and 42dot Sans to Figtree/Manrope by role. One token change restores any of them if the designer wants them kept.
2. **Sticky header.** No scrolled state in Figma. After 40px the top bar folds away, the band turns solid navy-950 with a soft shadow, the glass bar keeps its 70px height. No hide-on-scroll-down.
3. **Header over content pages.** Figma only shows the header over the dark hero. On pages without a dark hero the band is solid navy-950 (`.site-header`); pages that open with a dark hero mark it with `data-dark-hero` and the band turns transparent.
4. **Glass bar blur.** Figma gives white at 80% with a 1px white stroke; a `backdrop-blur` was added so the bar stays legible over the hero image. Remove `backdrop-blur-md` in `components/nav/Header.tsx` if not wanted.
5. **Mega-menu panel colour.** Figma fills the panel with `#CCCDCF` (grey). Built as designed; it reads like a placeholder, so please confirm (white would be the usual choice). The panel sits 45px under the bar as in Figma; that gap is a transparent hover zone so the pointer can cross it.
6. **Mega-menu panels for About Us, Solutions and Insights.** Only the Services panel is designed. The same layout is reused: categories left, the active category's links in the middle, featured card right. Menus whose items have no children (About Us, Insights) render as a single list plus the featured card (Insights: the House of Lords event).
7. **Insights trigger.** Figma shows a chevron only on About, Services and Solutions. The brief says Insights also opens a mega menu, so it has one, with a chevron for consistency.
8. **Case Studies** is a plain link (brief and Figma agree).
9. **Region switcher dropdown.** Only the closed state (flag, label, chevron) is designed. The open list is a white card with the three regions in the brief's order: India, UK & Ireland, GCC. Built on `<details>` so it works without JavaScript.
10. **Mobile (no frames).** Below 1200px the nav collapses to a hamburger in the glass bar. The drawer is a full-height navy-950 panel under the header with accordion sub-menus (`<details>`), the region list and the "Talk to an expert" button. Below 640px the top bar shows only the phone and social icons, and the header CTA moves into the drawer. Focus is trapped, Esc closes, body scroll is locked. Between 1024 and 1199 the drawer is used too because the designed nav (logo 205 + five items + switcher + CTA) needs about 1100px.
11. **Social icons.** Figma shows LinkedIn, Facebook, Twitter and YouTube in the top bar. Only Facebook and LinkedIn have verified URLs on the live site, so only those render (from the database). Twitter and YouTube icons are in `components/ui/Icon.tsx` ready for URLs.
12. **Top-bar phone.** Figma's `+91 000 500 0000` is a placeholder; the region's phone and email come from the database (India `+91-6296680677`, UK `+44 7768 706988`, GCC `+971 4 705 6001`, all `marketing@adamastech.in`).
13. **Footer region switcher** reuses the header switcher in a bordered button with a globe icon (Figma shows "India" with a globe and chevron); the list opens upwards.
14. **Copyright year** is computed (cached daily) rather than hard-coded "2026".
15. **Logo.** The only logo in Figma is a 236x69 raster (the live site's WebP). It is served at 205x60 (header) and 178x52 (footer). A vector logo is needed from the designer for crisp rendering on high-density screens.
16. **Flags.** Exported from the Figma rectangles (24x14) at 4x and served as AVIF/WebP at 1x-3x.

## Naming differences logged (sitemap wins over Figma)

| Figma | Built | Source |
|---|---|---|
| About | About Us | Brief, sitemap |
| AI Services (pillar) | Data & AI Services | Sitemap row 21 |
| Cloud Migration | Migration & Modernization | Sitemap comment |
| Cloud Transformation | DevOps & SecOps | Sitemap comment |
| Managed Cloud & Cloud Reselling (CSP) | Managed Services | Sitemap comment |
| SAP on Cloud | AI/ML Ops | Sitemap comment |
| Oracle NetSuite / Cloud ERP | Cloud Automation | Sitemap comment |
| Cloud Security & FinOps | Cloud Advisory & Consultation | Sitemap comment |
| AI Product A / B | A-EYE / AIR-MIND | Brief, sitemap; slugs `/solutions/a-eye`, `/solutions/air-mind`, old slugs 301 |
| Smart Parking | Industrial Analytics | Sitemap; slug renamed to `/solutions/industrial-analytics`, old slug 301s |
| Cash Forecasting (SAP Treasury) | Asset Tracking | Sitemap; slug renamed to `/solutions/asset-tracking`, old slug 301s |
| (none) | Data Engineering, Advanced Analytics, Sovereign AI, Responsible AI, AI Security & Governance | Sitemap "create URL" |
| Middle East | GCC | Brief |

Swayang overrode brief section 12 on 13 Nov 2026: the solution and cloud sub-service slugs follow the sitemap names (`migration-modernization`, `devops-secops`, `managed-services`, `ai-ml-ops`, `cloud-automation`, `cloud-advisory-consultation`; `a-eye`, `air-mind`, `industrial-analytics`, `asset-tracking`). The old slugs 301 to the new ones and every WordPress URL points straight at the final URL (`content/redirects.ts`).

## Milestone B: homepage sections (13 Nov 2026)

Built to the Home Page frame (236:1395) at 1920px; the Playwright/pixelmatch comparison per section is in `screenshots/round5/compare/` (Figma left, build middle, diff right) and `results.txt`.

17. **Hero cards.** Figma composes the three cards as one flattened image (the overlays are baked into the raster). The cards are rebuilt as links over the clean photos from the designer's exports (`Rectangle 3793/3794/3798.svg`): category icon badge, label, title and arrow. Content comes from the HeroSlide rows (navLabel = category, eyebrow = date line, headline = title, poster = photo).
18. **Hero pause control.** Figma has none; a small pause/play circle sits beside the counter so the auto-advance (7s) can be stopped (brief section 9). Auto-advance is off with reduced motion and while hovering or focused.
19. **Top Stories.** The 1217px cards keep the Figma layout; the date renders in British English ("29 October 2026") where Figma shows "October 29, 2026" (brief: inner copy in British English). Figma repeats one story three times; the slider shows the Figma story plus the real event and case study.
20. **Partners strip.** All partner logos in the database rotate (Figma shows four); the marquee pauses on hover, focus, the pause button and reduced motion.
21. **About.** The diagonal light shape ("Vector 1") is drawn with a CSS clip-path; the outline word "ADAMAS" and the blue squares graphic are from the design.
22. **Our Services.** The three tabs share the 1215px width equally (405px each, as in Figma). The image-card caption is the pillar's outcome line. Figma repeats the Cloud paragraph twice; it renders once (CONTENT_TODO). Only the Cloud tab is designed; the other pillars reuse the same panel with their own copy and images.
23. **Client Outcomes.** The two white cards overlap the feature card's right edge by 141px as in Figma; the "30%" figure is a DRAFT stat with the draft badge.
24. **Industries.** Twelve industries from Figma (the live site's seven are mapped where names match; Hospitality dropped). The side menu selects a card in the rail; the rail also scrolls by touch and works without JavaScript through anchor links. Figma's Degulardisplay / 42dot Sans text uses Manrope / Figtree.
25. **Why Organisations Choose Adamas.** Rebuilt in HTML/SVG from the flattened infographic: card positions measured from the raster, icons from the `The adamas difference*.svg` exports, the centre sphere and network from the fills. The outer ring and centre glow pulse gently (none with reduced motion). Below 1024px the cards form a two-column grid under the centre.
26. **Events & Insights.** The event title and date come from the Event row (Figma's card copy "Join us at the House of Lords, London." is editorial); the three insight rows are seeded copy. The white insights card overlaps the event card by 192px as in Figma.
27. **Tech Excellence.** Body text uses grey-600 instead of Figma's #B7C8DC on white (1.9:1 fails WCAG AA; grey-600 is 4.9:1).
28. **Our Presence.** The map is the flattened Figma raster (pins, labels and arcs baked in, Bengaluru highlighted) stretched to 1920x937 as Figma does. It cannot change per region or animate until the designer supplies separate layers; the office cards do come from the database with the region's featured office first.
29. **Contact.** A consent checkbox (required by the contact action for GDPR) and inline validation messages are added under the Figma fields; the phone country selector doubles as the required "country" field. Submissions post to the existing server action (honeypot, rate limit, database, mail).
30. **Scroll reveals.** GSAP ScrollTrigger reveals `[data-reveal]` elements (24px rise, 60ms stagger); the hidden pre-state is gated on `@media (scripting: enabled)`, a focus inside a hidden element reveals it, and a 3s safety timer reveals everything if GSAP never loads. Lenis smooth scrolling is on for mouse users only (off for touch and reduced motion).

### Responsive decisions (no mobile frames)

- Below 1024px every multi-column section stacks: hero cards become a swipeable rail (one card at 390px), the Top Stories card puts its image above the copy, Services tabs scroll horizontally, Solutions/Industries/Presence cards are swipeable rails, the Client Outcomes and Events side cards stack under the feature, the diagram becomes a grid.
- Display sizes use `clamp()`: H1 36-62px, H2 30-43px, eyebrows 16-28px, industry "Industry Growth" 32-64px.
- The Industries side menu becomes a horizontal chip list; "Explore Industry" buttons link to /contact.
- Section padding drops from the Figma 100-145px to 64px (`py-16`) below 1024px.

### Round 6 (13 Nov 2026): comparison with the design's own content, and Milestone C

31. **Fixture page.** `/figma-fixture` (only with `FIGMA_FIXTURE=1`, noindex, outside the sitemap) renders the seven sections that scored under 90% with the same components but the Figma placeholder copy and artwork (`lib/fixtures/figma-home.ts`): the designer's baked hero cards, the repeated story, the Figma sub-service names and the doubled Cloud paragraph, "About" instead of "About Us", the placeholder phone and email, four social icons, undated claims. The only edit is "Middle East" to "GCC" in the hero body. `scripts/measure-figma.mts` prints every measured box next to the Figma node box (x absolute, y relative to the section band) and flags deltas over 2px; `scripts/compare-figma.mts` now compares the header band with the top of the Home Page render (the Mega Menu frame has no header group, which is why the earlier 64.5% was meaningless), hides the Next.js dev overlay and sets the reveal attributes only after hydration.
32. **Section headers.** Eyebrows sit on Figma's 15px line box (`lg:leading-[15px]`), so H2s land 27px below the eyebrow top as in the SectionTitle frames; sections whose frames differ pass their own box (Services 22px, Events 22px, Solutions 20px, Difference 20px, Tech Excellence 27px, Presence 33px). The default header column is 690px (Figma), with 719/720px for Services, Solutions and Difference, 906px for Tech Excellence and 1130px for Presence. Top Stories uses the 18px eyebrow of its frame; the Services intro is 16px/24.5.
33. **Hero.** The supporting line keeps Figma's three-line (77px) box so the buttons, cards and trust row sit at y 538/647/887; cards are 401/381/401px from 1440px; claims are 24px/28; slider counters are a fixed 48px; both hero buttons and the header CTA are at least 174px wide. The card track stays centred (Figma's frame is 4px right of centre).
34. **Header.** Nav items are 37px apart and end 42px before the switcher's flag (the main nav is right-aligned next to the switcher, not centred); social icons are 24px targets on a 26px pitch; top-bar links are 16px line boxes.
35. **Top Stories.** The track loops: once hydrated, a copy of the last story leads and a copy of the first trails, and the track starts on the first real card, so the previous card peeks in on the left exactly as Frame 50 (x -902). A smooth scroll that settles on a copy jumps to the real card. The band is 852px (132px below the cards for the shadow); the card image is inset 1px; the text column is 578px with the title on a 137px minimum box and the link 28px under the text. The title uses greedy wrapping (`text-wrap: wrap`) because the Figma break leaves "solutions" alone, which the site-wide `text-wrap: pretty` would avoid.
36. **Services.** The tab row is 1215px wide (Figma), the panel 44px under it, "01" 50px from the card's right edge, the caption 41px from the bottom; the sub-service grid is 294 + 70 + 297px; paragraphs separated by a blank line sit 14px apart (Figma's taller first box). The no-JavaScript panels moved out of `AnimatePresence` (its "wait" mode warned about several children).
37. **Outcomes.** "IMPACT" and the 54px metric use Figma's 1.5 line height; the metric row is 102px and the button follows it directly; the two white cards are 230px tall with the link on a 28px box at the bottom; the card column no longer stretches its rows (`content-start`).
38. **Presence and Contact.** Presence: 1130px heading on one line, 1314px card row, phone 16px under the address, 71px below the cards; the map asset carries Figma's crop (the bottom 8.5% of the artwork is cut). Contact: the card starts 40px into the section, the eyebrow sits on a 55px line box with the heading box starting 7px before it ends, text column padding 48px; the consent line (not in the design) lives inside the design's 35px textarea-to-button gap (10 + 18 + 7px), with "Privacy Policy" and "Terms of Use" linked inline when the copy names them, so the card keeps Figma's 631px. The photo, the outcome dashboard and the hero backdrop are cropped exactly as the Figma fills.
39. **Results at 1920px** (`screenshots/round6-*/compare/results.txt`): with Figma's own content, Hero 91.2% to 96.2%, Top Stories 81.8% to 95.2%, Our Services 89.7% to 93.1%, Client Outcomes 88.4% to 91.8%, Our Presence 88.8% to 99.1%, Contact 89.3% to 99.3%, header band 95.6% to 96.4%. On `/in/` with the database content: Hero 93.1%, Top Stories 90.7%, Services 92.8%, Outcomes 91.8%, Presence 99.1%, Contact 99.0%, header 95.5%; every other section is between 90.7% and 97.6%. What remains is content (dates, names, badges, photos) and font rasterisation; the measured layout deltas left are the Figma frame's own 4px off-centre hero track and Figma's "Managed Cloud & Cloud Reselling" link wrapping to two lines in its 260px text box (28px taller list) where the browser keeps it on one.
40. **Milestone C.** The Gulf region key is `GCC` (`RegionCode` enum value renamed in place by migration `20261113120000_region_gcc`, slug `gcc`). `/ae`, `/ae/` and `/ae/*` are 301s to `/gcc/` in `proxy.ts` (before the redirect table, so the WordPress `/ae` row also lands in one hop); a saved `region=ae` cookie is read as `gcc` on the server and in the browser. hreflang and the sitemap come from the region rows, so `en-AE`, `en-SA`, `en-QA`, `en-KW`, `en-BH` and `en-OM` point at `/gcc/`. Deploying the migration with the code: `docs/deploy.md`.

### Round 7 (13 Nov 2026): frosted menus, QA milestone, event page, service template

41. **Frosted mega menu and drawer (designer decision).** The four header panels and the mobile drawer are one `.glass-panel` surface: white at 85% over a 20px backdrop blur (saturate 1.3), a 1px white 70% border and the header bar's inset highlight plus the lift shadow. Browsers without `backdrop-filter` and visitors with `prefers-reduced-transparency: reduce` get solid white. Contrast was measured with `scripts/glass-contrast.mts` (the darkest blurred backdrop under the panel on the hero is rgb(4,6,18)): at 85% white the panel's blue-600 links reach only 3.8:1 and grey-500 labels 3.9:1, so the panel text uses blue-700 for links, grey-700 for labels and descriptors and navy-900 at 60% for chevrons, which pass 4.5:1 and 3:1 everywhere the menu can open (over the hero, photos and light bands). Keeping blue-600 would have needed 94% white, which is no longer glass. The design's grey #CCCDCF panel is retired. Screenshots of every panel over the hero and over a light section, and the drawer over both: `screenshots/round7/menu/`.
42. **Tech Excellence and Partners on GCC.** The live /ae/ hid both; the approved design shows them on every region, so the GCC homepage now renders Tech Excellence (`showWhyUs`) and the partner strip (partner logos on all three regions).
43. **Images.** Every homepage `<img>` is now `next/image` through the `Img` wrapper (responsive `sizes`, AVIF/WebP from the optimiser, lazy by default); the first three hero cards are `priority` because the first card is the phone LCP element. `mediaUrl()` passes already-resolved `/media/...` URLs through.
44. **Accessibility (axe, serious and critical).** Decorative outline words ("ADAMAS", "IMPACT", "NEXT") are CSS `content` on empty elements; the Perspectives labels and "Your nearest office" move from sky-300-on-white and blue-600-on-navy (both below 2.2:1 in the design) to blue-600 and sky-300 respectively; the Industries "Industries" label never drops under 24px; "Explore Industry" sits on a 6% tint; the external hero card keeps its visible text as its accessible name; the partner marquee is a focusable region. Service pages use grey-550 for the small numbers the design drew in #8D98A5 / #6E7F95 (2.9:1). Event page: real `dl` groups, h2 section labels, a darker "to be confirmed" tone.
45. **House of Lords event page (no Figma frame).** Built from the homepage Events card: the photo under a navy gradient, the blue date block, a sky eyebrow with the venue, the title (a "title to be confirmed" tag while the seed title is a placeholder), When/Where, "Register" and "Add to calendar". Below, in the tint-50 band: agenda timeline, speakers, venue card with a Maps link, and the sticky registration card styled like the homepage contact form. `registerForEvent` saves the row (unique per event and email), emails the enquiries inbox and the attendee (text and HTML, with the `.ics` attached, built by `lib/ics.ts`, the same file `/calendar` serves), and answers closed, duplicate and rate-limited states. Works without JavaScript (`scripts/event-smoke.mts` submits with and without JavaScript and checks the database). JSON-LD Event schema on the page.
46. **Mail transport.** `MAILER=smtp` sends through nodemailer (SMTP_HOST/PORT/USER/PASS, MAIL_FROM); `console` logs. Mail failure never fails a submission.
47. **Service page template (Figma Cloud Services 292:24608).** New tokens: blue-link #0066FF (eyebrows, accent words), navy-850 #0D1B2D, grey-550 / grey-450 / grey-400, grey-50 #F0F3F9. Sections, each a component under `components/services/`: hero (530px band, pill, 62px title); intro (425px column, 660x536 photo with the floating pill card 66px past its edge); "What makes ... different" (42px heading, 24px paragraphs, four 310x311 stat cards with the gear artwork); expertise (frosted 2x2 cards 52px past the container, as drawn); platforms (native `<details name>` accordion, first open); industries (499/765/347/405 mosaic); services and capabilities (ARIA tabs, 76px frosted rows with the 3px blue inset, panel with "ADAMAS CLOUD / 01"); case studies (three 428x392 cards, real stories instead of the design's concept showcases); technology ecosystem (DRAFT, names only, no brand marks drawn in); quality and trust (the delivery-principles artwork rebuilt in CSS); FAQ (two `<details>` columns); the homepage contact card. Copy lives in `services.<pillar>.<section>` blocks; the hero title falls back to the pillar's outcome line while the design's title is a placeholder. Sub-service pages reuse hero, intro, capabilities (the "what we do" items), quality rows (delivery steps), ecosystem tiles (technologies), FAQ, case studies and a "More in <pillar>" row; their section labels are interim UI labels.
48. **Lighthouse (mobile emulation, production build on the development laptop, 13 Nov 2026; median of three runs per page, run alone).** Before: /in/ 65 (LCP 3.9 s, TBT 1,010 ms), /uk/ 75 (5.4 s, 240 ms), /gcc/ 72 (5.9 s, 260 ms); CLS 0 on all. After: /in/ 69 (LCP 3.7 s, TBT 826 ms), /uk/ 72 (3.6 s, 681 ms), /gcc/ 69 (3.7 s, 884 ms); CLS 0.001; accessibility 100, best practices 100. What moved: every homepage image is next/image with responsive sizes (the hero card, the phone LCP element, is no longer lazy and is preloaded), GSAP and Lenis load on the first interaction or idle, Motion (45 KB gzipped) and zod (34 KB) left the client bundle (JavaScript transfer 290 KB to 214 KB), and the three generic "Read More" links carry their article titles for screen readers and crawlers. Still open against the brief targets (90 / LCP 2.5 s / TBT 200 ms): script evaluation is 3.5 s under the 4x CPU throttle (React hydration of a 1,588-node page with eleven client components) and style/layout 2.1 s; LCP is held back by that work, not by the image. The laptop benchmarks below Lighthouse's reference device, so the same build should score higher on PageSpeed Insights against the Vercel deployment; the next steps are measuring there, then trimming client components below the fold (Industries explorer, Perspectives, the stories loop) into server markup with small islands and reducing the DOM. SEO 69 is the staging noindex (BLOCK_INDEXING) and is-crawlable, expected until launch.

---

## Questions for Mithu: the inner pages (17 November 2026)

From the Figma fetch of 17 November (file `Adamas Web`, version 2421258474762007606, unchanged since the
13 November fetch). Page "v2 uPDATED" holds three new page frames: **About us** (274:1617), **Carrer** (274:2667)
and **CASE STUDY** (274:8299). Nothing else new was found, which raises the following.

1. **No case-studies listing is designed.** 274:8299 "CASE STUDY" is a case-study *detail* page, and specifically
   the SAP Treasury story ("PROJECT OBJECTIVES", "Building a More Connected Treasury Function", "KEY SOLUTION
   CAPABILITIES", "TreasuryHeading"). The sitemap needs `/case-studies` as well: a listing with filters for
   service, industry and region. Please design the listing, the filter controls, the active-filter state, and the
   **empty state** - all 20 case studies are DRAFT until the client approves them, so at launch the listing may
   legitimately have nothing in it. Until it arrives, the listing will be built from the existing design tokens
   and the Cloud Services card patterns, with a Contact CTA in the empty state.
2. **No service pillar or sub-service frames beyond Cloud Services.** The sitemap has `/services` (overview), three
   pillar pages (Cloud Services, Digital Transformation, Data & AI Services) and roughly twenty sub-service pages.
   Only "Cloud Services" (292:24608) is drawn, and it is already built. Is Cloud Services intended as the template
   for all three pillars and every sub-service page, or are Digital Transformation and Data & AI Services meant to
   differ? Also: is `/services` (the overview with three pillars plus cross-cutting capabilities) designed anywhere?
3. **No `/about/team` or `/credentials` frames.** The About us frame contains a leadership block (four portraits
   with role and name) and a certifications/partner strip, but the sitemap has Team and Credentials as pages of
   their own (#46, #48 - five badge pages plus downloadable certificates). Should those be sections of About us
   only, or separate pages, and if separate, may we extend the About us blocks to fill them?
4. **No case-study detail states.** 274:8299 is drawn around one story with a dashboard image and a results band.
   What does the template do for a case study with no image, no quantified results, or no client name (several of
   the 20 are unclearable)?
5. **Careers has no job-detail or empty state.** "Carrer" (274:2667, note the spelling) has a job grid
   ("Repeat Grid 5", 274:7372). There is no single-job page, no "no vacancies" state, and no Apply flow. Careers is
   Phase 2 and stays DRAFT, so this is not urgent, but the grid with zero jobs needs a state.
6. **No mobile or tablet frames, again.** As with the homepage, every inner page is drawn at 1920 only. The
   responsive behaviour from 1920 down to 360 will be decided here and logged in this file for review.
7. **Placeholder people on About us.** The leadership block carries invented names and roles (Robert Amplilian,
   Maggie Strickland, Stephen Mearsley, "Chief People Officer", "President & CEO"). These are Figma placeholders,
   never public: they will be gated at block level and only real people from the database will render. Please
   confirm the block is meant for four people, as drawn.
8. **The HCLTech reference layer** (326:215, "About our Company: HCLTech - Supercharging Progress") is ignored
   entirely, per the brief. Flagging only so it is not assumed missing.


## Milestone D: inner pages (17 November 2026)

Built from the new frames: About us (274:1617), the case-study detail (274:8299). Team, Credentials and the
case-studies listing have no frame and reuse these components and tokens, as agreed in INNER_PAGES.md section 2.

### Deviations from the frames, and why

1. **A breadcrumb on About us.** The frame has none. Every inner page needs the trail and its BreadcrumbList data
   (brief section 10), so it sits centred under the hero intro, in white at 75% on the photograph. On the
   case-study detail it sits at the top of the dark hero, above the label. **Mithu: is that placement acceptable,**
   or would you rather it sat on the light band below the hero?
2. **The approach band carries a navy wash over the contour artwork.** On the raw image the 20px eyebrow and the
   18px intro fall below AA for contrast. The wash is a 72-90% navy gradient; the contours still read.
3. **Four step cards became three columns.** The frame draws "04 Steps". The steps come from the database and the
   client's own list has six, so the grid is four columns when the count divides by four and three otherwise, and
   the counter in the corner prints the real number. Six cards in four columns left two orphans on the white band.
4. **The big "12 Years' Experience" figure only appears when a verified statistic exists.** None is verified today,
   so the column collapses and the company paragraphs centre on the same measure as the header.
5. **Sections with no content behind them are not rendered.** "Our Commitment", "Our Strategic Direction",
   "Progress in Numbers", the testimonials rail, the second statistics band and "Life at Adamas" are drawn in the
   frame but hold template filler ("Miyah Myles", "1790 happy clients") or HCLTech's figures ($14.8B revenue,
   230K+ people). They are on the client's list; until that copy arrives the page runs without them.
6. **Case-study detail: the diagram bands are lists.** "Existing process", "Technology architecture" and the
   before/after band are drawn as diagrams built from one story's content. The database holds solution steps,
   results and technologies, so those bands render as cards and chips. **Mithu: if the diagrams matter, we need a
   component spec that works for a case study with three steps and one with eight.**

### Responsive decisions (no mobile frames, again)

- **About hero:** 530px tall at 1920, min 380px below 1024; the 62px page name scales to 32px and the 46px heading
  to 28px with `clamp()`; the intro stays on a 820px measure and centres.
- **Approach cards:** four columns at 1024+, two at 640-1023, one below. The cards keep their -170px overlap into
  the dark band at 1024+ and -130px below it.
- **Expertise, journey, people, credentials, case grid:** three columns at 1024+, two at 640-1023, one below.
- **Case-study summary card:** the results column drops under the summary below 1024px, and the card's padding
  goes from 56px to 32px.
- **Case-study filters:** the pills wrap; the group label keeps a 72px column so the rows stay aligned. No
  horizontal scroller, so nothing is hidden off-screen.
- No horizontal overflow at 1920, 1440, 1024, 768, 414 or 360 on any of the new pages.

### Careers (274:2667), 17 November 2026

Built and kept DRAFT, as the brief asks: hidden from the public, visible in the drafts preview, and the menu
still shows "Careers (coming soon)" as plain text rather than a link.

1. **"Carrer" is spelled "Careers"** everywhere, and the copy has been put into British spelling
   ("optimised"). The words are otherwise the designer's and still need the client's sign-off.
2. **The job rows come from a new `Job` table**, which is empty: the brief forbids invented vacancies. The band
   therefore renders its empty state - "No vacancies are open at the moment", the client's line about keeping CVs
   on file, and a contact call to action. **Mithu: the frame has no empty state; please confirm this one.**
3. **The discipline chips are generated from the roles that exist** (plus "Remote" when a remote role does), not
   the frame's fixed Remote / Design / Marketing / JAVA-Tech / Mobile App / #Trend. Each chip is a link with a
   query string, so the filter works without JavaScript.
4. **No Apply button is drawn** until `CAREERS_APPLY_URL` or `CAREERS_EMAIL` is set. The application and CV upload
   are out of scope for this phase, and a button that goes nowhere is worse than no button.
5. **The "Recognitions / Good Firms" band is not built.** Its four badges all read "Top mobile app developers in
   the industry", which is another company's award. It is on the client's content list.
6. **Responsive:** the five hiring stages run across one row at 1024px and above with the connecting rule behind
   the numbers; below that they become two columns and then one, and the rule is dropped. Job rows go from
   three columns (role, location, apply) to stacked at 1024px.

### What the per-section comparison says (17 November 2026)

`node scripts/qa/compare-figma-page.mjs <about|case-detail|careers>` compares each `data-compare` band with the
matching band of the frame render. It measures **layout**, not words: these pages carry the client's content from
the database while the frames carry the designer's placeholder copy, so a band can be structurally right and still
report mismatch wherever the text or the photograph differs.

About us: company 91%, credentials 86%, approach 85%, people 81%, journey 79%, expertise 77%, hero 70%.
Case study: technology 94%, results 88%, summary 83%, facts strip 74%, solution 55%, hero 52%.

The four that sit below 80% are all content, not layout:

- **Expertise (77%)**: the frame draws three cards with photographs and the title over the image; the client's
  copy has six items and no per-item imagery, so they are icon cards in a three-column grid. **Mithu: may we have
  the three photographs, or should the band stay on icons for six items?**
- **Case-study hero (52%)**: same layout (centred label, title, descriptor, button, facts strip under it), but the
  frame's photograph is an SAP dashboard and the row's own image is a warehouse interior. The wash over it was
  lightened on 17 Nov to sit closer to the frame.
- **Case-study solution (55%)**: the frame gives this band 2113px - an intro, a product screenshot and six
  capability cards. The database has the capabilities but no screenshot, so the band is 1103px of cards.
  **Mithu: is the screenshot per case study, or one illustration reused?**
- **Journey (79%)**: the frame draws a horizontal 2020-2029 timeline; the milestones in the database have no years
  confirmed yet, so they render as a card grid. It will be revisited once the client sends the dates.

## Round 8 (18 November 2026)

- **Mega-menu panels are portalled to `<body>`.** The header bar carries `isolation: isolate`, which makes it a
  backdrop root, so a `backdrop-filter` inside it could only sample the header box and the panel never blurred.
  The panels are now `fixed`, positioned from the header's 1312px chrome box and the bar's bottom edge. Panel is
  white at 95% over `blur(24px) saturate(1.6)`; a navy `#000C33` 30% scrim sits behind it, under the header.
  The entrance animation moved onto the panel element itself, because an ancestor at `opacity < 1` is also a
  backdrop root.
- **New `.container-about` (1194px content).** The About frame lays its sections on a narrower column than the
  homepage - x 366-1560 at 1920, shared by the approach steps, expertise cards, people cards, CTA band and award
  badges. Every About section had been using `container-site` (1320) and so was 126px too wide. It is defined in
  `@layer components`, not as an `@utility`: a utility is only emitted when the class scanner finds it, and a
  long-running dev server does not re-scan for a newly defined one.
- **About hero wash.** The design puts white 46-62px type over parts of the hero photograph at 2.29:1 (p95), below
  the 3:1 large-text minimum - measured on the frame's own render. Overall brightness now matches the design
  (mean luminance 179 against 182), with a soft ellipse darkening only the text column: worst case 5.36:1.
  Checked by `scripts/qa/hero-contrast.mjs`.
- **Clients ring is gated to `xl`, not `lg`.** The nine logo tiles are absolutely positioned at percentage
  `left` offsets with a fixed 174px width; between 1024 and 1279 they overflowed the narrowed container and the
  page scrolled sideways by 11-20px. Below `xl` the logos are a plain grid.
- **Draft notes are deliberately compact** (12px, tight padding). They exist for the reviewer, and a tall box pushes
  every band below it out of step with the frame the same preview is measured against.
- **The case-study "facts strip" is not in the Figma frame.** Round 7 recorded it as Figma y 1260-1400; there is no
  such band in 274:8299, and the band it was scored against is the top edge of the executive-summary panel. It is
  our own addition and is on the allowed-differences list.
- **Contact and footer are one Figma group** (Group 21307, on both About and Cloud Services). Scoring our contact
  section against the whole group is what produced the old "44%"; split correctly it is 91% and the footer 95%.

## Round 9 (19-20 November 2026)

### "Top Stories" removed from the homepages (client decision)

The client asked on 19-20 November for the **"Top Stories"** band - eyebrow "Top Stories", heading "Latest
Insights, Success Stories and What's Next", the slider directly under the hero - to come off **/in/, /uk/ and
/gcc/**. It is a removal, not a deletion:

- `app/[region]/page.tsx` no longer renders `<TopStories>`; a comment marks where it was.
- `content/blocks.ts` keeps the `home.topStories` row with its three stories and turns it **DRAFT**, so the
  content survives in the database and the band returns by publishing the row and restoring one line.
- `components/home/TopStories.tsx` and `components/home/StoriesSlider.tsx` are kept for the same reason. They
  are still exercised by the design fixture at `/figma-fixture` (FIGMA_FIXTURE=1), which is a replica of the
  approved Figma frame and deliberately still shows the band.
- `scripts/compare-figma.mts` no longer expects the frame's y 961-1813 band, and the e2e specs no longer test the
  slider: `home.spec.ts` now asserts the band is absent from all three homepages, and the no-JS slider check in
  `nojs.spec.ts` moved to the solutions rail (the only remaining homepage slider that clones cards).

Note that **"Latest Perspectives & Updates" also carries the eyebrow "Top Stories"** in the approved design
(`home.perspectives`). That section stays; only the band under the hero was withdrawn. If the client wants that
eyebrow changed now that the real "Top Stories" band is gone, it is a one-field edit.

The BUG-006 (slider copies) and BUG-019 (two-line counter) regressions were guarded by the removed test. If the
band is ever restored, restore that test with it.

### New logo, favicon set and the Cloud Services revamp (20 November 2026)

**Brand.** The client supplied two SVGs: a full-colour lockup and a reversed ("white") one, both the same
horizontal mark. The colour file arrived on a 1004x591 canvas with the artwork occupying about 60% of it, so
`scripts/tighten-svg.mjs` rewrites the root viewBox to the artwork (721.25 x 169.75, 4.25:1) before the asset
pipeline sees it; the white file was already tight (4.21:1). Both are shipped as **SVG** - one file, sharp at any
device pixel ratio - with rasters alongside for the two places SVG will not do: Organization JSON-LD (Google asks
for a raster) and HTML email.

- Header and mobile drawer use the colour artwork. The header bar is white glass in **both** its normal and its
  scrolled state (`.headerbar::before` stays `bg-white/80` when `.site-header` turns navy), so there is no
  second state to handle.
- The footer is navy-900 and uses the supplied reversed artwork. Note it is not flat white: the designer's file
  uses a white-to-silver gradient, which is what renders.
- The logo's aspect changed from the old 3.4:1 to 4.25:1, so `LogoLink` now derives `height` from `width`
  rather than taking both as props. Declaring the old 205x60 would have shifted the header on first paint.
- **Icons:** every icon is the circular monogram alone, cropped out of the lockup - the full lockup is unreadable
  at 16px. `scripts/make-icons.mjs` writes favicon.ico (16/32/48, PNG inside the ICO container), app/icon.svg,
  app/apple-icon.png (180, on white, because iOS composites transparency onto black) and the 192/512 PNGs for the
  web app manifest.
- **A trap worth remembering:** `proxy.ts` rewrites any single-segment path with a file extension to a 404
  (hardening against `/.env`, `/wp-login.php`). Every root-level metadata file Next emits has to be added to
  `ROOT_FILES` or the browser's icon and manifest requests come back as 404s. That is what happened to
  /icon.svg, /apple-icon.png, /manifest.webmanifest and the two PNGs on the first pass.

**Cloud Services.** Rebuilt to the revamp frame (file `IldSD5373EYodtZ2XH17uk`, node `8705:3814`, 1440x6695) as
a **template variant**: `app/(site)/services/[pillar]` routes only `cloud-services` to the new layout and every
other pillar and sub-service still renders the untouched shared `PillarPage`. Two design-system differences are
scoped to the page rather than adopted site-wide, both under `.cloud-v2`:

- a **1200** content column (the revamp lays out at 1440 on x 120-1320; `container-site` gives 1344 there);
- **Poppins** and **DM Sans**, loaded by that page alone, with the frame's **Inter mapped to DM Sans** rather than
  loading a third family for two bands.

Both should move into `@theme` if the revamp rolls out site-wide. Full inventory, the content held back for the
client and the question about the other pillars:
`docs/qa/evidence/inner-pages/CLOUD_SERVICES_V2.md`.

### The finalised Cloud pages, two case studies and one lead inbox (23 November 2026)

The client sent a zip of finalised designs (`Adamas_web_new design.zip`, extracted to
`design-ref/exports/new-design/`). **`Cloud.svg` supersedes every earlier Cloud reference** — Figma frames
`292:24608` and `8705:3814`, `Cloud_Services.svg`, `Cloud (1).svg`, `Frame 1000005184.svg` and the page built in
round 9. For these pages the brief overrides the earlier decision about design tokens: the designs' own fonts,
column width and spacing are followed exactly, scoped to `.cloud-v2` so the rest of the site is unaffected.

**Every page SVG has its text outlined to paths**, and three of the four matching Figma frames are older than the
zip (Cloud 6695 against 8480, Managed Services 5997 against 7252, Kubernetes 4152 against 4867), so the Figma text
could not be used. All the copy was transcribed from renders instead, and every transcribed block is listed for
proofreading in `docs/qa/evidence/cloud-final/`. New tooling for that: `scripts/qa/render-new-design.mjs`
(rasterise), `scripts/qa/slice-design.mjs` (readable bands), `scripts/qa/detect-bands.mjs` (section boundaries
from the pixels, since there is no Figma geometry) and `scripts/extract-svg-images.mjs` (pull the embedded
bitmaps out for the asset pipeline).

**Five corrections made in round 9 were reverted.** "How we helping Business", the repeated "Our tech stack"
eyebrow, the government-sovereignty text on the Advanced Tier badge, the duplicated Storage Consulting body and
the repeated Delivery Validations body are all still in the finalised design, and the client has signed it off.
They are built as drawn, per "don't redesign, reorder, shorten or improve anything", and every one is listed in
the report instead. The `$5,000*` credits figure is published for the same reason.

**Three new page types.**

- `/services/cloud-services` gains a clientele marquee, photographs on the six capability cards, carousel dots on
  the case-study rail, artwork in the phase explorer and — new — the site's contact block, which the design
  places on the page. Eleven bands where there were ten; nothing removed, nothing reordered.
- The **six Cloud sub-services** share a new template built to `Managed Services.svg`. Managed Services uses that
  design's copy word for word; the other five use their own content in the same structure and **never** another
  page's words. A slot with no content for that service renders a Draft note, visible in the preview, hidden
  publicly. Digital Transformation, Data & AI and their children are untouched.
- The **two client case studies** get their own layout, separate from the generic one the other eighteen still
  use. Both are now PUBLISHED; the rest stay DRAFT.

**Two motion components, both with the fallbacks built in rather than bolted on.** `ClientMarquee` and
`VelocityTestimonials` make the animation **opt-in after hydration**, which is what makes the required behaviour
fall out for free: the server HTML *is* the static row/grid, so no-JavaScript and `prefers-reduced-motion` are
satisfied by the same code path, and the duplicated set is never rendered in either case (so every logo and quote
is announced exactly once). The reduced-motion query is read in JavaScript rather than left to CSS for that
reason. `VelocityTestimonials` is written from scratch against `motion` — React Bits' Scroll Velocity behaviour,
none of its code, so no attribution notice attaches.

Two details worth remembering:

- **A marquee's spacing must not be a `gap`.** With the set duplicated and the track translated −50%, a flex
  `gap` leaves one set exactly half a gap narrower than the translate, which shows as a jump at the loop point.
  Spacing goes on the items as a trailing margin instead.
- **A comparison harness that forces `reducedMotion: reduce` compares the wrong layout** on a page whose design
  includes a marquee. `scripts/qa/compare-figma-page.mjs` now takes `reducedMotion: false` per page.

**One inbox for every lead.** `MAIL_TO_ENQUIRIES` was already the single recipient for the contact form, the
event registration's organiser copy and the newsletter notification, with no per-region routing anywhere. What
changed: the rate-limit notice shown to visitors used to print `enquiriesInbox()`, which would leak the delivery
address if it ever became a CRM dropbox — it now uses a separate `PUBLIC_CONTACT_EMAIL` constant. `.env.example`
documents the SMTP block properly (the unused `AWS_REGION` is gone, and `MAILER` no longer claims a `ses` mode
that does not exist), and `docs/deploy.md` gains a launch checklist with the real-send test.

**Accessibility fixes found by axe in this round:** the breadcrumb on a dark hero was rendering in its
light-background colours (about 1.5:1) — `Breadcrumb` now takes a `tone` prop; the phase explorer's inactive
numbers were 3.1:1 and its active subtitle 3.4:1; and the mega-menu portal host is now a labelled `<nav>`, since
a direct child of `<body>` otherwise puts the open panel outside every landmark.

### The ecosystem orb becomes 3D, and one inbox detail (23 November 2026, later)

**The flat polyhedron at the centre of "Why Organisations Choose Adamas" is now the handoff's three.js lattice.**
It appeared in exactly one place on the site - `components/home/Difference.tsx`, rendered on `/in/`, `/uk/` and
`/gcc/`. (`images/about/globe.webp` on the About page is a different shape and is untouched; `ServiceDifference`
on the pillar pages has no polyhedron at all.)

The handoff moved from `handoff/` into `components/polynode/`, its `.js` became a typed `.ts`, and the
`tsconfig`/`eslint` exclusions that kept it out of the gates are gone. `three` is pinned at **0.187.0** exact,
with `@types/three` to match. Four things were added to the scene for this brief: the nodes pulse while idle and
brighten on hover, the spin is **integrated from a frame delta** rather than read off a running clock (so hover
can speed it up without the rotation jumping, and a hidden tab resumes where it left off), a tap drives the same
response once on touch, and rendering stops on `visibilitychange` as well as when the orb leaves the viewport.
`THREE.Clock` is deprecated in 0.187 and warned on every page; `performance.now()` replaced it.

**`three` is never in the initial bundle, and usually never downloaded at all.** `polynode-orb.ts` imports only
*types* from three and takes the namespace as an argument, so nothing pulls the library in by reference;
`DifferenceOrb` is the gate and checks, in order: reduced motion, a viewport under 768px, `saveData`, and a
throwaway WebGL context. Only then does a 400px-margin IntersectionObserver trigger the client-only dynamic
import. The flat artwork is the poster in the server HTML at its final size and stays as the fallback, so the
box never changes and the LCP candidate is unaffected.

**Two things worth remembering:**

- **`:not([data-drawn])` is not a scope.** The entrance sequence's pre-state was first written as
  `:not([data-drawn]) > .ecosystem-card`; since the cards sit inside a `<ul>` whose parent is the stage, the
  selector never stopped matching and every card stayed invisible. Anchor to the stage itself -
  `[data-stage="ecosystem"]:not([data-drawn]) .ecosystem-card`.
- **A scale transform is not a layout shift.** The orb's entrance scales it to 0.82, which `getBoundingClientRect`
  reports and `offsetWidth` does not. The e2e test measures the latter, because that is what CLS counts.

**Also fixed in the same pass:** `inert: "" as unknown as boolean` on the testimonial row's duplicated cards -
React 19 wants a real boolean and logs "Received an empty string for a boolean attribute inert" otherwise. The
clientele marquee had the same cast. And nine next/image "width or height modified, but not the other" warnings
on the Cloud and sub-service pages: those images fix a height in CSS and let the width flex, which is what `fill`
is for, so they now use it inside a positioned box.

`scripts/qa/console-check.mjs` reports next/image's "detected as the Largest Contentful Paint" advice separately
from real faults. Scrolling a page to the bottom makes a below-the-fold image the largest thing ever painted, so
the advisory fires for images that are not the LCP - and acting on it would make LCP worse. `--no-scroll` judges
the page the way that warning means it.
