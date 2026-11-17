# Asset manifest

Processed output lives under `public/media/` and is served through `MEDIA_BASE_URL`. Sources are never edited: the designer's SVG exports in `design-src/`, and Figma image fills and node exports saved in `design-ref/` (both gitignored). `scripts/process-assets.mjs` regenerates every raster from `scripts/assets.manifest.json` (AVIF + WebP at 1x/2x of the rendered size; `sharp`). Where Figma crops a fill (STRETCH image transform), the manifest entry carries the same crop as fractions (`crop`, `fit: "fill"`, `enlarge` for the hero backdrop that Figma scales past its pixel size): `hero-bg`, `outcome-sap`, `contact-photo`, `presence-map` since round 6. The design-comparison fixture's artwork (`public/media/figma-fixture/`, gitignored) is cut by `scripts/figma-fixture.mjs` from the hero-card sheet (fill `94e1e948…`, Rectangles 3793/3794/3798) and the Top Stories image (`84b59bd6…`). Inline vectors were optimised with SVGO and recoloured to `currentColor` in `components/ui/Icon.tsx`.

## Rasters (public/media)

| Processed file | Source | Figma node | Rendered size | Used in |
|---|---|---|---|---|
| `brand/logo.{avif,webp}` | Figma fill `c995b7a7...` (236x69, the live-site logo) | 236:2165 "logo 1" | 205x60 header, 178x52 footer | Header, footer |
| `flags/in[@2x,@3x].{avif,webp}` | Figma node export at 4x | 262:1595 "IND" | 24x14 | Region switcher, drawer |
| `flags/uk[@2x,@3x].{avif,webp}` | Figma node export at 4x | 262:1599 "UK" | 24x14 | Region switcher, drawer |
| `flags/gcc[@2x,@3x].{avif,webp}` | Figma node export at 4x | 262:1603 "GCC" | 24x14 | Region switcher, drawer |
| `images/home/hero-bg.{avif,webp}` + `.blur.txt` | Figma fill `ffe571bf...` (1920x1080) | 236:1403 "Rectangle 3120" | 1920x960 at 60% opacity | Homepage hero (Milestone B) |
| `images/menu/sap-treasury.{avif,webp}` | Figma fill `5a2952d6...` (384x167, low-res) | 236:4647 | 280x553 | Not used: the mega-menu feature card takes the case study's own image from the database |
| `images/about/hero-bg.{avif,webp}` + `.blur.txt` | Figma fill `d657ab7b...` (2216x1108, STRETCH crop `[0,0,1,0.5521]`) | 274:1626, About us hero | 1920x530 | About hero (LCP image, `priority`) |
| `images/about/approach-bg.{avif,webp}` | Figma fill `c4653bdb...` (1894x663) | 274:1667 "Image 243" | 1920x490 under a navy wash | "Our approach" band on About |
| `images/about/commitment.{avif,webp}` + `.blur.txt` | Figma fill `17cc7dde...` (740x460, enlarged) | 274:1736 | 1194x524 | "Our Commitment" band - held until the client sends that copy |

Live-site images migrated in the prototype round (`public/media/images/**`: partners, certifications, clients, industries, case studies, solutions, people, hero posters) are unchanged and still referenced by the seed.

## Inline vectors (components/ui/Icon.tsx)

| Icon name | Source | Figma node |
|---|---|---|
| `facebook`, `linkedin`, `twitter`, `youtube` | Figma SVG export | 262:289, 262:292, 262:298, 262:301 ("Subtraction 2") |
| `arrow` | Figma SVG export | 236:2149 (button arrow, 16px) |
| `chevron-down` | Figma SVG export | 236:2158 |
| `phone`, `mail-small` | Figma SVG export | 262:279 "Frame 43", 262:283 "Frame 44" (top bar, 12px) |
| `mail`, `user` | Figma SVG export | 269:1715, 269:1718 (contact form) |
| `global-delivery`, `senior-led`, `quality` | Figma SVG export | 262:385, 262:390, 262:395 (About section) |
| `thumbs-up`, `shield` | Figma SVG export | 262:223, 262:226 (hero trust row) |
| `menu`, `close`, `globe`, `external`, `chevron-right` | Drawn (not in Figma), 1.5px stroke style | - |

## Still needed from the designer or Figma (later milestones)

- Vector logo (only a 236x69 raster exists).
- World map: Figma has one flattened raster (1717x916) with pins and arcs baked in; pins and arcs are needed as separate layers to animate.
- "Why Organisations Choose Adamas" diagram: a flat 1536x1024 raster in Figma; it will be rebuilt in HTML/SVG from the six `The adamas difference*.svg` icons and the centre image (`Ellipse 658`, `Glowing Blue Geometric Network`).
- Partner logos are 600x315 rasters (AWS Partner Network, Cloudera, SAP Partner Open Ecosystem, Google Developers Agency Program); vectors preferred.
- Certification badges in the Tech Excellence card are 128x71 rasters; the live-site WebPs (`images/certifications/`) are better and will be used.
- Hero carousel cards (`Rectangle 3793/3794/3798.svg`, 5MB each, embedded rasters) and the section photos (`ABOUT ADAMAS IMG.svg`, `Cloud Services IMG.svg`, `Healthcare IMG.svg`, `P1/P2/Face/Parking/AI Product B.svg`, `Article*.svg`, gear icons) are processed in Milestone B when the homepage sections are built.

## Milestone B additions (homepage)

| Processed file | Source | Figma node | Rendered size | Used in |
|---|---|---|---|---|
| `images/home/hero-card-{event,arivoo,treasury}[@2x].{avif,webp}` | `design-src/Rectangle 3793/3794/3798.svg` | 236:2192-2194 | 401x217 | Hero cards |
| `images/home/story-adamas-building[@2x]`, `story-wave` | `design-src/TOP STORIES.svg`, `TOP STORIES BG.svg` | 236:2217, 236:2216 | 561x363, 1217x365 | Top Stories |
| `images/home/about-team[@2x]`, `about-graphic.svg` | `design-src/ABOUT ADAMAS IMG.svg`, `ABOUT ADAMAS graphic.svg` | 236:2287, 236:2289 | 551x490, 227x227 | About |
| `images/services/{cloud-services,digital-transformation,ai-services}[@2x]` | `design-src/Cloud Services IMG.svg`, `Digital Transformation.svg`, `AI Services.svg` | 236:2307, 236:2324, 236:2342 | 551x556 | Services tabs (pillar images) |
| `images/solutions/{arivoo,a-eye,air-mind,face-recognition,industrial-analytics}-card[@2x]` | `design-src/P1.svg`, `P2.svg`, `AI Product B.svg`, `Face.svg`, `Parking.svg` | 262:553-637 | 424x523 | Solutions cards |
| `images/home/outcome-sap-treasury` | Figma fill `8bf97241...` | 236:2365 | 1043x550 | Client Outcomes |
| `images/home/industries-bg`, `images/industries/healthcare-card[@2x]`, `healthcare-phone[@2x]` | Figma fills `fdd7cbc5...`, `545bddf1...`, `abbb40ba...` | 236:1396, 236:2732, 236:2733 | 1920x968, 206x140, 50x105 | Industries |
| `images/home/difference-centre[@2x]`, `difference-network[@2x]` | `design-src/Group 21304.svg`, `Frame 12455.svg` | 236:2890, 236:2892 | 353x353, 193x193 | Why Adamas diagram |
| `images/events/house-of-lords-keynote` | `design-src/Article.svg` | 236:2424 | 967x571 | Events (event image, placeholder) |
| `images/home/perspective-{data,resilience,ai}[@2x]` | `design-src/Image (Technology leaders...).svg`, `Image (Secure...).svg`, `Article-1.svg` | 236:2477, 236:2487, 236:2499 | 715x401, 246x268, 580x285 | Latest Perspectives |
| `images/home/tech-gear-{1..4}[@2x]` | `design-src/Target, Puzzle, and Checkmark Gear N.svg` | 251:5070-5073 | 174x116 | Tech Excellence |
| `images/home/presence-map` + blur | Figma fill `2ff9d381...` (1717x916) | 254:5205 | 1920x937 (stretched) | Our Presence |
| `images/home/contact-photo[@2x]` | Figma fill `0a71171e...` | 236:2587 | 785x621 | Contact |
| `images/partners/{aws-partner-network,cloudera,sap-partner-open-ecosystem,google-developers-agency}[@2x]` | Figma fills (600x315) | 236:2628 | 200x105 | Partners strip |
| `images/home/products-rings.svg`, `events-rings.svg` | `design-src/PRODUCTS & SOLUTIONS.svg`, `Events.svg` | 236:2409/2410, 236:2466 | decorative | Solutions / Events backgrounds |
| Icons `industry-*`, `difference-1..6`, `calendar`, `layers`, `chart`, `check` | `design-src/*_D.svg`, `The adamas difference*.svg`; the last four drawn | 262:89-149, 269:1657-1680 | inline | Industries menu, diagram, hero cards |

## Round 7 additions (Cloud Services page, Figma 292:24608)

Entries are added by `scripts/cloud-assets.mjs` (crops read from the node transforms) and generated by `scripts/process-assets.mjs`.

| Processed file | Source | Figma node | Rendered size | Used in |
|---|---|---|---|---|
| `images/services/cloud/hero` + blur | Figma fill `a237d6e1...` (1344x377, upscaled as the design does) | 292:24613 "raise_money" | 1920x530 | Cloud Services hero |
| `images/services/cloud/intro[@2x]` | Figma fill `d39f8fb2...` (4096x2730) | 292:24669 | 660x536 | Intro photo |
| `images/services/stat-gear-1..4[@2x]` | Figma fill `c01c475c...` (one sheet, four crops) | 298:28081-28084 | 174x116 | Stat cards (DRAFT) |
| `images/services/expertise-icon-1..4[@2x]` | Figma fill `b773659e...` (one sheet, four crops) | 298:28148-28151 | 81x73 | Expertise cards |
| `images/services/platform-icon-1..4@2x/@3x` | Figma fill `da2bab7d...` (one sheet, four crops) | 298:28231-28241 | 27x19 | Platform accordion |
| `images/services/industry-{retail,bfsi,manufacturing,healthcare}[@2x]` | Figma fills (stock photos) | 298:28256-28289 | 489x644, 755x310, 339x310, 395x310 | Industry mosaic |
| `images/services/quality-badge-1@2x, -2, -3` | Figma fills (40x40 badges) | 299:28708-28712 | 40x40 | Delivery-principles artwork |

Still from the designer for this page: the vendor logos for the technology ecosystem (none drawn in), a non-placeholder hero title, and the "Glossy Cloud" icon set as vectors (the crops are rasters).
