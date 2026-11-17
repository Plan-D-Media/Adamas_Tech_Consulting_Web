# Solutions redirect map (scope change, 17 November 2026)

Swayang's decision: solutions get no pages on this site. Every solution links out to its own website, so every URL
that used to point at a solution page needs a new home. This is the complete map, for sign-off. Nothing else in the
redirect table changed.

Source of truth: `content/redirects.ts` (compiled to `lib/generated/redirects.json` by the seed) and the `/solutions`
rule in `proxy.ts`. All of it is reversible in one seed edit.

## 1. Old WordPress URLs that pointed at a solution

One row only. The old page is an SAP Treasury, Investment and Cash Management implementation, so its nearest live
page is the SAP service page. One hop, 301.

| Old URL (live site today) | Was going to | Now goes to | Why |
|---|---|---|---|
| `/sap-treasury-investment-and-cash-management-implementation/` | `/solutions/asset-tracking` | `/services/digital-transformation/sap` | Nearest live page. The Asset Tracking solution has no page here, and no website URL has been supplied for it yet. |

The old page's copy is not lost: it is still the Asset Tracking solution's card copy in the database, ready to
publish the moment its website URL arrives.

## 2. Internal slug renames, removed

These four rows redirected one prototype URL to another prototype URL inside `/solutions`. Neither side was ever
public, and `/solutions/<anything>` is now handled by the rule in section 3, so the rows were deleted.

| Removed row | Was going to |
|---|---|
| `/solutions/ai-product-a` | `/solutions/a-eye` |
| `/solutions/ai-product-b` | `/solutions/air-mind` |
| `/solutions/smart-parking` | `/solutions/industrial-analytics` |
| `/solutions/cash-forecasting` | `/solutions/asset-tracking` |

## 3. `/solutions` and everything under it

Handled in `proxy.ts`, not in the redirect table, because the target depends on the visitor's region and a static
table cannot express that.

| Request | Response | Notes |
|---|---|---|
| `/solutions` | 301 to `/<region>/#products-solutions` | Region from the `region` cookie; the legacy `ae` cookie maps to `gcc`; no cookie means the CDN country, then `DEFAULT_REGION`. |
| `/solutions/` | the same, after the trailing slash is normalised | |
| `/solutions/<anything>` | 301 to `/<region>/#products-solutions` | Covers every old prototype slug and anything a search engine still holds. |
| `/solutions?utm_source=x` | 301 to `/<region>/?utm_source=x#products-solutions` | The query string survives the hop. |

`#products-solutions` is the Products & Solutions section of the regional homepage (`lib/anchors.ts`, rendered by
`components/home/Solutions.tsx`). The response carries `Vary: Cookie, CloudFront-Viewer-Country`, so a CDN cannot
serve one region's redirect to another region's visitor.

The same `/solutions` URL is what every "All solutions" link in the header, the mega menu, the mobile drawer and the
footer points at. That keeps one URL for the idea of "all solutions", keeps those links working with JavaScript off,
and means the region is resolved at request time rather than baked into the HTML.

`/solutions` is no longer in the sitemap: a sitemap must list only canonical URLs that answer 200.

## 4. What this leaves pointing outwards

| Link | Target | Status |
|---|---|---|
| Arivoo (menu, card, footer, homepage story card) | `https://arivoo.in` | Published |
| Arivoo UMS | `https://arivoo.in/arivoo-ums` | Published |
| Arivoo SMS | `https://arivoo.in/arivoo-sms` | Published |
| Arivoo LMS | `https://arivoo.in/arivoo-lms` | Published |
| TestGUARD | `https://arivoo.in/testguard` | Published (now a fourth Arivoo module) |
| A-EYE, AIR-MIND, Face Recognition Security, Industrial Analytics, Asset Tracking, AI solutions 4 to 6 | none supplied | Not published, waiting on a website URL |

The header mega menu still uses `arivoo.in/arivoo-ums`, `/arivoo-sms` and `/arivoo-lms` (the sitemap's URLs). The
current live site's header uses `/sms` and `/lms` instead, and labels UMS "Coming soon" with no link at all. Worth
one line of confirmation from the client.
