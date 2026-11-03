# Round 2: Solutions and Case studies templates

Routes: `/solutions`, `/solutions/[slug]`, `/case-studies`, `/case-studies/[slug]`.
Files: `app/solutions/**`, `app/case-studies/**`, `lib/data/solutions.ts`, `lib/data/caseStudies.ts`, `components/solutions/{SolutionTile,ArivooFeature}.tsx`, `components/case-studies/{CaseExplorer,ResultsStrip}.tsx`.

Legend (as in `CONTENT_TODO.md`): **CONFLICT** = the live site contradicts itself · **MISSING** = no source content · **PLACEHOLDER** = rendered with a designed stand-in · **DECISION** = client choice needed · **INTERIM** = UI label or behaviour chosen for the prototype

## Placeholders and items to confirm

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

## Data handling decisions (interim, in `lib/data/caseStudies.ts`)
- `CONFLICTING_HEADLINE` and `UNVERIFIED_RESULTS`: slug lists of withheld figures (above), applied everywhere these templates render case cards (solutions overview, solution detail, listing, related rails). The **homepage rails use the shared `toCaseCard` and still show these headline figures**.
- `SEQUENCED_SOLUTION`: only `ai-traffic-monitoring` has a real step sequence (collect → annotate → augment → train → evaluate) and is numbered; every other solution list is a set of capabilities.
- Arivoo modules (`ARIVOO_MODULE`) have no page (`/solutions/arivoo-ums` → 404); they always link out.
- Listing filters are client-side over the full list; the selection is mirrored to `?industry=…&service=…` with `history.replaceState` and restored after hydration, so the route stays static.

## Shared-file change requests (not made)
1. **Schema**: a `verified` flag on `CaseStudy.headlineMetric` and on `CaseResult`, and a `solutionIsSequence` boolean on `CaseStudy`, to replace the hard-coded slug lists above. Then `toCaseCard` (lib/data/mappers.ts) should withhold unverified headlines so the homepage rails follow the same rule.
2. **lib/data/mappers.ts**: once (1) exists, move `safeCaseCard` behaviour into `toCaseCard`.
3. **globals.css** (optional): a `.case-fade` keyframe utility; `CaseExplorer` currently injects a 2-line `<style>` for the fade-in of cards entering after a filter change (transform/opacity, reduced-motion safe).
4. **content/blocks.ts** (client copy): an intro `body` for the `home.solutions` block would give the Solutions hero a lead line.
