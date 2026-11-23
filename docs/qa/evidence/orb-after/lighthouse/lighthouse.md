# Lighthouse (mobile) orb-after http://localhost:3100 2026-11-23T11:48:10.628Z

Median of 3 runs per URL, run alone on the development laptop (Lighthouse CLI, default mobile emulation: Moto G Power, 4x CPU slowdown).

| URL | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI | DOM | Script | Images | Fonts |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /in/ | 87 | 100 | 100 | 69 | 3904 ms | 0.001 | 75 ms | 1702 ms | 1957 ms | 1167 | 231 KB | 224 KB | 83 KB |

## /in/
| Metric | Median |
|---|---|
| Performance | 87 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 3904 ms |
| CLS | 0.001 |
| TBT | 75 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1702 ms |
| Speed Index | 1957 ms |
| TTI | 4713 ms |
| DOM size | 1167 elements |

Per-run performance: 80, 87, 87; TBT: 157, 75, 66 ms; LCP: 4665, 3904, 3886 ms.

LCP element: `<img alt="A student holding a laptop and books on campus" decoding="sync" data-nimg="fill" class="object-cover" style="position: absolute; height: 100%; width: `

Transfer by type: document 52 KB, script 231 KB, stylesheet 27 KB, image 224 KB, font 83 KB, other 24 KB; requests 48.

Largest scripts:
- 71 KB /_next/static/chunks/0x3zgld0yn029.js
- 45 KB /_next/static/chunks/2a3-n6eympugl.js
- 28 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/2p2jd75im6m_h.js
- 13 KB /_next/static/chunks/2y3r5eibnxf88.js
- 13 KB /_next/static/chunks/00miubta9uw2k.js
- 11 KB /_next/static/chunks/06lmyads1w__u.js
- 10 KB /_next/static/chunks/2x5x846uwkg7a.js

Largest images:
- 125 KB /media/images/home/presence-map.webp
- 23 KB /_next/image?url=%2Fmedia%2Fimages%2Fservices%2Fcloud-services.webp&w=750&q=75
- 17 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fabout-team.webp&w=750&q=75
- 11 KB /media/brand/logo.svg
- 8 KB /media/images/home/industries-bg.webp
- 8 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fhero-card-arivoo.webp&w=640&q=75

Fonts: 25 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2, 21 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2

Main-thread work:
- Style & Layout: 1063 ms
- Other: 1031 ms
- Script Evaluation: 911 ms
- Rendering: 286 ms
- Parse HTML & CSS: 111 ms
- Script Parsing & Compilation: 104 ms
- Garbage Collection: 19 ms

Script evaluation by origin/file (bootup-time):
- /in/: total 1390 ms, scripting 32 ms
- /_next/static/chunks/2khblt934m9wm.js: total 860 ms, scripting 209 ms
- /_next/static/chunks/0x3zgld0yn029.js: total 490 ms, scripting 343 ms
- Unattributable: total 383 ms, scripting 10 ms
- /_next/static/chunks/0uk63h0tuavo5.js: total 178 ms, scripting 176 ms
- /_next/static/chunks/2a3-n6eympugl.js: total 94 ms, scripting 69 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 3.9 s
- Max Potential First Input Delay: 170 ms
- Time to Interactive: 4.6 s
- Forced reflow: 
- LCP request discovery: 
- Network dependency tree: 

