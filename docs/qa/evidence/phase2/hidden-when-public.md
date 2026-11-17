# Hidden on the public site (phase2)

Generated 2026-11-17T07:41:43.318Z by `scripts/qa/hidden-inventory.mts` against the local database. Re-run it after any reseed or rescope.

Everything listed here is built and sitting in the database, but does not render when `PREVIEW_DRAFTS=false` (the public configuration):
DRAFT rows are awaiting content or client sign-off, ARCHIVED rows are deliberately retired, and a few PUBLISHED rows are held back by their own flags
(`Stat.verified`, `Certification.verified`). This is the mechanical view; `CONTENT_TODO.md` is the hand-written list of what is missing, with questionnaire refs.

**Hidden routes: 37. Hidden menu items: 18. Hidden sections inside published pages: 69.**

## Summary

| Model | Total rows | Visible when public | Hidden (DRAFT) | Hidden (ARCHIVED) |
|---|---|---|---|---|
| AgendaItem | 3 | 0 | 3 | 0 |
| Announcement | 3 | 0 | 3 | 0 |
| ApproachStep | 19 | 19 | 0 | 0 |
| CaseStudy | 20 | 0 | 20 | 0 |
| Certification | 6 | 3 | 3 | 0 |
| ContentBlock | 32 | 30 | 2 | 0 |
| Event | 1 | 0 | 1 | 0 |
| Faq | 10 | 1 | 9 | 0 |
| HeroSlide | 20 | 6 | 3 | 11 |
| HomeServiceCard | 18 | 6 | 0 | 12 |
| Industry | 12 | 4 | 8 | 0 |
| LogoItem | 35 | 35 | 0 | 0 |
| Milestone | 6 | 0 | 6 | 0 |
| NavItem | 76 | 58 | 18 | 0 |
| Office | 8 | 5 | 3 | 0 |
| Page | 9 | 9 | 0 | 0 |
| Person | 3 | 0 | 3 | 0 |
| RegionHome | 3 | 3 | 0 | 0 |
| Service | 21 | 13 | 8 | 0 |
| ServicePillar | 3 | 3 | 0 | 0 |
| Solution | 13 | 5 | 8 | 0 |
| SolutionFeature | 10 | 10 | 0 | 0 |
| Stat | 13 | 10 | 3 | 0 |
| Technology | 45 | 45 | 0 | 0 |
| **All** | **389** | **265** | **101** | **23** |

Read from the code at run time. Detail routes on disk: case-studies yes, insights/events yes, solutions no, service pillar yes, sub-service yes.
Listing routes on disk: /case-studies yes, /insights/events yes, /solutions no, /services yes.
Sections gated by `lib/data/links.ts`: case-studies, insights/events. Sections that redirect a hidden row to their listing (`lib/data/unpublished.ts`): case-studies, insights/events, services.

## 1. Hidden pages and routes (37)

A URL whose row exists but is not visible redirects (307) to its section listing where `lib/data/unpublished.ts` covers that section; everything else answers 404.

| URL it would have | Model | Row | Status | What the visitor gets | Why it is hidden (editorNote) |
|---|---|---|---|---|---|
| `/case-studies/ai-traffic-monitoring` | CaseStudy | AI Smarter Spaces: Analysing Traffic with 99% Accuracy, Improving Flow by 30% | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). CONFLICT: the live listing card reuses the PPE card's body text, so the summary is a placeholder: card copy needed. Duplicate pages /surveillance-system/ and /ai-smarter-spaces... |
| `/case-studies/car-parking-lot` | CaseStudy | Real-Time Parking Spot Detection with 95% Accuracy | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title. Alternatives: homepage card "Effortless Parking with AI Intelligence"; detail H1 "Maximizing Efficiency: A Case Study in Car Parking Lot Optimization". L... |
| `/case-studies/cinema-hall-person-count` | CaseStudy | 95% Accurate Real-Time Cinema Analytics with Advanced Computer Vision | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title. Alternative: detail H1 "Optimizing Cinema Operations: Accurate Person Counting for Enhanced Audience Management". Label: listing "SMART CITIES", detail "... |
| `/case-studies/entry-exit-time-tracker` | CaseStudy | Monitor Crowd Flow with 98.7% Accuracy and 24/7 Real-Time Entry/Exit Tracking | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). CONFLICT: the live listing card reuses the PPE card's body text, so the summary is a placeholder: card copy needed. Title = listing title ("tracking" capitalised). Alternative:... |
| `/case-studies/face-recognition` | CaseStudy | 99% Accurate Real-Time Facial Recognition Across Multiple Individuals | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title (trailing full stop removed). Alternatives: homepage card "Effortless Security through AI Recognition"; detail H1 "Enhancing Security: A Case Study in Adv... |
| `/case-studies/fruit-recognition` | CaseStudy | 95% Accurate Fruit Detection with Advanced Computer Vision Algorithms | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title. Alternative: detail H1 "Smart Nutrition: Innovating Fruit Recognition and Calorie Prediction". Label "retail" (lower case on the listing) capitalised. Cl... |
| `/case-studies/invoiceai-invoice-processing` | CaseStudy | Reduced Invoice Processing Time by 90% with AI Automation | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title. Alternative: detail H1 "InvoiceAI – Automated Invoice Processing & Reconciliation" (eyebrow "InvoiceAI"). Result labels shortened only by removing the re... |
| `/case-studies/kubernetes-operations-healthtech` | CaseStudy | Modernising Kubernetes Operations for a Leading HealthTech Company | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). MISSING: the page has no headline number, so headlineMetric/metricLabel are placeholders: a measured outcome is needed. The page's "Business Outcomes" are qualitative with no f... |
| `/case-studies/ppe-detection` | CaseStudy | AI Ensures 95%+ PPE Compliance with 30% Efficiency Boost | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title. Alternative: detail H1 "PPE Compliance Monitoring Solution". Label: listing "SMART CITIES", detail "Smarter Cities". Candidate for AI solution 4–6. Indus... |
| `/case-studies/predictive-machine-health-monitoring` | CaseStudy | Reduce Manual Efforts by 50% with Better Planning and Insights | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title (full stop removed). Alternative: detail H1 "Proactive and Predictive Machine Health Monitoring with IoT integration solution". Label: listing "PHARMA" vs... |
| `/case-studies/rag-knowledge-assistant` | CaseStudy | Instant Knowledge Retrieval with AI-Powered RAG Chatbot | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title (full stop removed). Alternative: detail H1 "Information Retriever Chatbot – Enterprise Knowledge Assistant". Headline metric = listing card "50% Less Sup... |
| `/case-studies/sap-analytics-cloud-liquor` | CaseStudy | Accelerate Decision-Making by 30% with Real-Time Dashboard Insights | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title. Alternatives: homepage card "Reducing Cost in Liquor Manufacturing"; detail H1 "SAP Analytics Cloud Implementation". Typo fixed: "litters" → "litres". On... |
| `/case-studies/sap-bank-communication-management` | CaseStudy | Achieve 70% Faster Batch Processing for Enhanced Operational Efficiency | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title (full stop removed). Alternative: detail H1 "SAP Bank Communication Management". Label: listing "BANKING" vs detail "Real Estate" (detail used; client is ... |
| `/case-studies/sap-business-partner-workflow` | CaseStudy | Reduced Data Volume by 97% for Optimal Storage Efficiency | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). CONFLICT: "Reduced Data Volume by 97%" vs "cutting storage needs by three-quarters" / "Of overall data volume was cut by ¾": which figure is right? Title = listing title. Alter... |
| `/case-studies/sap-condition-contract-management` | CaseStudy | Boosted Sales Revenue by 15% in Just One Year | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title (full stop removed). Alternative: detail H1 "Condition Contract Management (Settlement Management)". Label: listing "PREDICTIVE MAINTAINANCE" (wrong for t... |
| `/case-studies/sap-disaster-recovery-cement` | CaseStudy | Strengthening SAP Resilience and Disaster Recovery on AWS | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). No headline number on the page: "24×7" is taken from its Business Outcomes ("24×7 monitoring across AWS and SAP environments"). A measured outcome (e.g. tested RTO/RPO) would b... |
| `/case-studies/sap-fiori-btp-capex-real-estate` | CaseStudy | Save 30% in Efforts with Smarter Resource Planning | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). CONFLICT: the 30% headline ("Save 30% in Efforts") does not match the detail page, whose 30% is "Improvement in cash working capital". Title = listing title (full stop removed)... |
| `/case-studies/sap-intercompany-reconciliation` | CaseStudy | 80% Faster Period Closure: Reduce Reporting Time to 2 Days | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). Title = listing title (full stop removed). Alternative: detail H1 "SAP Inter-Company Reconciliation functionalities". Label: listing "FINANCIAL PRODUCTIVITY" vs detail "Real Es... |
| `/case-studies/sap-treasury-cash-forecasting` | CaseStudy | Boosting Cash Forecasting by 30% | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). CONFLICT resolved by choice: title = homepage card "Boosting Cash Forecasting by 30%" (matches the Cash Forecasting solution). Alternatives: listing "Cut Manual Reconciliation ... |
| `/case-studies/steel-plate-inspection` | CaseStudy | Detect 80% of Steel Plate Defects with Advanced Computer Vision Algorithms | DRAFT | 307 to /case-studies | DRAFT until client clearance (Q5.5, Q5.6). CONFLICT: listing title says "Detect 80% of steel plate defects", the card body says it "reduces manual intervention by 80%". Which? Title = listing title (capitalised as a tit... |
| `/insights/events/house-of-lords-2026` | Event | [Placeholder] AdamasTech at the House of Lords | DRAFT | 307 to /insights/events | MISSING (Q6.1–Q6.6), launch priority: full title, eyebrow, summary, body, start time (18:00 is a placeholder; only the date 26 Nov comes from the sitemap), end time, venue room and confirmation of the venue name/address... |
| `/services/ai-services/advanced-analytics` | Service | Advanced Analytics | DRAFT | 307 to /services | Added from the sitemap (13 Nov 2026, "create URL"): no old page. MISSING: descriptor, summary, what-we-do list and FAQs. |
| `/services/ai-services/ai-security-governance` | Service | AI Security & Governance | DRAFT | 307 to /services | Added from the sitemap (13 Nov 2026, "create URL"): no old page. MISSING: descriptor, summary, what-we-do list and FAQs. |
| `/services/ai-services/computer-vision` | Service | Computer Vision | DRAFT | 307 to /services | MISSING: no old page. Descriptor from the /ai-ml-services/ delivery areas; whatWeDo lists the 8 computer-vision case studies (titles shortened from the case studies). Summary copy needed. Proposed sub-service (Q5.2). |
| `/services/ai-services/data-engineering` | Service | Data Engineering | DRAFT | 307 to /services | Added from the sitemap (13 Nov 2026, "create URL"): no old page. MISSING: descriptor, summary, what-we-do list and FAQs. |
| `/services/ai-services/responsible-ai` | Service | Responsible AI | DRAFT | 307 to /services | Added from the sitemap (13 Nov 2026, "create URL"): no old page. MISSING: descriptor, summary, what-we-do list and FAQs. |
| `/services/ai-services/sovereign-ai` | Service | Sovereign AI | DRAFT | 307 to /services | Added from the sitemap (13 Nov 2026, "create URL"): no old page. MISSING: descriptor, summary, what-we-do list and FAQs. |
| `/services/cloud-services/ai-ml-ops` | Service | AI/ML Ops | DRAFT | 307 to /services | MISSING: no old page. Case-study-backed facts available: "Strengthening SAP Resilience and Disaster Recovery on AWS" (SAP HANA System Replication, AWS Backup, CloudWatch). Copy needed. Name to confirm (Q5.3). |
| `/services/digital-transformation/e-invoicing-uae` | Service | UAE E-Invoicing | DRAFT | 307 to /services | DECISION Q2.4: keep or retire, and show to GCC visitors only? Built from /e-invoicing-uae/ as a draft; /e-invoicing-uae/ redirects to /ae/ for now. Regulatory facts (Cabinet Decision No. 106 of 2025, AED 5,000 penalties... |
| `no URL yet` | Solution (AI_SOLUTION) | Face Recognition Security | DRAFT | nothing: the row has no website to link to, and solutions have no pages on this site | Copy from /face-recognition/ (intro, challenge as body, "BUSINESS BENEFITS" as features); tagline = homepage card. MISSING (Swayang, 17 Nov 2026): the product website URL (set `externalUrl`; no URL was guessed), and pro... |
| `no URL yet` | Solution (AI_SOLUTION) | Industrial Analytics | DRAFT | nothing: the row has no website to link to, and solutions have no pages on this site | Copy from /car-parking-lot/ (intro, challenge as body, "BUSINESS BENEFITS" as features); tagline = homepage card. MISSING (Swayang, 17 Nov 2026): the product website URL (set `externalUrl`; no URL was guessed), and prod... |
| `no URL yet` | Solution (AI_SOLUTION) | Asset Tracking | DRAFT | nothing: the row has no website to link to, and solutions have no pages on this site | Copy from the old /sap-treasury-investment-and-cash-management-implementation/ page ("Solutions Offered" as features, "Technologies Leveraged" as integrations). That old URL now redirects to the SAP service page, becaus... |
| `no URL yet` | Solution (AI_SOLUTION) | [Placeholder] AI solution 4 | DRAFT | nothing: the row has no website to link to, and solutions have no pages on this site | MISSING (Q5.3): remaining AI solutions 4–6 — which solutions they are, and a website URL for each (set `externalUrl`; solutions have no pages here). Candidates from existing case studies: PPE Detection (ppe-detection), ... |
| `no URL yet` | Solution (AI_SOLUTION) | [Placeholder] AI solution 5 | DRAFT | nothing: the row has no website to link to, and solutions have no pages on this site | MISSING (Q5.3): remaining AI solutions 4–6 — which solutions they are, and a website URL for each (set `externalUrl`; solutions have no pages here). Candidates from existing case studies: PPE Detection, Steel Plate Insp... |
| `no URL yet` | Solution (AI_SOLUTION) | [Placeholder] AI solution 6 | DRAFT | nothing: the row has no website to link to, and solutions have no pages on this site | MISSING (Q5.3): remaining AI solutions 4–6 — which solutions they are, and a website URL for each (set `externalUrl`; solutions have no pages here). Candidates from existing case studies: PPE Detection, Steel Plate Insp... |
| `no URL yet` | Solution (PRODUCT) | A-EYE | DRAFT | nothing: the row has no website to link to, and solutions have no pages on this site | Name A-EYE from the brief and sitemap (13 Nov 2026). MISSING (Q7.2): the product website URL (set `externalUrl`; no URL was guessed), plus tagline and card copy. Not on the live site. Publish the row once the URL arrive... |
| `no URL yet` | Solution (PRODUCT) | AIR-MIND | DRAFT | nothing: the row has no website to link to, and solutions have no pages on this site | Name AIR-MIND from the brief and sitemap (13 Nov 2026). MISSING (Q7.2): the product website URL (set `externalUrl`; no URL was guessed), plus tagline and card copy. Not on the live site. Publish the row once the URL arr... |

### Published rows that are invisible anyway (0)

_None._

## 2. Hidden menu items (18)

A DRAFT menu row is simply not rendered. Its children go with it, published or not (`lib/data/site.ts` builds the tree from visible rows only).

### HEADER menu (15)

| Path through the menu | href | External? | Status | Why it is hidden (editorNote) |
|---|---|---|---|---|
| Services > Cloud Services > AI/ML Ops | `/services/cloud-services/ai-ml-ops` | no | DRAFT | Renamed from SAP on Cloud (sitemap comment, 13 Nov 2026); slug renamed, old slug 301s here. MISSING: descriptor and page copy for AI/ML Ops. |
| Services > Data & AI Services > Advanced Analytics | `/services/ai-services/advanced-analytics` | no | DRAFT | Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy. |
| Services > Data & AI Services > AI Security & Governance | `/services/ai-services/ai-security-governance` | no | DRAFT | Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy. |
| Services > Data & AI Services > Data Engineering | `/services/ai-services/data-engineering` | no | DRAFT | Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy. |
| Services > Data & AI Services > Responsible AI | `/services/ai-services/responsible-ai` | no | DRAFT | Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy. |
| Services > Data & AI Services > Sovereign AI | `/services/ai-services/sovereign-ai` | no | DRAFT | Added from the sitemap (13 Nov 2026, create URL). MISSING: descriptor and page copy. |
| Services > Digital Transformation > UAE E-Invoicing | `/services/digital-transformation/e-invoicing-uae` | no | DRAFT | DECISION Q2.4: keep or retire the UAE e-invoicing page, and show it to GCC visitors only? Draft until decided. |
| Solutions > A-EYE | - | yes, new tab | DRAFT | Name A-EYE from the brief and sitemap (13 Nov 2026). MISSING (Q7.2): the product website URL (set `href`) and the descriptor. |
| Solutions > AI Solutions > [Placeholder] AI solution 4 | - | yes, new tab | DRAFT | MISSING (Q5.3): AI solution 4. Candidates: PPE Detection, Steel Plate Inspection, InvoiceAI, RAG chatbot. |
| Solutions > AI Solutions > [Placeholder] AI solution 5 | - | yes, new tab | DRAFT | MISSING (Q5.3): AI solution 5. |
| Solutions > AI Solutions > [Placeholder] AI solution 6 | - | yes, new tab | DRAFT | MISSING (Q5.3): AI solution 6. |
| Solutions > AI Solutions > Asset Tracking | - | yes, new tab | DRAFT | MISSING (17 Nov 2026): the product website URL (set `href`). Also verify the "30%" figure in the descriptor (Q5.5). |
| Solutions > AI Solutions > Face Recognition Security | - | yes, new tab | DRAFT | MISSING (17 Nov 2026): the product website URL (set `href`). The descriptor is live-site copy and is ready. |
| Solutions > AI Solutions > Industrial Analytics | - | yes, new tab | DRAFT | MISSING (17 Nov 2026): the product website URL (set `href`). The descriptor is live-site copy and is ready. |
| Solutions > AIR-MIND | - | yes, new tab | DRAFT | Name AIR-MIND from the brief and sitemap (13 Nov 2026). MISSING (Q7.2): the product website URL (set `href`) and the descriptor. |

### FOOTER menu (3)

| Path through the menu | href | External? | Status | Why it is hidden (editorNote) |
|---|---|---|---|---|
| Solutions > Asset Tracking | - | yes, new tab | DRAFT | MISSING: product website URL. |
| Solutions > Face Recognition Security | - | yes, new tab | DRAFT | MISSING: product website URL. |
| Solutions > Industrial Analytics | - | yes, new tab | DRAFT | MISSING: product website URL. |

### LEGAL menu (0)

_None._

### SOCIAL menu (0)

_None._

### Published menu items that disappear with a hidden parent (0)

_None._

## 3. Menu items that stay visible but whose target is hidden (4)

`lib/data/links.ts` rewrites a link that points into a gated section (case-studies, insights/events) when the target row is not public, so it lands on that section's listing instead.
Links to anything else (service pages, company pages, solution pages) are **not** gated: they stay in the menu as seeded and the visitor meets the route itself.
A row that reads "no route is built for this path" or "this site no longer has ... pages" is usually a database that has not been reseeded since a route was removed, not missing client content.

| Menu | Item | href | What happens on the public site |
|---|---|---|---|
| HEADER | Services > Data & AI Services > Computer Vision | `/services/ai-services/computer-vision` | not gated: the link stays in place and the visitor gets 307 to /services |

### Featured mega-menu cards dropped (3)

| Menu | Item | Featured target | What happens |
|---|---|---|---|
| HEADER | Insights | event house-of-lords-2026 (DRAFT) | the featured card is dropped; the menu panel shows no card |
| HEADER | Services | case study sap-treasury-cash-forecasting (DRAFT) | the featured card is dropped; the menu panel shows no card |
| HEADER | Solutions | case study face-recognition (DRAFT) | the featured card is dropped; the menu panel shows no card |

### Teasers inside published sections that point at hidden pages (7)

The same gate runs over homepage and section content, so a card advertising a hidden page is dropped rather than left dangling.

| Where | Item | href | What happens |
|---|---|---|---|
| ContentBlock home.outcomes (all homepages) | extra.cards[0].href | `/case-studies/kubernetes-operations-healthtech` | the link gate rewrites it to /case-studies (lib/data/links.ts); a teaser card with this href is dropped entirely |
| ContentBlock home.outcomes (all homepages) | extra.feature.href | `/case-studies/sap-treasury-cash-forecasting` | the link gate rewrites it to /case-studies (lib/data/links.ts); a teaser card with this href is dropped entirely |
| ContentBlock home.topStories (all homepages) | extra.items[1].href | `/insights/events/house-of-lords-2026` | the link gate rewrites it to /insights/events (lib/data/links.ts); a teaser card with this href is dropped entirely |
| ContentBlock home.topStories (all homepages) | extra.items[2].href | `/case-studies/sap-treasury-cash-forecasting` | the link gate rewrites it to /case-studies (lib/data/links.ts); a teaser card with this href is dropped entirely |
| HeroSlide, homepage /gcc/ | Event | `/insights/events/house-of-lords-2026` | the whole hero slide is dropped (lib/data/home.ts) |
| HeroSlide, homepage /in/ | Event | `/insights/events/house-of-lords-2026` | the whole hero slide is dropped (lib/data/home.ts) |
| HeroSlide, homepage /uk/ | Event | `/insights/events/house-of-lords-2026` | the whole hero slide is dropped (lib/data/home.ts) |

## 4. Hidden content inside published pages (69)

These rows do not take a page away; they leave a gap in a page that is otherwise live.

### ContentBlock (2)

Section headers and short copy, keyed by section. A hidden row leaves the section without its heading, intro or call to action (the template falls back where it can).

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| services.cloud-services.ecosystem - "Powered by a Strong Technology Ecosystem." | /services/cloud-services, section "ecosystem" (all regions) | DRAFT | Copy from the approved Figma Cloud Services page (292:24608), 13 Nov 2026. DRAFT: the eleven vendor names are the designer's list. No brand logos are drawn in; tiles show the names until the client confirms the list and... |
| services.cloud-services.stats | /services/cloud-services, section "stats" (all regions) | DRAFT | PLACEHOLDER figures from the Figma Cloud Services page (every card says 500+). DRAFT so the row only shows in the preview. MISSING: real, verifiable numbers and labels. |

### HeroSlide (14)

Homepage hero stories. A hidden slide is one fewer tab in the hero carousel.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| Case study - "How SAP Treasury improved cash forecasting by 30%" | homepage /gcc/, hero carousel | DRAFT | Card copy from the approved Figma hero (13 Nov 2026). The 30% figure is unverified (case study DRAFT, Q5.5). |
| Digital Transformation - "Seeking Digital Transformation?" | homepage /gcc/, hero carousel | ARCHIVED | Headline typo fixed ("Transformation ?" → "Transformation?"). Body is the slide's tag words, joined with "·". Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S... |
| Oracle NetSuite - "Transform Operations with Oracle NetSuite" | homepage /gcc/, hero carousel | ARCHIVED | "Oracle NetSuite Partner": partner status to confirm (credentials). Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S3/CloudFront. |
| SAP - "Reinvent SAP for the Digital Era" | homepage /gcc/, hero carousel | ARCHIVED | Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S3/CloudFront. |
| AWS - "Scale Smarter. Build Faster. On AWS." | homepage /in/, hero carousel | ARCHIVED | "AWS-certified capabilities": confirm the AWS partner tier/competencies before launch. Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S3/CloudFront. |
| Case study - "How SAP Treasury improved cash forecasting by 30%" | homepage /in/, hero carousel | DRAFT | Card copy from the approved Figma hero (13 Nov 2026). The 30% figure is unverified (case study DRAFT, Q5.5). |
| Digital Transformation - "Seeking Digital Transformation?" | homepage /in/, hero carousel | ARCHIVED | Headline typo fixed ("Transformation ?" → "Transformation?"). Body is the slide's tag words, joined with "·". Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S... |
| Oracle NetSuite - "Transform Operations with Oracle NetSuite" | homepage /in/, hero carousel | ARCHIVED | "Oracle NetSuite Partner": partner status to confirm (credentials). Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S3/CloudFront. |
| SAP - "Reinvent SAP for the Digital Era" | homepage /in/, hero carousel | ARCHIVED | Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S3/CloudFront. |
| AWS - "Scale Smarter. Build Faster. On AWS." | homepage /uk/, hero carousel | ARCHIVED | "AWS-certified capabilities": confirm the AWS partner tier/competencies before launch. Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S3/CloudFront. |
| Case study - "How SAP Treasury improved cash forecasting by 30%" | homepage /uk/, hero carousel | DRAFT | Card copy from the approved Figma hero (13 Nov 2026). The 30% figure is unverified (case study DRAFT, Q5.5). |
| Digital Transformation - "Seeking Digital Transformation?" | homepage /uk/, hero carousel | ARCHIVED | Headline typo fixed ("Transformation ?" → "Transformation?"). Body is the slide's tag words, joined with "·". Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S... |
| Oracle NetSuite - "Transform Operations with Oracle NetSuite" | homepage /uk/, hero carousel | ARCHIVED | "Oracle NetSuite Partner": partner status to confirm (credentials). Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S3/CloudFront. |
| SAP - "Reinvent SAP for the Digital Era" | homepage /uk/, hero carousel | ARCHIVED | Poster is the Vimeo thumbnail (oEmbed, 1920px). Please supply a proper still and a self-hosted MP4/WebM for S3/CloudFront. |

### HomeServiceCard (12)

The per-region homepage service-card grid.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| AI/ML Services | homepage /in/, service cards | ARCHIVED | - |
| AWS Services | homepage /in/, service cards | ARCHIVED | - |
| Open edX® Services | homepage /in/, service cards | ARCHIVED | - |
| Oracle NetSuite Services | homepage /in/, service cards | ARCHIVED | CONFLICT: construction-specific line, unlike the other cards. Keep, or use the /ae/ wording? |
| SAP Services | homepage /in/, service cards | ARCHIVED | - |
| Technology Transformation | homepage /in/, service cards | ARCHIVED | Live wording "by optimize, and transform digitally" is ungrammatical. Kept verbatim: needs client wording. |
| AI/ML Services | homepage /uk/, service cards | ARCHIVED | - |
| AWS Services | homepage /uk/, service cards | ARCHIVED | - |
| Open edX® Services | homepage /uk/, service cards | ARCHIVED | - |
| Oracle NetSuite Services | homepage /uk/, service cards | ARCHIVED | CONFLICT: construction-specific line, unlike the other cards. Keep, or use the /ae/ wording? |
| SAP Services | homepage /uk/, service cards | ARCHIVED | - |
| Technology Transformation | homepage /uk/, service cards | ARCHIVED | Live wording "by optimize, and transform digitally" is ungrammatical. Kept verbatim: needs client wording. |

### Industry (8)

Industry tabs on every homepage and the industry filter on /case-studies.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| Energy - Energy | homepage industries tabs, /case-studies filter | DRAFT | DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6). |
| Government - Government | homepage industries tabs, /case-studies filter | DRAFT | DRAFT: Figma names the industry but designs no copy. The live site's "Public sector" tab copy and image are reused under the new name until the client confirms them or supplies new copy (CONTENT_TODO, round 6). |
| Legal (Law Firms) - Legal (Law Firms) | homepage industries tabs, /case-studies filter | DRAFT | DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6). |
| Manufacturing - Manufacturing | homepage industries tabs, /case-studies filter | DRAFT | DRAFT: Figma names the industry but designs no copy. The live site's "Supply chain" tab copy and image are reused under the new name until the client confirms them or supplies new copy (CONTENT_TODO, round 6). |
| Marketing Agencies - Marketing Agencies | homepage industries tabs, /case-studies filter | DRAFT | DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6). |
| Software Development - Software Development | homepage industries tabs, /case-studies filter | DRAFT | DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6). |
| Startups - Startups | homepage industries tabs, /case-studies filter | DRAFT | DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6). |
| Technology - Technology | homepage industries tabs, /case-studies filter | DRAFT | DRAFT: Figma lists the industry but designs no copy, and the live site has none. Rendered as a placeholder card (Details to be confirmed) until the client supplies copy (CONTENT_TODO, round 6). |

### Person (3)

Leadership profiles on /about/team, and event speakers.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| KayCee (Koushik Chatterjee) - Chief Executive Officer | /about/team | DRAFT | DECISION Q5.7: who is listed on /about/team. MISSING: bio and LinkedIn URL. Photo is the live /about-us/ image (alt=""); higher-resolution portrait welcome. Name shown verbatim as on the site; preferred display form ("K... |
| Rajat Subhra Roy - Director | /about/team | DRAFT | DECISION Q5.7: who is listed on /about/team. MISSING: bio and LinkedIn URL. Photo is the live /about-us/ image (alt=""); higher-resolution portrait welcome. |
| Saumya Subhra Roy - Director | /about/team | DRAFT | DECISION Q5.7: who is listed on /about/team. MISSING: bio and LinkedIn URL. Photo is the live /about-us/ image (alt=""); higher-resolution portrait welcome. |

### Milestone (6)

The "Mission & Journey" timeline on /about.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| year to be confirmed - Milestone title to be confirmed | /about, journey timeline | DRAFT | PLACEHOLDER: client to provide year, title, 1–2 lines and optional photo (CONTENT_TODO: About → journey). |
| year to be confirmed - Milestone title to be confirmed | /about, journey timeline | DRAFT | PLACEHOLDER: client to provide year, title, 1–2 lines and optional photo (CONTENT_TODO: About → journey). |
| year to be confirmed - Milestone title to be confirmed | /about, journey timeline | DRAFT | PLACEHOLDER: client to provide year, title, 1–2 lines and optional photo (CONTENT_TODO: About → journey). |
| year to be confirmed - Milestone title to be confirmed | /about, journey timeline | DRAFT | PLACEHOLDER: client to provide year, title, 1–2 lines and optional photo (CONTENT_TODO: About → journey). |
| year to be confirmed - Milestone title to be confirmed | /about, journey timeline | DRAFT | PLACEHOLDER: client to provide year, title, 1–2 lines and optional photo (CONTENT_TODO: About → journey). |
| year to be confirmed - Milestone title to be confirmed | /about, journey timeline | DRAFT | PLACEHOLDER: client to provide year, title, 1–2 lines and optional photo (CONTENT_TODO: About → journey). |

### Certification (3)

Certificates and partner programmes on /credentials and in the homepage trust strip.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| AWS Partner (Amazon Web Services) [verified = false] | /credentials | DRAFT | DECISION: tier to confirm. The live client-strip banner reads "AWS Partner Advanced Tier Services", and /aws-solutions/ claims "AWS Advanced Tier Partner", "AWS AI Services Competency" and "AWS Education Consulting Comp... |
| Oracle NetSuite Partner (Oracle NetSuite) [verified = false] | /credentials | DRAFT | DECISION: partner programme and tier to confirm. Live hero slide: "As an Oracle NetSuite Partner"; Vimeo video title "Oracel Netsuite Alliance Partner". |
| SAP PartnerEdge (SAP) [verified = false] | /credentials | DRAFT | DECISION: SAP PartnerEdge status and level to confirm (shown on the live partner badge banners). |

### Office (3)

Office addresses on /contact and in the homepage "Our Presence" block.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| Bhubaneswar (Bhubaneswar, India, region IN) [confirmed = false] | /contact, homepage "Our Presence" | DRAFT | Only on /contact/ ("Arch Bishop House, Saheed nagar, Khurda"). Show it? Postcode needed. Map pin is approximate (geocoded from the address, city/street level). Confirm. |
| London (Harrow) (Harrow, United Kingdom, region UK) [confirmed = false] | /contact, homepage "Our Presence" | DRAFT | Only on /contact/ ("39 Roxborough Road, Harrow, London") and the privacy policy (UK representative address, postcode HA1 1NS). Is this an office, or only the UK representative's address? Map pin is approximate (geocoded... |
| Riyadh (Riyadh, Saudi Arabia, region GCC) [confirmed = false] | /contact, homepage "Our Presence" | DRAFT | Only on /contact/, with no street address ("Riyadh"). Show it? Full address needed. Pin is city-centre only. Map pin is approximate (geocoded from the address, city/street level). Confirm. |

### Stat (3)

Figures in the hero trust row, the trust strip, the CTA band and on /about. See section 5: a Stat also needs verified = true for the trust strip and /about.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| cash-forecasting-improvement-30 = "30%" (improvement in cash forecasting) [verified = false] | placements: outcome | DRAFT | UNVERIFIED (Figma Client Outcomes): the 30% figure needs client clearance with the SAP Treasury case study. |
| hero-satisfied-100 = "100%" (Satisfied) [verified = false] | placements: hero-trust | DRAFT | UNVERIFIED (Figma hero): confirm or replace "100% Satisfied". |
| hero-zero-risk = "Zero Risk" () [verified = false] | placements: hero-trust | DRAFT | UNVERIFIED (Figma hero): confirm or replace "Zero Risk". |

### LogoItem (0)

Client, partner and certification logos in the homepage strips and on /credentials.

_None._

### Faq (9)

FAQ accordions on service, solution and company pages.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| Can cloud solutions be tailored to our industry? | /services/cloud-services | DRAFT | Question from the Figma Cloud Services page (292:24608); the design shows no answer (row collapsed). DRAFT until the client supplies one (CONTENT_TODO, round 7). |
| Can you help modernise existing enterprise applications? | /services/cloud-services | DRAFT | Question from the Figma Cloud Services page (292:24608); the design shows no answer (row collapsed). DRAFT until the client supplies one (CONTENT_TODO, round 7). |
| Does Adamas provide ongoing managed cloud support? | /services/cloud-services | DRAFT | Question from the Figma Cloud Services page (292:24608); the design shows no answer (row collapsed). DRAFT until the client supplies one (CONTENT_TODO, round 7). |
| Does Adamas support hybrid and multi-cloud environments? | /services/cloud-services | DRAFT | Question from the Figma Cloud Services page (292:24608); the design shows no answer (row collapsed). DRAFT until the client supplies one (CONTENT_TODO, round 7). |
| How can cloud migration help our business? | /services/cloud-services | DRAFT | Question from the Figma Cloud Services page (292:24608); the design shows no answer (row collapsed). DRAFT until the client supplies one (CONTENT_TODO, round 7). |
| How can we start a cloud transformation project with Adamas? | /services/cloud-services | DRAFT | Question from the Figma Cloud Services page (292:24608); the design shows no answer (row collapsed). DRAFT until the client supplies one (CONTENT_TODO, round 7). |
| How do you approach cloud security and governance? | /services/cloud-services | DRAFT | Question from the Figma Cloud Services page (292:24608); the design shows no answer (row collapsed). DRAFT until the client supplies one (CONTENT_TODO, round 7). |
| How do you help businesses optimise cloud costs? | /services/cloud-services | DRAFT | Question from the Figma Cloud Services page (292:24608); the design shows no answer (row collapsed). DRAFT until the client supplies one (CONTENT_TODO, round 7). |
| What is the difference between cloud migration and cloud transformation? | /services/cloud-services | DRAFT | Question from the Figma Cloud Services page (292:24608); the design shows no answer (row collapsed). DRAFT until the client supplies one (CONTENT_TODO, round 7). |

### SolutionFeature (0)

The "what it delivers" capability cards for a solution.

_None._

### ApproachStep (0)

The "step by step" delivery sequence on a sub-service page.

_None._

### AgendaItem (3)

The agenda on an event page.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| 2026-11-26 18:00 - [Placeholder] Arrival and registration | /insights/events/house-of-lords-2026 (the event itself is DRAFT) | DRAFT | Placeholder agenda item: time and content needed (Q6.1–Q6.6). |
| 2026-11-26 18:30 - [Placeholder] Keynote | /insights/events/house-of-lords-2026 (the event itself is DRAFT) | DRAFT | Placeholder agenda item: time, title and speaker needed (Q6.1–Q6.6). |
| 2026-11-26 19:30 - [Placeholder] Networking reception | /insights/events/house-of-lords-2026 (the event itself is DRAFT) | DRAFT | Placeholder agenda item: time and content needed (Q6.1–Q6.6). |

### Announcement (3)

The hero announcement strip (news, partnerships, awards). Also date-windowed: an item outside its window does not show either.

| Row | Where it belongs | Status | Why it is hidden (editorNote) |
|---|---|---|---|
| Event: [Placeholder] AdamasTech at the House of Lords, 26 November 2026 | homepages /in/, /uk/, /gcc/ | DRAFT | Follows the House of Lords event (Q6.1–Q6.6): final event title needed; the date 26 Nov comes from the sitemap. Publish together with the event. Hides itself after the event ends. |
| News: [Placeholder] Company news headline | homepages /in/, /uk/, /gcc/ | DRAFT | MISSING: client to provide 3–5 announcements (news, partnerships, awards) with links and date windows. |
| Partnership: [Placeholder] Partnership announcement | homepages /in/, /uk/, /gcc/ | DRAFT | MISSING: client to provide 3–5 announcements (news, partnerships, awards) with links and date windows. |

### Technology (0)

Technology logos in the platform strips on service and case-study pages.

_None._

## 5. Published, but still invisible

These rows pass the status check and are still never rendered, by design.

### Stat rows that are PUBLISHED but verified = false (10)

Only verified figures are rendered in the trust strip and on /about (placements trust-strip, about). A `hero-trust` or `outcome` figure does render without verification.

| Key | Value | Label | Placements | Renders anywhere? | Source note / editorNote |
|---|---|---|---|---|---|
| client-satisfaction-99 | 99% | Client Satisfaction | trust-strip, cta-band | no | Visible in the footer on every page ("99% / Client Satisfaction"); also in the hidden stats block on the homepages, about-us, contact, services and clients. Not contradicted, but no source given. |
| established-1995 | 1995+ Year | Established On | about, trust-strip | no | Hidden (display:none) stats block: "1995+ Year / Established On"; also "1995 / We Established On" on the theme demo pages /company/ and /about-us-backup/. Conflicts with "Founded in 2021" (/about-us/, visible). |
| experience-3-years | 3+ | Years Experience | about | no | /ae/ only, inside a block hidden on all devices ("INNOVATION … 3+ Years Experience / Meet Our Experts"). Never visible. |
| field-experience-22-years | 22+ Years | Field Experience | trust-strip, about | no | Hidden (display:none) stats block on the homepages, about-us, contact, services and clients: "22+ Years / Field Experience". Conflicts with the visible footer "26.8k Hours" and with "Founded in 2021". |
| field-experience-26-8k-hours | 26.8k Hours | Field Experience | trust-strip, cta-band | no | Visible in the footer on every page: "26.8k Hours / Field Experience". Conflicts with the hidden "22+ Years / Field Experience". |
| founded-2021 | 2021 | Founded in | about | no | /about-us/ body, visible: "Founded in 2021, Adamas Tech Consulting has rapidly expanded…" (a hidden copy is on /clients/). Conflicts with "1995+ Year Established On" and "22+ Years Field Experience". |
| projects-950 | 950+ Projects | Done Around World | trust-strip | no | Hidden (display:none) stats block only: "950+ Projects / Done Around World". Never visible on the live site. |
| response-time-2-mins | 2 Mins | Response Time | cta-band, trust-strip | no | Hidden (display:none) stats block on /in/, /uk/, /ae/, /about-us/, /contact/, /services/, /clients/: "2 Mins / Response Time". Conflicts with the visible footer "5 Mins". |
| response-time-5-mins | 5 Mins | Response Time | cta-band, trust-strip | no | Visible in the footer CTA band on every page: "5 Mins / Response Time". Conflicts with the hidden "2 Mins / Response Time". |
| team-size-100 | 100+ | Experts | about, trust-strip | no | /about-us/ body, visible: "With a team of over 100 experts, we blend deep industry knowledge…". |

### Stat rows whose placement no page reads (0)

Readers exist only for trust-strip, about, hero-trust, outcome. Placement values in the data that no page reads: cta-band; a figure placed only there cannot appear.

_None._

### Office rows that are PUBLISHED but confirmed = false (5)

`confirmed = false` means the client has not checked the address or the label. Note that it does **not** stop the office rendering: `lib/data/site.ts` reads every PUBLISHED office, so these addresses are live on /contact and in the presence block exactly as seeded.

| Office | City | Country | Region | Why it is unconfirmed (editorNote) |
|---|---|---|---|---|
| Bengaluru | Bengaluru | India | IN | CONFLICT: legal pages give "2nd Floor, Vallabha Pamadi, 2727, 16th Cross, 27th Main Rd, HSR Layout, Bengaluru, Karnataka 560068". Postcode 560102 vs 560068. No office phone on the live site (the India number is shown at... |
| Dubai | Dubai | United Arab Emirates | GCC | CONFLICT: homepages show "…Latifa Tower near Trade Centre, Sheikh Zayed Road, Dubai, UAE."; /about-us/ and /contact/ omit "near Trade Centre" and "UAE". Dubai is also missing from the /contact/ Locations list and from A... |
| Kolkata | Kolkata | India | IN | CONFLICT: /contact/ gives "Haute Street, 86 A, Topsia Road," (house number 86 A, no postcode). No office phone on the site. Map pin is approximate (geocoded from the address, city/street level). Confirm. |
| London | London | United Kingdom | UK | CONFLICT: /contact/ and the privacy policy give a second London address (39 Roxborough Road, Harrow HA1 1NS). Which is the office? Map pin is approximate (geocoded from the address, city/street level). Confirm. |
| Palo Alto | Palo Alto | United States | UK | Labelled "San Francisco" on the live site; the address is Palo Alto. Region "UK" is only a technical placeholder: the US office belongs to no current region (the type requires one). Confirm the office is still active (s... |

### Certification rows that are PUBLISHED but verified = false (3)

The row renders, but its certificate number, validity date and download link are withheld until `verified = true` (`lib/data/pages.ts`).

| Certification | Issuer | Why it is unverified (editorNote) |
|---|---|---|
| CMMI Maturity Level 3 |  | MISSING: certificate PDF, certificate number and validity date (Q5.9). verified = false until supplied. Badge reads "CMMI ML3 Appraised"; /about-us/ says "CMMI Level 3 certification holder". Appraisal model/version, app... |
| ISO/IEC 27001 Information Security | DQS | MISSING: certificate PDF, certificate number and validity date (Q5.9). verified = false until supplied. Issuer read from the badge ("DQS ISO/IEC 27001"). Edition year (2013 or 2022) not shown: confirm. |
| ISO 9001:2015 Quality Management | BSI | MISSING: certificate PDF, certificate number and validity date (Q5.9). verified = false until supplied. Issuer read from the badge ("BSI ISO 9001:2015 Quality Management"). Also stated on /about-us/ and in "Certified Qu... |

