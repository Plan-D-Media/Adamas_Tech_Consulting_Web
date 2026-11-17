# Lighthouse (mobile) inner-pages http://localhost:3000 2026-11-17T18:12:18.364Z

Median of 3 runs per URL, run alone on the development laptop (Lighthouse CLI, default mobile emulation: Moto G Power, 4x CPU slowdown).

| URL | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI | DOM | Script | Images | Fonts |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /about | 92 | 100 | 96 | 69 | 3202 ms | 0.000 | 63 ms | 1544 ms | 1544 ms | 824 | 227 KB | 36 KB | 83 KB |
| /case-studies | 81 | 100 | 96 | 69 | 4576 ms | 0.000 | 134 ms | 1760 ms | 2319 ms | 856 | 227 KB | 123 KB | 83 KB |
| /case-studies/sap-treasury-cash-forecasting | 90 | 100 | 96 | 69 | 3275 ms | 0.000 | 176 ms | 1577 ms | 1853 ms | 764 | 233 KB | 25 KB | 83 KB |
| /about/careers | 93 | 100 | 96 | 69 | 3151 ms | 0.000 | 85 ms | 1557 ms | 1702 ms | 616 | 227 KB | 43 KB | 83 KB |

## /about
| Metric | Median |
|---|---|
| Performance | 92 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 3202 ms |
| CLS | 0.000 |
| TBT | 63 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1544 ms |
| Speed Index | 1544 ms |
| TTI | 3951 ms |
| DOM size | 824 elements |

Per-run performance: 93, 92, 92; TBT: 62, 63, 72 ms; LCP: 3128, 3235, 3202 ms.

LCP element: `<img alt="" fetchpriority="high" width="1920" height="530" decoding="async" data-nimg="1" class="absolute inset-0 -z-10 h-full w-full object-cover" style="color`

Transfer by type: document 36 KB, script 227 KB, stylesheet 23 KB, image 36 KB, font 83 KB, other 5 KB; requests 41.

Largest scripts:
- 71 KB /_next/static/chunks/0x3zgld0yn029.js
- 45 KB /_next/static/chunks/2a3-n6eympugl.js
- 28 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/2p2jd75im6m_h.js
- 13 KB /_next/static/chunks/24s7fydbdip0v.js
- 12 KB /_next/static/chunks/325dicgmrqshd.js
- 11 KB /_next/static/chunks/3bhhukh84qeph.js
- 10 KB /_next/static/chunks/2x5x846uwkg7a.js

Largest images:
- 20 KB /_next/image?url=%2Fmedia%2Fimages%2Fabout%2Fapproach-bg.webp&w=750&q=75
- 10 KB /_next/image?url=%2Fmedia%2Fimages%2Fabout%2Fhero-bg.webp&w=750&q=75
- 7 KB /media/brand/logo.avif
- 0 KB data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' colo…
- 0 KB data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' colo…
- 0 KB data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' colo…

Fonts: 25 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 21 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2

Main-thread work:
- Script Evaluation: 697 ms
- Style & Layout: 617 ms
- Other: 466 ms
- Script Parsing & Compilation: 126 ms
- Parse HTML & CSS: 60 ms
- Rendering: 57 ms
- Garbage Collection: 13 ms

Script evaluation by origin/file (bootup-time):
- /about: total 827 ms, scripting 23 ms
- /_next/static/chunks/0x3zgld0yn029.js: total 468 ms, scripting 396 ms
- /_next/static/chunks/2khblt934m9wm.js: total 348 ms, scripting 164 ms
- Unattributable: total 211 ms, scripting 7 ms
- /_next/static/chunks/2a3-n6eympugl.js: total 88 ms, scripting 59 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 3.2 s
- Max Potential First Input Delay: 160 ms
- Time to Interactive: 4.0 s
- Forced reflow: 
- Network dependency tree: 

## /case-studies

| Metric | Median |
|---|---|
| Performance | 81 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 4576 ms |
| CLS | 0.000 |
| TBT | 134 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1760 ms |
| Speed Index | 2319 ms |
| TTI | 4675 ms |
| DOM size | 856 elements |

Per-run performance: 81; TBT: 134 ms; LCP: 4576 ms.

LCP element: `<img alt="Real-time face recognition" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position: absolute; height: 100%; width: 100%`

Transfer by type: document 52 KB, script 227 KB, stylesheet 23 KB, image 123 KB, font 83 KB, other 5 KB; requests 59.

Largest scripts:
- 71 KB /_next/static/chunks/0x3zgld0yn029.js
- 45 KB /_next/static/chunks/2a3-n6eympugl.js
- 28 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/2p2jd75im6m_h.js
- 13 KB /_next/static/chunks/24s7fydbdip0v.js
- 12 KB /_next/static/chunks/325dicgmrqshd.js
- 11 KB /_next/static/chunks/3bhhukh84qeph.js
- 10 KB /_next/static/chunks/2x5x846uwkg7a.js

Largest images:
- 23 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Fsap-intercompany-reconciliation.webp&w=750&q=75
- 22 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Fcar-parking-lot.webp&w=750&q=75
- 19 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Finvoiceai-invoice-processing.webp&w=750&q=75
- 18 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Fsap-treasury-cash-forecasting.webp&w=750&q=75
- 12 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Fsap-bank-communication-management.webp&w=750&q=75
- 11 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Fsap-analytics-cloud-liquor.webp&w=750&q=75

Fonts: 25 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 21 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2

Main-thread work:
- Script Evaluation: 1144 ms
- Style & Layout: 914 ms
- Other: 714 ms
- Script Parsing & Compilation: 183 ms
- Rendering: 115 ms
- Parse HTML & CSS: 76 ms
- Garbage Collection: 26 ms

Script evaluation by origin/file (bootup-time):
- /case-studies: total 1271 ms, scripting 36 ms
- /_next/static/chunks/0x3zgld0yn029.js: total 816 ms, scripting 702 ms
- /_next/static/chunks/2khblt934m9wm.js: total 467 ms, scripting 220 ms
- Unattributable: total 330 ms, scripting 9 ms
- /_next/static/chunks/2a3-n6eympugl.js: total 164 ms, scripting 113 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 4.6 s
- Max Potential First Input Delay: 270 ms
- Time to Interactive: 4.7 s
- LCP request discovery: 

## /case-studies/sap-treasury-cash-forecasting

| Metric | Median |
|---|---|
| Performance | 90 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 3275 ms |
| CLS | 0.000 |
| TBT | 176 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1577 ms |
| Speed Index | 1853 ms |
| TTI | 3956 ms |
| DOM size | 764 elements |

Per-run performance: 90, 90; TBT: 154, 176 ms; LCP: 3275, 3256 ms.

LCP element: `<img alt="" fetchpriority="high" decoding="async" data-nimg="fill" class="-z-10 object-cover" style="position: absolute; height: 100%; width: 100%; inset: 0px;"`

Transfer by type: document 30 KB, script 233 KB, stylesheet 23 KB, image 25 KB, font 83 KB, other 5 KB; requests 40.

Largest scripts:
- 71 KB /_next/static/chunks/0x3zgld0yn029.js
- 45 KB /_next/static/chunks/2a3-n6eympugl.js
- 28 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/2p2jd75im6m_h.js
- 13 KB /_next/static/chunks/24s7fydbdip0v.js
- 12 KB /_next/static/chunks/325dicgmrqshd.js
- 11 KB /_next/static/chunks/3bhhukh84qeph.js
- 10 KB /_next/static/chunks/2x5x846uwkg7a.js

Largest images:
- 18 KB /_next/image?url=%2Fmedia%2Fimages%2Fcase-studies%2Fsap-treasury-cash-forecasting.webp&w=750&q=75
- 7 KB /media/brand/logo.avif
- 0 KB data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' colo…
- 0 KB data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' colo…
- 0 KB data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' colo…
- 0 KB data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' colo…

Fonts: 25 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 21 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2

Main-thread work:
- Script Evaluation: 1005 ms
- Style & Layout: 836 ms
- Other: 569 ms
- Script Parsing & Compilation: 156 ms
- Rendering: 75 ms
- Parse HTML & CSS: 68 ms
- Garbage Collection: 14 ms

Script evaluation by origin/file (bootup-time):
- /case-studies/sap-treasury-cash-forecasting: total 1127 ms, scripting 44 ms
- /_next/static/chunks/0x3zgld0yn029.js: total 681 ms, scripting 592 ms
- Unattributable: total 233 ms, scripting 10 ms
- /_next/static/chunks/2khblt934m9wm.js: total 230 ms, scripting 145 ms
- /_next/static/chunks/2p2jd75im6m_h.js: total 220 ms, scripting 80 ms
- /_next/static/chunks/2a3-n6eympugl.js: total 141 ms, scripting 102 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 3.3 s
- Max Potential First Input Delay: 250 ms
- Time to Interactive: 4.0 s
- Forced reflow: 
- Network dependency tree: 

## /about/careers

| Metric | Median |
|---|---|
| Performance | 93 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 69 (noindex on staging is expected) |
| LCP | 3151 ms |
| CLS | 0.000 |
| TBT | 85 ms |
| INP | not measured by lab Lighthouse (field metric) |
| FCP | 1557 ms |
| Speed Index | 1702 ms |
| TTI | 3932 ms |
| DOM size | 616 elements |

Per-run performance: 93; TBT: 85 ms; LCP: 3151 ms.

LCP element: `<img alt="" fetchpriority="high" width="1920" height="530" decoding="async" data-nimg="1" class="absolute inset-0 -z-10 h-full w-full object-cover" style="color`

Transfer by type: document 39 KB, script 227 KB, stylesheet 23 KB, image 43 KB, font 83 KB, other 5 KB; requests 35.

Largest scripts:
- 71 KB /_next/static/chunks/0x3zgld0yn029.js
- 45 KB /_next/static/chunks/2a3-n6eympugl.js
- 28 KB /_next/static/chunks/2khblt934m9wm.js
- 18 KB /_next/static/chunks/2p2jd75im6m_h.js
- 13 KB /_next/static/chunks/24s7fydbdip0v.js
- 12 KB /_next/static/chunks/325dicgmrqshd.js
- 11 KB /_next/static/chunks/3bhhukh84qeph.js
- 10 KB /_next/static/chunks/2x5x846uwkg7a.js

Largest images:
- 25 KB /_next/image?url=%2Fmedia%2Fimages%2Fhome%2Fcontact-photo.webp&w=750&q=75
- 10 KB /_next/image?url=%2Fmedia%2Fimages%2Fabout%2Fhero-bg.webp&w=750&q=75
- 7 KB /media/brand/logo.avif
- 1 KB /media/flags/in@2x.avif

Fonts: 25 KB 82450a180bcad83c-s.p.0p-wng2nn8o-p.woff2, 21 KB cb4b92673aedbbad-s.0-95eo-012xnf.woff2, 37 KB c5f006ccf96c15fe-s.0a0h245ktd4x0.woff2

Main-thread work:
- Script Evaluation: 864 ms
- Style & Layout: 567 ms
- Other: 521 ms
- Script Parsing & Compilation: 141 ms
- Rendering: 60 ms
- Parse HTML & CSS: 49 ms
- Garbage Collection: 14 ms

Script evaluation by origin/file (bootup-time):
- /about/careers: total 785 ms, scripting 21 ms
- /_next/static/chunks/2khblt934m9wm.js: total 387 ms, scripting 195 ms
- /_next/static/chunks/0x3zgld0yn029.js: total 357 ms, scripting 290 ms
- /_next/static/chunks/2a3-n6eympugl.js: total 323 ms, scripting 288 ms
- Unattributable: total 250 ms, scripting 9 ms

Failing performance audits in the median run:
- Largest Contentful Paint: 3.2 s
- Max Potential First Input Delay: 200 ms
- Time to Interactive: 3.9 s
- Forced reflow: 

