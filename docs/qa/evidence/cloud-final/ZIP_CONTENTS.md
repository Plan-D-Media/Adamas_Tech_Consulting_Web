# `Adamas_web_new design.zip` — contents (extracted 23 November 2026)

Source: `E:\PLAN D MEDIA PROJECTS\Adamas Tech Website\Adamas_web_new design.zip` (72,823,673 bytes, 23 Nov 2026
12:24). Extracted unchanged to `design-ref/exports/new-design/` (gitignored, `/design-ref` in `.gitignore`); the
zip itself was not modified.

**All four files the brief names are present, under exactly those names.** Nothing is missing.

## The four page designs

| File | Size | Dimensions | Used for |
|---|---|---|---|
| `Cloud.svg` | 30,325,065 | 1440 × 8480 | `/services/cloud-services` |
| `Managed Services.svg` | 46,492,566 | 1440 × 7252 | the six Cloud sub-service pages |
| `Case Study_SAP_Cement industry.svg` | 6,987,865 | 1440 × 4262 | `/case-studies/sap-disaster-recovery-cement` |
| `Case Study_Kubernetes.svg` | 11,106,016 | 1440 × 4867 | `/case-studies/kubernetes-operations-healthtech` |

Rendered to PNG at native width into `design-ref/renders/new-design/` with
`node scripts/qa/render-new-design.mjs`, and sliced into readable bands under
`design-ref/renders/new-design/slices/<name>/` with `node scripts/qa/slice-design.mjs`.

## The other 25 files

All logo and flag assets, all small. They are the artwork already embedded in the page SVGs, exported
separately; none is a page design, and none was needed, because the bitmaps were pulled straight out of the page
SVGs instead (`node scripts/extract-svg-images.mjs`).

| File | Size | Dimensions |
|---|---|---|
| `1642669592_thumbnail_i-Stem_Logo_with_Tagline.svg` | 289,961 | 55 × 16 |
| `327279043_910004573525337_8767521135149235988_n.svg` | 228,522 | 54 × 54 |
| `Ajmal-Perfumes-Logo (1).svg` | 35,727 | 62 × 31 |
| `al_dar_kitchen_equipment_trading_llc_logo (1).svg` | 7,545 | 53 × 53 |
| `Asset 1@4x 6.svg` | 124,946 | 231 × 87 |
| `Careem_logo.svg (1).svg` | 87,148 | 213 × 45 |
| `Frame 1000005208.svg` | 8,091,989 | 3314 × 69 |
| `Full_logo_horizontal_white_original 1.svg` | 341,552 | 154 × 33 |
| `gulf-processing (1).svg` | 40,868 | 80 × 23 |
| `IISc_Master_Seal 1.svg` | 2,048,508 | 75 × 76 |
| `images (3) 1.svg` | 3,181 | 85 × 85 |
| `images (5) 1.svg` | 16,245 | 97 × 97 |
| `India.svg` | 4,155 | 51 × 19 |
| `logo (1) 1.svg` | 48,407 | 126 × 43 |
| `logo.22285f727990 1.svg` | 20,774 | 171 × 44 |
| `Media (2) 1.svg` | 79,775 | 24 × 33 |
| `Media (4) 1.svg` | 52,786 | 62 × 53 |
| `pisquarelogo 1.svg` | 34,475 | 149 × 51 |
| `Pwc-logo (1).svg` | 59,364 | 148 × 110 |
| `softnextuk_logo 1.svg` | 16,522 | 103 × 103 |
| `tccoelllgo_1600x@3x 1.svg` | 118,762 | 249 × 149 |
| `UAE.svg` | 1,058 | 45 × 18 |
| `Uk.svg` | 1,008 | 29 × 18 |
| `University_of_Kalyani_Logo 2.svg` | 131,689 | 90 × 90 |
| `Webel 600x400 logo.132ced2c57c05cb9ad0a70aaad7369f4b3f0506c 1.svg` | 59,891 | 88 × 58 |

`Frame 1000005208.svg` (3314 × 69) is the logo strip laid out end to end — the same seven logos the Cloud design
shows. It is not used; see the note on the clientele strip in `CLOUD.md`.

## Two things that changed how the build was done

**1. Every page SVG has its text outlined to paths.** `<text>` count is zero in all four files
(382 / 283 / 184 / 292 `<path>` elements instead). So the brief's fallback applies: the matching Figma frames were
checked first, and **three of the four are older than the zip**, so their text could not be used:

| Design | Zip | Figma frame on page `7586:47704` | Verdict |
|---|---|---|---|
| `Cloud.svg` | 1440 × **8480** | `8705:3814` "Cloud " — 1440 × **6695** | older; not used |
| `Managed Services.svg` | 1440 × **7252** | `8476:3840` "Managed Services" — 1440 × **5997** | older; not used |
| `Case Study_Kubernetes.svg` | 1440 × **4867** | `8477:11634` — 1440 × **4152** | older; not used |
| `Case Study_SAP_Cement industry.svg` | 1440 × **4262** | `8478:12006` — 1440 × **4262** | same height, but the export draws a different page header, so the render was used for copy here too |

Every string on the four pages was therefore **transcribed from the render**. Each page's report lists the
transcribed blocks for proofreading: `CLOUD.md`, `SUB_SERVICES.md`, `CASE_STUDIES.md`.

One exception, in the other direction: `/services/cloud-services/migration-modernization` has no SVG in the zip,
and its own Figma frame `7669:44187` ("Migration") **is** the best source available for it, so its live text was
read from the API. See `SUB_SERVICES.md` for which parts of that frame are real copy and which are filler.

**2. The Figma API rate-limited the rest.** `scripts/figma-access-check.mjs` confirms the token can read the file
(HTTP 200), and `7669:44187` was fetched, but every later request for `8185:796`, `8185:1473` and `8476:3840`
returned HTTP 429 across sixteen attempts spaced up to 100 s apart. This did not block anything — the zip is the
newer and authoritative source — but it is why the DevOps and AI/ML frames were not cross-checked.
