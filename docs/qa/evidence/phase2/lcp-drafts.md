# LCP evidence drafts (2026-11-17T08:21:14.121Z)

Median run per URL, chosen by LCP, so the phases belong to the run whose LCP is quoted. Lighthouse mobile, simulated throttling.

| URL | Run | Perf | LCP | FCP | TBT | TTI | Render delay | fetchpriority=high | Script eval | Script KB | DOM |
|---|---|---|---|---|---|---|---|---|---|---|---|
| /gcc/ | drafts (3) | 89 | 3645 ms | 1670 ms | 58 ms | 4501 ms | 3188 ms | NO | 1513 ms | 214 KB | 1606 |
| /in/ | drafts (3) | 89 | 3639 ms | 1520 ms | 94 ms | 4421 ms | 3183 ms | NO | 1687 ms | 214 KB | 1608 |
| /insights/events/house-of-lords-2026 | drafts (3) | 94 | 3015 ms | 1365 ms | 53 ms | 3174 ms | 2474 ms | NO | 420 ms | 170 KB | 604 |
| /services/cloud-services | drafts (3) | 93 | 3164 ms | 1514 ms | 59 ms | 3271 ms | 1872 ms | NO | 677 ms | 219 KB | 1213 |
| /uk/ | drafts (3) | 89 | 3635 ms | 1518 ms | 124 ms | 4339 ms | 3179 ms | NO | 1506 ms | 214 KB | 1608 |

## /gcc/

### drafts

- LCP element: `<img alt="The Houses of Parliament and Big Ben at dusk" decoding="async" data-nimg="fill" `
- phases: TTFB 457 ms, Load Delay 0 ms, Load Time 0 ms, Render Delay 3188 ms
- LCP image checklist: fetchpriority=high NOT applied, discoverable in the HTML yes, lazy loading off yes
- observed in the trace: first paint 562 ms, FCP 562 ms, LCP 562 ms, load event 391 ms
- main thread: script evaluation n/a, total scripting across files 1513 ms
- transfer: script 214 KB, total 706 KB; DOM 1606 elements

## /in/

### drafts

- LCP element: `<img alt="The Houses of Parliament and Big Ben at dusk" decoding="async" data-nimg="fill" `
- phases: TTFB 457 ms, Load Delay 0 ms, Load Time 0 ms, Render Delay 3183 ms
- LCP image checklist: fetchpriority=high NOT applied, discoverable in the HTML yes, lazy loading off yes
- observed in the trace: first paint 513 ms, FCP 513 ms, LCP 513 ms, load event 396 ms
- main thread: script evaluation n/a, total scripting across files 1687 ms
- transfer: script 214 KB, total 706 KB; DOM 1608 elements

## /insights/events/house-of-lords-2026

### drafts

- LCP element: `<img alt="The Houses of Parliament seen from the Thames at dusk" decoding="async" data-nim`
- phases: TTFB 455 ms, Load Delay 0 ms, Load Time 86 ms, Render Delay 2474 ms
- LCP image checklist: fetchpriority=high NOT applied, discoverable in the HTML yes, lazy loading off yes
- observed in the trace: first paint 365 ms, FCP 365 ms, LCP 365 ms, load event 269 ms
- main thread: script evaluation n/a, total scripting across files 420 ms
- transfer: script 170 KB, total 366 KB; DOM 604 elements

## /services/cloud-services

### drafts

- LCP element: `<img alt="Server racks in a data centre" decoding="async" data-nimg="fill" class="object-c`
- phases: TTFB 455 ms, Load Delay 0 ms, Load Time 837 ms, Render Delay 1872 ms
- LCP image checklist: fetchpriority=high NOT applied, discoverable in the HTML yes, lazy loading off yes
- observed in the trace: first paint 319 ms, FCP 319 ms, LCP 353 ms, load event 286 ms
- main thread: script evaluation n/a, total scripting across files 677 ms
- transfer: script 219 KB, total 456 KB; DOM 1213 elements

## /uk/

### drafts

- LCP element: `<img alt="The Houses of Parliament and Big Ben at dusk" decoding="async" data-nimg="fill" `
- phases: TTFB 456 ms, Load Delay 0 ms, Load Time 0 ms, Render Delay 3179 ms
- LCP image checklist: fetchpriority=high NOT applied, discoverable in the HTML yes, lazy loading off yes
- observed in the trace: first paint 518 ms, FCP 518 ms, LCP 518 ms, load event 475 ms
- main thread: script evaluation n/a, total scripting across files 1506 ms
- transfer: script 214 KB, total 706 KB; DOM 1608 elements

