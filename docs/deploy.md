# Deploying code and database together

## Next.js 16.4.6 (security upgrade, 17 November 2026)

`next` and `eslint-config-next` are pinned to exactly `16.4.6`, no caret. The upgrade from 16.4.3 closes
GHSA-mfr8-8qww-v76h (moderate): information disclosure across root params when a `use cache` function is called
through `unstable_cache()`, affecting `>=16.3.0 <=16.4.4`. This project sets `cacheComponents: true` and uses
`use cache`, so the advisory applied directly. The fix first shipped in 16.4.5; 16.4.6 is the latest of that line.
`@next/env`, `@next/eslint-plugin-next` and `@next/swc-win32-x64-msvc` followed to 16.4.6 transitively. Prisma stays
pinned at 6.19.3, and nothing else was upgraded.

`npm audit` still reports advisories in `nodemailer` (high), `prisma`/`@prisma/config` (high, pinned on purpose),
`svgo`, `deepmerge-ts`, `minimatch` and `typescript-eslint`. None was touched in this upgrade; `nodemailer` is the
one to look at next, because the contact and event-registration forms send through it.


Vercel builds the project from GitHub (`main`). The client preview reads the Neon database `neondb` at build time
(static pages are prerendered from it) and at runtime (forms, revalidation). During development `.env` points at the
local PostgreSQL database `adamas`; nothing touches Neon until a deploy.

Every deploy that carries a schema change or new seed content lands on Neon first and on Vercel straight after, in
this order. Do not push before the database step: the build reads the database, so a push with a pending migration
builds against the old schema.

1. **Build locally first**, so a broken build never reaches the preview:
   ```powershell
   npm run typecheck; npm run lint; npm run check:config; npm run build
   ```
   `check:config` is cheap and must run whenever `next.config.ts` or anything it imports changes. Next loads the
   config outside the bundler, so tsconfig `paths` aliases (`@/lib/...`) are not resolved there: an alias import in
   that graph passes `typecheck` and `lint` and then kills every `next build` and `next dev`. The script walks the
   config's import graph for aliased or absolute specifiers, then loads the config through Next's own loader. See
   `scripts/check-config-load.mjs`.
2. **Migrate and seed Neon**, with the Neon connection strings on the command line only (never written into `.env`).
   `migrate deploy` applies pending migrations and is idempotent; `db seed` rewrites the content tables from
   `content/` and regenerates `lib/generated/redirects.json`:
   ```powershell
   $env:DATABASE_URL = "<Neon pooled connection string>"
   $env:DIRECT_URL   = "<Neon direct connection string>"
   npx prisma migrate deploy
   npx prisma db seed
   Remove-Item Env:DATABASE_URL; Remove-Item Env:DIRECT_URL
   ```
   Read the two strings from the Vercel project (Settings > Environment Variables) or the Neon console; a `#` in a
   password must be percent-encoded (`%23`).
3. **Push straight away** so the new schema, the new content and the new pages go live together:
   ```powershell
   git push origin main
   ```
   Vercel builds and promotes the deployment. If the build fails, Neon already carries the migration and the previous
   deployment keeps running; every migration so far is backward compatible, so that is safe.
4. **Check the preview:** `/in/`, `/uk/`, `/gcc/` return 200; `/ae/` is a 301 to `/gcc/`; `/sitemap.xml` lists `/gcc/`
   with the Gulf hreflang tags; `/insights/events/house-of-lords-2026` shows the registration form and its
   `/calendar` link downloads the `.ics`.

## Migrations that Neon still needs

| Migration | What it does | Needed since |
|---|---|---|
| `20261113120000_region_gcc` | Renames the `RegionCode` enum value `AE` to `GCC` in place (all rows and `RegionCode[]` arrays keep their data) and sets the region row's slug to `gcc`. | Milestone C, 13 Nov 2026 |

**Superseded by "Preview deploy, Wednesday 19 November 2026" below, which lists all six migrations and how to
check what the target database already has.** `20261117174539_add_job` (the Careers `Job` table) is also outstanding.

The seed after it rewrites navigation, redirects (`/ae` now 301s to `/gcc/`), the DRAFT industries, the remapped
case-study industries, Tech Excellence shown on GCC, and the Cloud Services page blocks.

## Vercel environment variables

Check these before the push (Settings > Environment Variables, Production and Preview). Nothing in the build reads
`.env.local`.

| Variable | Value for the preview | Read by |
|---|---|---|
| `DATABASE_URL` | Neon pooled connection string | Prisma at build and runtime |
| `DIRECT_URL` | Neon direct connection string | Prisma Migrate (only used by the migrate step above) |
| `NEXT_PUBLIC_SITE_URL` | `https://<preview-domain>` (no trailing slash) | canonical URLs, sitemap, Open Graph, calendar files, emails |
| `DEFAULT_REGION` | `uk` (`in`, `uk` or `gcc`) | bare `/` redirect for visitors outside IN, UK/IE and the GCC |
| `SITE_ENV` | `staging` (`production` at launch) | draft preview guard |
| `PREVIEW_DRAFTS` | `true` on the preview, `false` at launch | renders DRAFT rows |
| `SHOW_DRAFT_BADGES` | `false` for the client, `true` for internal review | orange "Draft" tags |
| `BLOCK_INDEXING` | `true` until launch | `noindex` on every page and `Disallow: /` in robots.txt |
| `MEDIA_BASE_URL` | `/media` (CloudFront URL once media moves there) | every image URL |
| `REVALIDATE_SECRET` | a long random string | `POST /api/revalidate` and the IP hash for rate limiting |
| `MAILER` | `smtp` to send mail, `console` to only log it | contact, event registration and newsletter forms |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | the relay's values (Google Workspace: `smtp.gmail.com`, `587`, the mailbox, an app password; or Amazon SES SMTP credentials) | `MAILER=smtp` (new in round 7) |
| `MAIL_FROM` | `AdamasTech Consulting <marketing@adamastech.in>` (a sender the relay is allowed to use) | the From header (new in round 7) |
| `MAIL_TO_ENQUIRIES` | the inbox that receives enquiries and registrations | all forms |
| `NEXT_PUBLIC_GTM_ID` | the container ID, e.g. `GTM-XXXXXXX`; leave empty to ship no analytics at all | Google Tag Manager and the consent banner (wired 17 Nov 2026) |
| `PREVIEW_USERNAME`, `PREVIEW_PASSWORD` | set both on the staging preview; leave both unset at launch | Basic Auth challenge on every route in `proxy.ts` (new in the QA fix round, 16 Nov 2026) |
| `CAREERS_APPLY_URL` or `CAREERS_EMAIL` | leave unset until the client decides where applications go | the Apply buttons on /about/careers; with neither set none is rendered (17 Nov 2026) |

Not set on Vercel: `FIGMA_TOKEN` (build scripts only) and `FIGMA_FIXTURE` (the design-comparison page is for local QA only).
`AWS_REGION` from `.env.example` is unused now that mail goes through SMTP.

## Analytics and cookie consent (17 Nov 2026)

`NEXT_PUBLIC_GTM_ID` is the only switch. It is read at build time, so changing it needs a rebuild.

**Empty (the default, and what every QA build so far has used).** No Google script, no `dataLayer`, no consent
cookie, and no banner: there is nothing to consent to, so the site does not ask. The footer's "Cookie settings"
control is not rendered either, and the Cookie Policy page serves its "No analytics, advertising or tracking
cookies" section. The Content-Security-Policy stays locked to the site's own origin, so a Google script could not
load even if one were injected.

**Set to a container ID.** The banner appears on the first visit, offering Accept all, Reject all and Manage
cookies, and the choice is stored in the `consent` cookie for six months. Until a choice is made, nothing is
requested from Google. On agreement the page pushes Consent Mode v2 defaults with every signal denied, then an
update carrying the visitor's choice, and only then loads `gtm.js`, `afterInteractive`, so it stays off the
critical path. The two categories map onto the four Consent Mode signals: analytics to `analytics_storage`,
advertising to `ad_storage`, `ad_user_data` and `ad_personalization`. Withdrawing consent reloads the page, because
a script that is already running cannot be unloaded. The footer's "Cookie settings" control reopens the banner on
any page, and the Cookie Policy page swaps in its "Measurement cookies, only if you agree" section, which lists the
Google cookies. `lib/security-headers.ts` adds the Google hosts to `script-src`, `img-src` and `connect-src`, and
only then.

Before switching it on: have the client's legal adviser read the Cookie Policy (it is drafted, not client copy, and
the Google cookie names and retention periods come from Google's documentation rather than from a measured
container), and confirm the consent wording. `tests/e2e/consent.spec.ts` covers both states and adapts to whichever
the build under test carries, so run the suite again after a build with the ID set.

## Preview protection and security headers (QA fix round, 16 Nov 2026)

- **Basic Auth.** When `PREVIEW_USERNAME` and `PREVIEW_PASSWORD` are both set, `proxy.ts` answers every request
  without matching credentials with `401` and a `WWW-Authenticate: Basic` challenge: pages, `/_next` data and static
  chunks, media and API routes alike. The one exemption is `POST /api/revalidate`, which has its own shared secret and
  is called server-to-server by the seed and, later, the CMS. Unset both variables (or either) and the site is open;
  Vercel Deployment Protection can be used on top, not instead, if the preview must stay private.
- **Headers.** `lib/security-headers.ts` sets `Content-Security-Policy` (with `frame-ancestors 'none'`),
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin` and, when `NEXT_PUBLIC_SITE_URL` is `https://`,
  `Strict-Transport-Security: max-age=31536000; includeSubDomains`. They are applied by `next.config.ts` to every
  response Next serves and by `proxy.ts` to its own redirects and the auth challenge. The CSP allows `'unsafe-inline'`
  scripts and styles because the pages are prerendered (Cache Components), so a per-request nonce cannot be used;
  external scripts are limited to the site's origin, so adding Google Tag Manager later means adding its host to
  `script-src` and `connect-src` in `lib/security-headers.ts`. `MEDIA_BASE_URL`, when absolute, is added to
  `img-src`, `media-src` and `connect-src` automatically.
- **Rate limiting behind a proxy.** `lib/forms.ts` hashes the first `X-Forwarded-For` address. Vercel and CloudFront
  overwrite that header with the real client address, so the limit holds there. On a bare origin (a plain `next
  start` reachable from the internet without a trusted proxy) a client can spoof the header and bypass the limit:
  always deploy behind Vercel, CloudFront or another proxy that normalises `X-Forwarded-For` (QA BUG-022).
- **Redirect hops.** The eleven old WordPress homepage URLs (`/home-old` and friends) redirect to `/` on purpose and
  take a second hop to the visitor's regional homepage (`/in/`, `/uk/` or `/gcc/`): the second hop is the cookie
  or geo decision and is expected. Every other legacy URL lands in one hop (QA BUG-018).

## Preview deploy, Wednesday 19 November 2026

Everything below is for you to run: nothing in this round touched Neon or Vercel. Work through it in order; each
step says what "good" looks like, so a failure stops the deploy rather than being discovered on the preview.

### 0. Before you start

- A Neon branch (or database) for the preview, with its **pooled** and **direct** connection strings to hand.
- The Vercel project connected to this repository, with the preview branch chosen in Settings > Git.
- The work in this round is **uncommitted**. Commit and push it first; Vercel builds what is on the branch.

### 1. Migrations Neon needs

Six migrations exist. Neon has had everything up to `20261102120000_milestones` on the last deploy; the two below
it are the ones added since, and `add_job` is new in this round.

| Migration | What it does | Added |
|---|---|---|
| `20261029102353_init` | The whole schema | 29 Oct 2026 |
| `20261029104952_region_home_sort_order` | `sortOrder` on the regional homepage rows | 29 Oct 2026 |
| `20261029170830_announcements` | The announcements strip | 29 Oct 2026 |
| `20261102120000_milestones` | The company timeline | 2 Nov 2026 |
| `20261113120000_region_gcc` | Renames the `RegionCode` value `AE` to `GCC` in place (rows and `RegionCode[]` arrays keep their data) and sets the region slug to `gcc` | 13 Nov 2026 |
| `20261117174539_add_job` | Creates the `Job` table for /about/careers (no data: the client has sent no vacancies) | 17 Nov 2026 |

Check what the target database already has, then apply the rest:

```bash
# against the Neon database, from a shell that has DATABASE_URL and DIRECT_URL set to it
npx prisma migrate status      # lists applied and pending migrations
npm run db:deploy              # prisma migrate deploy: applies the pending ones, never resets
```

`migrate deploy` is additive and safe to re-run. It never drops data, and it will refuse to run if the database has
a migration this repository does not know about.

### 2. Seed the preview database

The preview is only useful with content in it. From the same shell:

```bash
npm run db:seed
```

The seed clears the content tables and rewrites them from `/content`; it never touches submissions (contact
enquiries, event registrations, newsletter subscribers). It finishes by compiling
`lib/generated/redirects.json` and `lib/generated/unpublished.json`, which the deploy will compile again anyway
(step 4).

### 3. Vercel environment variables

Settings > Environment Variables, for the **Preview** environment (and Production when that time comes). Nothing in
the build reads `.env.local`.

| Variable | Value for Wednesday's preview | Why |
|---|---|---|
| `DATABASE_URL` | Neon **pooled** connection string | Prisma at build and at runtime. **The build now fails without it** (step 4) |
| `DIRECT_URL` | Neon **direct** connection string | Prisma Migrate only |
| `NEXT_PUBLIC_SITE_URL` | `https://<preview-domain>` (no trailing slash) | canonical URLs, sitemap, Open Graph, calendar files, e-mail links |
| `SITE_ENV` | `staging` | the draft-preview guard; `PREVIEW_DRAFTS` is ignored when this is `production` |
| `PREVIEW_DRAFTS` | `true` | renders DRAFT rows: the 20 case studies, the leadership profiles, the milestones, the Careers page |
| `SHOW_DRAFT_BADGES` | `true` for an internal review, `false` when the client looks at it | the orange "Draft" tags |
| `BLOCK_INDEXING` | `true` | `noindex` on every page and `Disallow: /` in robots.txt. Do not deploy a preview without this |
| `PREVIEW_USERNAME` | a name you choose | Basic Auth on every route, including `/_next` and media (`proxy.ts`) |
| `PREVIEW_PASSWORD` | a long random string | as above. **Both** must be set or the preview is public |
| `DEFAULT_REGION` | `uk` | which homepage a visitor outside IN, UK/IE and the GCC lands on |
| `MEDIA_BASE_URL` | `/media` | image URLs; change only when media moves to CloudFront |
| `REVALIDATE_SECRET` | a long random string | `POST /api/revalidate`, and the salt for the hashed client IP in rate limiting |
| `MAILER` | `console` | **No SMTP credentials have arrived yet.** The forms work and store the enquiry; the message is logged instead of sent. Switch to `smtp` the moment the relay exists |
| `MAIL_FROM` | `AdamasTech Consulting <marketing@adamastech.in>` | the From header; must be an address the relay is allowed to use |
| `MAIL_TO_ENQUIRIES` | `marketing@adamastech.in` | where enquiries and registrations go |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | leave unset on Wednesday | only read when `MAILER=smtp` |
| `NEXT_PUBLIC_GTM_ID` | **empty** | with no container ID the site ships no Google script, no `dataLayer`, no consent cookie and no banner. It is inlined at build time, so changing it later needs a rebuild |
| `CAREERS_APPLY_URL` or `CAREERS_EMAIL` | leave both unset | with neither set, the Careers page shows no Apply button at all, which is correct until you decide where applications go |

Not set on Vercel: `FIGMA_TOKEN` and `FIGMA_FIXTURE` (local build scripts only), `E2E_*` (the test suite),
`PLAYWRIGHT_BROWSERS_PATH`, `CHROME_PATH`, `NEXT_DIST_DIR` (the local QA chain), `PRISMA_GENERATE` (the local
Windows escape hatch).

### 4. What the Vercel build now does differently

`npm run build` runs a `prebuild` step first (`scripts/prebuild.ts`):

1. `prisma generate` when the generated client is missing or when `VERCEL`/`CI` is set, so a cached
   `node_modules` cannot ship a stale client.
2. It opens the database, and **fails the build loudly if it cannot** - with the reason, and a pointer to
   `DATABASE_URL`.
3. It compiles `lib/generated/redirects.json` (the 120 legacy WordPress redirects),
   `lib/generated/unpublished.json` (the 29 detail URLs whose row exists but is not published) and
   `lib/generated/unpublished-pages.json` (the paths whose Page row is unpublished - today just
   `/about/careers`) from whatever is in the database **at deploy time**.

That last point is the reason this step exists: `proxy.ts` serves both files on every request, the seed is the only
other thing that writes them, and Vercel never runs the seed. Before this, a case study published in Neon would
have gone on redirecting to its listing until someone re-ran the seed locally and committed the result.

**Consequence worth knowing:** publishing or hiding a row in Neon changes what those files should contain, so it
needs a **redeploy** (or at least a rebuild) to take effect in the proxy, not just a revalidation.

### 5. Deploy

1. Commit and push the branch.
2. Watch the build log for the three prebuild lines:
   `prisma generate: ...`, `prebuild: compiling the proxy's redirect maps (Vercel (preview environment))`,
   `prebuild: 120 redirects, 29 unpublished fallbacks and 1 unpublished page(s) compiled.`
3. If the build stops at `prebuild FAILED`, the database is unreachable from the build: fix `DATABASE_URL` and
   redeploy. Nothing else in the build will have run.

### 6. Check the preview

In this order, because each one would mask the next:

1. **Basic Auth**: an incognito window must be challenged before anything renders, including an image URL and
   `/_next/...`. If anything loads without a password, `PREVIEW_USERNAME` or `PREVIEW_PASSWORD` is missing.
2. **Indexing**: `curl -sI <preview>/in/ | grep -i x-robots` and `curl -s <preview>/robots.txt` - expect
   `noindex` and `Disallow: /`.
3. **Drafts**: `/case-studies` lists the 20 case studies and `/about/careers` renders (both are DRAFT, so they only
   appear when `PREVIEW_DRAFTS=true`). If they are missing, `SITE_ENV` is `production` or `PREVIEW_DRAFTS` is not
   `true`.
4. **Regions**: `/` redirects to `/in/`, `/uk/` or `/gcc/` by IP, and the region switcher sets the cookie.
5. **The proxy maps**: a legacy URL such as `/sap-inter-company-reconciliation` lands on the case study
   (`PREVIEW_DRAFTS=true` makes it a real page there); with drafts off it must answer a **307 with a `Location`**
   to `/case-studies`, not a 307 with no target.
6. **Forms**: submit the contact form. With `MAILER=console` the enquiry is stored and the message appears in the
   Vercel function logs; the browser lands on `/thank-you`.
7. **No consent banner**: with `NEXT_PUBLIC_GTM_ID` empty there must be no banner, no `consent` cookie and no
   Google request.
8. **Hidden pages**: with `PREVIEW_DRAFTS=true` the Careers page renders. If you ever set `PREVIEW_DRAFTS=false`
   on a preview, `/about/careers` must answer a real **404** (not a 200 carrying the "Page not found" body).

### 7. Not ready for Wednesday, by design

- **Real e-mail.** `nodemailer` went from 7.0.13 to 10.6.0 in this round (a security upgrade; every release up to
  10.1.3 is affected). The forms are covered by the test suite against the `console` mailer, but **no message has
  been sent through a real relay on version 10**. When the SMTP credentials arrive: set `MAILER=smtp` and the four
  `SMTP_*` variables, then send one real enquiry from `/contact` and one event registration, and confirm both
  arrive at `MAIL_TO_ENQUIRIES` with the right From address. Do that before launch, not on launch day.
- **Analytics.** `NEXT_PUBLIC_GTM_ID` stays empty until the client's legal adviser has read the Cookie Policy.
- **The Careers page** is DRAFT and the `Job` table is empty, so it is review-only.
