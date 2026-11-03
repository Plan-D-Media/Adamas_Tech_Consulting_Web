# AdamasTech Consulting — Phase 1 build plan

Status: **awaiting go-ahead** (step 1 of the working method).
Inputs used: `docs/sitemap.pdf`, `logo.webp`, the live site (extracted to `docs/source-content/`, 121 URLs), and reference-site notes in `docs/design-notes.md`.

---

## 0. Decisions where the brief and the sitemap disagree

The brief is the later instruction, so it wins unless you say otherwise.

| # | Topic | Sitemap says | Plan |
|---|---|---|---|
| D1 | Gulf label | "Middle East", switcher order India / Middle East / UK & Ireland | **"GCC"** everywhere; order **India · UK & Ireland · GCC**; URL stays `/ae/` |
| D2 | Gulf hreflang | en-AE "+ other Gulf codes if confirmed" | en-AE, en-SA, en-QA, en-KW, en-BH, en-OM (as the brief says) |
| D3 | URL spelling | p.1 text layer reads `/cloudservices` | Hyphenated, matching the PDF image and the redirect map: `/services/cloud-services/...` |
| D4 | Arivoo | `/solutions/arivoo` **or** link straight to arivoo.in (Q7.1) | Build `/solutions/arivoo` as a short overview page; UMS / SMS / LMS link out to arivoo.in in a new tab. Easy to switch to a direct link. |
| D5 | Offices | Contact page: London, Dubai, Bengaluru, Kolkata; US office "to confirm" | The 5 "Our Presence" offices as on the live site, with Palo Alto **labelled "Palo Alto"** and flagged. Harrow, Riyadh and Bhubaneswar (shown only on /contact/) seeded as draft. |
| D6 | e-invoicing UAE | Keep or retire (Q2.4) | Build `/services/e-invoicing-uae` from the live content as **draft**; redirect target stored as data, so the decision is a DB edit |
| D7 | `/consulting/` redirect | `/services` or `/services/digital-transformation` (Q2.2) | `/services` for now, flagged |
| D8 | Footer newsletter | In the footer spec | Email-only form → `NewsletterSubscriber` table, double opt-in later |
| D9 | Search | Placement to confirm (Q2.1) | Search icon in the header utility area, opening an overlay → `/search` |

---

## 1. What the live site actually contains (key facts)

- **/uk/ is a copy of /in/** (only the `<title>` differs). UK differences will therefore come only from the content we seed: London office featured, +44 phone, British spelling where the Indian copy differs (it doesn't today).
- **/ae/:** 3 hero slides (no AWS slide), a UAE e-invoicing banner ("Take Assesment" → adamastech.ae), different service cards (Oracle NetSuite instead of AWS, plus an unlinked "Mobile App Development" card), a different client-logo set, and the Partners and Tech Excellence sections are hidden.
- **Hero Vimeo IDs:** 1143398275 (Digital Transformation), 1177633889 (AWS), 1150026207 (Oracle NetSuite), 1142019553 (SAP). Every CTA is "Let's Talk" → /contact.
- **Case studies:** 18 on the listing and 2 more (the AWS Kubernetes and SAP DR ones), each with a metric and full Challenge / Solution / Technologies / Benefits body. This is more than enough for the "minimum 4 at launch".
- **Leadership:** Rajat Subhra Roy (Director), Saumya Subhra Roy (Director), Koushik "KayCee" Chatterjee (CEO).
- **Not on the live site:** House of Lords event, RICE Adamas Group, AI Product A/B, AI solutions 4–6, testimonials and quotes.

---

## 2. Design system

### Palette (sampled from `logo.webp`)
The logo is a 236×69 lossy WebP, so each value below is the most common pixel colour in its area.

| Token | Hex | Source / use |
|---|---|---|
| `brand-600` (primary) | `#0070BC` | Wordmark. Links, primary UI. White text on it: 5.19:1 ✓ |
| `brand-700` | `#005C9C` | Hover/pressed. White on it: 6.97:1 |
| `brand-50 / 100` | `#EEF6FC` / `#D6EAF7` | Tinted surfaces |
| `sky-400` | `#4FB6E2` | Icon highlight (gradient lightest `#5ACCF5`). Data accents, progress bars and stats **on dark only** (7.43:1 on navy; 2.3:1 on white ✗) |
| `indigo-800` | `#263F76` | Darkest icon pixel. Gradient stop for dark sections |
| `navy-950` | `#071C36` | Dark sections, footer, scrims. White on it: 17.1:1 |
| `navy-900 / 800` | `#0B2747` / `#12345C` | Raised surfaces and lines on dark |
| `orange-500` (CTA) | `#DC7C12` | "consulting". **CTA only.** White on it is only 3.03:1 ✗, so buttons use **navy-950 text** (5.65:1 ✓) |
| `orange-700` | `#B4600A` | Orange text on white (4.55:1), and button hover |
| `grey-50…900` | cool neutral scale, `grey-600 #5B6B80` (5.44:1 on white) for secondary text | |

Text on video always sits on a navy gradient scrim (min. 60% opacity under the text block), so contrast doesn't depend on the frame.

### Typography (`next/font/google`, self-hosted, `display: swap`)
- **Archivo** (variable, `wdth` 100–125) for display. Headlines at weight 600–700, `wdth` 112, tracking −0.02em, line-height 1.02–1.1.
- **Figtree** for body (400 / 500 / 600), line-height 1.6.

| Token | 1440 | 360 | Use |
|---|---|---|---|
| `display-xl` | 88 | 42 | Hero headline (max 3 lines, `text-wrap: balance`) |
| `display` | 64 | 36 | Statement sections, page heroes |
| `h2` | 48 | 30 | Section titles |
| `h3` | 32 | 24 | Pillar / card titles |
| `h4` | 22 | 19 | Small card titles |
| `metric` | 72 | 48 | Case-card headline metric (Archivo, `wdth` 118) |
| `lead` | 20 | 18 | Intro paragraphs |
| `body` | 17 | 16 | Body copy |
| `small` | 14 | 14 | Descriptors, meta |
| `eyebrow` | 13, caps, +0.12em | 12 | Section labels |

All sizes are fluid `clamp()` between 360 and 1440. Headlines use `text-wrap: balance`, and `&nbsp;` is stored in the DB where needed, to avoid orphaned words.

### Grid, spacing, shape, motion
- **8px system.** Section padding 128 (≥1280), 96 (768–1279), 64 (<768).
- **Container** 1312 max (1280 content + 2×16), 12 columns, gutter 24 (32 at ≥1280). Side padding 16 at 360, 32 at 768, 48 at 1024+.
- **Radius:** 2px buttons and inputs (engineered, enterprise), 8px cards and media, full-round only for avatars and the pause control.
- **Elevation:** borders before shadows. One soft shadow token for the mega-menu and floating cards.
- **Motion tokens:**
  - `fast` 160ms (hover)
  - `base` 280ms (menus, tabs)
  - `slow` 600ms (reveals)
  - `story` 7000ms (hero slide)
  - easing `cubic-bezier(.2,.7,.2,1)` out, `(.6,0,.4,1)` in-out
  - reveals: 24px rise + fade, staggered 60ms
  - **Reduced motion:** no scrub, no parallax, no autoplay, no marquee movement; posters shown and reveals become instant.

### Component library (`components/`)
- `ui/`: Button (primary-orange, secondary, ghost-on-dark, arrow-link), Eyebrow, SectionHeader, Container/Grid, Tag, Input/Select/Textarea/FormField
- `cards/`: CaseCard (metric-forward), SolutionCard, ServiceCard, EventCard, PersonCard, IndustryTile, OfficeCard
- `media/`: HeroVideo (Vimeo background **or** MP4/WebM + poster, skipped on Save-Data/2G/reduced-motion), Img (MEDIA_BASE_URL-aware `next/image` loader)
- `motion/`: Reveal, StatCounter (GSAP, verified stats only), StatementReveal, Marquee
- `nav/`: Header, MegaMenu, MobileDrawer, RegionSwitcher, Breadcrumbs, Footer
- `sections/`: HeroStories, TrustStrip, PillarExplorer, Rail, IndustriesGrid, WhyUs, EventFeature, GlobalPresence, CtaBand, Faq (accordion), ApproachSteps, Countdown, plus the forms ContactForm, EventRegistrationForm and NewsletterForm
- `seo/`: JsonLd, plus helpers for metadata

---

## 3. Homepage, section by section (`/in/`, `/uk/`, `/ae/`, one template)

1. **Video hero (100svh, min 640, max 960).**
   - Full-bleed HeroVideo with a navy gradient scrim from the bottom left.
   - Content sits bottom-left on the 12-column grid (columns 1–8): eyebrow, display-xl headline animating in line by line (mask + rise), one supporting line, one orange "Let's Talk" button.
   - The story navigator runs along the bottom edge: 4 numbered tabs (3 on /ae/), each with a short label and a 2px sky progress line filling over 7s, plus a round pause/play button. Clicking a tab jumps to that story; the crossfade carries a slow 1.06 Ken-Burns scale on the poster/video.
   - The header sits transparent over the hero.
2. **Trust strip (white).**
   - Left: eyebrow "Partners & Certifications" plus the live intro line.
   - Right: a pausable marquee of the 12 partner and certification logos, greyscale until hover/focus.
   - Below: a row of **verified** stats only, with GSAP count-up. If none are verified, the row isn't rendered.
   - On /ae/ the strip shows the GCC client logo set, since the live /ae/ hides partners. Flagged.
3. **"What we do": 3-pillar explorer (navy).**
   - Desktop: the section pins. On the left, 3 large pillar tabs (Cloud Services, Digital Transformation, AI Services), each with a progress tick. On the right, an image panel plus the sub-service list (arrow links) and an outcome line.
   - Scrolling advances the pillars (GSAP ScrollTrigger); clicking or arrow keys switch them too (ARIA tabs).
   - Mobile: stacked accordion, no pin.
4. **Solutions spotlight (white).**
   - Section header plus a horizontal snap rail: Arivoo (with UMS / SMS / LMS chips, external), Face Recognition Security, Smart Parking, Cash Forecasting, and placeholders for AI Product A/B (hidden while draft).
   - Large imagery, arrow controls, drag, and the next card peeking in.
5. **Industries (grey-50).** 7 tiles in a 4+3 editorial grid. Hover/focus reveals the panel copy over the image, and on touch the tile expands. No links (no industry pages in this phase).
6. **Success stories rail (white).** Metric-forward CaseCards: the 72px metric is the biggest element, then the label, title and arrow link. 6–8 featured, chosen per region in the DB, plus a "View all case studies" arrow link.
7. **Why AdamasTech (navy statement + grid).**
   - A one-line statement revealed word by word on scroll, using the live "Develop Innovations That Propel Your Business".
   - Then the 4 Tech Excellence items in a 4-column grid with thin dividers, and certification badges inline under "Certified Quality".
8. **Events: House of Lords feature.** A split card with image, date block, title, a live countdown and "Register" (orange). The region decides its weight: full-width on /uk/, standard on /in/ and /ae/. Hidden if no event is published.
9. **Global presence (navy).** A stylised dotted world map (inline SVG, no map tiles) with 5 office pins; the current region's office pulses and its card is expanded. Office cards list address and tel.
10. **Closing CTA band.** "Talk to an expert", the region's phone/WhatsApp and email, and an orange button to /contact.
11. **Footer (navy-950).** Columns: Services, Solutions, Company, Insights. Offices grouped by region. Phone and WhatsApp per region, newsletter, social links, legal links, a GCC-labelled region switcher, and certification marks.

**Header:** 72px, transparent over the hero, solid white (+ hairline) after 24px of scroll, hides on scroll-down and returns on scroll-up. **Mega-menu:** full-width panel. Category list on the left (3 columns wide), links with one-line descriptors in the middle (6 columns), a featured card on the right (3 columns, a case study or the event). It opens on hover with intent delay on desktop and on click/tap elsewhere; arrow-key navigation, Esc closes and focus returns to the trigger.

---

## 4. Prisma schema (outline)

Every **content** model shares: `id cuid`, `status Status @default(DRAFT)`, `publishedAt DateTime?`, `createdAt`, `updatedAt @updatedAt`, `sortOrder Int @default(0)`, `needsReview Boolean @default(false)`, `editorNote String?` (the placeholder/conflict flag the CMS will show).
Models that are **pages** add the SEO fields: `seoTitle`, `seoDescription`, `ogImageId → MediaAsset`, `noindex Boolean`, `canonicalPath?`.

```prisma
enum Status       { DRAFT PUBLISHED ARCHIVED }
enum RegionCode   { IN UK AE }
enum MediaKind    { IMAGE VIDEO DOCUMENT }
enum NavMenu      { HEADER FOOTER LEGAL SOCIAL }
enum SolutionKind { PRODUCT AI_SOLUTION ARIVOO_MODULE }
enum LogoKind     { PARTNER CERTIFICATION CLIENT }

model Region        { code RegionCode @id; slug String @unique; label String; locale String; hreflang String[]
                      phone String?; whatsapp String?; email String?; featuredOfficeId String?; homepage RegionHome? }
model RegionHome    { /* content + SEO */ region RegionCode @unique; heroSlides HeroSlide[]; featuredEventId String?
                      eventProminence String; showTrustStrip Boolean; promoBanner Json? /* e.g. AE e-invoicing */ }
model HeroSlide     { /* content */ regionHomeId; eyebrow?; headline; body?; ctaLabel; ctaHref; navLabel
                      vimeoId?; videoAssetId?; posterId }
model ContentBlock  { /* content */ key String; region RegionCode?; eyebrow?; heading?; body?; ctaLabel?; ctaHref?
                      @@unique([key, region]) }          // section headers; region row overrides global row
model MediaAsset    { id; key String /* path under MEDIA_BASE_URL */; kind; mime; width?; height?; alt; blurDataUrl?
                      isPlaceholder Boolean; sourceUrl? }
model NavItem       { /* content */ menu NavMenu; parentId?; label; descriptor?; href?; external Boolean
                      comingSoon Boolean; featuredCaseStudyId?; featuredEventId? }

model ServicePillar { /* content + SEO */ slug @unique; name; tagline; summary; outcomeLine; heroImageId; challenge
                      services Service[]; faqs Faq[]; caseStudies CaseStudy[] @relation }
model Service       { /* content + SEO */ pillarId; slug; name; descriptor; summary; whoFor; whatWeDo Json
                      steps ApproachStep[]; technologies Technology[]; faqs Faq[]; caseStudies CaseStudy[]
                      legacyPath? ; @@unique([pillarId, slug]) }
model ApproachStep  { /* content */ serviceId; title; body }
model Technology    { /* content */ name @unique; logoId? }
model Faq           { /* content */ question; answer; pillarId?; serviceId?; solutionId?; pageId? }

model Solution      { /* content + SEO */ slug @unique; kind SolutionKind; name; tagline; summary; externalUrl?
                      parentId? /* Arivoo → UMS/SMS/LMS */; features SolutionFeature[]; screenshots MediaAsset[]
                      integrations Technology[]; caseStudies CaseStudy[] }
model SolutionFeature { /* content */ solutionId; title; body }

model Industry      { /* content */ slug @unique; tabLabel; title; body; imageId }
model CaseStudy     { /* content + SEO */ slug @unique; label; title; summary; headlineMetric; metricLabel
                      clientDescriptor; overview; challenge; solution; results CaseResult[]; quote?; quoteBy?
                      industryId?; services Service[]; pillars ServicePillar[]; solutions Solution[]
                      technologies Technology[]; regions RegionCode[]; featuredIn RegionCode[]; heroImageId; legacyPath? }
model CaseResult    { /* content */ caseStudyId; value; label }

model Stat          { /* content */ key; value; numeric Float?; suffix?; label; verified Boolean @default(false)
                      sourceNote; placements String[]; regions RegionCode[] }
model LogoItem      { /* content */ kind LogoKind; name; logoId; url?; regions RegionCode[] }
model Certification { /* content + SEO */ slug; name; issuer; standard; badgeId; certificateFileId?; validUntil?; verified }
model Office        { /* content */ city; label; country; region RegionCode; addressLines String[]; phone?; whatsapp?
                      lat; lng; confirmed Boolean }
model Person        { /* content */ name; role; bio?; photoId?; linkedinUrl?; showOnTeam Boolean; eventSpeakers EventSpeaker[] }

model Event         { /* content + SEO */ slug @unique; title; summary; body; startsAt; endsAt; timezone
                      venueName; venueAddress; heroImageId; registrationOpen Boolean; capacity Int?
                      agenda AgendaItem[]; speakers EventSpeaker[]; registrations EventRegistration[] }
model AgendaItem    { /* content */ eventId; startsAt; title; body? }
model EventSpeaker  { eventId; personId; sortOrder; @@id([eventId, personId]) }

model Page          { /* content + SEO */ path @unique; template String /* about|legal|credentials|coming-soon|… */
                      title; intro?; blocks Json /* typed via zod in lib/data */ }
model Redirect      { id; fromPath @unique; toPath; statusCode Int @default(301); active Boolean; decisionRef?; note? }

// submissions (not content; no status/publish fields)
model ContactSubmission  { id; createdAt; name; email; phone?; country; message; region RegionCode?; sourcePath
                           serviceContext?; ipHash; userAgent?; mailedAt? }
model EventRegistration  { id; createdAt; eventId; name; email; company?; jobTitle?; phone?; dietary?; consent Boolean
                           ipHash; mailedAt? ; @@unique([eventId, email]) }
model NewsletterSubscriber { id; createdAt; email @unique; region RegionCode?; consent Boolean }
model RateLimitHit       { key; windowStart; count ; @@id([key, windowStart]) }  // DB-backed limiter, no Redis needed
```

`lib/data/*` exposes typed, cached readers (`getRegionHome(code)`, `getPillar(slug)`, `getCaseStudies(filter)`…). Each only returns `status = PUBLISHED`, uses `unstable_cache`/`revalidate` tags, and is ready for on-demand revalidation from the future CMS.

---

## 5. Folder structure

```
adamas_tech_consulting_web/
├─ app/
│  ├─ (site)/
│  │  ├─ layout.tsx                 header, footer, consent, Organization JSON-LD
│  │  ├─ [region]/page.tsx          /in /uk /ae  (generateStaticParams, ISR)
│  │  ├─ services/page.tsx
│  │  ├─ services/[pillar]/page.tsx
│  │  ├─ services/[pillar]/[service]/page.tsx
│  │  ├─ services/e-invoicing-uae/page.tsx
│  │  ├─ solutions/page.tsx · solutions/[slug]/page.tsx
│  │  ├─ case-studies/page.tsx · case-studies/[slug]/page.tsx
│  │  ├─ insights/events/page.tsx · insights/events/[slug]/page.tsx
│  │  ├─ insights/blog/page.tsx     (coming soon)
│  │  ├─ about/page.tsx · about/team/page.tsx · about/careers/page.tsx (coming soon)
│  │  ├─ credentials/ · contact/ · thank-you/ · search/
│  │  └─ privacy-policy/ · cookie-policy/ · terms-of-use/
│  ├─ api/  events/[slug]/ics/route.ts · revalidate/route.ts
│  ├─ not-found.tsx · sitemap.ts · robots.ts · opengraph-image.tsx
│  └─ globals.css                   tokens as CSS variables
├─ components/  ui/ cards/ media/ motion/ nav/ sections/ forms/ seo/
├─ lib/
│  ├─ data/      regions.ts home.ts services.ts solutions.ts caseStudies.ts events.ts offices.ts nav.ts pages.ts redirects.ts
│  ├─ actions/   contact.ts registerEvent.ts newsletter.ts   (server actions, zod-validated)
│  ├─ mail/      index.ts (interface) ses.ts console.ts
│  ├─ region.ts  geo.ts  media.ts  seo.ts  rateLimit.ts  ics.ts  db.ts
├─ content/      typed seed sources: regions.ts home/*.ts services/*.ts caseStudies/*.ts …
├─ prisma/       schema.prisma  seed.ts  migrations/
├─ public/media/ local images, posters, logos (mirrors the S3 keys)
├─ middleware.ts root-only geo redirect + Redirect-table 301s
├─ docker-compose.yml  .env.example
├─ docs/         sitemap.pdf PLAN.md design-notes.md source-content/
└─ CONTENT_TODO.md
```

**Redirects in middleware:** the redirect map is read from the DB through a small edge-cached endpoint, or compiled at build time into `redirects.generated.json` by the seed script. The plan is the build-time compile: it adds no DB round-trip per request, and the CMS can trigger a rebuild or revalidate.

---

## 6. Content gaps (also in `CONTENT_TODO.md`)

Summary: stat conflicts; no House of Lords details; AI Product A/B and AI solutions 4–6 missing; no testimonials/quotes; no certificate PDFs; no pillar "challenge/outcome/FAQ" copy for the new pillars and the 4 new AI sub-services; UK homepage identical to India; office list inconsistencies; no product screenshots; hero videos only on Vimeo (no MP4 or posters); no meta descriptions anywhere. Full list with pages in `CONTENT_TODO.md`.

**On new service pages with no source copy:** the new IA has pages with no current page behind them, e.g. Agentic AI, Generative AI, Computer Vision, Cloud Migration, Managed Cloud, Cloud Security & FinOps and SAP on Cloud. Per "do not invent", they get the case-study-backed facts we do have (e.g. Computer Vision ← the 8 CV case studies) and clearly marked placeholder copy, flagged `needsReview`.

---

## 7. Environment questions before Milestone 1

1. **Docker isn't installed on this machine** (no `docker`, no `psql`). I'll still write `docker-compose.yml`. For local dev, pick one:
   - (a) install Docker Desktop (recommended)
   - (b) install PostgreSQL 16 for Windows
   - (c) use a free hosted dev database (Neon/Supabase) via `DATABASE_URL`
2. **Infosys reference pass + visual QA:** two Chrome browsers are connected to the extension, so I need you to pick one. I'll use Playwright (headless) for the milestone screenshots at 360/768/1024/1280/1440 either way.
3. Is the parent-folder `index.html` (an earlier single-page mock-up with the same palette and fonts) a reference to follow, or should I ignore it?

---

## 8. After client approval

Work held until the client signs off the content, so it isn't done twice.

- **Real 404 status codes for unknown slugs.** Today an unknown slug on a dynamic route (e.g. `/solutions/nope`, `/case-studies/nope`, `/services/nope`, `/insights/events/nope`) renders the 404 page with `noindex`, but with HTTP **200**: with `cacheComponents`, params that `generateStaticParams` did not list are served from the prerendered fallback shell, and `dynamicParams = false` is not available. Once the slug lists are final, return a real 404 the same way unknown regions already do in `proxy.ts` (check the path against the published slugs, rewrite unknown ones to an unmatched path), and add the routes to the QA script that checks `/fr/` and `/zz`.
