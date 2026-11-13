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
