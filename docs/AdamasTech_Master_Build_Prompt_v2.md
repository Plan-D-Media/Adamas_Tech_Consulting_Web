# Master build brief: AdamasTech Consulting website (Phase 1, approved design)

## 0. Your role

You are a principal front-end engineer with more than 20 years of experience building enterprise corporate websites at the level of hcltech.com, infosys.com and ibm.com. You care about pixel-accurate implementation, performance, accessibility and clean, maintainable code. When the design gives a value, you read it rather than guess. You never invent content.

The client is **AdamasTech Consulting** (adamastechconsulting.com), an IT consulting company with offices in India, the UK, the Gulf and the US.

Read this whole brief before writing any code. Then follow the working method in section 13.

---

## 1. What has changed since the last brief

- Until now this project held a **design prototype**. The client has now **approved the final design in Figma**. **The Figma file is the design source of truth.** Build it exactly. Don't redesign it, and don't fall back on the prototype's look.
- This same project becomes the final build. Keep the parts of the prototype that still apply: the routing, Prisma schema, data layer, seed, Basic Auth, draft and archive logic, and the no-JS fixes (section 9). Replace its visual layer, starting with the scope of this round.
- **The Gulf homepage URL changes from `/ae/` to `/gcc/`**, a client decision recorded in the sitemap (section 4).
- **The nav order is now About Us · Services · Solutions · Case Studies · Insights.**

---

## 2. Project and inputs

- **Project folder:** `Adamas_tech_consulting_web`, the folder you're running in, on the E: drive. Work only inside it.
- **Figma file** (design source of truth): https://www.figma.com/design/vpITDkp55Gla7w1HEP6zaL/Adamas-Web?node-id=236-1394
  - File key: `vpITDkp55Gla7w1HEP6zaL`
  - Start node: `236:1394`
  - It contains the final **Home Page**, the **Mega Menu** (opens on hover over the nav) and **one service page (Cloud Services)**. The Cloud Services design is the template for every service page.
- **Designer's SVG exports:** already in this project folder. Find them (section 6).
- **Sitemap:** `docs/sitemap.pdf` and the latest "Sitemap & Pages" sheet. If the sheet's CSV is in the project, use it. Where the sheet's "Adamas tech comment" column renames something, the comment wins.
- **Existing docs:** `CONTENT_TODO.md`, `docs/PLAN.md`, `docs/design-notes.md`. Update them; don't start new copies.

---

## 3. Locked technology (don't change)

- **Frontend:** Next.js 16 (App Router, SSR/ISR, cacheComponents), TypeScript, Tailwind CSS.
- **Backend:** Node.js inside Next.js (server components, route handlers, server actions), **Prisma 6.19.3 (pinned, don't upgrade)**, PostgreSQL.
- **Motion:** GSAP + ScrollTrigger for scroll-driven sequences; Motion (`motion/react`) for hover, menu, tab and component transitions; Lenis for smooth scrolling, as long as it doesn't hurt accessibility.
- **Media:** `MEDIA_BASE_URL` env variable. Locally, serve from `/public/media`; in production, from AWS S3 + CloudFront.
- **Databases:**
  - Local: PostgreSQL 16 on E:, database `adamas`.
  - Preview: Neon, connected through Vercel env vars.
  - Production: AWS RDS, later. Don't change any connection strings.
- **Env flags already in use:** `PREVIEW_DRAFTS`, `SHOW_DRAFT_BADGES`, `BLOCK_INDEXING`, `PREVIEW_USERNAME`/`PREVIEW_PASSWORD` (Basic Auth in `proxy.ts`). Keep them working.
- **Content lives in the database, never hard-coded in components.**
  - Every text block, image, stat, service, solution, case study, event, office, nav item and footer link is a Prisma model, seeded from typed files in `/content` through `prisma/seed.ts`.
  - Pages read it through `lib/data/*`.
  - A CMS portal will be built on this same database in Phase 2, so keep the schema clean and editor-friendly: `status` (DRAFT / PUBLISHED / ARCHIVED), `publishedAt`, `updatedAt`, `sortOrder`, and SEO fields where relevant.
- **Schema changes:** create a proper Prisma migration and keep `npm run db:setup` (`prisma migrate deploy && prisma db seed`) working. Tell Swayang when the Neon preview database needs the new migration.

---

## 4. Regions and URLs

- **Three regional homepages: India `/in/`, UK & Ireland `/uk/`, GCC `/gcc/`.**
- **Changing `/ae/` to `/gcc/`:**
  - Update the routes, `generateStaticParams` (in, uk, gcc), the region cookie values, the bare-`/` redirect, the region switcher, the Logo link, `sitemap.xml`, hreflang, internal links and the seed data.
  - If the database stores the region key as `ae`, migrate it to `gcc` with a Prisma migration plus a data update, and update the sync scripts.
  - Add a **301 from `/ae/` and `/ae/*` to `/gcc/`**, and update the redirect table: the old WordPress `/ae` now goes to `/gcc/`.
- **Always label the Gulf region "GCC"** in the UI, including the switcher, footer, headings and body text. Never write "Middle East".
- **Region switcher options, in this order:** India · UK & Ireland · GCC.
  - It swaps the homepage only; the navigation is the same everywhere.
  - It sets a `region` cookie.
  - Keep it instant with `<Link prefetch>`.
- **Only the bare `/` redirects.** On `/`, the region cookie decides first; otherwise the IP country:
  - IN → `/in/`
  - GB, IE → `/uk/`
  - AE, SA, QA, KW, BH, OM → `/gcc/`
  - Any other country → `DEFAULT_REGION` (config).
  - Never redirect inner pages.
- **hreflang**, on homepages only:
  - `en-IN` → `/in/`
  - `en-GB` and `en-IE` → `/uk/`
  - `en-AE`, `en-SA`, `en-QA`, `en-KW`, `en-BH` and `en-OM` → `/gcc/`
  - `x-default` → `/`
- Inner pages are one global version in **British English**.

---

## 5. Step 1: Read the design from Figma

The designer's Figma plan has no Dev Mode, so read the file through the **Figma REST API**.

- **Token:** Swayang will put a read-only personal access token in `.env.local` as `FIGMA_TOKEN`. Check that `.env.local` is in `.gitignore`. **Never print, log or commit the token.** If it's missing, stop and ask for it.
- **Steps:**
  1. `GET https://api.figma.com/v1/files/vpITDkp55Gla7w1HEP6zaL?depth=2` (header `X-Figma-Token: $FIGMA_TOKEN`) lists the pages and top-level frames. Identify the Home Page, Mega Menu and Cloud Services frames, plus any variants: regional homepages, sticky header, hover states, mobile frames. Report what you find.
  2. `GET /v1/files/vpITDkp55Gla7w1HEP6zaL/nodes?ids=<frame ids>` returns the full node trees. Save the JSON to `design-ref/figma/` (add `design-ref/` to `.gitignore`) and work from the saved copies. The API is rate-limited, so re-fetch only when the design changes.
  3. `GET /v1/images/vpITDkp55Gla7w1HEP6zaL?ids=<frame ids>&format=png&scale=1` downloads a reference render of each frame into `design-ref/renders/`. These are your comparison targets (section 11).
  4. From the node data, extract the exact values:
     - fills (hex and opacity) and gradients (stops and angles)
     - text styles: font family, weight, size, line height, letter spacing
     - auto-layout padding and gaps
     - corner radii and strokes
     - effects: shadows and blurs
     - frame width, content container width, and the grid
  5. Variables are not available through the API on this plan, so derive the tokens from the nodes and styles.

---

## 6. Step 2: Design tokens and assets

### Tokens (one central place)

- Put every colour, font, type size, spacing step, radius, shadow and breakpoint in **one** place: CSS variables in the global stylesheet, wired into the Tailwind theme.
- Components use the tokens, never raw hex values or magic pixel numbers. The brand guidelines may still adjust colours and fonts, and one edit to the token file must restyle the whole site.
- Replace the prototype's palette and fonts with the Figma values. Where the prototype guessed (Archivo, Figtree, logo-sampled colours), the Figma values win.
- **Fonts:** take the family and weights from the Figma text nodes.
  - If it's a Google Font, load it with `next/font/google` (latin subset, `display: swap`, only the weights used).
  - If it isn't, stop and tell Swayang which font files are needed. Use a metric-matched fallback in the meantime.
- Document all tokens in `docs/design-tokens.md`, as a table.

### Assets

The designer's SVG exports in this folder are the source. **Don't edit or delete the originals.** Put the processed output under `public/media/` (served through `MEDIA_BASE_URL`).

- **Photos wrapped in SVG:** large files with an embedded base64 image, e.g. `ABOUT ADAMAS IMG.svg`, `Cloud Services IMG.svg`, `Healthcare IMG.svg`, `Rectangle 3793.svg`.
  - Extract the embedded raster and convert it with `sharp` to AVIF and WebP at 1x and 2x of the rendered size.
  - Serve it with `next/image` and correct `sizes`.
  - Never ship a multi-megabyte SVG.
- **True vector SVGs** (icons, flags, social icons, line graphics):
  - Optimise them with SVGO and use them as inline React components or one sprite, so they inherit colour.
  - The industry icons come in `_D` and `_W` pairs. Use one `currentColor` icon per industry instead of two files where possible.
- **Text exported as SVG** (e.g. `PRODUCTS & SOLUTIONS.svg`, `TOP STORIES.svg`, `The adamas difference.svg`): check each against Figma.
  - Real headings must be HTML text.
  - Purely decorative graphics, like the large outline background words, stay as SVG with `aria-hidden="true"`.
- **Unnamed files** (`Rectangle 2137`, `Group 21304`, `Frame 12455`, hashed names and so on): match each one to its Figma node by size and position, then give the processed copy a meaningful name, e.g. `home-about-team.avif`.
- **Missing assets** (logo, partner logos, certification badges, world map with pins and arcs, hero images or video, House of Lords image, contact photo):
  - Export them from Figma: `/v1/images?ids=<node id>&format=svg` for vectors, or `format=png&scale=2` for raster images.
  - Export the world map's pins and arcs as separate layers so they can animate.
- **Hero video:** if the Figma hero implies video, keep the existing `HeroVideo` component (Vimeo background player as an interim source, self-hosted MP4/WebM as the target, with a poster image). Don't load video when Save-Data is on, on slow connections or with reduced motion.
- **Record every asset** in `docs/asset-manifest.md`: processed file → original file or Figma node → where it's used.

---

## 7. Content rules

- **Verified data only.**
  - Don't invent statistics, years, clients, testimonials, awards, partner tiers, certifications or copy.
  - If a slot has no real content, use a designed placeholder, mark it DRAFT, and log it in `CONTENT_TODO.md`.
  - The founding-year conflict (1995 / 2021 / "22+ years") stays unresolved: don't show any of those values.
- **Use the text in Figma**, with these corrections:
  - "Middle East" → **"GCC"**.
  - "Whats's Next" → **"What's Next"**.
  - Cloud sub-services, renamed by the client in the sitemap: **Migration & Modernization, DevOps & SecOps, Managed Services, AI/ML Ops, Cloud Automation, Cloud Advisory & Consultation**.
  - Data & AI sub-services: also add **Data Engineering, Advanced Analytics, Sovereign AI, Responsible AI, and AI Security & Governance**, as in the sitemap.
  - AI Product A → **A-EYE**, AI Product B → **AIR-MIND**.
  - Smart Parking → **Industrial Analytics**; Cash Forecasting → **Asset Tracking**. Apply this in the footer as well.
  - The top-bar phone `+91 000 500 0000` is a placeholder. Use the real number for each region from the database, and log it.
- **Where Figma and the sitemap disagree on a name, the sitemap wins.** Log each difference.
- **Unverified claims in the approved design:** "100% Satisfied", "Zero Risk", and "30% improvement in cash forecasting". Build them as designed, but store them as DRAFT, so they show the draft badge when `SHOW_DRAFT_BADGES=true`. List them in `CONTENT_TODO.md` for client confirmation.
- **Filler repeated twice in the design** (the Services and Industries paragraphs): render it once and log the slot as needing final copy.
- **The "Explore Industry" buttons:** the sitemap has no industry pages. Link them to `/contact` for now, and log it as a client question.
- Fix only obvious typos and spacing. Don't rewrite the client's copy.

---

## 8. Scope of this round

Build these exactly to Figma:

1. **Global header:**
   - top bar (phone, email, social icons)
   - logo, linking to the visitor's region homepage from the cookie
   - main nav and the **mega menu**
   - region switcher
   - "Talk to an expert" button (→ `/contact`)
   - sticky state on scroll
2. **Homepage**, built as one layout that serves **`/in/`, `/uk/` and `/gcc/`** with regional content from the database.
3. **Global footer.**

Also read the **Cloud Services** frame now, so the tokens and components you create fit it. Don't build that page this round; it's next (section 13).

Every other existing prototype page must keep working and stay reachable from the new nav and footer, with no 404s. Once the new tokens are in place, those pages may look partly restyled. That's expected; they'll be rebuilt to Figma in later rounds.

### Header and mega menu

- **Nav order:** About Us · Services · Solutions · Case Studies · Insights. **Case Studies** is a direct link; the other four open mega menus. Follow Figma for the exact panel layout and contents.
- **Menu contents come from the database** (nav models and the existing sync scripts):
  - **About Us:** Company, Team, Careers (coming soon).
  - **Services:** the 3 pillars and their sub-services, with the sitemap names.
  - **Solutions:** Arivoo (opens arivoo.in in a new tab), A-EYE, AIR-MIND and the AI solutions.
  - **Insights:** Events; Blog shows as coming soon.
- **Desktop behaviour:**
  - Opens on hover with hover intent: about 120–150 ms before opening and about 200 ms before closing, so it doesn't flicker as the pointer crosses gaps.
  - Also opens on click or tap for touch screens.
- **Keyboard and screen readers:**
  - Each trigger is a `<button>` with `aria-expanded` and `aria-controls`.
  - Enter or Space opens the panel; Esc closes it and returns focus to the trigger.
  - Tab moves through the panel, and the panel closes when focus leaves it.
  - Focus styles are always visible.
- **Animation:** the panel fades and slides slightly (under 250 ms, with Motion), and respects `prefers-reduced-motion`.
- **Sticky header:** use the Figma state if there is one. Otherwise give it a solid background with a subtle shadow after 40 px of scroll, and log the decision.
- **Mobile:**
  - The hamburger opens a full-height drawer with accordion sub-menus, the region switcher and a "Talk to an expert" button.
  - Focus stays trapped inside the drawer, Esc closes it, and body scroll is locked while it's open.
- **Search:** Figma has no search icon, so don't add one, but keep the `/search` route working.

### Homepage sections, in the Figma order

Hero with the card carousel and trust row · Top Stories slider · Partners & Certifications · About Adamas · Our Services (tabs: Cloud Services / Digital Transformation / AI Services) · Products & Solutions slider · Client Outcomes · Industries (side menu + card slider) · Why Organisations Choose Adamas (diagram) · Events & Insights (House of Lords feature) · Latest Perspectives · Tech Excellence · Our Presence (map + office cards) · Contact form · Footer.

Confirm this order against Figma and follow Figma if it differs.

### Regional differences, all from the database and not separate code

- **Hero eyebrow and supporting text:** the Figma hero shows an India eyebrow with Gulf-focused text, which is inconsistent. Use each region's own copy from the database. If none exists, use the existing seeded copy and log it.
- **Top-bar phone and email.**
- **The highlighted "Your nearest office" card and map pin:** India, as in Figma; UK, London; GCC, Dubai.
- **Region switcher label.**

### Forms

- **The contact form** saves to the database, uses a honeypot and rate limiting, sends an email notification through the pluggable mailer, and shows success and error states. It keeps the phone country selector from Figma.
- **No bound server actions.** Pass values in hidden fields; `.bind()` caused an infinite render loop without JavaScript.

---

## 9. Motion, and the no-JS rules from earlier rounds (keep these)

- GSAP + ScrollTrigger for scroll reveals and the map arcs drawing in; Motion for hover, tabs and menus; Lenis for smooth scrolling.
- Keep it subtle and enterprise-grade: every animation should reveal, guide the eye or show a relationship.
- Build what the design implies:
  - hero carousel with a progress bar, a pause control and keyboard support
  - partners strip with its pause button
  - Top Stories and Solutions sliders
  - Services tabs
  - Industries selector
  - gentle pulse on the "Why Adamas" diagram
  - map arcs and pins
- **`prefers-reduced-motion`:** no parallax, marquee, auto-advance or scrubbing.
- **Every piece of content must be visible without JavaScript.** Keep these existing fixes:
  - pre-paint reveal state set through `next/script` `beforeInteractive` + `@media (scripting: enabled)`
  - no Suspense hidden containers (they hid streamed content when JavaScript was off)
  - `export const instant = false` on the region and slug routes
  - no `dynamicParams` (not allowed with cacheComponents)
  - no bound server actions
- **Fade-in elements must never block keyboard focus.**

---

## 10. SEO and accessibility

- **Metadata** for each page comes from the database, with self-referencing canonicals, Open Graph images, and hreflang as in section 4.
- **JSON-LD:** Organization on every page; BreadcrumbList where relevant.
- **Indexing:** keep `BLOCK_INDEXING` working, so the preview isn't indexed.
- **WCAG 2.2 AA:**
  - one H1 per page and a logical heading order
  - alt text from the database
  - labelled form fields
  - text contrast of at least 4.5:1
- **The Tech Excellence card text in Figma is very light.** If it fails contrast, darken it to the nearest passing shade and log the change.

---

## 11. Quality bar (must pass before you report done)

- **Visual match:**
  - Use Playwright to screenshot each homepage at the Figma frame width and compare it with `design-ref/renders/`, using `pixelmatch` or an overlay.
  - Fix every visible difference, then compare again until the match is as close as you can get it.
  - Save side-by-side comparisons to `screenshots/round5/` for `/in/`, `/uk/` and `/gcc/` at 1920, 1440, 1280, 1024, 768 and 390, plus one with the mega menu open for each of the four panels.
- **Widths wider than the design:** keep the content container centred and let backgrounds run full width.
- **No mobile frames yet:** build a careful responsive version from the same tokens, following the patterns of enterprise sites. Record every decision in `docs/design-notes.md` for the designer to confirm.
  - No horizontal scroll at any width.
  - No orphaned single words in headings.
- **Performance** (mobile Lighthouse on a production build, `next build && next start`):
  - Targets: LCP under 2.5 s, CLS under 0.1, TBT under 200 ms, Performance 90 or higher.
  - The previous score was 44, so report before and after.
  - Set the hero image or poster to `priority`; lazy-load everything below the fold; keep third-party scripts off the critical path.
- **Accessibility:** run axe and fix every serious and critical issue. Lighthouse Accessibility should be 95 or higher.
- **Code quality:**
  - `npm run lint` and `tsc --noEmit` show zero errors.
  - No console errors.
  - Reusable components go in `components/`.
- **No-JS:** with JavaScript disabled, all three homepages show every section and the nav links work.
- **Links:** nothing on the homepage, header or footer leads to a 404. `/ae/` returns a 301 to `/gcc/`.

---

## 12. What not to do, and working rules

- Don't change the tech stack, URLs (apart from `/ae/` → `/gcc/`), the nav order, or the Prisma version.
- Don't redesign anything the Figma design shows. Don't copy text, images or icons from other companies' websites.
- Don't invent content, numbers or credentials. Don't hard-code content in components.
- Never write "Middle East" in the UI.
- **Git:** don't run `git commit` or `git push`. Leave changes uncommitted and report what changed. Never add AI attribution lines (Co-Authored-By, Claude-Session, "Generated with Claude Code") to anything.
- Keep `.env` and `.env.local` out of git. Never print secrets. Don't run `neon init` in the project.
- Run one agent and one dev server at a time, with `NODE_OPTIONS=--max-old-space-size=2048`. Keep caches and temporary files on the E: drive, not C:.
- If you're blocked (no Figma token, a font that isn't on Google Fonts, an asset you can't export, a schema decision that affects the CMS), stop and ask. Don't work around it silently.

---

## 13. Working method for this round

1. **Read and check (short).**
   - Read this brief, the sitemap, `CONTENT_TODO.md` and `docs/PLAN.md`.
   - Fetch the Figma data (section 5).
   - Locate and list the SVG assets.
   - Report in one short message: the frames found, the tokens extracted, the font, any missing assets, and any blockers.
   - If there are no blockers, carry straight on.
2. **Milestone A:** design tokens, fonts, processed assets, and the header (with the mega menu, sticky state and mobile drawer) plus the footer.
3. **Milestone B:** the `/in/` homepage, every section to Figma, with motion and no-JS support.
4. **Milestone C:** `/uk/` and `/gcc/`. This covers the `/ae/` → `/gcc/` migration and 301, regional content, the bare-`/` redirect, the region switcher and hreflang.
5. **QA:** everything in section 11. Fix what falls short.
6. **Stop and report:**
   1. Figma frames used.
   2. Files created or changed, grouped by area.
   3. Design tokens (`docs/design-tokens.md`) and assets (`docs/asset-manifest.md`).
   4. Every deviation from Figma, and why.
   5. Responsive decisions made without mobile frames.
   6. Updated `CONTENT_TODO.md`: placeholders, unverified claims and naming differences.
   7. Lighthouse before and after, axe results, and the screenshot folder.
   8. Migrations Swayang needs to run on the Neon preview database.
   9. What the designer still needs to supply.
   10. The plan for the next round: the Cloud Services page as the service template, then the pillar and sub-service pages, then the remaining inner pages, with the House of Lords event page first.

The deadline is 24 November, so in the next round the event page gets priority alongside the service template.
