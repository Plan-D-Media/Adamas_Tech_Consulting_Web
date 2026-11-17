# AdamasTech: Build the newly designed inner pages from Figma

You are the same principal front-end engineer as before, with more than 20 years of experience building enterprise sites at the level of HCLTech, Infosys and IBM. Everything in these files still applies:
- `docs/MASTER_BRIEF.md`
- `docs/qa/QA_PROMPT.md`
- the memory rules from the Phase 2 completion brief

## 0. Timing: don't interrupt the current run

- **Let the Phase 2 run chain finish and report first:** the drafts build, the public build, the final regression, then the GTM dummy-container check.
- **While you wait for memory, do the light work:** fetch the Figma data, map the frames, write the code, run `tsc` and lint. Start no build, server, Playwright, Lighthouse or axe job until the Phase 2 chain is done.

## 1. Read the new designs from Figma

The designer has finished new pages in the same file.
- File key: `vpITDkp55Gla7w1HEP6zaL`
- Page: **"v2 uPDATED"**. Node `328:2099` turned out to be a "Container" inside About us; the real frames are:

| Figma frame | Node | Route |
| --- | --- | --- |
| About us | `274:1617` | `/about` |
| CASE STUDY (detail; the SAP Treasury story) | `274:8299` | `/case-studies/[slug]` |
| Carrer | `274:2667` | `/about/careers` (stays DRAFT) |

- Token: `FIGMA_TOKEN` in `.env.local`, as before.

**Pages with no Figma frame. Build them as follows:**
- **Service pillars and sub-services:** extend the Cloud Services template (`292:24608`).
- **The `/case-studies` listing, its filters and its empty state:** build them from the tokens, using the homepage case-study card and the Cloud Services card patterns. Take screenshots for the designer to review.
- **`/about/team` and `/credentials`:** simple pages that reuse the About us leadership and certification blocks (same components, same tokens).
- **The placeholder leadership names in Figma** (Robert Amplilian, Maggie Strickland, Stephen Mearsley) must never be public. Use the real leadership rows from the database. They stay DRAFT until the client confirms them.

**Steps:**
1. List every frame on that page and under that node.
2. Save the node JSON to `design-ref/figma/` and the renders to `design-ref/renders/`, as before.
3. Check whether the Home Page, Mega Menu or Cloud Services frames have changed since your last fetch (compare the file version or `lastModified`). If they have, list exactly what changed and **ask me before applying it**.
4. Ignore the "About our Company: HCLTech" reference layer. Never use its text, images or layout.

**Map each frame to a route** using `docs/sitemap-latest.csv`, and show me the map in your first report:

| Figma frame | Route(s) |
| --- | --- |
| Service pages (pillar and/or sub-service) | `/services`, `/services/[pillar]`, `/services/[pillar]/[sub]` |
| About Us | `/about`, plus `/about/team` and `/credentials` if they're designed |
| Case studies | `/case-studies` (listing) and `/case-studies/[slug]` (detail) |
| Careers | `/about/careers` |

If a frame doesn't fit any route, or a sitemap page has no frame, list it. Don't guess.

## 2. Build order (launch is 24 November)

1. **Service pages:** both pillar pages and every sub-service page.
   - Reuse and extend the existing Cloud Services template components. Don't fork a second template.
   - Where a new frame differs from Cloud Services, add a variant to the shared component.
   - Every sub-service page renders from its own database row.
2. **About Us**, then Team and Credentials if they're designed.
3. **Case studies:** the listing, with filters for service, industry and region that work without JavaScript as plain links, and the detail page.
   - All 20 case studies are DRAFT until the client approves them.
   - The public build must still pass, and the listing must look right with zero published case studies: an empty state built from the design tokens, with a Contact CTA.
   - Keep the "Case Studies" nav link visible.
4. **Careers:** build the page to Figma, with a `Job` model (`status`, `publishedAt`, `sortOrder`, location, region, type, description).
   - **Careers is Phase 2.** Keep the page DRAFT, so it's hidden from the public and the menu still shows "Careers (coming soon)".
   - **Don't build the application or CV-upload backend now.** If the design has an Apply button, wire it to a `CAREERS_APPLY_URL` or `CAREERS_EMAIL` env variable. Show the button only when that variable is set.

Report after (1) and after (3).

## 3. Same quality bar as the homepage

- **Fidelity:**
  - Use tokens from `docs/design-tokens.md`. If a frame introduces a new colour, type style, radius or shadow, add it as a token and list it.
  - Process assets through the existing pipeline. Export missing images and icons from Figma.
  - Use the fixture method: render Figma's own placeholder copy so content differences drop out. Aim for a pixelmatch of 90% or more per section at 1920. Report the match for each section.
- **Content:**
  - Content comes only from the database or `/content`. No invented copy, figures, client names or job listings.
  - Figma placeholder copy is never public: gate it at block level with `lib/public-copy.ts`.
  - The existing rules still hold: British English, client service names as written, external links for solutions, "GCC", never "Middle East".
- **Responsive:** no mobile frames exist. Test 1920 to 360 with no overflow, and log every responsive decision in `docs/design-notes.md` for the designer.
- **Performance:**
  - Server components by default; client components only where the page needs interactivity.
  - Each template's LCP image gets `priority` and `fetchpriority="high"`.
  - The pages must not raise TBT above the homepage's. Run `scripts/qa/lcp-report.mjs` on one page per template.
- **Accessibility:** one H1, a logical heading order, keyboard-operable tabs, accordions and filters, axe with zero serious or critical issues, and every page fully visible without JavaScript.
- **SEO:**
  - Metadata from the database, canonical URLs, breadcrumbs, and BreadcrumbList JSON-LD.
  - `Service` schema on service pages.
  - `Article` schema on case-study detail pages.
  - `JobPosting` schema only for published jobs.
  - Add new public pages to `sitemap.xml` only when they're published.
- **Tests:** extend `tests/e2e/` for each template: page loads, nav and breadcrumb links, filters (case studies), accordions and tabs, the draft gate (DRAFT hidden in the public build), and the no-JS render.

## 4. Content and design gaps

- **Client content:** add each new gap, whether copy, images or a decision, to `docs/qa/evidence/phase2/client-content-request.md`. Keep its Part A / B / C grouping by urgency.
- **Designer:** add each design question for Mithu (missing states, empty states, mobile) to a short list in `docs/design-notes.md`.

## 5. Rules (unchanged)

- Don't change the approved design or the client's content to fix a bug. If a change would affect either, ask first.
- Don't touch the Neon database or the Vercel settings.
- Don't run `git commit` or `git push`, and add no AI attribution lines.
- One heavy job at a time, with the memory floors: 4 GB for builds, 3 GB for QA runs.
- GSAP motion (Part 3 of the QA prompt) is still on hold until I say go.

## 6. Report when done

1. The frame-to-route map, and any frames or pages left over.
2. Pages built, with their routes and screenshots at 1440 and 390.
3. The Figma match per section, and new tokens added.
4. Results for e2e, axe and LCP on each template.
5. What's DRAFT or hidden publicly, and the new client-content items.
6. Questions for the designer.
