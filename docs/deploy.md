# Deploying code and database together

Vercel builds the project from GitHub (`main`). The client preview reads the Neon database `neondb` at build time
(static pages are prerendered from it) and at runtime (forms, revalidation). During development `.env` points at the
local PostgreSQL database `adamas`; nothing touches Neon until a deploy.

Every deploy that carries a schema change or new seed content lands on Neon first and on Vercel straight after, in
this order. Do not push before the database step: the build reads the database, so a push with a pending migration
builds against the old schema.

1. **Build locally first**, so a broken build never reaches the preview:
   ```powershell
   npm run typecheck; npm run lint; npm run build
   ```
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
| `NEXT_PUBLIC_GTM_ID` | empty until analytics is approved | analytics (not wired yet) |
| `PREVIEW_USERNAME`, `PREVIEW_PASSWORD` | set both on the staging preview; leave both unset at launch | Basic Auth challenge on every route in `proxy.ts` (new in the QA fix round, 16 Nov 2026) |

Not set on Vercel: `FIGMA_TOKEN` (build scripts only) and `FIGMA_FIXTURE` (the design-comparison page is for local QA only).
`AWS_REGION` from `.env.example` is unused now that mail goes through SMTP.

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
