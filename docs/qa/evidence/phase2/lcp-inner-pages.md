# LCP evidence inner-pages (2026-11-17T18:17:53.158Z)

Median run per URL, chosen by LCP, so the phases belong to the run whose LCP is quoted. Lighthouse mobile, simulated throttling.

| URL | Run | Perf | LCP | FCP | TBT | TTI | Render delay | fetchpriority=high | Script eval | Script KB | DOM |
|---|---|---|---|---|---|---|---|---|---|---|---|
| /about | inner-pages (3) | 92 | 3202 ms | 1539 ms | 72 ms | 4000 ms | 2689 ms | yes | 742 ms | 227 KB | 824 |
| /about/careers | inner-pages (3) | 0 | n/a | n/a | n/a | n/a | n/a | n/a | 0 ms | 227 KB | 616 |
| /case-studies | inner-pages (3) | 0 | n/a | n/a | n/a | n/a | n/a | n/a | 0 ms | 227 KB | 856 |
| /case-studies/sap-treasury-cash-forecasting | inner-pages (3) | 90 | 3256 ms | 1552 ms | 176 ms | 3938 ms | 2447 ms | yes | 943 ms | 233 KB | 764 |

## /about

### inner-pages

- LCP element: `<img alt="" fetchpriority="high" width="1920" height="530" decoding="async" data-nimg="1" `
- phases: TTFB 463 ms, Load Delay 0 ms, Load Time 50 ms, Render Delay 2689 ms
- LCP image checklist: fetchpriority=high applied, discoverable in the HTML yes, lazy loading off yes
- observed in the trace: first paint 466 ms, FCP 466 ms, LCP 466 ms, load event 394 ms
- main thread: script evaluation n/a, total scripting across files 742 ms
- transfer: script 227 KB, total 441 KB; DOM 824 elements

## /about/careers

### inner-pages

- LCP element: `not reported`
- phases: not reported
- LCP image checklist: fetchpriority=high NOT applied, discoverable in the HTML no, lazy loading off no
- observed in the trace: first paint n/a, FCP n/a, LCP n/a, load event n/a
- main thread: script evaluation n/a, total scripting across files 0 ms
- transfer: script 227 KB, total 461 KB; DOM 616 elements

## /case-studies

### inner-pages

- LCP element: `not reported`
- phases: not reported
- LCP image checklist: fetchpriority=high NOT applied, discoverable in the HTML no, lazy loading off no
- observed in the trace: first paint n/a, FCP n/a, LCP n/a, load event n/a
- main thread: script evaluation n/a, total scripting across files 0 ms
- transfer: script 227 KB, total 552 KB; DOM 856 elements

## /case-studies/sap-treasury-cash-forecasting

### inner-pages

- LCP element: `<img alt="" fetchpriority="high" decoding="async" data-nimg="fill" class="-z-10 object-cov`
- phases: TTFB 467 ms, Load Delay 0 ms, Load Time 341 ms, Render Delay 2447 ms
- LCP image checklist: fetchpriority=high applied, discoverable in the HTML yes, lazy loading off yes
- observed in the trace: first paint 632 ms, FCP 632 ms, LCP 632 ms, load event 498 ms
- main thread: script evaluation n/a, total scripting across files 943 ms
- transfer: script 233 KB, total 439 KB; DOM 764 elements

