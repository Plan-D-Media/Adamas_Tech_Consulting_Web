# AdamasTech Consulting: design reference notes

Reference sites: hcltech.com, ibm.com/in-en (served /consulting, /events, /case-studies), infosys.com.
Date: 2026-10-29. Stack target: Next.js + Tailwind + GSAP + Motion.

**Method and caveats**
- **HCL and IBM:** no browser was used for these two. Two Chrome instances were connected and the session needed the user to pick one, which a subagent can't ask. Their notes come from **raw HTML and the production CSS bundles** (HCL ~1.1 MB, IBM ~3.4 MB), parsed for selectors and declared values.
- So the numbers are **declared CSS values**, not computed ones. **Motion and hover behaviour were inferred** from transitions, keyframes and class states, not watched. Mega-menu anatomy comes from markup and CSS, not from opening it.
- **Infosys was observed later in a real browser** (Claude in Chrome, 1536×674 viewport, cookies rejected, not signed in). Its numbers are **computed values** (`getComputedStyle`, Swiper's live params), and motion was sampled over time. Pages: homepage, the full-screen menu, one service page (cyber security), one case study and one insights article from that service.
- No wording, imagery, icons or brand assets are recorded here. Labels only identify patterns.

---

## 1. Observations

### HCLTech (homepage, /digital-business, /case-studies + one case study, /trends-and-insights)
- **Hero:** full-bleed image slider (slick), not video. Slide height is **500px** on desktop, 600px at ≥1900px and 530px on mobile, so it is shorter than 100vh. The copy box is max-width **764px** with 121px top and 65px bottom padding. H1 is **48px / lh 1.05, weight 400**. It steps to 42px at ≤1201, 30px/1.2 at ≤992 and 28px at ≤360, which gives about 2–3 lines. The sub-copy is 18/28. There is one primary CTA: a 47–48px tall button, 5px radius, with a fill that wipes left to right over **0.75s ease**.
- **Hero navigator:** dots are **text-labelled tabs** (14px, weight 500, 11px padding, 12px apart). Under the active tab a **2px bar grows from 0 to 100% width over 7s linear** (`slideProgress`). A second "AI banner" slider further down uses the same pattern at 5s.
- **Pause control:** a 38×38 glass button (5px radius, translucent white). On hover or focus it **expands to 83px** and fades in a Pause/Play text label. It has `role=tab` and a visible label, which makes it a good accessible pattern.
- **Header:** `position:fixed; top:24px`. It is a **floating, inset glass bar**: background rgba(240,240,240,.75), `backdrop-filter: blur(50px)`, 8px radius, a hairline gradient border and transitions of 0.4s ease-in-out. It **hides on scroll down and returns on scroll up** (`scrolldown` / `scrollup` body classes, with about a 68px offset). Top-level items have a 52px line-height and 12px horizontal padding, and hover shows a 4px-radius tint.
- **Mega-menu:** opens on hover or focus. The panel sits **8px below the bar** (`top: calc(100% + 8px)`) with an invisible 8px hover bridge. It uses the same glass treatment as the header (blur 50px, 8px radius) with 21px vertical padding, and it **fades opacity and visibility over 0.5s ease**. Inside are multi-column lists (`header-submenu-column`). A level-1 heading is 18px/600 and leaf links are 14px with 6px vertical padding. Level-3 and level-4 links use **1px tree-connector lines**. There is a gradient-text hover on headings and no featured image card in the SSR markup.
- **Container:** fixed **1246px** (1216px content after 15px side padding), then 100% width below 1280px. Bootstrap 5 grid with **24px gutters** (12px column padding).
- **Section rhythm:** carousel sections use **64px** vertical padding (40px on mobile). The expertise band uses 32px (20px on mobile). H2 is **32px** at ≥1200 and fluid below (`calc(1.325rem + .9vw)`). Body text is **18px / 1.4 at weight 300**, which is light and airy.
- **Homepage order:** hero slider → AI answer-engine search band → second story slider → "latest highlights" asymmetric 3-column card grid → expertise (50/50: sticky title left, 3 accordion-like rows with arrow buttons right) → number-facts (2-col intro + **4-up stat row**) → awards/media list with **two auto-scrolling vertical image columns** → partners slider → stacked resources carousel → careers cards → subscribe fold → footer.
- **Cards:** **8px radius** (5px on some), soft lavender-tinted shadow `0 4px 10px rgba(…,.3)`, and a gradient hairline border drawn with `::before`. Hover transitions run 0.3–0.4s ease: the shadow deepens to `0 35px 40px rgba(0,0,0,.06)` and the title turns into gradient text. Category tag sits above the title. Arrow-link CTA at the bottom.
- **Stats:** numbers are **48px / 600 / lh 1.2**, stepping to 36 and then 28. Labels are 20/1.4. Each sits in a 25% column. A 1.5px underline fades in on hover.
- **Service page:** static banner (desktop and mobile images) → **sticky secondary in-page nav** → 2-col text + video → two-column accordion → **stacked cards slider** → left-content accordion → expertise → grey icon cards → leader card → success-story carousel → partner logos → 3 white cards → awards → team slider → FAQ accordion → subscribe.
- **Case study:** banner image with centred content box → sticky secondary nav → overview (title left, prose right) → alternating Challenge / Solution / Impact bands on grey and white (title-wrap + bullet list + image) → full-width media → related case-study slider → contact band. Impact figures go in the bullet content, not in large stat numerals.
- **Insights hub:** featured stories grid → sticky secondary nav → video gallery → podcast gallery → knowledge library → subscribe → "all articles" listing → social row.
- **Rails:** slick with arrows and the autoplay pause button, not native scroll-snap. The partner and award columns run on infinite `translateY(-50%)` loops for **20s linear**.
- **Footer:** decorative radial-gradient glows. **Five link columns** with 18px/600 headings, 14px links (4px padding) and 35px top spacing; these become accordions below 992px with 49px tap rows. Social icons have proper `aria-label`s.
- **Motion summary:** mostly CSS transitions at 0.3s, 0.4s, 0.5s and 0.75s, using `ease`. There is one expressive curve, `cubic-bezier(.65,0,.076,1)` at 0.45s. No GSAP, AOS or Lottie in the page source. Only **2 of 93 `<img>` tags are lazy-loaded**. There are 16 external scripts, including several ad/analytics tags, plus jQuery and slick.

### IBM (in-en homepage, /consulting, /case-studies/[one], /events)
- **Hero ("leadspace expanded"):** this is **not a carousel**. It is a static split on the 16-col grid: **6 cols headline + CTA / 8 cols media / 2 cols news feed**. Top padding is `clamp(2rem, 8vh, 6rem)` and bottom padding 2rem. H1 is **weight 300, lh 1.2**, sized 36px, then 42 at ≥1056, 48 at ≥1312 and 60 at ≥1584. Mobile media is 4:3 and desktop 16:9. Video leadspaces have a **circular pause/play control** placed over the media.
- **Header (masthead):** always solid, **48px tall** (3rem), never transparent. An optional L1 sub-bar adds another 48px (98px total). Nav items are 16px with 13px/16px padding.
- **Mega-menu:** opens on click (`aria-expanded`). Anatomy: **left category rail at 25% width** (14px items, tabs separated by 1px) | **right panel** with a 28px heading link, then category groups in **3–4 CSS columns** (2 columns below 1056px). Each link has a **14px one-line descriptor**, and there is a "view all" row. A page overlay fades in over **300ms cubic-bezier(.5,0,.1,1)**, and the panel uses expand/collapse keyframes at **300ms cubic-bezier(.4,.14,.3,1)**. Shadow is `0 2px 6px rgba(0,0,0,.3)`.
- **Grid:** Carbon **16 columns**, max **99rem = 1584px**. Outer margin is 16px, then 32px at ≥672, then 40px at ≥1584. **32px gutters** (16px column padding). Breakpoints are 672 / 1056 / 1312 / 1584.
- **Section rhythm:** about **64px (4rem)** between sections via a `--vertical-spacing` token. Intro blocks have **48px (3rem)** below them, and headings 32px below. H2 is 32→36→42→48px, reaching 60px at ≥1584 (weight 300 from 672 up, lh 1.25→1.17).
- **Cards:** **4px radius**, flat with no shadow. Hover changes the background to a 12% grey over **240ms cubic-bezier(.2,0,.38,.9)**. There is also an **animated border-draw**: a gradient border sweeps around the card over **700ms cubic-bezier(.4,.14,.3,1)**, gated behind `(hover:hover)` and swapped for a simple opacity fade under reduced motion. Cards sit in grids with a **1px gap**, which reads as hairline dividers.
- **Case-study card (homepage):** this is the reference for metric-forward cards. Top section: client logo (48px tall, 96px wide) + 28/36 headline. **Bottom section: a grey band (#f4f4f4) holding the metric at 20/28 weight 600 + a 16/22 description**, at 85% width. The whole card is the link, and hover darkens both bands. Grid is 1 → 2 (≥672) → 3 cols (≥1056), or 4 in the full-width variant.
- **"Thick stat" CTA band (service page):** stat numerals are **weight 600**, sized 42px, 54 at ≥1056, 60 at ≥1312 and **76px at ≥1584** (lh 1.13), in a title + 3 items layout.
- **Service page:** leadspace → editorial card section → 50/50 content (text + stat items + pull quote) → thick-stat band → **logo gallery grid** (2/3/4/5 cols, filterable) → 50/50 → **full-width tabs** with block cards → CTA.
- **Case study:** leadspace → long-form content with **callout quote** (quote, source image, details) and 3 statistic items → **"next steps" CTA section** at the end.
- **Events:** short banner → leadspace → **carousel** of cards (16:9 thumbnails, image scales on hover over 0.4s) → thin-stat band → two-column lead form.
- **Logo ribbon:** carousel of logos at **144px wide** (160px at ≥1584).
- **Motion summary:** Carbon motion tokens throughout: productive 150–240ms `(.2,0,.38,.9)`, expressive 300–700ms `(.4,.14,.3,1)`, entrance `(.5,0,.1,1)`. Little or no scroll-reveal. Reduced motion is handled explicitly. Type is Plex Sans/Serif/Mono.

### Infosys (homepage, full-screen menu, /services/cyber-security + one case study + one insights article)
- **Hero:** a full-bleed **video** inside an **inset frame**: the section has 10px padding and the media has a 10–15px radius, so a thin pale border shows around it. It is taller than the viewport (938px at a 730px viewport). It is built as a Swiper carousel but had **only 1 slide, with autoplay off**, so on this visit there was no rotation, progress bar or dots. The video is muted, autoplays, loops (~23s), has a poster, uses `preload=metadata` and `object-fit: cover`. **No visible pause control.** The centred H1 is **7vw (107.5px at 1536) / lh 1.0 / weight 300 / −1px tracking** (Geist), and it **appears a few seconds after load** rather than on first paint. An AI search composer sits over the lower hero: a 78px round mic button overlapping a white panel, with suggestion chips. Content padding is 130px top.
- **Header:** there is no solid bar. Three **floating pieces** sit over the hero: a 50px round white menu button (left), a **glass pill nav** in the centre (rgba(255,255,255,.6), `blur(50px)`, 50px radius, 40px tall, link colour transitions 0.15s ease-in-out), and a dark pill CTA (right). The nav is `absolute` at the top. On scroll down it becomes `fixed` and gets a `hide-header` class, so it slides away. I did not confirm whether it comes back on scroll up.
- **Mega-menu:** a **full-screen off-canvas** opened by the round button. It slides in from the left (`transform 0.3s ease-in-out`), Esc closes it, and focus goes back to the trigger. Anatomy:
  - **Left rail:** 3 of 12 cols, ~384px, pale grey. Primary items are 18px/500 buttons, 43px tall with 8px radius. The active item gets a white pill and a blue left indicator. Below that is a quieter secondary list (16px) and a row of social icons.
  - **Right panel:** white, **20px radius**, 50/30px padding, scrolls on its own, 32px/500 heading. The default view shows **2 large featured image cards** with dark bottom scrims. Choosing a category swaps in **3-col tinted group boxes** (#f0f5fd, 20px radius, 20px padding), each with a 20px/600 heading over a hairline and 14px links.
- **Container:** Bootstrap, **1320px** with 12px column padding (24px gutters).
- **Section rhythm:** a **75px** vertical padding token everywhere (`py-75`). Section H2 is **32px / 1.2 / 500**, centred over a centred 16px intro. Cards use 24px/500 titles and 16/1.6 body. Backgrounds alternate pale grey-blue (#e9eef7), white and **black**.
- **Horizontal rails:** all Swiper, `grabCursor` on. **No native CSS scroll-snap**; Swiper snaps one card per drag.
  - **Peeking:** fractional `slidesPerView`, mostly **2.5** (service-page stories, 596px cards) and **3.5** (awards and related reads, 420px cards). Gap is **20px**. The rail is full-bleed: it starts 40px from the viewport edge and runs off the right edge, so half a card peeks. Breakpoints drop to 2.3, then 1.5, then **1.1–1.2 on mobile**, with the offset reduced to 15–20px.
  - **"Top stories" rail (home):** 1.5 per view, 70px left offset, **1.4s** slide speed (0.5s on mobile). The active card is scale 1 and the others are **scale(0.85)**, with a `0.8s ease` transition. Each card is horizontal: image ~36% + text, 16px radius.
  - **Controls:** prev/next are **32–40px squares** with 8px radius, a 1px border and an arrow, plus a **fraction counter ("1 / 6")** between them. They sit top-right of the section heading, or centred under the rail. The disabled arrow is dimmed. There is no autoplay, no progress bar and no dots.
  - **Default speed** is 300ms `ease`.
- **Cards:** two anatomies:
  - **Overlap card** (homepage case rail): a 16:10 image with 15px radius, then a white content panel ~92% wide that **overlaps the image by 30px**. The panel has a 10px radius, `0 15px 20px` purple-tinted shadow at .25, 20px padding (70px at the bottom for the CTA) and a dark 5px-radius category chip.
  - **Plain card** (service rails): an image of about 1.8–2:1 with 10px radius, then a chip, title and arrow button.
  - **Product trio:** a flex row where the active or hovered card grows from `flex 1` to ~1.2× width over **0.6s**.
  - **News block:** a mixed bento of horizontal and vertical cards, 16px radius.
- **Service page:** short inset hero (64px / 1.0 / 300 H1) → intro 2-col with images → "what's new" rail (2.5) → success stories → "our work" single-slide carousel → insights → awards rail (3.5) → feature section (40px H2) → **black testimonial rail (2.5)** → **black closing band**: full-bleed background image, 4/8 split, 48px H2 + form.
- **Case study and insights article** (same template):
  - **Inset gradient banner**, 344px tall with 10px radius, holding a breadcrumb and a large light page-type label (no image).
  - A floating **"listen" text-to-speech pill**.
  - 2-col title (40–48px / 1.2 / 500) + media (16px radius, purple shadow).
  - Prose at **18 / 1.6** running **~1076px wide**, which is too long a measure.
  - CTA button, then a "related" rail (3.5 per view, fraction controls top-right), then the black closing band.
  - **No stat strip or metric callouts.**
- **Motion summary:** GSAP 3 and ScrollTrigger are loaded, but no ScrollTriggers were active on the homepage. Reveals use **WOW + animate.css** (fadeInUp/Down, **1s ease, 0.2s delay**). Swiper runs the rails. The site has 32 `prefers-reduced-motion` rules in its CSS. There is a 1.5s infinite pulse on the mic button and a floating round back-to-top button.

**Not covered:** the footer, and dark sections apart from those noted above.

---

## 2. Patterns we will use

| Pattern | Source | Where on AdamasTech | Implementation notes |
|---|---|---|---|
| Cinematic video hero + story navigator + pause | HCL (labelled tabs, 2px progress, 7s; expanding pause button) + IBM (round media pause) + Infosys (full-bleed looping video, oversized light centred H1, inset frame) | Home hero | Muted, `playsinline`, poster-first `<video>` (≤2.5 MB per clip, AV1/H.264). 3–4 stories with **labelled tabs** (not dots) and a 2px bar animated by GSAP `scaleX` 0→1 over `duration` (7s). Pause toggles timeline + video and expands 40→88px to show its label. Autoplay off under `prefers-reduced-motion`. Height `min(88svh, 820px)`. Scrim: bottom-left linear gradient at about 55% black so 48px text keeps ≥4.5:1. |
| Header transparent → solid | HCL (glass, hide-on-down / show-on-up) | Global | Transparent over hero, then solid or glass (`bg-white/80 backdrop-blur-md`) after 80px. Height 72px desktop (64px on scroll), 56px mobile. Hide on scroll down / show on scroll up with a 0.3s transform. Never hide while the menu is open or focus is inside it. |
| Mega-menu: categories / links + descriptors / featured card | IBM (25% left rail, 14px descriptors, overlay) + HCL (glass panel, 8px offset, hover bridge) + Infosys (left category rail with active pill; tinted 20px-radius group boxes; full-screen sheet, which suits **mobile nav**) | Services, Industries, Insights | Panel full container width (1216px) as a 3/6/3 split of 12 cols: left category tabs, middle 2-col links each with a one-line 14px descriptor, right featured card (16:9 image + title + arrow link). Opens on click and also hover-intent (150ms delay), Esc closes, roving focus. Motion: overlay opacity 300ms `(.5,0,.1,1)`, panel y −8px→0 + fade 240ms. |
| "What we do" 3-pillar explorer | HCL expertise (sticky title 50% + rows) | Home section 2 | 12-col: sticky intro in cols 1–5, three pillar rows in 7–12. The active row expands (Motion `layout`) to show sub-services + arrow link, and a background image crossfades per pillar. Keyboard: buttons with `aria-expanded`. |
| Horizontal snap rails | **Infosys** (Swiper, 2.5 / 3.5 per view, 20px gap, full-bleed right, fraction + square arrows) + IBM carousel / HCL resources slider | Insights, case studies, events, related reads | Native `overflow-x:auto; scroll-snap-type:x mandatory`, cards `snap-start`, `scroll-padding-inline` = container margin. Like Infosys, **align the first card to the container but let the rail bleed off the right edge**. Two densities: **story rail 2.5 cards**, **compact rail 3.5 cards**, 20px gap; 1.15 cards (≈85vw) on mobile. Pointer drag via a small pointer-events handler (`cursor: grab`), with snapping left to CSS. Controls: 40px square arrows (8px radius, 1px border) + a "n / total" counter top-right of the heading, with the arrow disabled at each end. No autoplay. |
| Featured "focus" rail | Infosys top-stories rail | Home featured insights / case studies | 1.5 cards per view. Inactive cards `scale(.85)` and the active card 1, over 0.8s `power2.out`. Horizontal card (image ~36% + text, 16px radius). Slide 0.9s on desktop, 0.5s on mobile. Arrows + counter as above. Under reduced motion, drop the scale and use instant slides. |
| Overlap card | Infosys homepage case rail | Case-study rail, Insights | 16:10 image (12px radius), then a white panel ~92% wide that **overlaps the image by 32px**, 10px radius, soft tinted shadow `0 16px 24px rgb(brand/.2)`, category chip, 24px title clamped to 2 lines, arrow CTA pinned bottom-right. Whole card is one link. |
| Inset cinematic frame | Infosys hero + case/insight banners | Home hero; inner-page banners | Hero media sits inside a **10px page inset with a 16px radius**, which looks premium and frames the video. Inner pages reuse it as a short (~340px) inset banner with a brand gradient, breadcrumb and page-type label. Unlike Infosys: give the video a pause control, and don't hold the H1 back on load (it hurts LCP). |
| Metric-forward case cards | IBM homepage case card | Home "Impact", Case-study index | Card = logo + 24–28px headline, then a **tinted bottom band holding the metric at 40px / 600** + 16px label (bigger than IBM's 20px for more punch). 8px radius, whole card is one link, hover tints the band + border-draw over 700ms. Grid 1/2/3. |
| 12-col editorial grid + arrow-link CTAs | IBM grid / HCL arrow links | All inner pages | 12 cols, 24px gutter (32px at ≥1280). Eyebrow (13px caps) → H2 → body in cols 1–6 or 1–7. Text CTA = label + arrow; the arrow moves 4px right on hover over 200ms. Buttons only for primary actions. |
| Dark statement sections revealed on scroll | HCL stat band + IBM thick-stat | Between Services and Impact; About | Full-bleed near-black band, statement in 48–56px weight 300 spanning 8–10 cols. GSAP ScrollTrigger: lines split by **line** (not character), y 24px→0 + opacity, stagger 0.08, 0.7s `power3.out`, triggered once at 75% viewport. Background shifts from light to dark as the section enters (scrubbed). Stats count up once. |
| Greyscale → colour logo marquee | IBM logo ribbon + HCL infinite loop | Home trust strip, Partners | Logos at 144px wide, 48px tall boxes, `grayscale(1) opacity(.6)` → colour on hover over 300ms. CSS `translateX(-50%)` loop over **40s linear** on a duplicated list, `aria-hidden` on the duplicate, pause on hover/focus and under reduced motion (static wrap grid). |
| Industry tile grid + hover reveal | IBM tile group (1px-gap grid) | Home Industries, /industries | 4×2 grid with 1px gaps (hairlines). Tile 4:5 image with dark scrim and title at bottom. On hover/focus the scrim deepens, a 2-line descriptor + arrow slides up (y 16→0, 300ms), and the image scales 1.04. Touch shows the descriptor by default. |
| Global presence map | HCL global delivery network (nav) | About / Contact | Dotted SVG world map (static, under 40 KB), office pins as buttons. Selecting a region filters an office list on the right. Pins pulse once on reveal. No map tiles or JS map library. |
| Persistent CTA + closing CTA band | IBM "next steps" + HCL subscribe fold | Global / every page end | A "Talk to us" pill fixed bottom-right after 1 viewport of scroll (hidden near footer and over forms). Closing band: dark, H2 40px + 2 CTAs, 96px padding. |
| Sticky in-page secondary nav | HCL service/case pages | Service + case-study pages | Sticky under the header, anchor links with active underline via IntersectionObserver, horizontally scrollable on mobile. |
| Case-study page skeleton | HCL + IBM | /case-studies/[slug] | Hero → 3-up stat strip (IBM thick-stat scale) → Challenge / Solution / Impact alternating bands → pull quote → related rail → next-steps CTA. |

---

## 3. Measurements to adopt (starting tokens)

Rationale: both sites settle on 48px hero H1s at desktop. IBM goes to 60px only at ≥1584. HCL body is 18px, IBM 16px. We sit between them, with headings a little larger than HCL and IBM's light weight.

| Token | 1440px | 360px | Notes |
|---|---|---|---|
| Display / hero H1 | 64px / 1.05 / 300 | 36px / 1.1 | Above HCL and IBM, for the cinematic hero. `clamp(2.25rem, 1.4rem + 3.4vw, 4rem)`. Infosys goes to 7vw (~108px) / 1.0 / 300, but only for a 3–4 word line. Allow up to 88px when the hero line is that short. |
| H1 (inner page) | 48px / 1.1 / 300 | 32px / 1.15 | Matches HCL and IBM at 1312–1440 |
| H2 section | 40px / 1.15 / 400 | 28px / 1.2 | Between HCL 32 and IBM 48 |
| H3 card title | 24px / 1.3 / 500 | 20px / 1.3 | IBM case card is 28/36 |
| Stat numeral | 64px / 1.1 / 600 | 40px | IBM thick-stat is 60–76, HCL 48 |
| Card metric | 40px / 1.1 / 600 | 32px | |
| Lead / intro | 20px / 1.5 | 18px / 1.5 | HCL 20/1.4 |
| Body | 17px / 1.6 / 400 | 16px / 1.6 | Avoid HCL's weight 300 at body size |
| Small / descriptor | 14px / 1.45 | 14px | Mega-menu descriptors (IBM 14px) |
| Eyebrow | 13px / caps / +0.08em | 12px | |

- **Container:** max 1280px content (1344px with gutters). HCL uses 1216px of content and IBM 1584px. Side margin 16px (<640), 32px (≥768), 40px (≥1440).
- **Grid:** 12 cols. Gutter 16px (mobile), 24px (≥768), 32px (≥1280).
- **Section padding (vertical):** 96px desktop / 64px tablet / 48px mobile for standard sections; 128px / 80px for statement and closing bands; 64px for dense rails. HCL is 64/40 and IBM about 64, so ours is a bit more generous to read as premium.
- **Header:** 72px, 64px when condensed, 56px mobile. Mega-menu offset 8px.
- **Radius:** 8px cards and images (HCL), 6px buttons and inputs, 999px pills, 0 for full-bleed bands. IBM's 4px felt too utilitarian for this brief.
- **Hero:** `min(88svh, 820px)`. Copy max-width 760px (HCL 764px). One primary CTA plus one text link at most. Optional Infosys-style inset: 10px page padding and a 16px media radius.
- **Rails (Infosys):** 2.5 cards (story) / 3.5 cards (compact) per view, 20px gap, first card on the container edge and bleeding off the right, 1.15 cards on mobile. Arrows 40px square with 8px radius. Slide 300ms for normal rails; the featured rail uses 0.8s scale with inactive cards at .85.
- **Prose measure:** max 72ch (~720px at 18px). Infosys runs article prose ~1076px wide, which reads poorly.
- **Motion durations and easing:**
  - micro 150ms
  - hover/state 240ms `cubic-bezier(.2,0,.38,.9)`
  - panels/menus 300ms `cubic-bezier(.4,.14,.3,1)`
  - overlays 300ms `cubic-bezier(.5,0,.1,1)`
  - reveals 600–800ms `power3.out` with 60–80ms stagger
  - border-draw 700ms
  - hero story 7s linear
  - marquee 40s linear

---

## 4. Things to avoid

- **Eager image loading.** HCL lazy-loads only 2 of 93 images. Use `next/image` lazy loading by default; set `priority` only on the hero poster and LCP.
- **Tag bloat.** HCL loads 16 external scripts (ad and analytics pixels) and IBM 28. Load third parties via `next/script` `lazyOnload` behind consent, with at most 3 tags.
- **jQuery + slick carousels.** They are heavy, not native and lose scroll position. Use CSS scroll-snap plus a little JS instead.
- **`backdrop-filter: blur(50px)` on large fixed surfaces** (HCL header and mega-panel). It costs a lot to repaint while scrolling on mid-range Android. Keep blur at 12–16px, apply it to the header only, and fall back to a solid colour under `prefers-reduced-transparency` or on low-end devices.
- **Endless auto-moving content without a control.** HCL's 20s vertical image loops have no pause. Every autoplay (hero, marquee) needs a visible pause control (WCAG 2.2.2) and must stop under reduced motion. HCL handles reduced motion in only 2 rules, IBM in 1; we should honour it everywhere.
- **Gradient-clipped text on hover** for link labels. Contrast becomes unpredictable. Keep solid text and move colour to underlines or borders.
- **Weight-300 body copy at 16–18px** (HCL). It looks too light on Windows. Use 400 for body and save 300 for 40px+ display text.
- **Hover-only menus and reveals.** HCL opens on hover; IBM's click with `aria-expanded` is the model. Industry-tile descriptors must also show on focus and touch.
- **`role="tab"` on a play/pause button** (HCL). Use a `<button aria-pressed>` with a changing label.
- **Hero video as the LCP element.** Use a poster image as LCP, start the video after `requestIdleCallback`, and skip the video on Save-Data or slow connections.
- **Duplicate H1s or SEO-only `sr-only` H1s** (HCL hides its real H1). Use one visible H1 per page.
