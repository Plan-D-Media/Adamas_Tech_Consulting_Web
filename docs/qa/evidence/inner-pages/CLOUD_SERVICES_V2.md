# /services/cloud-services rebuilt to the revamp design (20 November 2026)

Source: Figma **"ATC Website Revamp"**, file `IldSD5373EYodtZ2XH17uk`, page "AWS_Webpages" (`7586:47704`),
frame **`8705:3814` "Cloud "**, 1440 x 6695.

**Figma access: confirmed.** `node scripts/figma-access-check.mjs IldSD5373EYodtZ2XH17uk 7586-47704` returns 200.
Note the URL in the brief points at the **page**, not a frame; the page holds 34 frames and the Cloud Services one
is `8705:3814`.

**The two SVG exports named in the brief were not in the project root.** "Cloud (1).svg" and
"Frame 1000005184.svg" are not there (the only new files were the two logos). The build was done from the Figma
API - full-depth node JSON plus a 1x render - which is the same source the exports would have come from.
`Frame 1000005184` is `8480:200` on that page, a 3886x180 strip, if you still want it moved in.

---

## 1. Section inventory

`node scripts/qa/compare-figma-page.mjs cloud-v2 http://localhost:3000`, screenshotted at **1440** (the frame's
width; the old file was 1920). Side-by-side images (Figma | ours | diff) per section are in
`docs/qa/evidence/inner-pages/compare/cloud-v2/`.

Page height: **ours 7313px against the frame's 6695px** (+9%), almost all of it in the two bands noted below.

| Section | Figma band | Built | Match at 1440 | Our height | Remaining differences |
|---|---|---|---|---|---|
| Hero | 109-724 | yes | 82.4% | 615px | ±0px. The particle artwork, pill eyebrow, 72px title, intro and CTA all match; the frame's version sits under a transparent page header, ours under the site header, so the artwork is cropped differently at the top. |
| Client logo strip | 724-875 | yes | 94.1% | 104px | -47px. Fed from the Logo table (the frame's logos are our own clients: PwC, Careem, WorkIndia, Aldar, Webel, Gulf Processing...), so it uses the existing media rather than re-importing. Ours wraps rather than scrolling. |
| Our tech stack | 875-1365 | yes | 92.8% | 430px | -60px. Seven vendor tiles, copy left. The frame's 7th tile sits alone on a third row; ours fills the grid. |
| Six ways we take cloud work off your plate | 1365-2204 | yes | 95.2% | 877px | +38px. Six cards, 2x3, icon tile, "Learn more". |
| Case studies | 2204-3069 | yes | 75.7% | 780px | -85px. Black band, three white cards with image, label, title, body, ticked tags and the circular arrow. **The frame's carousel dots are not built** - it is a static three-up; ours also wraps the titles to fewer lines. |
| Our framework | 3069-3939 | yes | 93.1% | 792px | -78px. Phase list plus detail card, interactive. |
| Credentials | 3939-5089 | yes | 92.8% | 1208px | +58px. One wide badge card, four in a 2x2, then the five Delivery Validation tiles. |
| Industries | 5089-5822 | yes | 90.8% | 674px | -59px. Seven pill tabs, photo and window-chrome card. |
| Testimonials | 5822-6340 | yes | 77.0% | 599px | +81px. The frame runs the row off both edges as a marquee; ours is a scroll-snap rail starting at the content column, so the left-hand partial card is missing. |
| Free cloud credits | 6340-6695 | yes | 90.9% | 384px | +29px. Panel, line-art graphic, CTA. |

**No footer or contact form in the frame** - the site chrome supplies both, unchanged.

**Responsive:** `node scripts/qa/responsive-check.mjs` at 1440, 1024, 768 and 390 - **no horizontal overflow at any
width**, every width 200.

### Two systematic things that were fixed

- **Content column.** The revamp lays out on a **1200** column at 1440 (x 120-1320); `container-site` gives 1344
  there. A scoped `.cloud-v2 .container-cloud` fixes it, and it lifted case studies 68 -> 76%, framework 92 -> 93%
  and industries 88 -> 91% on its own.
- **Type system.** The revamp uses **Poppins** (headings/UI), **DM Sans** (body) and **Inter** (two bands), where
  the site uses Manrope / Roboto / Figtree. Poppins and DM Sans are now loaded by this page alone (next/font,
  `preload: false`) and scoped under `.cloud-v2`; **Inter is mapped to DM Sans** rather than loading a third family
  for two bands. If the revamp rolls out site-wide this should move into `@theme` and the old families retire.
  **Worth your decision.**

---

## 2. Content held back for you

The brief said to publish the client's content and list anything that looked unverified or unfinished. Everything
below is **in the design but not on the page**; the page uses the substitute shown, and `lib/cloud-services-content.ts`
marks each one at the point of use.

| # | In the frame | Why it was held | On the page now |
|---|---|---|---|
| 1 | **"Get up to $5,000\* in credits"** | A figure set by the cloud provider, not by us, and the frame's own footnote says the amount is assessed case by case. | "Get cloud provider credits to test a migration..." - the offer and the footnote, without the number. |
| 2 | **"How we helping Business"** (case studies heading) | Not grammatical. | "How we help businesses". |
| 3 | **Eyebrow "Our tech stack" on the "Six ways" band** | It is the eyebrow of the band immediately above, repeated - a copy-and-paste in the design. | "What we do". |
| 4 | **Advanced Tier Service Partner body**: "We empower governments to achieve true digital sovereignty on AWS through secure, compliant, and scalable solutions." | Describes a government offering, not the partner tier the badge is for. | A description of the tier itself. |
| 5 | **Storage Consulting body**, identical to Managed Services Provider: "Optimizes AWS production, allowing your engineering team to focus on the product instead of patching and surprise costs." | The same sentence on two different competencies; one of them is wrong. | Managed Services keeps it; Storage Consulting has a storage-specific line. |
| 6 | **"Our Delivery Validations" body**, identical to the section body above it | Repeated verbatim in the design. | A line describing the Service Delivery programme. |
| 7 | **"day-2000 operations"** (hero) | Reads like a typo for "day-2 operations", but it may be deliberate. **Left as written** - please confirm. | Unchanged. |
| 8 | **Six of the seven industry tabs** (Retail, Healthcare, Finance, Hospitality, Supply chain, Public sector) | The frame fills in Education only: no copy, photograph or fact chips for the rest. | The tabs are built so the row matches; each says the copy is still with you. |
| 9 | **Framework phases 02-05** (Migrate, Run, Optimise, Protect) | The frame is drawn in state 01, so only "Plan" has a service card. | The phases are built; 02-05 say their detail is being written up. |
| 10 | **Four named testimonials** with specific claims - "fifty legacy enterprise applications", "back in 8 minutes flat" | Named, attributed quotes need the client's written permission to publish, and the two figures are unverified. **Published as written**, per "this is real content", but flagged. | Unchanged. Tell us if any should come down. |

**Also changed, under the standing British-English rule:** "Modernizing" -> "Modernising", "Optimize" -> "Optimise",
"Optimizes" -> "Optimises", "modernize" -> "modernise", "data centers" -> "data centres". Product names (Amazon EKS,
CloudWatch, SAP HANA) are untouched.

---

## 3. The other service pages

The new layout is a **template variant**, not a change to the shared template:
`app/(site)/services/[pillar]/page.tsx` routes `cloud-services` to `CloudServicesPage` and everything else still
renders `components/services/PillarPage.tsx`, which this round did not edit.

Checked after the change - all 200, all still on the old template:

| Page | Status | Template |
|---|---|---|
| `/services` | 200 | unchanged |
| `/services/cloud-services` | 200 | **new** |
| `/services/digital-transformation` | 200 | shared `PillarPage` (5 sections, unchanged) |
| `/services/ai-services` | 200 | shared `PillarPage` (5 sections, unchanged) |
| `/services/cloud-services/migration-modernization` | 200 | shared sub-service template |
| `/services/cloud-services/managed-services` | 200 | shared sub-service template |
| `/services/digital-transformation/sap` | 200 | shared sub-service template |

**Should the new structure apply to them too?** The new design is very AWS-specific - the credentials band is AWS
partner badges, the framework is a cloud lifecycle, the tech stack is hyperscalers. Digital Transformation and
Data & AI would need their own equivalents of those three bands, and their own content, before the layout would
suit them. The parts that would transfer unchanged are the hero, the six-card capability grid, the case-study
band, the industries tabs, the testimonials and the credits CTA.

Recommendation: **leave them on the shared template until the client supplies the revamp frames for them**, then
lift the transferable bands into a shared v2 template. Doing it now would mean inventing the three AWS-shaped
bands for two pillars.

---

## 4. Still to do

- The chain has not been run: `node scripts/qa/phase2-chain.mjs --dry` reports **free memory 1766 MB against the
  4096 MB floor**. PostgreSQL is up; memory is the only blocker. Nothing in this round has been seen in a
  production build.
- The case-study carousel dots and the testimonial marquee's left-hand partial card are not built.
- Sub-service links from the six capability cards were checked: all six resolve 200. The card for Cloud Advisory
  pointed at /services/cloud-services/cloud-advisory, which 404s; the Service row is cloud-advisory-consultation
  and the link was corrected.
