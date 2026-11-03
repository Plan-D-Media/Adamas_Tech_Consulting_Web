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
- CONFLICT: Palo Alto address labelled "San Francisco". The new site will show "Palo Alto". Confirm label, and whether the US office is still active (sitemap: "US office to confirm").
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
- PLACEHOLDER: [AI Product A], [AI Product B]: name, page, screenshots (Q7.2). Seeded as draft, hidden from the menu until published.
- PLACEHOLDER: AI solutions 4–6 (Q5.3). Candidates from existing case studies: PPE Detection, Steel Plate Inspection, Invoice AI, RAG chatbot. Please confirm.
- DECISION: Arivoo as `/solutions/arivoo` page vs direct link (Q7.1). Built as a page.
- CONFLICT: Arivoo URLs: header uses arivoo.in/lms, /sms; footer uses /arivoo-lms, /arivoo-sms, /arivoo-ums. Sitemap uses /arivoo-*. Using the sitemap.
- DECISION: TestGUARD placement (Q7.3). Not in the menu; footer link kept.
- MISSING: product UI screenshots for every solution (placeholder frames until supplied).

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
- MISSING: Cookie Policy text (new page). Placeholder until supplied.
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
| /solutions, /solutions/ai-product-a, /solutions/ai-product-b | AI Product A/B: name, tagline, overview, challenge, capabilities, screenshots (Q7.2) | "Name to be confirmed" / "Title to be confirmed" tags, "Details to be confirmed", pending Overview/Challenge panels, three "Capability to be confirmed" panels, branded artwork; pages are `noindex` | All product copy and imagery |
| /solutions, /solutions/ai-solution-4…6 | AI solutions 4–6 (Q5.3; candidates: PPE Detection, Steel Plate Inspection, InvoiceAI, RAG assistant) | As above | Which solutions, plus copy and imagery |
| /solutions/face-recognition, /smart-parking, /cash-forecasting | Product screenshots | Section hidden | Screenshots (optional) |
| /solutions/cash-forecasting | Challenge/body copy (none on the source page) | Overview shows the summary only | Optional challenge copy; also confirm it belongs under AI solutions (editorNote) |
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
