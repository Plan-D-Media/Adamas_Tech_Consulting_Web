# Lighthouse (mobile) drafts http://localhost:3100 2026-11-16T06:29:51.154Z

Median of 3 runs per URL, run alone on the development laptop (Lighthouse CLI, default mobile emulation: Moto G Power, 4x CPU slowdown).

| URL | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI | DOM | Script | Images | Fonts |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /in/ | 89 | 100 | 100 | 69 | 3639 ms | 0.000 | 94 ms | 1520 ms | 1878 ms | 1608 | 214 KB | 297 KB | 81 KB |
| /uk/ | 89 | 100 | 100 | 69 | 3635 ms | 0.000 | 124 ms | 1518 ms | 1898 ms | 1608 | 214 KB | 297 KB | 81 KB |
| /gcc/ | 89 | 100 | 100 | 69 | 3645 ms | 0.001 | 62 ms | 1518 ms | 1921 ms | 1606 | 214 KB | 297 KB | 81 KB |
| /services/cloud-services | 93 | 100 | 96 | 69 | 3164 ms | 0.000 | 80 ms | 1514 ms | 1514 ms | 1213 | 219 KB | 54 KB | 81 KB |
| /insights/events/house-of-lords-2026 | 94 | 100 | 96 | 69 | 3015 ms | 0.000 | 50 ms | 1365 ms | 1365 ms | 604 | 170 KB | 32 KB | 81 KB |

## /in/
| Metric | Median |
|---|---|
| Performance | 89 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 3639 ms |
| CLS | 0.000 |
| TBT | 94 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1520 ms |
| Speed Index | 1878 ms |
| TTI | 4387 ms |
| DOM size | 1608 elements |

Per-run performance: 89, 89, 88; TBT: 88, 94, 135 ms; LCP: 3652, 3639, 3639 ms.

LCP element: `<img alt="The Houses of Parliament and Big Ben at dusk" decoding="async" data-nimg="fill" class="object-cover" style="position: absolute; height: 100%; width: 1`

Transfer by type: document 61 KB, script 214 KB, stylesheet 20 KB, image 297 KB, font 81 KB, other 15 KB; requests 50.

Largest scripts:
- 70 KB /_next/static/chunks/3gjfgdn2oppok.js
- 45 KB /_next/static/chunks/2p-md9k6el63r.js
- 27 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/0wmbjntx9mglf.js
- 17 KB /_next/static/chunks/2p2jd75im6m_h.js
- 11 KB /_next/static/chunks/0u2vt5pcamdv9.js
- 9 KB /_next/static/chunks/0p95iqj6bwbvk.js
- 5 KB /_next/static/chunks/2zfto7c_a6cyg.js

Largest images:
- 125 KB /media/images/home/presence-map.webp
- 33 KB /media/images/home/story-wave.webp
- 26 KB /_next/image?url=%2Fmedia%2Fimages%2Fevents%2Fhouse-of-lords-keynote.webp&w=750&q=75
- 19 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fstory-adamas-building.webp&w=750&q=75
- 18 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Fsap-treasury-cash-forecasting.webp&w=750&q=75
- 17 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fabout-team.webp&w=750&q=75

Fonts: 24 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2, 20 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2

Main-thread work:
- Script Evaluation: 1499 ms
- Other: 912 ms
- Style & Layout: 806 ms
- Rendering: 232 ms
- Script Parsing & Compilation: 81 ms
- Parse HTML & CSS: 68 ms
- Garbage Collection: 13 ms

Script evaluation by origin/file (bootup-time):
- /_next/static/chunks/3gjfgdn2oppok.js: total 1269 ms, scripting 1165 ms
- /in/: total 1081 ms, scripting 25 ms
- /_next/static/chunks/2khblt934m9wm.js: total 638 ms, scripting 159 ms
- Unattributable: total 419 ms, scripting 7 ms
- /_next/static/chunks/2p-md9k6el63r.js: total 100 ms, scripting 78 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 3.7 s
- Time to Interactive: 4.4 s
- Forced reflow: 
- LCP request discovery: 
- Network dependency tree: 

## /uk/

| Metric | Median |
|---|---|
| Performance | 89 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 3635 ms |
| CLS | 0.000 |
| TBT | 124 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1518 ms |
| Speed Index | 1898 ms |
| TTI | 4349 ms |
| DOM size | 1608 elements |

Per-run performance: 88, 89, 89; TBT: 136, 105, 124 ms; LCP: 3635, 3653, 3635 ms.

LCP element: `<img alt="The Houses of Parliament and Big Ben at dusk" decoding="async" data-nimg="fill" class="object-cover" style="position: absolute; height: 100%; width: 1`

Transfer by type: document 61 KB, script 214 KB, stylesheet 20 KB, image 297 KB, font 81 KB, other 15 KB; requests 50.

Largest scripts:
- 70 KB /_next/static/chunks/3gjfgdn2oppok.js
- 45 KB /_next/static/chunks/2p-md9k6el63r.js
- 27 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/0wmbjntx9mglf.js
- 17 KB /_next/static/chunks/2p2jd75im6m_h.js
- 11 KB /_next/static/chunks/0u2vt5pcamdv9.js
- 9 KB /_next/static/chunks/0p95iqj6bwbvk.js
- 5 KB /_next/static/chunks/2zfto7c_a6cyg.js

Largest images:
- 125 KB /media/images/home/presence-map.webp
- 33 KB /media/images/home/story-wave.webp
- 26 KB /_next/image?url=%2Fmedia%2Fimages%2Fevents%2Fhouse-of-lords-keynote.webp&w=750&q=75
- 19 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fstory-adamas-building.webp&w=750&q=75
- 18 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Fsap-treasury-cash-forecasting.webp&w=750&q=75
- 17 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fabout-team.webp&w=750&q=75

Fonts: 24 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2, 20 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2

Main-thread work:
- Script Evaluation: 1764 ms
- Style & Layout: 993 ms
- Other: 928 ms
- Rendering: 241 ms
- Script Parsing & Compilation: 103 ms
- Parse HTML & CSS: 78 ms
- Garbage Collection: 25 ms

Script evaluation by origin/file (bootup-time):
- /_next/static/chunks/3gjfgdn2oppok.js: total 1506 ms, scripting 1349 ms
- /uk/: total 1252 ms, scripting 30 ms
- /_next/static/chunks/2khblt934m9wm.js: total 668 ms, scripting 198 ms
- Unattributable: total 397 ms, scripting 9 ms
- /_next/static/chunks/2p-md9k6el63r.js: total 132 ms, scripting 96 ms
- /_next/static/chunks/0u2vt5pcamdv9.js: total 89 ms, scripting 32 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 3.7 s
- Max Potential First Input Delay: 180 ms
- Time to Interactive: 4.4 s
- Forced reflow: 
- LCP request discovery: 
- Network dependency tree: 

## /gcc/

| Metric | Median |
|---|---|
| Performance | 89 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 3645 ms |
| CLS | 0.001 |
| TBT | 62 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1518 ms |
| Speed Index | 1921 ms |
| TTI | 4446 ms |
| DOM size | 1606 elements |

Per-run performance: 90, 89, 86; TBT: 62, 58, 200 ms; LCP: 3617, 3645, 3651 ms.

LCP element: `<img alt="The Houses of Parliament and Big Ben at dusk" decoding="async" data-nimg="fill" class="object-cover" style="position: absolute; height: 100%; width: 1`

Transfer by type: document 60 KB, script 214 KB, stylesheet 20 KB, image 297 KB, font 81 KB, other 15 KB; requests 50.

Largest scripts:
- 70 KB /_next/static/chunks/3gjfgdn2oppok.js
- 45 KB /_next/static/chunks/2p-md9k6el63r.js
- 27 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/0wmbjntx9mglf.js
- 17 KB /_next/static/chunks/2p2jd75im6m_h.js
- 11 KB /_next/static/chunks/0u2vt5pcamdv9.js
- 9 KB /_next/static/chunks/0p95iqj6bwbvk.js
- 5 KB /_next/static/chunks/2zfto7c_a6cyg.js

Largest images:
- 125 KB /media/images/home/presence-map.webp
- 33 KB /media/images/home/story-wave.webp
- 26 KB /_next/image?url=%2Fmedia%2Fimages%2Fevents%2Fhouse-of-lords-keynote.webp&w=750&q=75
- 19 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fstory-adamas-building.webp&w=750&q=75
- 18 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Fsap-treasury-cash-forecasting.webp&w=750&q=75
- 17 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fabout-team.webp&w=750&q=75

Fonts: 24 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 20 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2

Main-thread work:
- Script Evaluation: 1563 ms
- Style & Layout: 1018 ms
- Other: 830 ms
- Rendering: 248 ms
- Script Parsing & Compilation: 112 ms
- Parse HTML & CSS: 87 ms
- Garbage Collection: 11 ms

Script evaluation by origin/file (bootup-time):
- /gcc/: total 1329 ms, scripting 30 ms
- /_next/static/chunks/3gjfgdn2oppok.js: total 1288 ms, scripting 1188 ms
- /_next/static/chunks/2khblt934m9wm.js: total 656 ms, scripting 175 ms
- Unattributable: total 316 ms, scripting 7 ms
- /_next/static/chunks/2p-md9k6el63r.js: total 119 ms, scripting 85 ms
- /_next/static/chunks/0u2vt5pcamdv9.js: total 68 ms, scripting 27 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 3.6 s
- Max Potential First Input Delay: 150 ms
- Time to Interactive: 4.5 s
- LCP request discovery: 
- Network dependency tree: 

## /services/cloud-services

| Metric | Median |
|---|---|
| Performance | 93 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 3164 ms |
| CLS | 0.000 |
| TBT | 80 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1514 ms |
| Speed Index | 1514 ms |
| TTI | 3683 ms |
| DOM size | 1213 elements |

Per-run performance: 93, 93, 92; TBT: 59, 125, 80 ms; LCP: 3164, 2967, 3179 ms.

LCP element: `<img alt="Server racks in a data centre" decoding="async" data-nimg="fill" class="object-cover" style="position: absolute; height: 100%; width: 100%; inset: 0px`

Transfer by type: document 41 KB, script 219 KB, stylesheet 20 KB, image 54 KB, font 81 KB, other 15 KB; requests 32.

Largest scripts:
- 70 KB /_next/static/chunks/3gjfgdn2oppok.js
- 45 KB /_next/static/chunks/2p-md9k6el63r.js
- 27 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/0wmbjntx9mglf.js
- 17 KB /_next/static/chunks/2p2jd75im6m_h.js
- 11 KB /_next/static/chunks/0u2vt5pcamdv9.js
- 9 KB /_next/static/chunks/0p95iqj6bwbvk.js
- 7 KB /_next/static/chunks/3fhbwmshbgto4.js

Largest images:
- 16 KB /_next/image?url=%2Fmedia%2Fimages%2Fservices%2Fcloud%2Fhero.webp&w=750&q=75
- 16 KB /_next/image?url=%2Fmedia%2Fimages%2Fservices%2Fcloud%2Fintro.webp&w=750&q=75
- 6 KB /media/brand/logo.avif
- 4 KB /_next/image?url=%2Fmedia%2Fimages%2Fservices%2Fstat-gear-1.webp&w=384&q=75
- 4 KB /_next/image?url=%2Fmedia%2Fimages%2Fservices%2Fstat-gear-3.webp&w=384&q=75
- 4 KB /_next/image?url=%2Fmedia%2Fimages%2Fservices%2Fstat-gear-2.webp&w=384&q=75

Fonts: 24 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 20 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2

Main-thread work:
- Style & Layout: 711 ms
- Script Evaluation: 700 ms
- Other: 436 ms
- Script Parsing & Compilation: 118 ms
- Rendering: 64 ms
- Parse HTML & CSS: 59 ms

Script evaluation by origin/file (bootup-time):
- /services/cloud-services: total 933 ms, scripting 20 ms
- /_next/static/chunks/3gjfgdn2oppok.js: total 295 ms, scripting 251 ms
- /_next/static/chunks/2p-md9k6el63r.js: total 268 ms, scripting 240 ms
- /_next/static/chunks/2p2jd75im6m_h.js: total 243 ms, scripting 106 ms
- Unattributable: total 187 ms, scripting 7 ms
- /_next/static/chunks/2khblt934m9wm.js: total 104 ms, scripting 53 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 3.2 s
- Max Potential First Input Delay: 170 ms
- Forced reflow: 
- LCP request discovery: 
- Network dependency tree: 

## /insights/events/house-of-lords-2026

| Metric | Median |
|---|---|
| Performance | 94 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 3015 ms |
| CLS | 0.000 |
| TBT | 50 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1365 ms |
| Speed Index | 1365 ms |
| TTI | 3172 ms |
| DOM size | 604 elements |

Per-run performance: 94, 94, 94; TBT: 50, 53, 48 ms; LCP: 3057, 3015, 3014 ms.

LCP element: `<img alt="The Houses of Parliament seen from the Thames at dusk" decoding="async" data-nimg="fill" class="object-cover opacity-60" style="position: absolute; he`

Transfer by type: document 23 KB, script 170 KB, stylesheet 20 KB, image 32 KB, font 81 KB, other 15 KB; requests 23.

Largest scripts:
- 70 KB /_next/static/chunks/3gjfgdn2oppok.js
- 45 KB /_next/static/chunks/2p-md9k6el63r.js
- 18 KB /_next/static/chunks/0wmbjntx9mglf.js
- 11 KB /_next/static/chunks/0u2vt5pcamdv9.js
- 9 KB /_next/static/chunks/0p95iqj6bwbvk.js
- 5 KB /_next/static/chunks/2zfto7c_a6cyg.js
- 4 KB /_next/static/chunks/turbopack-3-ry682tkyiqk.js
- 3 KB /_next/static/chunks/1kexj4s7oxhs2.js

Largest images:
- 26 KB /_next/image?url=%2Fmedia%2Fimages%2Fevents%2Fhouse-of-lords-keynote.webp&w=750&q=75
- 6 KB /media/brand/logo.avif
- 0 KB data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' colo…

Fonts: 24 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2, 20 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2

Main-thread work:
- Script Evaluation: 423 ms
- Style & Layout: 401 ms
- Other: 219 ms
- Script Parsing & Compilation: 94 ms
- Parse HTML & CSS: 42 ms
- Rendering: 36 ms
- Garbage Collection: 11 ms

Script evaluation by origin/file (bootup-time):
- /insights/events/house-of-lords-2026: total 556 ms, scripting 17 ms
- /_next/static/chunks/3gjfgdn2oppok.js: total 371 ms, scripting 333 ms
- Unattributable: total 166 ms, scripting 6 ms
- /_next/static/chunks/2p-md9k6el63r.js: total 79 ms, scripting 52 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 3.1 s
- Max Potential First Input Delay: 150 ms
- LCP request discovery: 
- Network dependency tree: 

