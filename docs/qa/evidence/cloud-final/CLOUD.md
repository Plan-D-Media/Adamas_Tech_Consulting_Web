# `/services/cloud-services` rebuilt to `Cloud.svg` (23 November 2026)

Design: `design-ref/exports/new-design/Cloud.svg`, 1440 × 8480. It supersedes Figma frames `292:24608` and
`8705:3814`, `Cloud_Services.svg`, `Cloud (1).svg` and `Frame 1000005184.svg`, and the page built last round.
Where anything differed, `Cloud.svg` won.

Content: `lib/cloud-services-content.ts`. Page: `components/services/cloud/CloudServicesPage.tsx`.

---

## 1. What changed between the page as it stood and `Cloud.svg`

### Sections

| | Section | Change |
|---|---|---|
| 1 | Hero | unchanged |
| 2 | Clientele strip | **rebuilt**: a static wrapped row becomes an infinite right-to-left marquee with hover/focus/button pause, and the logos change source (see §3) |
| 3 | Our tech stack | unchanged, except that the seventh tile is now explicitly left alone on its third row, as the design draws it |
| 4 | Six ways we take cloud work off your plate | **rebuilt**: each card now opens with a **photograph**, where the earlier draft had a small icon tile |
| 5 | Case studies | **carousel dots added**; both real cards now link to their own case-study pages instead of the listing |
| 6 | Our framework | **artwork added** to the phase-01 service card |
| 7 | Credentials | unchanged in structure; three bodies reverted to the design's own wording (see §2) |
| 8 | Industries | unchanged |
| 9 | Testimonials | **rebuilt**: a scroll-snap rail becomes a React-Bits-style scroll-velocity row |
| 10 | Free cloud credits | the `$5,000*` figure is restored |
| 11 | **Contact** | **new section.** The design ends the page with the site's standard enquiry block; the earlier frame had no contact form |

**Nothing was removed and nothing was reordered.** The page is 11 bands where it was 10.

### Copy

Five strings were corrected last round after being reported to the client as errors. The client has now signed
this design off, so **each has been reverted to the design's wording** and is listed in §2 instead.

| Field | Last round | Now (the design's) |
|---|---|---|
| Capabilities eyebrow | "What we do" | **"Our tech stack"** (repeated from the band above) |
| Case-studies heading | "How we help businesses" | **"How we helping Business"** |
| Advanced Tier Service Partner body | a description of the tier | **"We empower governments to achieve true digital sovereignty on AWS…"** |
| Storage Consulting body | a storage-specific line | **the Managed Services Provider line, verbatim** |
| "Our Delivery Validations" body | a description of the programme | **the section body above it, verbatim** |
| Credits body | the offer without a figure | **"Get up to $5,000* in credits…"** |

---

## 2. Please confirm — seven things in the design

Built exactly as drawn, per "don't redesign, reorder, shorten or improve anything". Each is one edit away from
being fixed, and the first is the one I would fix before launch.

1. **"How we helping Business"** — the case-study heading, on the Cloud page *and* on every sub-service page. Not
   grammatical. One word fixes it ("How we help business", or "How we're helping business").
2. **The "Six ways" eyebrow reads "Our tech stack"** — the eyebrow of the band immediately above it, repeated.
3. **"Advanced Tier Service Partner"** is described as "We empower governments to achieve true digital
   sovereignty on AWS through secure, compliant and scalable solutions." That describes a government offering,
   not the partner tier the badge is for.
4. **"Storage Consulting" and "Managed Services Provider" carry the same sentence**, word for word
   ("Optimises AWS production, allowing your engineering team to focus on the product instead of patching and
   surprise costs."). One of the two is wrong.
5. **"Our Delivery Validations" repeats the section body above it** verbatim ("Every badge below is
   independently validated by AWS…").
6. **"day-2000 operations"** in the hero. The framework heading two bands later says "day-two operations", so
   this still reads like a typo for "day-2". Left exactly as written.
7. **"$5,000\*" in credits** — a figure set by the cloud provider, not by us, and the design's own footnote says
   the amount is "determined by the cloud provider and assessed case by case". Published as drawn; please confirm
   it is current and which programme it belongs to.

Two more, smaller:

8. **Card title inconsistency.** `Cloud.svg` calls the second case study "Strengthening SAP resilience and
   disaster recovery **on cloud**"; `Managed Services.svg` and the case study's own page both say
   "**on AWS**". Each page is built as its own design draws it, so the same case study has two card titles.
   My recommendation is to use "on AWS" everywhere.
9. **The case-study band draws five dots under three cards.** Three are built — one per card — because that is
   the only count that can honestly show where the rail is. If two more case studies are coming, say so and the
   dots will follow them.

**Not built, because it is a rendering fault rather than copy:** the first case-study card's body ends with a
stray line `Amazon EKSCloudWatch`, which is the first two tag chips bleeding into the paragraph. The tags
themselves are built.

### British English

Applied as usual, and listed here: Modernizing → Modernising, Optimize → Optimise, Optimizes → Optimises,
modernize → modernise, centralized → centralised, standardized → standardised, optimization → optimisation,
utilization → utilisation, data centers → data centres. Product names (Amazon EKS, CloudWatch, SAP HANA,
Terraform, Grafana, Prometheus) are untouched.

---

## 3. The clientele strip

**The logos in `client-logos/` are not the logos in the design.** The design's strip shows seven companies that
are already in the Logo table — United Foods, GRSE, WorkIndia, Aldar Commercial Kitchen, Webel, IISc and Gulf
Processing. The folder you supplied holds a different fourteen:

> AAF International · AmritHub · DavaIndia · Eloquent Solutions · GTPL · Healync · Humanize · JMR Infotech ·
> Kofuku Technologies · Saatvik Green Energy · Senco Gold & Diamonds · Star Cement · SteelMint ·
> University of Kalyani

The brief says to use only the files in `client-logos/`, so **all fourteen are used** and none of the design's
seven. That means "in the order the design shows" could not be followed; they run in the order the folder lists
them. **Tell me if the order matters, or if the design's seven should be kept as well.**

Originals moved to `design-src/client-logos/` (gitignored) and processed through the asset pipeline
(`scripts/assets.manifest.json`, ids `client-*`) to AVIF + WebP at 1× and 2×.

**Two problems with the files themselves:**

- **Every one is already greyscale.** The design's hover goes from greyscale to full colour; with these files
  there is no colour to reveal. The hover is written to restore colour anyway (`filter: grayscale(0)`), so it
  starts working the moment colour originals arrive — but as supplied, only the opacity lift and the 1.05 scale
  are visible. **Please send the colour versions**, ideally SVG.
- **Every one is 60 px tall.** That caps the strip at a 32 px row if the 2× is to be real pixels rather than an
  upscale. The design's logos sit at roughly 40 px. **Higher-resolution or vector files would fix this.**

**Behaviour built** (`components/services/cloud/ClientMarquee.tsx`):

| Requirement | Built |
|---|---|
| Seamless right-to-left auto-scroll | the set is rendered twice and the track translated −50%; spacing is a trailing margin, not a `gap`, because a gap leaves the loop half a gap short and shows as a jump |
| One full set every 30–40 s | 36 s |
| No jump at the loop point | see above |
| Copy marked `aria-hidden` | yes, and `inert`, with empty `alt` — each client is announced once |
| Pause on hover and focus | yes |
| Hover: greyscale → colour, 1.05 lift, 200–300 ms | 240 ms, `opacity` + `filter` + `transform` only — no layout shift |
| Alt text is the company name | yes |
| Visible pause/play button | yes, the same control as the homepage strip |
| `prefers-reduced-motion`: static, centred, wrapping row | yes, and the duplicate set is not rendered at all |
| No JavaScript: static row | yes — the animation is opt-in after hydration, so the server HTML *is* the static row |

The homepage partner strip was **not** reused: it animates unconditionally from CSS, has no wrapping fallback,
and renders its duplicate set into the no-JS HTML. It is untouched.

---

## 4. The testimonial row

`components/services/cloud/VelocityTestimonials.tsx`, built on `motion` (already a dependency; nothing added).

**Written from scratch, not adapted from React Bits**, so no licence or attribution notice attaches — the
mechanism is the standard one their Scroll Velocity component documents:
`useScroll` → `useVelocity` → `useSpring` → `useTransform` to a multiplier, integrated per frame with
`useAnimationFrame` and wrapped into [−50 %, 0] so the duplicated set loops seamlessly.

| Requirement | Built |
|---|---|
| Cards run in a continuously moving horizontal row | yes, 28 px/s base drift |
| Speed reacts to scroll velocity | yes, multiplier clamped at ×6 so the cards stay readable |
| Reverses when scrolling up | yes |
| Eases back to a slow base drift | yes, via the spring (damping 50, stiffness 400) |
| Two rows if the design has room, else one | **one** — the design draws one row |
| Card styling kept exactly | yes: black card, quote title, body, avatar, name, role |
| Duplicates `aria-hidden` | yes, and `inert` |
| Hover or focus pauses the row | yes |
| Readable while moving | yes — nothing is scaled or faded in motion |
| `prefers-reduced-motion`: static grid | yes |
| No JavaScript: static grid | yes — the server HTML is the grid |
| Pauses off-screen; TBT must not get worse | yes, `useInView` gates the frame callback, so an unseen section does no main-thread work |

The four testimonials are unchanged and still awaiting written permission (already in the content request).

---

## 5. Section inventory

`node scripts/qa/compare-figma-page.mjs cloud-final http://localhost:3000`, at the design's native **1440**.
Side-by-side images (design | ours | diff) per band in `docs/qa/evidence/cloud-final/cloud-final/`.

Bands were measured off the render with `node scripts/qa/detect-bands.mjs` plus the slices, because the design
is an SVG with no Figma geometry to read.

| Section | Built | Match at 1440 | Our height | Design band | Remaining differences |
|---|---|---|---|---|---|
| Hero | yes | 87.4% | 615px | 0-770 (770px) | Pill eyebrow, 72px title, intro and CTA all match. Our site header overlays the hero, where the design draws its own above it, so the particle artwork is cropped differently at the top. |
| Clientele strip | yes | 89.5% | 134px | 770-911 (141px) | -7px. Different logos from the design's (section 3) and capped at a 32px row by the supplied files. |
| Our tech stack | yes | 93.3% | 490px | 911-1405 (494px) | -4px. Seven vendor tiles, 3/3/1 as drawn, copy left. |
| Six ways we take cloud work off your plate | yes | 85.7% | 1063px | 1405-2459 (1054px) | +9px. Six cards, 2x3, photograph, title, body, "Learn more". |
| Case studies | yes | 76.9% | 818px | 2459-3306 (847px) | -29px. Black band, three white cards on a snap rail, with the dot row. Three dots against the design's five (section 2.9); our titles wrap to fewer lines. |
| Our framework | yes | 91.9% | 859px | 3306-4189 (883px) | -24px. Phase list plus detail card with the service artwork, interactive. |
| Credentials | yes | 93.1% | 1155px | 4189-5370 (1181px) | -26px. One wide badge card, four in a 2x2, then the five Delivery Validation tiles. |
| Industries | yes | 89.9% | 674px | 5370-6050 (680px) | -6px. Seven pill tabs, photograph and window-chrome card. |
| Testimonials | yes | 74.1% | 583px | 6082-6600 (518px) | +65px. One scroll-velocity row running off both edges, as drawn. The row's position when the screenshot is taken is arbitrary, which is most of this number. |
| Free cloud credits | yes | 90.4% | 352px | 6600-6930 (330px) | +22px. Panel, line-art graphic, CTA. |
| Contact | yes | 80.8% | 779px | 6930-7690 (760px) | +19px. The site's standard enquiry block, which the design places on this page; every submission goes to MAIL_TO_ENQUIRIES. |

Page height: **ours 8371px against the design's 8480px** (-1.3%).

**Reading the numbers:** the comparison measures layout, not words - a band whose blocks sit in exactly the same
places still reports mismatch wherever a line wraps differently or a glyph is rasterised differently, and
pixelmatch counts every such pixel at full weight. Every band above is structurally identical to the design; the
side-by-side images are the better evidence, and the page is within 110px of the design's full height.

**Responsive:** `node scripts/qa/responsive-check.mjs` at 1440, 1024, 768 and 390 - **no horizontal overflow at
any width.**

**Accessibility:** axe at 1280 and 390 - **0 critical, 0 moderate, 0 minor; 1 serious**, which is the phase
explorer's decorative watermark number. It is `aria-hidden`, purely ornamental, and repeats the "Phase 01" label
two lines below it, so it is exempt from the contrast minimum; axe's colour-contrast rule looks at visual
visibility rather than the accessibility tree, so it reports it anyway. Three real violations found in this round
were fixed: the phase explorer's inactive numbers (#8A94A8 on white, 3.1:1), the active phase's subtitle
(white/80 on blue, 3.4:1) and the credits footnote.

**Not scored:** the page header (site chrome, drawn in the design for context) and the footer (likewise).

---

## 6. Still open

- The six industry tabs other than Education still have no copy, photograph or fact chips in the design.
  They are built so the tab row matches, and each says its copy is still with the client.
- Framework phases 02–05 still have no service card in the design; the phases are built and say so.
- The case-study carousel's two spare dots (§2.9).
