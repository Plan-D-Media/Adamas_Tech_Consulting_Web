# The two client case studies, built to their own designs (23 November 2026)

Designs: `design-ref/exports/new-design/Case Study_SAP_Cement industry.svg` (1440 × 4262) and
`Case Study_Kubernetes.svg` (1440 × 4867).

Layout: `components/cases/AwsCaseStudyPage.tsx`. Extra content: `lib/aws-case-studies.ts`. Routing by slug in
`app/(site)/case-studies/[slug]/page.tsx`.

Both designs share one structure, so this is **one new layout used by both** — separate from the generic
`components/cases/CaseStudyPage.tsx`, which the other eighteen case studies still use, untouched. It is not the
generic template with different content; it has its own hero, its own sticky section rail, its own
solution/outcomes/quote/stack bands and its own CTA.

---

## 1. Database mapping — confirmed before building

Both rows already existed, seeded from the same live pages in an earlier round, which is why the challenge
paragraphs, solution bullets, pull quotes and technology chips match the designs word for word.

| Design | Slug | Title on the row | Legacy path on the row |
|---|---|---|---|
| `Case Study_SAP_Cement industry.svg` | `sap-disaster-recovery-cement` | Strengthening SAP Resilience and Disaster Recovery on AWS | `/case-study/case-study_sap_cement-industry/` |
| `Case Study_Kubernetes.svg` | `kubernetes-operations-healthtech` | Modernising Kubernetes Operations for a Leading HealthTech Company | `/case-study/case-study_kubernetes/` |

The legacy paths match the SVG file names exactly, so the mapping is unambiguous.

**Both are now `status: "PUBLISHED"`** in `content/caseStudies.ts`; **the other eighteen stay DRAFT.** That is a
seed change, so it reaches the preview only after `prisma db seed` runs against Neon.

### What came from where

| Band | Source |
|---|---|
| Title, Business Challenge, Adamas Solution (paragraph + ticked rows), pull quote, technology chips | the `CaseStudy` row, unchanged — they already match the designs |
| Read time, the three hero meta cards, Business Outcomes, the closing CTA | `lib/aws-case-studies.ts` — the schema has no column for them |
| Banner and card images | re-cut from the designs' own bitmaps at 1200 × 230 and 640 × 360 (the live site's files were 317 × 160) |

**No schema migration.** The four new fields live in code rather than new columns, as the Cloud page's content
does, so Neon needs no migration for this release.

The Business Outcomes were previously parked in each row's `editorNote`, because the old template had nowhere to
show them. The new design has a band for them, so they are real content now. The Kubernetes design lists **six**
where the note recorded five — "Earlier detection of infrastructure and application issues" is new in the design.

---

## 2. Figures and claims to approve

Everything below is published exactly as supplied. Nothing was changed.

| Case study | Claim | Why it is worth confirming |
|---|---|---|
| SAP / cement | **"24×7 monitoring across AWS and SAP environments"** | A service-level claim, stated as a delivered outcome. It is also the row's `headlineMetric`. |
| SAP / cement | **"Leading Manufacturing / Cement Company"** | Describes the client without naming them. Confirm the client is content with this level of identification. |
| SAP / cement | **"Periodic DR validation exercises and recovery testing"**, **"RTO/RPO testing built in as a repeatable process"** | Specific operational commitments. |
| Kubernetes | **"HealthTech"** / **"a leading HealthTech company"** | Same point about identification. |
| Kubernetes | **"Continuous AWS cost governance and optimisation"**, **"Earlier detection of infrastructure and application issues"** | Outcome claims with no figure behind them. |
| Both | **The read times (4 min, 5 min)** | From the designs; they do not match our rendered word counts exactly, but they are the client's own. |

Neither page carries a percentage or a currency figure, so there is nothing numeric to verify. **No client is
named on either page**, which is the safer position until written permission exists — it is already on the
content request.

---

## 3. Two deliberate differences from the SVGs

1. **The SAP export draws a different page header** — a simpler "Home / About Us / Product / Services" bar with an
   AWS sub-navigation (Hub · Migration · Managed Cloud · Data · DevOps · App Modernisation · Security · AI/ML ·
   Education · Storage · Managed Services). The **Kubernetes export, and `Cloud.svg`, draw the site's real
   header**, so that export is the odd one out and the site header is used on both. **If that AWS sub-navigation
   is wanted, it is a separate piece of work — tell me and I will build it.**
2. **The SAP export ends with a footer branded "SYNCK"** — a design-kit placeholder, not AdamasTech. The site
   footer is used instead, which is what the Kubernetes export draws.

Also: both pages carry the site's breadcrumb trail, which neither design draws. It is site chrome and it feeds the
`BreadcrumbList` structured data, so it stays; on the dark hero it now uses a light variant (it failed contrast
before — see §5).

---

## 4. Section inventories

`node scripts/qa/compare-figma-page.mjs case-sap-final|case-kubernetes-final http://localhost:3000`, at native
1440. Side-by-side images in `docs/qa/evidence/cloud-final/case-sap-final/` and `.../case-kubernetes-final/`.

### SAP — disaster recovery for a cement manufacturer

| Section | Built | Match at 1440 | Our height | Design band | Remaining differences |
|---|---|---|---|---|---|
| Hero | yes | 83.2% | 684px | 167–681 (514px) | +170px. Read time, title and the three meta cards match; ours adds the breadcrumb, and the design's own header (which we do not build) sat in this band. |
| Business Challenge | yes | 86.8% | 247px | 1180–1380 (200px) | +47px. Icon, heading, one paragraph. |
| Adamas Solution | yes | 94.6% | 727px | 1400–2060 (660px) | +67px. Blue panel, paragraph, six ticked rows. |
| Business Outcomes | yes | 93.0% | 349px | 2060–2490 (430px) | −81px. Six bordered cards, 2 × 3. |
| Pull quote | yes | — | — | in-band | Dark panel with the quote mark; scored inside the bands either side. |
| AWS & Technology Stack | yes | 95.8% | 322px | 2690–3040 (350px) | −28px. Nine chips over two rows, as drawn. |
| Closing CTA | yes | 89.9% | 279px | 3070–3310 (240px) | +39px. |
| Contact | yes | not in this export | 779px | — | The SAP export has the "SYNCK" placeholder footer here; the Kubernetes export has the contact block, so both pages render it. |

### Kubernetes — operations for a HealthTech company

| Section | Built | Match at 1440 | Our height | Design band | Remaining differences |
|---|---|---|---|---|---|
| Hero | yes | 89.5% | 740px | 0–695 (695px) | +45px, the breadcrumb. |
| Business Challenge | yes | 86.3% | 217px | 1190–1390 (200px) | +17px. |
| Adamas Solution | yes | 94.6% | 629px | 1420–2030 (610px) | +19px. Five ticked rows. |
| Business Outcomes | yes | 91.7% | 372px | 2030–2460 (430px) | −58px. |
| AWS & Technology Stack | yes | 95.9% | 269px | 2650–2950 (300px) | −31px. Seven chips. |
| Closing CTA | yes | 87.2% | 322px | 3000–3230 (230px) | +92px. |
| Contact | yes | 79.3% | 779px | 3290–4037 (747px) | +32px. |

Both pages: **no horizontal overflow at 1440, 1024, 768 or 390.**

---

## 5. Accessibility

axe on both pages: **0 critical, 0 serious, 0 moderate, 0 minor.**

Two violations were found and fixed in this round:

- The breadcrumb on the near-black hero was rendering in its light-background colours — about 1.5:1. `Breadcrumb`
  now takes a `tone` prop and the case studies pass `tone="dark"`.
- The technology-stack intro line was `#6B7689` on `#FAFCFF`, which is 4.4:1 — just under the 4.5 minimum.
  Darkened to `#5A6578`.

---

## 6. The listing

Both appear on `/case-studies`. In the **public** build they are the only two published case studies, so they are
the whole listing. In the **drafts preview** all twenty render and these two sort last (`sortOrder` 18 and 19), so
they are on page 3 of the paginated listing — worth knowing when reviewing the preview. The e2e spec scans every
page rather than assuming page 1.

The Cloud page's case-study cards and the sub-service pages' case-study band both link straight to these two pages
(they used to point at the listing).
