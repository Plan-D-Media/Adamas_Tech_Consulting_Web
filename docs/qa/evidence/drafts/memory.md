# Memory pass drafts (http://localhost:3100) 2026-11-16T06:13:47.612Z

| Step | Route | Mode | Heap MB (after GC) | DOM nodes | Listeners | Script ms since previous |
|---|---|---|---|---|---|---|
| 0 | /in/ | initial load | 5.6 | 2574 | 706 | 319 |
| 1 | /services/cloud-services | client nav | 6.8 | 5026 | 1076 | 76 |
| 2 | /uk/ | client nav | 8.1 | 7295 | 1473 | 157 |
| 3 | /services/cloud-services/migration-modernization | client nav | 8.4 | 7663 | 1483 | 45 |
| 4 | /insights/events/house-of-lords-2026 | client nav | 8.7 | 7838 | 1499 | 36 |
| 5 | /gcc/ | client nav | 9 | 7872 | 1538 | 194 |
| 6 | /about | client nav | 9.2 | 7870 | 1515 | 39 |
| 7 | /services/digital-transformation | client nav | 9.4 | 8582 | 1582 | 39 |
| 8 | /solutions | client nav | 9.4 | 8449 | 1575 | 27 |
| 9 | /case-studies | client nav | 9.5 | 8498 | 1592 | 32 |
| 10 | /in/ | client nav | 9.6 | 8521 | 1618 | 157 |
| 11 | /services/ai-services | client nav | 9.9 | 9349 | 1677 | 48 |
| 12 | /insights/events | client nav | 9.9 | 9320 | 1668 | 24 |
| 13 | /uk/ | client nav | 10 | 9345 | 1694 | 155 |
| 14 | /services/cloud-services/devops-secops | client nav | 10.2 | 9792 | 1711 | 51 |
| 15 | /credentials | client nav | 10.2 | 9737 | 1691 | 25 |
| 16 | /gcc/ | client nav | 10.2 | 9759 | 1722 | 179 |
| 17 | /solutions/arivoo | client nav | 10.2 | 9734 | 1691 | 38 |
| 18 | /privacy-policy | client nav | 9.2 | 6365 | 1364 | 27 |
| 19 | /in/ | client nav | 9.2 | 6389 | 1392 | 150 |
| 20 | /services/cloud-services | client nav | 9.5 | 7524 | 1471 | 53 |
| 21 | /uk/ | client nav | 9.5 | 7543 | 1495 | 159 |

- Heap after GC: 5.6 MB at the start, 9.5 MB after 21 navigations (3.9 MB change).
- /in/ visited 3 times: heap 5.6 -> 9.6 -> 9.2 MB, nodes 2574 -> 8521 -> 6389, listeners 706 -> 1618 -> 1392.
- Idle 10 s on the last page (pointer parked): script 363 ms, 603 layouts, 602 style recalcs.
- Console errors during the pass: none.

Reading: a leak shows as heap and listener counts rising on every return to the same route; a render loop shows as hundreds of ms of script per second while idle.
