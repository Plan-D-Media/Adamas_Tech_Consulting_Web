# Round 8 — mega-menu readability and Figma fidelity (18 November 2026)

Brief: make the drafts preview (`PREVIEW_DRAFTS=true`) look like Figma for the client review on Wednesday 19
November. Everything below was measured on the drafts preview on `http://localhost:3000`.

**Status: parts 1, 2, 3 (About), 5 (homepage check) and 6 (performance) are done and measured. Part 3 for the
case-study detail page is partly done, Cloud Services is measured but not re-worked, and part 7 (the full QA chain
and the Lighthouse before/after) could not be run — see "Not done" at the end.**

---

## 1. The mega menu

### Cause

The panel did not blur because it was inside a **backdrop root**. `components/nav/Header.tsx` gives the header bar
`isolate` (`isolation: isolate`) so its glass pseudo-element can sit at `-z-10` without falling behind the page, and
an isolated element is a backdrop root: a `backdrop-filter` inside one can only sample what is painted *within that
root* — the header box — so the panel had nothing to blur and the page read straight through it.

### Change

- All four panels now render through a **portal at `<body>` level** (`components/nav/MegaMenuPortal.tsx`),
  positioned `fixed` under the header. Left edge and width are measured from the header's 1312px chrome box
  (Figma: panel x 304–1616); the top from the header bar's bottom edge, re-measured on scroll, on resize and
  through a `ResizeObserver` (the top bar folds away after 40px of scroll, so the bar's bottom edge moves).
- **Panel:** white at **95%** with `backdrop-filter: blur(24px) saturate(1.6)`, the header's border and the lift
  shadow. Solid white when `backdrop-filter` is unsupported or `prefers-reduced-transparency: reduce`.
- **Scrim:** navy `#000C33` at 30%, full viewport, fading in with the panel, under the header (z-45 vs the header's
  z-50) so the bar keeps its glass look. Clicking it closes the menu.
- The entrance animation moved from a wrapper onto the panel element itself: an ancestor at `opacity < 1` is also a
  backdrop root, so the wrapper would have killed the blur for the 200ms it ran.

### Verification — `node scripts/qa/menu-glass.mjs`

Each of the four panels opened over each of the four backdrops the brief names. "Behind-panel edge energy" is the
mean gradient magnitude inside the panel rectangle with the panel closed, versus the same rectangle with the panel
open and its *contents hidden* — so what is measured is the page as seen through the glass, not the panel's own
links. Contrast is the worst of every text colour actually used in that panel, read from `getComputedStyle`, against
the darkest 32px cell of the real composited panel (the navy featured card excluded, since it sets its own contrast).

| Backdrop | Edge energy behind the panel | Worst panel text contrast |
|---|---|---|
| Dark hero (`/in/`) | 8.2–9.0 → 0.1 (**−99%**) | 5.68:1 (needs 4.5) |
| Partner logo strip | 4.4–7.0 → 0.1 (**−98 to −99%**) | 5.83:1 |
| White section (`/about`) | 8.6–11.8 → 0.0–0.1 (**−99 to −100%**) | 5.93:1 |
| Photograph (case-study solution band) | 7.6–10.0 → 0.0–0.1 (**−99%**) | 5.87:1 |

All 16 combinations: portal confirmed at `<body>`, blur applied, scrim present, **contrast passes everywhere**
(worst 5.68:1 against a 4.5:1 requirement). Text behind the panel is not readable: edge energy collapses by 98–100%.
Screenshots: `docs/qa/evidence/menu/<backdrop>-<panel>.png`.

### Behaviour kept — `node scripts/qa/probe-menu.mjs`

A portal loses DOM order, so Tab in and out of the panel is now driven explicitly in `MegaMenu.tsx`.

| Behaviour | Result |
|---|---|
| Enter opens | pass |
| Panel host is a child of `<body>` | pass |
| Tab from the trigger lands inside the panel (QA BUG-008) | pass |
| Esc closes and returns focus to the trigger | pass |
| Hover intent: pointer away closes | pass |
| Tab out of the far side closes and continues to the next trigger | pass (3 tabs, focus lands on `header.services`) |

**One real regression was found and fixed during this.** React routes portal events up the *React* tree, so the
scrim counted as a descendant of the trigger's `<li>` and moving the pointer onto it never fired that `<li>`'s
`onPointerLeave` — the menu stayed open wherever the pointer went. The scrim now starts the close delay on
`onPointerEnter`.

### e2e

`tests/e2e/navigation.spec.ts` against the dev server: **5 of 8 pass**. The three failures are **not** regressions:

- `keyboard: Enter opens…` and `the panel closes when focus leaves it` — the spec presses a key immediately after
  `page.goto` with no settle wait. On a dev server hydration has not finished, so the one-shot keypress is lost and
  no amount of waiting afterwards recovers it. Reproduced directly in `probe-menu.mjs`: `no-wait Enter → false`,
  `after 3s Enter → true`. These specs are written for a production build, which hydrates far sooner.
- `every internal link … answers 200 in one hop` — timed out crawling every link against the dev server.

**These must be re-run against a production build** (part of the blocked QA chain below).

### Gating check: the "30% Boosting Cash Forecasting" featured card

The gate already exists and is in the right place: `featuredFrom()` in `lib/data/site.ts` returns the card only when
the linked case study's status is visible, and `sap-treasury-cash-forecasting` is `DRAFT`. The same figure is gated
in three other places (`content/navigation.ts` descriptor on a DRAFT nav row, `content/solutions.ts` tagline on the
DRAFT asset-tracking solution, `content/blocks.ts` `home.topStories` item via the link gate).
**Confirmed present in the drafts preview, as designed. NOT yet re-confirmed absent in a public build** — that needs
`PREVIEW_DRAFTS=false`, which needs a build. See "Not done".

---

## 2. Section inventories

Measured with `node scripts/qa/compare-figma-page.mjs <page> http://localhost:3000` at 1920, against the frame
renders in `design-ref/renders/`. Side-by-side images (Figma | ours | diff) per section are in
`docs/qa/evidence/inner-pages/compare/<page>/`.

**How to read the match figure.** It is a pixel comparison of layout *and words*. These pages render the client's
content from the database while the frame carries the designer's placeholder copy, so a band whose structure is
exactly right still reports a large mismatch wherever the text differs. The hero below is the clearest case: it is
structurally correct and scores 61% purely because the client's copy is not the designer's. Height is the more
honest layout signal, and the page totals are now within 1–3% of the frames.

### About us (Figma 274:1617, frame 12605px — ours 12256px)

All sixteen bands are now built, in the frame's order. Before this round, eight were.

| Section | Built | Visible in drafts | Visible in public | Match at 1920 | Remaining differences |
|---|---|---|---|---|---|
| Hero "About Adamas" | yes | yes | yes | 61.4% | Client copy, not the design's ("About Us / Innovative Solutions for a Better Tomorrow"). Photo and scrim now match (mean luminance 179 vs the frame's 182). +48px for the breadcrumb. |
| Our Company | yes | yes | yes | 90.1% | +313px: the client's paragraphs are longer than the design's. "12 Years" figure now drawn, marked DRAFT. |
| Our Approach (04 steps) | yes | yes | yes | 86.9% | −39px. Copy differs. |
| Partner logo strip | **new** | yes | yes | 91.0% | +90px: the strip wraps its caption area. Fed from Certification rows (kind=partner), not the design's images. |
| Video + Our Commitment | **new** | yes | no | 92.3% | +11px. Designer's copy; no film supplied, so the play control links to /contact. |
| Our Strategic Direction | **new** | yes | no | 90.2% | +116px: the design clips its right-hand card text, ours wraps. "Middle East" → "GCC". |
| Progress in Numbers | **new** | yes | no | 96.2% | +78px. Nine neutral placeholders; HCLTech's figures never rendered. Globe included. |
| Our Expertise | yes | yes | yes | 84.3% | +103px. Now the design's three photo cards. Client copy has **six** items against three slots — see questions. |
| Our Journey | yes | yes | no | 79.4% | −122px: the design's year rail (2020–2029) is not built; ours is a milestone list. |
| Clients & Partners | **new** | yes | no | 83.7% | +110px. Nine-tile ring with the dashed circle; the design's Lorem Ipsum/HP logos never used. "150+ Satisfied Clients…" marked DRAFT. |
| Statement + testimonials | **new** | yes | no | 87.7% | +87px. Two stepped rows kept; eight neutral placeholders, never "Miyah Myles". |
| Life at Adamas | **new** | yes | no | 86.8% | +146px. Collage and video card built; the eight floating labels are not (all sit outside the 1920 frame and are invisible in the render). |
| CTA band + statistics | **new** | yes | no | 91.3% | −65px. Four neutral placeholders; "1790/491/245/1090" never rendered. Telephone from the Region row. |
| Our People | yes | yes | no | 81.6% | +209px. Person rows are all DRAFT; the design's stock names never used. |
| Award badges | **new** | yes | yes | 84.6% | +155px. Five slots; the design's template badges never used. |
| Contact form | yes | yes | yes | 91.4% | +49px. Shared component. |
| Footer | yes | yes | yes | 95.0% | +105px. |

**A correction to the previous round's measurement.** `contact` was being compared against the whole of Figma's
Group 21307, which is the contact card **and the footer**. That is why it read 44%. Split correctly, contact is
91.4% and the footer 95.0% — nothing was wrong with the build.

### Case-study detail (Figma 274:8299, frame 12307px — ours 5916px)

| Section | Built | Visible in drafts | Visible in public | Match at 1920 | Remaining differences |
|---|---|---|---|---|---|
| Hero | yes | yes | yes | 66.9% | +139px. Was 52.1%: the band had been mapped over the photo strip below it. |
| Photograph strip | **new** | yes | no | 84.2% | +26px. The frame's own photograph as a Draft placeholder. |
| Executive summary | yes | yes | yes | 88.0% | −2px. Was 88% only after correcting the band from [943,1400] to the panel's real [833,1535]. The frame's two article cards with images on the right are not built. |
| The business challenge | yes | **no** | no | not rendered | This case study has no challenge block. |
| Our solution | yes | yes | yes | 56.5% | −951px. The product screenshot is now in (Draft placeholder, two-column). The frame's second half of this band — "Key solution capabilities", 814px of capability cards with images — is **not built**. |
| Technology architecture | yes | yes | yes | 94.0% | −322px. |
| Results and business impact | yes | yes | yes | 88.1% | −449px. |

**The "facts strip" does not exist in the Figma frame.** Round 7 recorded it as "Figma y 1260–1400: INDUSTRY, FOCUS
AREA, SOLUTION, TECHNOLOGY, PROJECT TYPE"; there is no such text anywhere in 274:8299, and the band it was scored
against (850–940, "74%") is the top edge of the executive-summary panel. The strip is **our own addition** and is on
the allowed-differences list; it is no longer scored against someone else's band.

The page is less than half the frame's height because several frame sections have never been built: the existing
process diagram (2352–3127), project objectives (3237–3837), key solution capabilities (4759–6070), the structured
approach graphic (6180–6875), before/after (7813–8472) and the illustrative interface (9642–10171).

### Cloud Services (Figma 292:24608, frame 11313px — ours 11287px)

All twelve bands are present. This page needed no rebuilding.

| Section | Built | Visible in drafts | Visible in public | Match at 1920 | Remaining differences |
|---|---|---|---|---|---|
| Hero | yes | yes | yes | 92.3% | ±0px. Title and image match. |
| About cloud transformation | yes | yes | yes | 77.8% | +262px: our four capability chips stack where the design keeps them in one row. |
| What makes CloudSMART different | yes | yes | yes | 92.4% | +45px. Four stat cards present; "500+" is DRAFT. |
| Our cloud expertise | yes | yes | yes | 92.7% | +246px. |
| Platform accordion | yes | yes | yes | 93.3% | +24px. |
| Industry mosaic | yes | yes | yes | 89.5% | −28px. |
| Services & capabilities + detail card | yes | yes | yes | 96.2% | −17px. |
| Case-study cards | yes | yes | partly | 75.8% | +142px. Real case studies replace the design's "Concept showcase" cards (allowed difference); cards linking to DRAFT studies drop out in public. |
| Technology ecosystem | yes | yes | yes | 95.7% | +46px. Vendor tiles shown in drafts. |
| Quality & trust + diagram | yes | yes | yes | 96.4% | −36px. |
| Two-column FAQ | yes | yes | yes | 96.4% | −10px. |
| Contact card | yes | yes | yes | 91.2% | +49px. |
| Footer | yes | yes | yes | 95.0% | +57px. |

### Homepage check (Figma 236:1395, frame 13566px — ours 13646px)

`npx tsx scripts/compare-figma.mts http://localhost:3000 /in/ round8`. **No homepage section is hidden or changed in
the drafts build.** All fifteen bands render: hero 92.9%, Top Stories 90.6%, Partners 94.3%, About Adamas 93.2%,
Services 92.8%, Products & Solutions 92.4%, Client Outcomes 91.8%, Industries 94.8%, The Adamas Difference 96.1%,
Events 90.6%, Latest Perspectives 93.0%, Tech Excellence 97.5%, Our Presence 99.1%, Contact 99.0%, Footer 97.6%,
header 95.5%, Services mega panel 89.6%.

### Responsive — `node scripts/qa/responsive-check.mjs`

/about, /case-studies, the case-study detail page and /services/cloud-services at 1440, 1024, 768 and 390:
**no horizontal overflow at any width, every page 200.**

One real bug was found and fixed: the new Clients ring put absolutely-positioned 174px tiles at percentage `left`
offsets from `lg` (1024px) up, so between 1024 and 1279 they stuck out of the narrowed container and the page
scrolled sideways by 11–20px. The ring is now gated to `xl`; below that the logos are a plain grid.

---

## 3. The allowed differences from Figma

Every deliberate difference, as the brief asks:

1. **Sitemap service names** — the client's renames (Smart Parking → Industrial Analytics, Cash Forecasting →
   Asset Tracking) replace the design's labels in the menu, footer and solution rows.
2. **Real case studies** in place of the design's "Concept showcase" cards on Cloud Services.
3. **British English** throughout, except client and product names.
4. **"GCC"** wherever the design says "Middle East" — including the new Strategic Direction item 2.
5. **Placeholder copy hidden in the public build** — every band marked "Visible in public: no" above.
6. **Breadcrumbs** on the About and case-study heroes. The design has none; every inner page needs the trail and the
   `BreadcrumbList` data (brief section 10). Adds ~48px to each hero.
7. **A facts strip on the case-study detail page** (industry / focus area / service / technology / region). Not in
   the frame at all; it is our addition.
8. **The About hero's local wash.** Measured on the frame's own render, the design puts white 46–62px type over
   parts of the photograph at **2.29:1 (p95) and 1.50:1 at worst** — below the 3:1 large-text minimum. Overall
   brightness now matches the design (179 vs 182 mean luminance), but a soft ellipse darkens the text column so the
   type passes: **5.36:1 at worst** (`node scripts/qa/hero-contrast.mjs`).
9. **Our Expertise shows three of the client's six items** — the design has three slots. See questions.
10. **"Life at Adamas" floating labels not built** — all eight sit outside the 1920px frame and are invisible in the
    design render.
11. **AboutCredentials is no longer a section on /about.** It used to stand in for the y 6440–6877 band; that band
    is now the frame's own "Organisations That Inspire Our Work". The certifications appear as badges in the awards
    row and in full on `/credentials`.
12. **The mega-menu panel is more opaque than the design** (white 95% rather than the design's flat `#CCCDCF`
    panel), with a page scrim behind it — the readability fix this round was asked for.
13. **The case-study "Our solution" band is two columns in drafts, one in public**, because the product screenshot
    it sits beside is a Draft placeholder.

---

## 4. New Draft and placeholder items

All of these are drafts-preview only unless stated. They are the client's to supply; added to
`docs/qa/evidence/phase2/client-content-request.md`.

**Designer's copy awaiting approval** (`lib/figma-draft.ts` — deliberately not in the database, so it cannot be
published by accident):

- About "Our Commitment": eyebrow, heading, body, button and the three statement pills.
- About "Our Strategic Direction": eyebrow, heading, lead and all five items.
- About "Progress in Numbers": heading and lead.
- About "Clients & Partners": eyebrow, heading, body, button.
- About statement band: the statement and its closing line.
- About "Life at Adamas": eyebrow, heading, video label.
- About CTA band: eyebrow and heading.

**Unverified figures, built as designed and marked DRAFT:**

- "12 Years' Experience In It" (About, Our Company).
- "150+ Satisfied Clients. 1M+ ROI Increased" (About, Clients & Partners).
- "500+" (Cloud Services, CloudSMART stat cards) — already DRAFT before this round.

**Neutral placeholders inside a kept layout** (the design's filler is never rendered, in the preview or anywhere):

- Nine "Progress in Numbers" cards — HCLTech's $14.8B / 230K+ / 60 / 167 / 205 / 70+ / 18K+ / 2,200+ / 26.
- Eight testimonial cards — the repeated "Miyah Myles" quote.
- Nine client logo tiles — the Lorem Ipsum marks, "Happy Marts", HP.
- Five award badges — the template's Clutch and "Top … Companies 2021" marks.
- Four CTA statistics — 1790 / 491 / 245 / 1090.
- Leadership rows continue to come from the Person table, never the design's Robert Amplilian / Maggie Strickland /
  Stephen Mearsley.

**Designer's photographs shown in the preview with a Draft note** (client photography still needed): the Commitment
video poster, the three Our Expertise cards, the five Life at Adamas photos and its video still, the statement
band's backdrop, the case-study hero photograph and photo strip, and the case-study product screenshot.

---

## 5. Questions for Mithu

1. **About hero copy.** The frame says "About Adamas / Technology That Moves Businesses Forward"; the database
   carries the client's "About Us / Innovative Solutions for a Better Tomorrow". We kept the client's, per the rule
   that client content wins. Which should the client see on Wednesday?
2. **Our Expertise has six client items against three design slots.** Currently the first three are shown and the
   other three are listed under the band for the reviewer. Which three belong there, or should the design grow to
   six? (In `CONTENT_TODO.md`.)
3. **AboutCredentials off /about** — the certifications now appear as badges in the award row and in full on
   `/credentials`. Is that acceptable, or should the detailed list stay on About as an extra section?
4. **Our Journey** is a milestone list; the frame has a 2020–2029 year rail with a card per year. The years are
   unconfirmed. Build the rail with DRAFT years, or leave the list until the client confirms the dates?
5. **The case-study detail page is half the frame.** Six frame sections have never been built (existing process,
   project objectives, key solution capabilities, structured approach, before/after, illustrative interface). Should
   they be built with the frame's conceptual content as Drafts, like About?
6. **No film exists** for the two video cards (About Commitment, Life at Adamas). Both currently link out. Is a film
   coming, or should they become plain images?
7. **The design's hero type fails contrast** (1.50:1 at worst). We fixed it with a local wash — please confirm the
   designer is happy with the slightly darker text column.

---

## 6. Not done this round

- **The full QA chain (`npm run qa:chain`) and the Lighthouse before/after were not run.** Both need a production
  build, and the machine has been at **2.0–2.5 GB free** against the 4 GB floor for builds all session. PostgreSQL
  is up; memory is the only blocker. Nothing in this round has been seen in a production build.
- Because of that: the three failing `navigation.spec.ts` specs are unconfirmed against a build, the public-build
  gating check for the "30%" featured card is unconfirmed, and there are **no Lighthouse numbers** for `/in/`,
  `/about`, `/services/cloud-services` or a case-study page.
- The case-study detail page's six missing frame sections (question 5).
- Cloud Services was measured but not re-worked; "About cloud transformation" (77.8%) and the case-study cards
  (75.8%) are the two bands worth a pass.
- About's "Our Journey" year rail (question 4).

### To finish it

```
# with 4 GB+ free:
npm run qa:chain
npx tsx scripts/qa/lighthouse.mjs ...   # /in/, /about, /services/cloud-services, one case study, median of 3
node scripts/qa/lcp-report.mjs drafts drafts-after
```
