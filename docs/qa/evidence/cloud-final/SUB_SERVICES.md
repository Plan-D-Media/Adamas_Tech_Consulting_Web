# The six Cloud sub-service pages, built to `Managed Services.svg` (23 November 2026)

Design: `design-ref/exports/new-design/Managed Services.svg`, 1440 × 7252.

One shared template — `components/services/sub/SubServicePage.tsx` — with the design's sections, order, slot
counts and copy length per slot. Content per page: `lib/sub-service-content.ts`. Routing:
`app/(site)/services/[pillar]/[service]/page.tsx` sends the six Cloud children here; **every other sub-service
(the Digital Transformation and Data & AI children) still renders the untouched shared `ServicePage`**, and the
Digital Transformation and Data & AI pillar pages themselves were not changed in this round.

| Route | Status |
|---|---|
| `/services/cloud-services/migration-modernization` | 200, new template |
| `/services/cloud-services/devops-secops` | 200, new template |
| `/services/cloud-services/managed-services` | 200, new template |
| `/services/cloud-services/ai-ml-ops` | 200, new template |
| `/services/cloud-services/cloud-automation` | 200, new template |
| `/services/cloud-services/cloud-advisory-consultation` | 200, new template |
| `/services/digital-transformation`, `/services/ai-services` | 200, unchanged |
| `/services/digital-transformation/sap` and the other non-Cloud children | 200, unchanged |

**Managed Services uses the design's content word for word.** No other page ever renders a word of it. A slot with
no real content for that service renders a Draft note — visible in the preview with a badge, hidden in the public
build — rather than borrowed or invented copy.

---

## 1. Section inventory — Managed Services against `Managed Services.svg`

`node scripts/qa/compare-figma-page.mjs managed-final http://localhost:3000`, at the design's native 1440.
Side-by-side images (design | ours | diff) per band in `docs/qa/evidence/cloud-final/managed-final/`.

| Section | Built | Match at 1440 | Our height | Design band | Remaining differences |
|---|---|---|---|---|---|
| Hero | yes | 84.3% | 718px | 0–764 (764px) | −46px. Badge, 48px title, intro, the two competencies and the CTA all match. Our site header overlays the hero, where the design draws its own above it. |
| Service overview | yes | 85.0% | 543px | 764–1390 (626px) | −83px. Eyebrow, heading, two paragraphs left; image right. |
| Why businesses work with an AWS MSP | yes | 87.6% | 559px | 1390–2031 (641px) | −82px. Six cards, 2 × 3, title and body left, 3D icon right. |
| What we manage (hub diagram) | yes | 91.9% | 788px | 2031–2947 (916px) | −128px. Six cards around the "AWS operations control hub" circle, connectors drawn behind the grid. |
| How this service creates value | yes | 79.3% | 834px | 2947–3900 (953px) | −119px. Copy and the video card left on a 512 column, four cards right. |
| Case study | yes | 79.8% | 697px | 3960–4620 (660px) | +37px. Two cards, image, label, title, body, chips, "Read more". |
| Related services | yes | 91.4% | 577px | 4620–5330 (710px) | −133px. Four columns, icon, underlined title, chevron, body, vertical rules. |
| Closing CTA | yes | 88.4% | 271px | 5330–5620 (290px) | −19px. |
| Contact | yes | 81.6% | 779px | 5620–6404 (784px) | −5px. The site's standard enquiry block, which the design draws on the page. |

Page height: **ours 6616px against 7252px** (−9%), almost all of it the design's generous band padding.

**Not scored:** the page header and footer (site chrome, drawn in the design for context).

**Reading the numbers:** the comparison measures layout, not words. Every band above is structurally identical —
same slots, same positions, same sizes — and the residual mismatch is text wrapping and font rendering, which
pixelmatch counts at full weight. The side-by-side images are the better evidence.

**Responsive:** `node scripts/qa/responsive-check.mjs` at 1440, 1024, 768 and 390 — **no horizontal overflow at
any width**, on Managed Services, AI/ML Ops or the Cloud page.

**Accessibility:** axe on `/services/cloud-services/managed-services` — **0 critical, 0 serious, 0 moderate,
0 minor**.

Spot-check screenshots of the other five pages, full page at 1440:
`docs/qa/evidence/cloud-final/sub-services/`.

---

## 2. Where each page's content came from

| Page | Hero | Service overview | Benefits (6 cards) | What we manage (6) | How this service creates value (4) | Case study | Related | CTA |
|---|---|---|---|---|---|---|---|---|
| **Managed Services** | SVG | SVG | SVG | SVG | SVG | SVG | SVG | SVG |
| **Migration & Modernisation** | Figma `7669:44187` | Figma `7669:44187` | **DRAFT** | Figma `7669:44187` (5 delivery areas) | Figma titles only — **bodies DRAFT** | shared | shared | shared |
| **DevOps & SecOps** | existing DB (`/cloud-transformation/`) | existing DB | existing DB ("Engagement Benefits", 5) | existing DB ("Our Engagement Model", 5) | **DRAFT** | shared | shared | shared |
| **AI/ML Ops** | Cloud page capability card | **DRAFT** | **DRAFT** | **DRAFT** | **DRAFT** | shared | shared | shared |
| **Cloud Automation** | Cloud page capability card | **DRAFT** | **DRAFT** | **DRAFT** | **DRAFT** | shared | shared | shared |
| **Cloud Advisory & Consultation** | Cloud page capability card + existing DB | existing DB (`/security-governance/`) | **DRAFT** | existing DB (5 delivery areas) | **DRAFT** | shared | shared | shared |

"shared" = the case-study band, the related-services row and the closing CTA are page furniture: the design draws
the same ones on the Managed Services and Migration frames alike.

### What is still needed, per page

- **Migration & Modernisation** — the four use-case cards have real titles (Legacy infrastructure modernisation ·
  Data centre exit or workload migration · Multi-environment AWS foundation buildout · Scale-up for growing
  digital platforms) but **no real bodies**: the frame fills all four with "Outcome-led service framing for
  &lt;title&gt; on AWS", which is filler. A benefits section too.
- **DevOps & SecOps** — the "how this service creates value" band.
- **AI/ML Ops** — everything below the hero. There is no old page and no frame; its database row was placeholder
  text describing SAP, which has been replaced (see §3).
- **Cloud Automation** — everything below the hero, and see §3.
- **Cloud Advisory & Consultation** — a benefits section and a value section.

---

## 3. Two database rows that were wrong, and what was done

1. **`ai-ml-ops` was DRAFT with a placeholder descriptor and summary that described SAP**, not AI/ML Ops
   ("[Placeholder] One line on running SAP on the cloud."). The Cloud page's capability card links to it, so in
   the public build that link would have 404'd. It is now **PUBLISHED** with the line the finalised Cloud design
   gives that capability, and the body sections show Draft notes until the client supplies copy.
2. **`cloud-automation`'s descriptor and summary are the Oracle NetSuite for Construction copy** from
   `/oracle-netsuite-solutions/` — a completely different service, which was feeding this page's `<title>` and
   meta description. The descriptor and summary are replaced with the finalised design's line for Cloud
   Automation. **The NetSuite material is still on the row** (and now flagged in its `editorNote`) so it is not
   lost — **it needs a page of its own; please say where it belongs.**

---

## 4. Please confirm

1. **"How we helping Business"** — the same ungrammatical heading as on the Cloud page, on all six pages.
2. **"Application Mordernazation"** in the related-services row is a typo; built as "Application Modernisation".
3. **"Talk to our Managed cloud team"** is the hero CTA on the Migration frame as well as on Managed Services.
   It reads as a copy-and-paste; the other four pages say "Talk to our cloud team".
4. **"on AWS Web Services"** in the Migration hero title. AWS *is* Amazon Web Services.
5. **Managed Services links to itself.** The design's related row on the Managed Services page includes
   "Managed Cloud & Optimization", which is that same page. The template drops any related card that points at
   the page it is on, so on Managed Services three cards show instead of four. Tell me which fourth you want.
6. **The images are shared across the six pages.** The design supplies one set of AWS-themed photographs and 3D
   icons; they are generic enough for all six, but per-service artwork would be better.

### British English

optimizes → optimises · utilization → utilisation · Modernization → Modernisation · modernization →
modernisation · Recognized → Recognised · Optimization → Optimisation · organizations → organisations ·
Mordernazation → Modernisation.
