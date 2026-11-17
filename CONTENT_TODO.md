# CONTENT_TODO

Running list of placeholders, conflicts and missing assets. Each item is also flagged in the DB (`needsReview = true` + `editorNote`) once seeded.
Source evidence: `docs/source-content/` (live site extracted 2026-10-29). "Q" refs are the client questionnaire refs from `docs/sitemap.pdf`.

Legend: **CONFLICT** = the live site contradicts itself · **MISSING** = no source content · **PLACEHOLDER** = rendered with marked placeholder content · **DECISION** = client choice needed

## Stats (Q5.8) — none render until verified
| Stat | Values found | Where | Status |
|---|---|---|---|
| Company age | "Founded in 2021" (about, visible) · "1995+ Year Established On" (hidden) · "22+ Years Field Experience" (hidden) · "3+ Years Experience" (/ae/ hidden) | /about, trust strip | CONFLICT, `verified=false` |
| Field experience | "26.8k Hours" (footer, visible) vs "22+ Years" (hidden) | trust strip, footer | CONFLICT, `verified=false` |
| Response time | "5 Mins" (footer, visible) vs "2 Mins" (hidden) | CTA band | CONFLICT, `verified=false` |
| Projects | "950+ Projects Done Around World" (hidden only) | trust strip | Unverified, `verified=false` |
| Client satisfaction | "99%" (footer, visible) | trust strip | Not contradicted, but no source. Seeded `verified=false` until confirmed |
| Team size | "over 100 experts" (/about-us/, visible) | /about | Seeded `verified=false` until confirmed |

## Offices and contact (Q3.6, Q8.1–Q8.3)

**DECIDED (Swayang, 17 November 2026): the approved Figma design is the source of truth for every office address**,
and `confirmed: false` stays a review flag rather than a visibility filter, so the five offices render as the design
shows them. The addresses in the design and in the seed already match line for line. The questions below stay open
with the client, and stay in `docs/qa/evidence/phase2/client-content-request.md`, because several of them also affect
the legal pages, which carry different addresses.
- DECIDED: Palo Alto is labelled "Palo Alto", not the live site's "San Francisco". Still confirm whether the US office is still active (sitemap: "US office to confirm").
- CONFLICT: London has two addresses: Golden Cross House, 8 Duncannon Street WC2N 4JF vs 39 Roxborough Road, Harrow (contact page + privacy policy). Which is the office?
- CONFLICT: Bengaluru postcode 560102 (Our Presence) vs 560068, "2nd Floor, Vallabha Pamadi, 2727, 16th Cross" (legal pages).
- CONFLICT: Dubai address with or without "near Trade Centre … UAE."
- DECISION: Riyadh and Bhubaneswar appear only on /contact/. Seeded as **draft** offices. Show them?
- CONFLICT: About Us says "four countries: Saudi Arabia, England, the USA, and India" and leaves out the UAE.
- MISSING: UK landline (only the mobile +44 7768 706988), GCC WhatsApp, US phone, per-region WhatsApp numbers (footer spec, Q3.6).
- CONFLICT: emails marketing@ (site) vs info@ / Info@ / hr@ (legal pages); adamastech.co.uk and adamastech.ae domains also in use. Confirm one enquiry inbox per region.
- MISSING: office coordinates (map pins) will be geocoded from the addresses. Please confirm.

## Regional homepages (Q3.1, Q3.2, Q3.4, Q3.5, Q3.8)
- MISSING: /uk/ content is identical to /in/. UK-specific emphasis is only London featured + UK phone. Any UK-specific headline or copy?
- DECISION: /ae/ live hides Partners & Certifications and Tech Excellence, and shows a different client set. New /ae/ shows the trust strip with GCC client logos; please confirm.
- /ae/ e-invoicing promo ("Take Assesment" → adamastech.ae) kept as an /ae/-only banner. Typo will be fixed to "Take Assessment".
- /ae/ "Mobile App Development" service card has no page. Mapped to Application Development; please confirm.

## Hero (all regions)
- MISSING: self-hosted MP4/WebM of the 4 Vimeo videos (1143398275, 1177633889, 1150026207, 1142019553) for S3/CloudFront.
- PLACEHOLDER: poster images will be grabbed from the Vimeo thumbnails. Please supply proper stills.
- MISSING: no hero sub-copy beyond the headline on the live slides. Slide 1 tags (AI/ML, AWS, SAP, Technology Transformation) will be used as the supporting line.

## Services (Q5.2, Q5.3, Q2.3)
- DECISION: all 6 cloud sub-service names "to confirm" (Q5.3); DT and AI lists "proposed" (Q5.2).
- MISSING / PLACEHOLDER: no current source page for Cloud Migration, Managed Cloud & CSP, SAP on Cloud, Cloud Security & FinOps, Agentic AI, Computer Vision (only case studies), Generative & Applied AI. These get marked placeholder copy plus any case-study-backed facts.
- MISSING: pillar-level "challenge", "outcome line" and FAQ copy for all 3 pillars (FAQs are only on some old pages).
- MISSING: "4-step approach" on sub-service pages unless the old page has one.
- DECISION: /consulting/ redirect target (Q2.2). Set to /services for now.
- DECISION: UAE e-invoicing keep/retire (Q2.4). Page built as draft.
- CONFLICT: the /services/ AWS card reuses the Technology Transformation description. The Oracle card says "for Modern Construction".
- Theme leftover: visible pricing block ("30/year", "30 Days Free Trail") on /sap-treasury… and /openedx. **Not migrated.**

## Solutions (Q7.1–Q7.4, Q5.3)

**SCOPE CHANGE (Swayang, 17 November 2026): solutions have no pages on this site.** Every solution links out to
its own website in a new tab, `/solutions` 301s to the Products & Solutions section of the visitor's regional
homepage, and the old solution detail pages are gone (map: `docs/qa/evidence/phase2/solutions-redirect-map.md`).
Two consequences for content:

- **MISSING, blocking (one per solution): the website URL.** A solution with no URL has nowhere to link to, so it
  is not shown at all. Needed for: **A-EYE**, **AIR-MIND**, **Face Recognition Security**, **Industrial
  Analytics**, **Asset Tracking**, and AI solutions 4 to 6 once they are named (Q7.2, Q5.3). No URL was guessed.
  Every one of these rows already holds its copy, so each is published by adding the URL and nothing else.
- **CONFIRM: that solutions should link out rather than have pages here.** This is the 17 November decision as
  given; the client has not been told yet. It changes what the client is asked for (a URL per product instead of
  page copy, screenshots and SEO text) and it means those products get no SEO benefit from this site.
- DONE: Arivoo is published, links to https://arivoo.in, and its card carries UMS, SMS, LMS and TestGUARD as
  module links. Its suite summary was composed from the live site's own module descriptions, because the live
  site has no suite-level overview: **please confirm the wording.**
- DECISION TAKEN (Q7.3): TestGUARD is now a fourth Arivoo module, so it keeps its footer link and its live URL
  and is not a menu item of its own. Reversible.
- CONFLICT: Arivoo URLs: header uses arivoo.in/lms, /sms; footer uses /arivoo-lms, /arivoo-sms, /arivoo-ums. The
  sitemap's `/arivoo-*` form is used everywhere. The live header also labels UMS "Coming soon" with no link:
  confirm the four URLs and whether UMS is live.
- PLACEHOLDER: AI solutions 4–6 (Q5.3). Candidates from existing case studies: PPE Detection, Steel Plate
  Inspection, Invoice AI, RAG chatbot. Please confirm which three, and give a URL for each.
- NO LONGER NEEDED (because there are no pages): per-solution page copy, challenge text, capability panels, SEO
  titles and descriptions, and product UI screenshots. Card images are still used and are placeholders from the
  Figma file.

## Case studies (Q5.5, Q5.6)
- DECISION: client clearance for each of the 20 case studies to publish.
- CONFLICT: titles and labels differ between homepage, listing and detail page (e.g. /sap-treasury… = "Boosting Cash Forecasting by 30%" / "Cut Manual Reconciliation… 60%" / label Automobile vs Manufacturing). New site uses **one** title per case study. The proposed choice is listed per item in `content/caseStudies`.
- CONFLICT: listing cards for Entry/Exit and AI Smarter Spaces reuse the PPE card's body text.
- CONFLICT: Workflow case "Reduced Data Volume by 97%" vs body "cutting storage needs by three-quarters".
- Duplicates: /surveillance-system = /ai-smarter-spaces-traffic-monitoring; /crowd-movement duplicates face-recognition. One page each; the others get a 301.
- MISSING: client quotes and testimonials (case-study template has a quote slot, hidden when empty).
- MISSING: region tags per case study (for the region filter). Inferred from client geography where stated, otherwise flagged.

## Events (Q6.1–Q6.7) — launch priority
- MISSING: **House of Lords event:** full title, date/time (sitemap: 26 Nov), venue details, agenda, speakers, capacity, registration fields, host/sponsor wording, imagery. Seeded as a flagged placeholder.
- MISSING: past events for the listing (Q6.7).

## About / Team / Credentials (Q5.7, Q5.9)
- MISSING: RICE Adamas Group description (sitemap: About page content). Not on the live site.
- MISSING: Client to provide year-by-year milestones: year, title, 1–2 lines, optional photo. (/about "Mission & Journey" timeline, `Milestone` table / `content/milestones.ts`. Six placeholders are seeded and show "Milestone 01–06" with a "Year to be confirmed" tag; no years or history were invented, because the current site gives conflicting founding dates: "1995", "2021", "22+ years", "3+ years". Any number of milestones works; edit the rows, then revalidate the "milestones" tag.)
- DECISION: who is listed on /about/team. Live leadership: Rajat Subhra Roy (Director), Saumya Subhra Roy (Director), Koushik "KayCee" Chatterjee (CEO). Photos and bios needed.
- MISSING: certificate PDFs, certificate numbers and validity dates for ISO 9001:2015 (BSI), ISO/IEC 27001 (DQS), CMMI ML3.
- DECISION: AWS partner tier. The live client strip image shows "AWS Partner Advanced Tier Services". Not stated as a credential until confirmed. SAP PartnerEdge / Oracle NetSuite partner status to confirm.

## Legal and global (Q10.2–Q10.4)
- **FOR CLIENT LEGAL REVIEW: the Cookie Policy was drafted on 17 November 2026** (`content/pages.ts`,
  `/cookie-policy`). It was written from the cookies this site actually sets, which is exactly one: `region`,
  a first-party functional cookie holding `in`, `uk` or `gcc` for one year so that the homepage, phone number,
  email and office shown match the visitor's region. The policy states plainly that there are no analytics,
  advertising or tracking cookies, that there is therefore nothing to consent to and no cookie banner, and that
  it must be updated and consent asked for before any analytics is switched on. It also covers cookies set by
  other websites we link to (arivoo.in, Facebook, LinkedIn), and points form data at the Privacy Policy.
  **It is not legal advice and has not been reviewed by a lawyer.** If the client's counsel wants the usual
  Termly-style template instead, supply it and it will replace this text.
- NOTE: adding GA4 or GTM (below) makes this policy wrong. It will need a new row in the cookie table, a consent
  mechanism, and a fresh legal review.
- Privacy Policy and Terms migrated verbatim. They contain the alternate addresses and emails above.
- MISSING: social profile URLs (verify the footer links on the live site), newsletter provider/consent wording.
- MISSING: meta descriptions. **No page on the live site has one.** Drafted from existing copy and flagged.
- MISSING: GA4 / GTM container IDs.

## Typos to fix (obvious only)
"Seeking Digital Transformation ?" → "?" spacing · "Results- Driven" → "Results-Driven" · "Lets get in touch" → "Let's get in touch" · "Assesment" → "Assessment" · "MAINTAINANCE" → "MAINTENANCE" · "MSAP S4 HANA" → "SAP S/4HANA" (confirm) · "by optimize, and transform digitally" (needs client wording) · stray "4o" on data-science page · "-86%"/"-23%" stat signs (confirm intent) · "Open edX services" → "Open edX® services".

---

## Added with the seed content (`content/*.ts`, 2026-10-29)
Every item below is also flagged in its seed record (`needsReview` + `editorNote`).

### Regions and offices (`content/regions.ts`)
- DECISION: one enquiry inbox per region. All three regions use marketing@adamastech.in for now.
- MISSING: WhatsApp numbers for IN, UK and GCC (left empty).
- DECISION: India featured office is Bengaluru. Or Kolkata?
- Palo Alto is seeded under region "UK" only because the type requires a region. The US office belongs to no current region.
- PLACEHOLDER: all office map pins are approximate (geocoded from the addresses). Riyadh is a city-centre pin with no street address.
- All 8 offices are `confirmed: false`. Harrow, Riyadh and Bhubaneswar are draft.

### Homepages (`content/home.ts`, `content/blocks.ts`)
- /ae/ (Home): "Mobile App Development" card is linked to Application Development. Confirm.
- /ae/ (Home): the e-invoicing banner's second button ("Learn More" → /e-invoicing-uae) and its three badges have no field. Not migrated.
- /ae/ (Home): live hero posters are local uploads (Img-1.png, Img_2.png, Img_3.png); the shared Vimeo posters are used.
- /ae/ (Home): Tech Excellence is hidden on the live page, so `showWhyUs = false`. Confirm.
- PLACEHOLDER (Home, all regions): "Solutions" and "Events" section headers, and the /ae/ client-strip heading. No live wording exists.
- Home ("What we do"): reuses the live "OUR SERVICES" header. "Our Presence" heading is taken from the /contact/ Locations section.
- Home service cards: the card bullets (e.g. "Streamline Operations", "Data Driven Insights") have no field. Not migrated.

### Services (`content/services.ts`)
- Cloud Migration, Managed Cloud and Cloud Security & FinOps: copy comes from the unlinked pages /cloud-migration-modernisation/, /managed-cloud-optimization/ and /security-governance/. These pages contain wireframe text and a template testimonial ("Katya Tognazzini"), which were not migrated. Confirm the copy.
- Agentic AI and Generative & Applied AI: copy comes from the unlinked pages /aws-for-automated-workflows/ and /aws-for-generative-ai/. Positioning copy is needed.
- MISSING: SAP on Cloud (all copy), Computer Vision (summary), CSP / cloud reselling copy, FinOps copy, Digital Transformation pillar outcome line and challenge, AI Services pillar challenge, and FAQs for every page.
- Data Science & Analytics and other service pages: "Did you know?" figures are third-party claims with no source. Seeded as highlights. Verify them and their +/- signs.
- AI/ML, Master Data Governance and Technology Transformation: some cards carry bodies copied from other pages (e.g. SAP text on the AI page). Those bodies are left out; copy is needed.
- Service pages: technology logos on the old pages are unlabelled images. `technologies` is only set where a tool is named in the text.
- Oracle NetSuite: the page is written for Construction / GCC. Confirm that focus for a global page. Unverified claims: "#1 true cloud ERP" and "USD 3.4M" saving. The "Why NetSuite Outperforms SAP" comparison is not migrated.
- UAE e-invoicing is seeded as `/services/digital-transformation/e-invoicing-uae` (draft). Re-check the regulatory dates and penalties before publishing.
- Open edX: the "Solutions Suite" list has no field. It is kept in the record's editorNote.

### Case studies (`content/caseStudies.ts`)
- All 20 are DRAFT. The chosen title and the alternatives are listed in each editorNote.
- Featured on all three homepages: face-recognition, car-parking-lot, sap-treasury-cash-forecasting, sap-analytics-cloud-liquor. Featured on IN and UK only: invoiceai-invoice-processing, sap-intercompany-reconciliation, sap-bank-communication-management.
- Region tags are set only for Treasury and Liquor (India stated). The other 18 are untagged and flagged.
- PLACEHOLDER: card summary for Entry/Exit and AI Traffic Monitoring. The live cards reuse the PPE text.
- MISSING: Kubernetes case study has no headline number (`headlineMetric` is a placeholder). The cement DR case study uses "24×7" from its outcomes.
- MISSING: higher-resolution images for the Kubernetes and cement case studies (317×160 px on the live site).
- CONFLICT: CAPEX case study headline "Save 30% in Efforts" does not match the detail page's 30% ("cash working capital"). Steel plate: "80% of defects" vs "reduces manual intervention by 80%".
- Not migrated (no field in `CaseStudySeed`): the detail pages' "More Benefits" lists and qualitative benefit cards. Suggest adding `benefits?: string[]` to the type.
- Industry mappings are editorial, for example Cinema → Hospitality and Treasury → Finance. The RAG chatbot has no industry. Confirm.
- Not migrated as case studies (redirected to the nearest service): /furniture-similarity/, /sap-advanced-available-to-promise-solution-implementation/, /sap-finance-group-consolidation/, /sap-finance-supply-chain-management/, /sap-fiori-based-mobility-application-for-supply-chain-and-logistics/, /transforming-higher-education-with-aws-cloud/, /resilient-backup-recovery-with-aws/. Add any of them?

### Solutions (`content/solutions.ts`)
- MISSING: Arivoo suite overview copy; screenshots for every solution.
- Cash Forecasting is an SAP Treasury implementation, not an AI product. Confirm it belongs under AI solutions.
- Arivoo UMS: the header says "Coming soon" with no link. Is it live?

### Trust (`content/trust.ts`)
- Trust strip: all 10 stats (including both versions of each conflicting figure) are seeded with `verified: false`, so none render.
- Trust strip: GRSE, IISc and SWCC were identified by reading the logos (the file names are numbers), and the Emirates drinking-water company name was read from its logo. Confirm all four.
- Trust strip: the client permission to show each logo is to confirm (Q5.5). The nature of the Flipkart, techUK, LCCI, MigNow and Leapwork relationships is to confirm before they are called partners.
- Credentials: the AWS, SAP and Oracle NetSuite partner credentials are draft, and each tier is to confirm. The CMMI appraisal body, version and expiry are needed, and so is the ISO 27001 edition year.

### People, events (`content/people.ts`, `content/events.ts`)
- /about/team: the 3 leaders are draft. MISSING: bios, LinkedIn URLs, and KayCee's preferred display name.
- House of Lords event: every field except the date is a placeholder. The start time of 18:00 and all 3 agenda items are placeholders.

### Redirects (`content/redirects.ts`)
- Every old URL in `_summary.md` §9 is covered, plus /intelligent-automation/, /sap-inter-company-reconciliation/, /house-of-lords/ and /success-stories/. Same-path URLs (/contact/, /services/ etc.) are deliberately not listed, to avoid loops.
- Case-study redirect targets are DRAFT until client clearance. The router should fall back to /case-studies until each one is published.

### Media (`public/media/`, `content/media.ts`)
- PLACEHOLDER: the 4 hero posters are Vimeo thumbnails (1920×1080). Proper stills and MP4/WebM files are still needed.
- Industry panel images are only 384×303 px. Partner logos are about 128×71 px. Higher-resolution versions are needed.

## Milestone 1 build notes (India homepage + shell, 2026-10-29)
- **Brand (MISSING):** official logo as SVG, in colour and reversed (white). Today the header uses the 236×69 `logo.webp`, slightly soft on retina; over dark backgrounds it is turned white with a CSS filter. Swap in the SVGs when supplied.
- **Pillar images (MISSING):** Cloud Services, Digital Transformation and AI Services have no image. The "What we do" explorer shows a branded placeholder pattern.
- **Solution and product images (MISSING):** Arivoo, [AI Product A/B] and TestGUARD have no image (placeholder pattern).
- **House of Lords image (MISSING):** the event feature uses the placeholder pattern.
- **Hero videos:** the interim source is the Vimeo background player (`dnt=1`, so no Vimeo cookies). Production needs MP4/WebM files on S3 (see "Hero").
- **/in/ and /uk/ service-card grid → DRAFT:** the live "Our Services" cards (SAP, AWS, AI/ML, Oracle NetSuite, Open edX, Technology Transformation) repeat the new 3-pillar explorer directly above them, so they are kept as DRAFT. /ae/ keeps its own cards, PUBLISHED as requested. Republish in the DB if the client wants both.
- **Bengaluru office phone removed:** the live "Our Presence" block shows no phone for Bengaluru. The India number appears at region level (header, footer, CTA band) instead.
- **Homepage events link:** the events section's secondary link now reads "All events" → /insights/events (the primary button already goes to the House of Lords page).
- **"Middle East" in client copy:** one verbatim sentence in the SAP Treasury case study (DRAFT) says "Middle East", describing the client's markets rather than our region label. The brief says never to show "Middle East" in the UI: reword before publishing (client to approve).
- **Case-study redirects:** old case-study URLs 301 to `/case-studies/<slug>`. Those pages are built in Milestone 3, and drafts will fall back to the /case-studies listing.

## Client sign-off requests (logged 2026-10-29, after Milestone 1 review)
- **SAP Treasury case study: "Middle East" → "GCC" (SIGN-OFF).** The overview's client-market list now reads "…Latin America, Africa, GCC, South and South East Asia" (live site: "Middle East"), per the rule that the UI never says "Middle East". The case study stays DRAFT until the client approves the wording. Note: the Gulf markets of a vehicle manufacturer may not map exactly to GCC; the client may prefer to list countries.
- **Official SVG logo, colour + white (CLIENT REQUEST).** The site uses the 236×69 `logo.webp`; the white version over dark backgrounds is a CSS filter (approved as interim). Please supply both SVGs.
- **Homepage SEO title + description (REVIEW).** No live page has a meta description. Drafted from the client's own words: title "IT consultancy and solutions | AdamasTech Consulting <Region>" (live tagline) and description "Tailored tech solutions driving growth, efficiency, and reliability with expert, customer-focused, scalable services." (live services intro). Same text for all three regions until region-specific copy is supplied.
- **Hero video hosting (PERFORMANCE / BEST PRACTICES).** Vimeo's player sets a third-party Cloudflare cookie (`__cf_bm`), which costs the homepage its Lighthouse Best Practices ≥ 90 target. Self-hosted MP4/WebM files on S3/CloudFront remove it (the HeroVideo component already supports them). Please supply the four source videos.


## Design round 2 (2026-10-29/30)

Items introduced or surfaced in design round 2. Brackets never render: names show a "Name to be confirmed" tag and missing copy a "Details to be confirmed" / "… to be confirmed" panel (`lib/placeholder.ts`). Draft badges show only with `SHOW_DRAFT_BADGES=true`.

### Homepages and shared
- **INTERIM HEADING (sign-off):** Solutions rail heading "Products and AI solutions" (no intro line yet); GCC trust strip heading "Trusted by organisations across the GCC"; events heading "Upcoming events". Previously bracketed placeholders.
- **MISSING: client to provide 3–5 announcements** for the hero announcement strip (news, partnerships, awards), each with label, text, link and date window. Two marked placeholders are seeded as drafts; the House of Lords item follows the event (final title needed, Q6.1).
- **MISSING:** hero videos are Vimeo embeds that return 401 outside the live domain (seen on localhost). Allow the staging/production domains in Vimeo's embed settings, or supply MP4/WebM files plus poster stills (preferred, see Hero above).
- **UNVERIFIED (not rendered):** the "Did you know?" figures on service pages (`highlights`) stay hidden until sourced.
- **ASSET:** the Arivoo UMS product screenshot is low resolution; a sharper capture is needed.
- **DECISION:** long case-study titles run to three lines in the case-study page hero; confirm shorter display titles if wanted.
- **MISSING:** service pages without overview copy show an "Overview to be confirmed" panel (e.g. Computer Vision, SAP on Cloud).

### Solutions and Case studies templates

Routes: `/solutions`, `/solutions/[slug]`, `/case-studies`, `/case-studies/[slug]`.
Files: `app/solutions/**`, `app/case-studies/**`, `lib/data/solutions.ts`, `lib/data/caseStudies.ts`, `components/solutions/{SolutionTile,ArivooFeature}.tsx`, `components/case-studies/{CaseExplorer,ResultsStrip}.tsx`.

Legend (as in `CONTENT_TODO.md`): **CONFLICT** = the live site contradicts itself · **MISSING** = no source content · **PLACEHOLDER** = rendered with a designed stand-in · **DECISION** = client choice needed · **INTERIM** = UI label or behaviour chosen for the prototype

#### Placeholders and items to confirm

| Page | Item | Shown as | Client to supply |
|---|---|---|---|
| /solutions (hero) | Intro line under "Products and AI solutions" (`home.solutions` block body) | No intro (heading only) | One-line intro for the Solutions section/page |
| /solutions, /solutions/arivoo | Arivoo overview copy (summary is a placeholder) | Overview: "Overview to be confirmed" panel; overview grid shows tagline + modules only | Short overview of the Arivoo suite (UMS, SMS, LMS) |
| /solutions/arivoo | Product screenshots | Section hidden (module images used instead) | Arivoo screenshots |
| /solutions, /solutions/arivoo | Arivoo landing URL `https://arivoo.in` and module URLs (`/arivoo-ums`, `/arivoo-sms`, `/arivoo-lms`; header uses `/sms`, `/lms`) | Links out in a new tab | Confirm URLs; confirm UMS is live (header says "Coming soon") |
| /solutions | **DECISION** Arivoo card/menu target. `externalUrl` is set, so the overview links Arivoo to arivoo.in; `/solutions/arivoo` exists but is reached only directly | Per DB | Clear `externalUrl` on the Arivoo row if menus/cards should open the page instead |
| /solutions, /solutions/a-eye, /solutions/air-mind | AI Product A/B: name, tagline, overview, challenge, capabilities, screenshots (Q7.2) | "Name to be confirmed" / "Title to be confirmed" tags, "Details to be confirmed", pending Overview/Challenge panels, three "Capability to be confirmed" panels, branded artwork; pages are `noindex` | All product copy and imagery |
| /solutions, /solutions/ai-solution-4…6 | AI solutions 4–6 (Q5.3; candidates: PPE Detection, Steel Plate Inspection, InvoiceAI, RAG assistant) | As above | Which solutions, plus copy and imagery |
| /solutions/face-recognition, /industrial-analytics, /asset-tracking | Product screenshots | Section hidden | Screenshots (optional) |
| /solutions/asset-tracking | Challenge/body copy (none on the source page) | Overview shows the summary only | Optional challenge copy; also confirm it belongs under AI solutions (editorNote) |
| /solutions/testguard | TestGUARD is DRAFT (Q7.3) but visible in preview; links out to arivoo.in/testguard | Product tile + page | Confirm placement |
| /solutions/* | FAQs | Section hidden (none in DB) | Optional FAQs per solution |
| /case-studies/* | All 20 case studies are DRAFT (Q5.5, Q5.6) and visible only with PREVIEW_DRAFTS | Normal | Clearance per story |
| /case-studies/sap-business-partner-workflow | **CONFLICT** headline 97% vs "cut by ¾"; result "97% Of overall data volume…" | Headline shows "Result to be confirmed"; that result row is hidden. **The title still contains "97%"** (title is DB copy) | Correct figure; title wording if 97% is wrong |
| /case-studies/sap-fiori-btp-capex-real-estate | **CONFLICT** headline "30% savings in efforts" vs detail-page 30% "cash working capital" | Headline "Result to be confirmed"; results (40%, 30% working capital) shown. **Title still says "Save 30% in Efforts"** | Correct headline figure/title |
| /case-studies/steel-plate-inspection | **CONFLICT** "detect 80% of defects" vs "reduces manual intervention by 80%" | Headline "Result to be confirmed"; results 67.2% / 32.8% shown. **Title still says 80%** | Which 80% is right |
| /case-studies/sap-bank-communication-management | Result "75% … (from 8-10 days to 2-3 days)" repeats the inter-company figure (flagged "confirm") | Result row hidden | Confirm or correct |
| /case-studies/kubernetes-operations-healthtech | No headline metric and no results | "Result to be confirmed" (hero, card) and "Results to be confirmed" panel on the results band | A measured outcome |
| /case-studies/ai-traffic-monitoring, entry-exit-time-tracker | Card summary is a placeholder | Hero has no intro line | Card copy |
| /case-studies/* | Quotes: none in the data | Quote section hidden (template ready) | Client quotes with attribution, if available |
| /case-studies/* | Region tags missing on most stories (NO_REGION notes) | Region row omitted from "At a glance" | Region per story |
| /case-studies (filters) | Industry mapping marked "confirm" on most stories; `rag-knowledge-assistant` has no industry | Facets derived from DB (Industry tab labels, service pillars); stories without an industry appear only under "All industries" | Confirm industries |
| /case-studies/* | Technologies missing for several stories (e.g. business-partner workflow) | Technologies strip hidden | Technologies |

INTERIM UI labels (not content, change freely): section headings "Our products", "AI solutions", "Our solutions in practice", "What {name} delivers", "Inside {name}", "{name} at work", "Platforms it works with", "Explore more solutions", "Explore our work", "What stood in the way", "What we delivered" / "How it was delivered", "The measurable impact", "Related case studies"; filter labels "Filter by industry/service", "All industries/services", empty-state copy.

#### Data handling decisions (interim, in `lib/data/caseStudies.ts`)
- `CONFLICTING_HEADLINE` and `UNVERIFIED_RESULTS`: slug lists of withheld figures (above), applied everywhere these templates render case cards (solutions overview, solution detail, listing, related rails). The **homepage rails use the shared `toCaseCard` and still show these headline figures**.
- `SEQUENCED_SOLUTION`: only `ai-traffic-monitoring` has a real step sequence (collect → annotate → augment → train → evaluate) and is numbered; every other solution list is a set of capabilities.
- Arivoo modules (`ARIVOO_MODULE`) have no page (`/solutions/arivoo-ums` → 404); they always link out.
- Listing filters are client-side over the full list; the selection is mirrored to `?industry=…&service=…` with `history.replaceState` and restored after hydration, so the route stays static.

### Events and Insights

Routes: `/insights` (hub), `/insights/events` (listing), `/insights/events/[slug]` (event page, launch priority: `house-of-lords-2026`), `/insights/events/[slug]/calendar` (.ics download), `/insights/blog` (coming soon + newsletter).

Files: `app/insights/**`, `lib/data/events.ts`, `components/events/**` (EventCard, EventParts, RegistrationForm, actions, format, honeypot), `components/newsletter/**` (NewsletterForm, actions; reusable on any page via `<NewsletterForm permalink="/page" tone="light|dark" />`).

#### Placeholders and items to confirm

##### House of Lords event (Q6.1–Q6.6), launch priority
- MISSING: **full event title.** The DB title is a placeholder, shown as "AdamasTech at the House of Lords" with a "Title to be confirmed" tag (hero, listing, cards, .ics).
- MISSING: **eyebrow** (shown as "Event").
- MISSING: **one-paragraph summary.** Hidden until supplied (hero intro, listing card, meta description, .ics description and JSON-LD fall back to date and venue).
- MISSING: **full description, host and sponsor wording.** The "About the event" section shows a "Event description to be confirmed" panel.
- MISSING: **start and end time.** 18:00 is a seeded placeholder (only 26 Nov comes from the sitemap); there is no end time. The hero, facts panel and form show "Finish time to be confirmed". The .ics has no end time until one is set. The countdown counts to 18:00 GMT.
- MISSING: **agenda.** Three placeholder items (18:00 arrival and registration, 18:30 keynote, 19:30 networking reception): times, titles and descriptions. Each shows "Details to be confirmed"; the section shows "Timings to be confirmed".
- MISSING: **speakers** (names, roles, photos, bios, LinkedIn). No EventSpeaker rows; the section shows "Speakers to be announced" with three designed placeholder places. Speakers are added as EventSpeaker → Person rows (Person needs status PUBLISHED, or DRAFT in preview).
- DECISION: **venue name and address** ("House of Lords, Palace of Westminster, London SW1A 0PW"), and the room. Shown as seeded.
- MISSING: **getting there**: arrival, entrance, security and accessibility notes. The venue section shows "Arrival, access and security details to be confirmed".
- MISSING: **capacity** (when set, the page shows "Limited to N guests").
- MISSING: **imagery** (event image and OG image). Branded artwork stands in on the hero, cards and venue block.
- DECISION: **registration fields.** Built from the EventRegistration model: full name*, work email*, organisation, job title, phone, notes (for example accessibility or dietary requirements), consent*. Confirm whether anything else is needed (for example dietary requirements as a separate field, or a guest).
- DECISION: **registration consent wording** (currently: "I agree to AdamasTech storing these details to manage my registration, as described in the Privacy Policy.") and the confirmation copy ("we will be in touch by email with the final details").
- DECISION: **confirmation email** to registrants. Today `sendMail` (console mailer) sends a notification to `MAIL_TO_ENQUIRIES` and a plain confirmation to the registrant. Wording and sender to confirm when SES is set up.

##### Events listing (Q6.7)
- MISSING: past events. The "Past events" section shows a designed empty state with the newsletter signup.

##### Blog (coming soon, Q2.6 / Phase 2)
- DECISION: blog launch timing; the page is a "Coming soon" page with newsletter signup.
- MISSING: **newsletter provider and consent wording** (CONTENT_TODO "Legal and global"). Current label: "I would like to receive email updates from AdamasTech. I can unsubscribe at any time; see the Privacy Policy." Subscribers are stored in NewsletterSubscriber (email, consent, region from the region cookie). There is no unsubscribe flow yet.

##### Interim UI copy (short labels written for this round, client to approve)
- `/insights/events` intro: "Upcoming and past AdamasTech events, with dates, venues and registration."
- `/insights` intro: "Events and articles from AdamasTech Consulting."; newsletter band: "Stay in the loop" / "New events and articles, straight to your inbox."
- `/insights/blog` intro: "Our blog is coming soon. Subscribe and we will email you when the first articles are published."

### Company and utility pages

Pages: `/about`, `/about/team`, `/about/careers`, `/credentials`, `/contact`, `/search`, `/thank-you`, `/privacy-policy`, `/cookie-policy`, `/terms-of-use`, and the 404 page.
Content source: `content/pages.ts` (seeded into `Page`), plus the existing `Person`, `Certification`, `Stat`, `Office` and `Region` rows.
Every item below is also flagged in its seed record (`needsReview` + `editorNote`).

Legend (as in `CONTENT_TODO.md`): **CONFLICT** = the live site contradicts itself · **MISSING** = no source content · **PLACEHOLDER** = rendered with a designed placeholder · **DECISION** = client choice needed · **INTERIM** = UI copy written for the prototype, for sign-off

#### About (`/about`, source `about-us.md`)
- **CONFLICT / held back:** "Founded in 2021, Adamas Tech Consulting has rapidly expanded its presence across four countries: Saudi Arabia, England, the USA, and India." It is visible on the live page, but the founding year conflicts with the hidden "1995+ Year" and "22+ Years", and "four countries" leaves out the UAE (Dubai office, /ae/). The sentence is kept in `blocks.story.held` and is not rendered. The page shows a designed "Founding story and team size to be confirmed" note instead. **Client:** confirm the founding year and the country list.
- **Unverified / held back:** "With a team of over 100 experts, we blend deep industry knowledge…". The team size is not verified (stat `team-size-100`). It is held the same way. **Client:** confirm the headcount, or approve the sentence without the number.
- **Kept, but needs verification:** "As an ISO 9001 and ISO 27001 certified company and a CMMI Level 3 certification holder…". This is the client's own live wording, and the same badges already show on the homepages. Certificates, numbers and validity are still MISSING (Q5.9). Remove the sentence if the certificates cannot be supplied before launch.
- **MISSING (PLACEHOLDER):** RICE Adamas Group description (sitemap: About page content). Shown as a "Group description to be confirmed" card.
- **REVIEW:** the "Our Model" heading "How we do" is kept verbatim. Suggested wording: "How we work". The six steps are verbatim (the live icons split each step over two lines, e.g. "Discovery and / Vision Setting").
- "Why Choose Us" items are verbatim, including the US spelling "prioritize" and the missing full stops on three items. The site otherwise uses British English: **client**, confirm whether to normalise.
- Verified "about" stats render under the story automatically. None are verified today, so none show.
- SEO description: there is no meta description on the live site. It is drafted from the hero line.

#### Team (`/about/team`)
- Names, roles and photos come from `content/people.ts` (unchanged). All three people are DRAFT (DECISION Q5.7). They show in this preview because `PREVIEW_DRAFTS=true`. In production the page shows a designed "Leadership profiles to be confirmed" panel until they are published.
- **MISSING (PLACEHOLDER):** a bio for each leader. Each row shows a "Biography to be confirmed" block.
- **MISSING:** LinkedIn URLs. The link renders automatically once a URL is set.
- **MISSING:** a page introduction. The hero runs without one. Title and eyebrow are the live "LEADERSHIP / Our Company Leading Members".
- Portraits: live images (about 470 px). Higher-resolution portraits are welcome. People without a photo get a designed monogram portrait.
- SEO description "The leadership of Adamas Tech Consulting." is INTERIM.

#### Careers (`/about/careers`)
- Phase 2 (Q2.9, Q13.1). There is no careers content on the live site.
- **INTERIM:** the status "Coming soon", the panel heading "Coming soon: careers at AdamasTech" and the message "Our careers page is on its way. In the meantime, we would be glad to hear from you." are UI copy for sign-off. The page is noindex until it goes live.

#### Credentials (`/credentials`)
- Hero and intro: the live "PARTNERS & CERTIFICATIONS / Trusted Partners & Certified Excellence" header (`in.md`). The section copy is the homepage "Certified Quality" item.
- **MISSING (Q5.9):** certificate PDF, certificate number and validity date for ISO 9001:2015 (BSI), ISO/IEC 27001 (DQS) and CMMI ML3. Nothing is verified, so each row shows "To be confirmed" / "Certificate to be supplied" tags. The number, date and download link render only when `Certification.verified = true`.
- **DECISION:** the AWS, SAP and Oracle NetSuite partner programmes are DRAFT rows (`content/trust.ts`). They show in preview with the tag "Programme and tier to be confirmed", and are hidden in production until published.
- "Partner programmes" and "Certifications" are UI labels.

#### Contact (`/contact`, source `contact.md`)
- **TYPO FIXED:** "Lets get in touch" → "Let’s get in touch".
- Hero and form copy are verbatim. The live "Support / Contact our fast support team / marketing@adamastech.in" and "Phone / Mon-Fri from 9:30am to 6:30pm. / +91-6296680677" are shown beside the form.
- **DECISION:** the office hours belong to the India number. Confirm the hours per region (the regional numbers are listed in the hero).
- Offices: the 5 published "Our Presence" offices (PLAN D5). Harrow, Riyadh and Bhubaneswar (second /contact/ list) stay draft. All office conflicts are already in `CONTENT_TODO.md`.
- **Not migrated:** the Locations intro "Our location is strategically situated at the heart of City…" (theme filler, and it contradicts a multi-office presence).
- Form: the live fields Name, Email, Phone Number, Country and Message, plus the terms checkbox, which now also names the privacy policy. Phone is optional; the live form marks nothing. The arithmetic captcha is replaced by a honeypot plus rate limiting (5 per 10 minutes per hashed IP). **Client:** confirm the consent wording.
- Each submission stores `region` (from the `region` cookie), `sourcePath`, and `serviceContext` from a `?service=` hint on the contact URL. The hint is read in the browser, or from the Referer without JavaScript, so the page stays static.
- **INTERIM:** form microcopy (labels, hints, validation messages, "Send message").

#### Thank you (`/thank-you`)
- **INTERIM:** the title "Thank you for getting in touch", the line "Your message has reached our team." and the "While you wait" next steps (Services, Success stories, Credentials) are UI copy. No response time is promised (the response-time stats are unverified). The page is always noindex.

#### Legal pages
- **Privacy Policy** and **Terms of Use:** migrated verbatim from the live pages (Termly template, "Last updated February 15, 2024") by a converter. Presentation changes only:
  - all-caps section headings set in sentence case (e.g. "1. WHAT INFORMATION DO WE COLLECT?" → "1. What information do we collect?");
  - quotes typed as ‘…‘ on the live page corrected to ‘…’;
  - the live table of contents is replaced by the sticky contents list;
  - inline links (Termly DSAR form, regulators, Google opt-out, ICO) are listed under their section, because `Prose` has no inline links;
  - the privacy notice's categories table (section 12) is a real table, stacked on phones;
  - the terms' table of contents is an ordered list on the live page, so section numbers 1–22 are shown.
- **TYPOS FIXED (terms):** "Adamas Tech Consulting Private Limited ," → "…Limited," (twice); "CONTRIBUTIONLICENCE" → "Contribution licence".
- **CONFLICT (legal review before launch):** the legal pages give the registered address "2nd Floor, Vallabha Pamadi, 2727, 16th Cross, 27th Main Rd, HSR Layout, Bengaluru 560068" and the emails Info@ / info@ / hr@adamastech.in. The privacy notice names Arun Bardhan (39 Roxborough Road, Harrow) as UK representative. Both documents say the website is https://adamastech.in. The terms link their privacy policy to https://adamastech.in/privacy/; that link now points to this site's `/privacy-policy`. The privacy notice's "Cookie Notice" reference links to `/cookie-policy`.
- The page title is "Terms of Use" (live page title "Terms of use"); the document itself is headed "Terms of Service" (kept as the document label).
- **MISSING (PLACEHOLDER):** Cookie Policy text (Q10.2–Q10.4). `/cookie-policy` shows a designed "Policy text to be supplied" panel and is noindex until the text arrives.

#### Search (`/search`)
- Static route. The cached index (services and pillars, solutions, case studies, events, published Page rows and the main listing pages) is rendered into the page and filtered in the browser. `?q=` is kept in step with `history.replaceState`. Draft items appear only in preview.
- Descriptors are the items' own taglines or summaries. Placeholder instructions are dropped. INTERIM: the static entry "Services: Cloud, digital transformation and AI services." (from the services page metadata).
- noindex, follow.

#### 404
- Same copy as before. It now uses the inner-page hero, plus a site search box and four section links.


## Design round 5: approved Figma build (started 2026-11-13)

The prototype's visual layer was removed on 13 Nov 2026; the site is rebuilt to the approved Figma file (`docs/AdamasTech_Master_Build_Prompt_v2.md`). Naming follows `docs/sitemap-latest.csv` where it differs from Figma (table in `docs/design-notes.md`). Items below were added or changed in this round; every one is also flagged in its seed record.

### Navigation and footer (`content/navigation.ts`, built in Milestone A)
- **RENAMED (sitemap comment):** Cloud sub-services are now Migration & Modernization, DevOps & SecOps, Managed Services, AI/ML Ops, Cloud Automation, Cloud Advisory & Consultation. Slugs renamed to match (Swayang, 13 Nov 2026): `/services/cloud-services/migration-modernization`, `devops-secops`, `managed-services`, `ai-ml-ops`, `cloud-automation`, `cloud-advisory-consultation`. The old slugs and the WordPress URLs 301 straight to the new ones (`content/redirects.ts`, section 1b).
- **MISSING:** descriptors and page copy for AI/ML Ops (`ai-ml-ops`) and Cloud Automation (`cloud-automation`): the old SAP-on-Cloud and NetSuite copy no longer matches the names, so both carry a `[Placeholder]` descriptor. Cloud Advisory & Consultation keeps the old "Cloud Security & FinOps" descriptor for review.
- **RENAMED (sitemap row 21):** the AI pillar is "Data & AI Services" (Figma says "AI Services"). Shown in the nav, services tab and footer.
- **ADDED (sitemap "create URL"):** Data Engineering, Advanced Analytics, Sovereign AI, Responsible AI and AI Security & Governance under `/services/ai-services/`, published with `[Placeholder]` descriptor and summary so the menu and routes exist. **MISSING:** all copy.
- **RENAMED (brief, sitemap):** AI Product A is **A-EYE**, AI Product B is **AIR-MIND**. Both `Solution` rows and nav items are now PUBLISHED so the menu and `/solutions/a-eye`, `/solutions/air-mind` exist (old slugs 301). **MISSING (Q7.2):** tagline, page copy, features, screenshots.
- **RENAMED (sitemap):** Smart Parking is **Industrial Analytics**, Cash Forecasting (SAP Treasury) is **Asset Tracking**, in the menu, footer and `Solution` rows. Slugs renamed to `/solutions/industrial-analytics` and `/solutions/asset-tracking` (Swayang, 13 Nov 2026); the old slugs and the WordPress SAP Treasury URL 301 to the new ones. The page copy still describes parking detection and SAP Treasury: **MISSING** copy for the renamed solutions.
- **CHANGED (brief):** the Arivoo menu and footer items open `https://arivoo.in` in a new tab (Q7.1). The `/solutions/arivoo` overview page still exists and is listed on `/solutions`.
- **CHANGED (brief):** the About Us menu lists Company, Team and Careers (coming soon). Credentials moved out of that menu (still in the footer and legal row).
- **PLACEHOLDER (Figma):** the top-bar phone `+91 000 500 0000` is replaced by each region's number from the database. Twitter and YouTube icons in the Figma top bar have no verified URLs, so only Facebook and LinkedIn render.
- **DESIGN:** Figma fills the mega-menu panel with grey `#CCCDCF`; built as designed, probably a placeholder (`docs/design-notes.md` item 5).
- **INTERIM:** mega-menu "Explore {category}" links, the About Us / Solutions / Insights panel layouts, the mobile drawer and the sticky-header state are built without Figma frames (`docs/design-notes.md`).

### Unverified claims in the approved design (to build in Milestone B as DRAFT)
- "100% Satisfied" and "Zero Risk" (hero trust row), "30% improvement in cash forecasting" (Client Outcomes). They will be stored as DRAFT stats so the draft badge shows with `SHOW_DRAFT_BADGES=true`. **Client:** confirm or replace.
- The Top Stories, Events & Insights and Latest Perspectives cards in Figma are editorial filler ("Adamas accelerates enterprise transformation with AI-driven solutions", "Building data sovereignty into your cloud strategy", "DATE PENDING"). **MISSING:** real stories.
- The Services and Industries paragraphs are repeated twice in Figma; each renders once. **MISSING:** final copy for the second paragraph.
- "Explore Industry" buttons: the sitemap has no industry pages; they will link to `/contact`. **Client:** confirm.
- Partner logos in Figma: AWS Partner Network, Cloudera, SAP Partner Open Ecosystem, Google Developers Agency Program. Cloudera and the Google programme are not on the live site. **Client:** confirm the partner list and tiers before they are published.
- Hero copy in Figma mixes an India eyebrow with Gulf-focused text ("across the Middle East"). Each region's own copy from the database will be used; "Middle East" is never shown.

### Homepage sections (Milestone B, 2026-11-13)
- **INTERIM:** hero eyebrow and body per region (`home.hero` rows): Figma copy with the region word changed; UK and GCC eyebrows written to the India pattern. Client to supply final hero copy for each region.
- **UNVERIFIED (DRAFT stats):** "100% Satisfied" and "Zero Risk" (`hero-satisfied-100`, `hero-zero-risk`) and "30% improvement in cash forecasting" (`cash-forecasting-improvement-30`). Shown only while drafts are previewed, with the draft badge.
- **FILLER (from Figma):** Top Stories story 1 ("Adamas accelerates enterprise transformation with AI-driven solutions", 29 Oct 2026), the three Events & Insights rows and the three Latest Perspectives cards (`home.topStories`, `home.events`, `home.perspectives`). Replace with real stories before launch. Dates render in British English ("29 October 2026"; Figma shows "October 29, 2026").
- **COPY:** the Cloud paragraph is repeated twice in the Figma Services panel; rendered once. Second paragraph needed. Only the Cloud tab is designed: Digital Transformation and Data & AI Services reuse their live-site summaries and new Figma-style images.
- **COPY:** the About paragraph says "supporting Indian enterprises and institutions": confirm wording for the UK and GCC homepages (a region override of `home.about` can replace it).
- **INDUSTRIES:** the twelve Figma industries replace the live site's seven tabs (Hospitality dropped). Copy exists for Healthcare and Financial Services (Figma) and Retail, Education, Manufacturing, Government (live site); Technology, Energy, Legal (Law Firms), Software Development, Marketing Agencies and Startups are placeholders. The Figma Industries paragraph is repeated twice; rendered once. "Explore Industry" links to /contact (no industry pages in the sitemap).
- **EVENT:** the hero card and Events section use the DRAFT House of Lords event (title still a placeholder: "AdamasTech at the House of Lords"); Figma's editorial card title is "Join us at the House of Lords, London.". The event image is a stock keynote photo from the design (placeholder).
- **PARTNERS:** the Figma strip shows AWS Partner Network, Cloudera, SAP Partner Open Ecosystem and Google Developers Agency Program. Cloudera and Google are DRAFT (not on the live site); AWS/SAP programme tiers to confirm.
- **DESIGN:** Tech Excellence body text darkened from #B7C8DC to grey-600 for contrast. The presence map is a flat raster with pins baked in (cannot highlight London/Dubai per region).
- **FORM:** the homepage contact form adds a consent checkbox (not in Figma; required by the contact action and GDPR). Confirm the wording "I agree to the Privacy Policy and Terms of Use."

## Design round 6 (2026-11-13): fixture comparison, industries, GCC

### Industries (`content/industries.ts`)
- **Copy sources, for the record:** Healthcare and Financial Services use the approved Figma copy. Retail and Education reuse the live site's tab copy and image under the same name (PUBLISHED, needs review). Nothing else was written for the client.
- **DRAFT (reused under a new name):** Manufacturing and Government carry the live site's "Supply chain" and "Public sector" tab copy and images. They are DRAFT until the client confirms the reuse or supplies new copy. **Client:** confirm or replace.
- **DRAFT (no copy exists):** Technology, Energy, Legal (Law Firms), Software Development, Marketing Agencies and Startups. Figma lists them in the "All Industries" menu but designs no copy, and the live site has none. Their body is a "[Placeholder]" that renders as "Details to be confirmed"; the rows are DRAFT, so they appear only in the preview (`PREVIEW_DRAFTS=true`, badged with `SHOW_DRAFT_BADGES=true`) and never on the public site. **Client:** two short paragraphs and an image for each.
- **Case studies:** the industry references follow the Figma names (finance to Financial Services, supply-chain to Manufacturing, public-sector to Government). "Cinema Hall Person Count" was Hospitality, which is not one of the twelve industries; it now has no industry tab. **Client:** which industry, if any?

### Homepage comparison with the Figma placeholder content (`/figma-fixture`, local only)
- The fixture keeps the Figma typos on purpose ("Whats's Next", "Al-driven") so the text wraps as designed; the live rows have the corrected copy. "Middle East" in the Figma hero body is never shown (fixture says "GCC").
- **Dates:** Figma writes "October 29, 2026"; the site uses the British order "29 October 2026" everywhere. **Client:** confirm the date format.
- **Consent line:** the contact form's consent checkbox now sits inside the design's gap above the button, and "Privacy Policy" / "Terms of Use" inside the consent copy become the links. If the copy is changed and names neither page, both links are appended after it.
- The remaining differences on `/in/` are content, not layout: the database phone, email and "About Us" label, the rebuilt hero cards over clean photos (Figma bakes text into one image), the real event title, the Draft badges, the Cloud sub-service names from the sitemap.

### Regions (Milestone C)
- **CHANGED (sitemap):** the Gulf homepage is `/gcc/`; `/ae/` and everything under it are 301s to `/gcc/`. The WordPress `/ae` redirect now targets `/gcc/`. Region rows, offices, logos, stats, case studies and content blocks use the key `GCC`.
- **Neon:** the preview database needs migration `20261113120000_region_gcc` and a reseed at the next deploy (`docs/deploy.md`). Until then the preview still serves `/ae/`.
- **COPY:** no region-specific copy was written. The About paragraph ("supporting Indian enterprises and institutions") still shows on `/uk/` and `/gcc/`; `home.about` can take a region override once the client supplies it. The hero eyebrow and body per region remain INTERIM (round 5).

## Design round 7 (2026-11-13): QA milestone, event page, Cloud Services template

### Regions
- **CHANGED:** Tech Excellence and the Partners & Certifications strip now show on `/gcc/` (the approved design has them on every homepage; the live /ae/ hid them). **Client:** confirm the GCC partner list is the same as India and UK.

### House of Lords event (`content/events.ts`, `/insights/events/house-of-lords-2026`)
- The page and registration are live on the template; the content is still the round-1 placeholder set: title ("AdamasTech at the House of Lords", shown with a "title to be confirmed" tag), eyebrow, summary and body (hidden while placeholders), 18:00 start, no end time, three DRAFT agenda items (preview only), no speakers, venue "House of Lords, Palace of Westminster, London SW1A 0PW". **Client, before 26 November:** final title, one-paragraph summary, description, start and end time, room, agenda, speakers (name, role, photo), capacity, dress code or entry requirements, host wording, and whether registration should close at a given date or number.
- Registration emails: the attendee gets a confirmation with the calendar entry attached from `MAIL_FROM`; the enquiries inbox gets the details. Mail only sends once `MAILER=smtp` and the SMTP variables are set on Vercel (`docs/deploy.md`). **Client:** which mailbox sends (marketing@adamastech.in via Google Workspace?) and who receives registrations.
- The consent wording on the registration form ("I agree to AdamasTech Consulting processing my details to manage this event...") is interim. **Client:** confirm.

### Cloud Services page (`content/blocks.ts` keys `services.cloud-services.*`, `content/services.ts` FAQs)
- **Figma copy, needs review:** intro, "What Makes CloudSMART Different" (the name "CloudSMART" and the partnership sentence), expertise cards, platform list (Azure and Google Cloud capability claims are not on the live site), industry cards, quality principles and the "Important" note, FAQ headings. All PUBLISHED with `needsReview`, like the homepage.
- **PLACEHOLDER (hero):** the designed title "The AI Impact Imperatives, 2026" is a placeholder; the page shows the pillar's live outcome line "Cloud that Scales your Organisation". **Client:** hero headline and line.
- **DRAFT (preview only):** the four "500+" stat cards (no real figures) and the technology-ecosystem tiles (eleven vendor names from the design; no logos drawn in). **Client:** real figures; confirm the vendor list and supply logo files the company may use.
- **FAQ:** ten questions from the design; only the first answer exists in the file. Questions 2 to 10 are DRAFT with placeholder answers. **Client:** nine answers.
- **Replaced:** the design's three "concept showcase" cards and the sentence "Conceptual showcases demonstrating..." are replaced by the pillar's real case studies (two today); "See All Case Studies" links to the listing. The "Learn more" button under CloudSMART has no target in the design and scrolls to the services list.
- **Links chosen:** industry cards and "Discuss This Service" go to /contact; "Meet Our Cloud Team" to /about/team; "Request Credential Information" to /contact.
- **Sub-service pages:** same template fed from each Service row; section labels ("What we do", "How we deliver", "Technologies", "More in Cloud Services", "<name>, step by step") are INTERIM UI labels.
- **Other pillars:** Digital Transformation and Data & AI Services render the template with their database rows but have no `services.<slug>.*` blocks yet (no intro, differentiator, platform, industry, ecosystem or quality sections). **Client/designer:** copy for those sections per pillar, or confirm the Cloud sections are reused.

### Accessibility deviations from the design (AA)
- Perspectives card labels sky-300 on white and the "Your nearest office" label blue-600 on navy fail 4.5:1 in the design; built in blue-600 and sky-300. Small numbers in the service page (#8D98A5, #6E7F95) are built in grey-550.
- The mega-menu panel is frosted glass per the designer's decision; its links are blue-700 (not blue-600) so they pass over the hero.


## QA Phase 2 (2026-11-17): British spelling and the BUG-014 placeholder sweep

### Service and product names kept in American spelling (DECISION, client)
Decision 3 of the Phase 2 brief: the general copy was converted to British English (`scripts/content/british-spelling.mjs`, 102 lines in eight seed files, change log in `docs/qa/evidence/phase2/spelling-changes.md`), but names the client wrote stay exactly as written. Ask the client whether these should follow:
- **"Migration & Modernization"** · Cloud Services sub-service name (`content/services.ts` `name`, `content/navigation.ts` label, sitemap row, slug `migration-modernization`). The copy around it now reads "modernisation".
- **"Google Developers Agency Program"** · partner logo name (`content/trust.ts`, DRAFT) and its alt text. Proper noun.
- Left unchanged on purpose because the British form differs in meaning or usage: "license/licensee" (legal pages: the verb and "licensee" are the same in British English), "program" (software sense), "catalog" (none found), the sitemap/slug values and every URL.

### Rows moved to DRAFT by the BUG-014 sweep (decision 4)
Scan of every PUBLISHED row (`scripts/qa/placeholder-sweep.mts`, evidence `docs/qa/evidence/phase2/placeholder-sweep-before.md` and `-after.md`): 53 hits before, 16 after. Each row below carries a `// DRAFT: BUG-014 sweep` comment next to its status in `content/*.ts` and reappears on the public site the moment the client's copy replaces the placeholder and the status is set back to PUBLISHED.
- **Hero card "How SAP Treasury improved cash forecasting by 30%"** (`content/home.ts`, all three homepages) · unverified 30 % figure (Q5.5); it also links to the DRAFT case study. The public hero shows the two remaining cards.
- **Services** (`content/services.ts`): AI/ML Ops, Computer Vision, Data Engineering, Advanced Analytics, Sovereign AI, Responsible AI, AI Security & Governance · placeholder descriptor and/or summary (Q5.2). Their pages, menu links and sitemap entries are hidden on the public build; legacy redirects to them land on `/services`. Data & AI Services keeps AI/ML, Agentic AI and Generative AI publicly.
- **Menu rows** (`content/navigation.ts`): the seven service links above plus A-EYE, AIR-MIND and Asset Tracking · placeholder descriptors or the 30 % figure.
- **Solutions** (`content/solutions.ts`): Arivoo (placeholder summary, Q7.1; the UMS/SMS/LMS products stay public), A-EYE and AIR-MIND (placeholder tagline and overview), Asset Tracking (tagline "Boosting Cash Forecasting by 30%", unverified).
- **Milestones** (`content/milestones.ts`, all six) · "Milestone title to be confirmed".
- **"What we do" items** "[Placeholder] Cloud reselling (CSP)" (Managed Services) and "[Placeholder] FinOps and cloud cost governance" (Cloud Advisory & Consultation) are list entries inside PUBLISHED rows: they are now rendered only in the drafts preview (`lib/data/services.ts`).

### Placeholder text still inside PUBLISHED rows (DECIDED, 17 November 2026)

Swayang's decision: keep these pages PUBLISHED, but hide the placeholder **blocks** when `PREVIEW_DRAFTS=false`,
at block level rather than page level. Implemented in the data layer, so no component can leak a placeholder and
every future template inherits the rule:

- `lib/public-copy.ts` decides whether one field may be shown: a `[Placeholder]` prefix, a bracketed name, or a
  "to be confirmed / to be supplied / TBC / TBD" label is withheld with drafts off and passed through in the
  drafts preview.
- `lib/data/site.ts` applies it to every `ContentBlock` eyebrow, heading, body and CTA label; `lib/data/services.ts`
  to every pillar and service tagline, summary, outcome line, challenge and descriptor; `lib/data/pages.ts` drops
  whole pending blocks (the About group paragraph and its held-back sentences, the Team and Credentials
  "to be confirmed" labels, a legal page's placeholder body).
- Each affected template already had a fallback, so the result is the designed page minus the unconfirmed line:
  the Cloud Services hero shows the pillar's own outcome line, the About page leaves the group paragraph out.

The client copy still needed for these rows is unchanged, and is listed in
`docs/qa/evidence/phase2/client-content-request.md`. The original 16 hits, for the record (none of them renders
on the public build; the public crawl and the e2e draft-leak test check for "[", "to be confirmed", "TBC",
"TBD", "Lorem", "30%", "500+", "100% Satisfied", "Zero Risk" on every sitemap URL):
- `ContentBlock services.cloud-services.hero` heading "[Placeholder] The AI Impact Imperatives, 2026" · the hero title falls back to the pillar name; DRAFT would drop the hero copy and image.
- `ContentBlock home.topStories` item 3 "Boosting cash forecasting by 30% with SAP Treasury" · dropped publicly because it links to the DRAFT case study (link gate); the block carries the other stories.
- `NavItem` Cloud Automation descriptor "[Placeholder] One line on cloud automation." · the page itself has real copy; instruction descriptors never render.
- `ServicePillar` digital-transformation `outcomeLine` and `challenge`, ai-services `challenge` · fallback fields only; DRAFT would remove two of the three pillars.
- `Page /about` group body "[Placeholder] RICE Adamas Group description." and the pending label; `Page /about/team` empty-state labels; `Page /credentials` pending labels · now dropped from the public payload by `lib/data/pages.ts`. Client copy still needed: the RICE Adamas Group description, leadership profiles and bios, certificate numbers and validity dates.
- `Page /cookie-policy` "[Placeholder] Cookie policy text." · **resolved**: the page now carries a factual cookie policy (see Legal and global above) and renders it through the new legal template, as /privacy-policy and /terms-of-use now do.
