# Lighthouse (mobile) orb-before http://localhost:3100 2026-11-23T11:16:45.448Z

Median of 3 runs per URL, run alone on the development laptop (Lighthouse CLI, default mobile emulation: Moto G Power, 4x CPU slowdown).

| URL | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI | DOM | Script | Images | Fonts |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /in/ | 86 | 100 | 100 | 69 | 4013 ms | 0.001 | 100 ms | 1833 ms | 3230 ms | 1165 | 228 KB | 224 KB | 83 KB |

## /in/
| Metric | Median |
|---|---|
| Performance | 86 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 4013 ms |
| CLS | 0.001 |
| TBT | 100 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1833 ms |
| Speed Index | 3230 ms |
| TTI | 4866 ms |
| DOM size | 1165 elements |

Per-run performance: 85, 86; TBT: 100, 75 ms; LCP: 3944, 4013 ms.

LCP element: `<img alt="A student holding a laptop and books on campus" decoding="sync" data-nimg="fill" class="object-cover" style="position: absolute; height: 100%; width: `

Transfer by type: document 52 KB, script 228 KB, stylesheet 26 KB, image 224 KB, font 83 KB, other 24 KB; requests 46.

Largest scripts:
- 71 KB /_next/static/chunks/0x3zgld0yn029.js
- 45 KB /_next/static/chunks/2a3-n6eympugl.js
- 28 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/2p2jd75im6m_h.js
- 13 KB /_next/static/chunks/00miubta9uw2k.js
- 11 KB /_next/static/chunks/06lmyads1w__u.js
- 11 KB /_next/static/chunks/2xb2c8mhgdu0u.js
- 10 KB /_next/static/chunks/2x5x846uwkg7a.js

Largest images:
- 125 KB /media/images/home/presence-map.webp
- 23 KB /_next/image?url=%2Fmedia%2Fimages%2Fservices%2Fcloud-services.webp&w=750&q=75
- 17 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fabout-team.webp&w=750&q=75
- 11 KB /media/brand/logo.svg
- 8 KB /media/images/home/industries-bg.webp
- 8 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fhero-card-arivoo.webp&w=640&q=75

Fonts: 25 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 21 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2

Main-thread work:
- Other: 1185 ms
- Style & Layout: 908 ms
- Script Evaluation: 808 ms
- Rendering: 397 ms
- Script Parsing & Compilation: 138 ms
- Parse HTML & CSS: 58 ms
- Garbage Collection: 20 ms

Script evaluation by origin/file (bootup-time):
- /in/: total 1375 ms, scripting 34 ms
- /_next/static/chunks/2khblt934m9wm.js: total 1047 ms, scripting 192 ms
- /_next/static/chunks/0x3zgld0yn029.js: total 556 ms, scripting 459 ms
- Unattributable: total 342 ms, scripting 14 ms
- /_next/static/chunks/2a3-n6eympugl.js: total 85 ms, scripting 53 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 4.0 s
- Max Potential First Input Delay: 140 ms
- Time to Interactive: 4.6 s
- Forced reflow: 
- LCP request discovery: 
- Network dependency tree: 

