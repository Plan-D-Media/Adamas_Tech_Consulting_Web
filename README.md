# AdamasTech Consulting website

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Prisma 6 + PostgreSQL · GSAP + Motion + Lenis.

All copy, images, stats, offices and menus live in the database. Pages read them through `lib/data/*`.
`content/` holds the typed seed source; `prisma/seed.ts` loads it.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL`: the Neon **pooled** connection string (host contains `-pooler`, add `&pgbouncer=true`)
   - `DIRECT_URL`: the Neon **direct** connection string (used by Prisma Migrate)

   For local Postgres instead, run `docker compose up -d` and use the commented localhost URLs.
3. `npm run db:setup` applies the migrations and seeds the content.
4. `npm run dev`, then open http://localhost:3000. `/` redirects to your region's homepage.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run db:migrate` | Create and apply a migration after editing `prisma/schema.prisma` (dev) |
| `npm run db:deploy` | Apply migrations (CI / production) |
| `npm run db:seed` | Reload content from `content/` (clears content tables; never touches form submissions) |
| `npm run redirects:build` | Recompile `lib/generated/redirects.json` from the `Redirect` table |
| `npm run screenshots -- http://localhost:3000 /in/` | Full-page QA screenshots at 360/768/1024/1280/1440 into `screenshots/` |
| `npm run typecheck` / `lint` | TypeScript / ESLint |

## Environment

See `.env.example`. Key flags:

- `MEDIA_BASE_URL`: `/media` locally (files in `public/media`); the CloudFront origin in production.
- `DEFAULT_REGION`: homepage for countries outside IN / UK+IE / GCC (default `uk`).
- `PREVIEW_DRAFTS=true`: renders DRAFT content with a "Draft" badge, for local review. Ignored when `SITE_ENV=production`.
- `BLOCK_INDEXING=true`: noindex on staging.

## Regions & routing

- `/in/`, `/uk/`, `/ae/` are regional homepages (one template, content from `RegionHome`). The Gulf region is labelled **GCC** in the UI.
- `proxy.ts` handles four things:
  - `/` only: region cookie → that homepage, otherwise IP country (CloudFront header) → region.
  - Homepages get a trailing slash.
  - Legacy WordPress URLs get 301s.
  - Any other trailing slash is removed.

## Content status

Placeholders, conflicts and missing assets are tracked in `CONTENT_TODO.md` and flagged in the DB (`needsReview`, `editorNote`).
Unverified stats are seeded with `verified = false` and never render.
