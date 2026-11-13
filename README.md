# AdamasTech Consulting website

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Prisma 6 + PostgreSQL · GSAP + Motion + Lenis.

All copy, images, stats, offices and menus live in the database. Pages read them through `lib/data/*`.
`content/` holds the typed seed source; `prisma/seed.ts` loads it.

**Status (13 Nov 2026):** the design prototype was removed and the site is being rebuilt to the approved Figma file
(`docs/AdamasTech_Master_Build_Prompt_v2.md`). The header, mega menu, footer, tokens and fonts are built; every other
route is a placeholder that loads its data and shows its title until its round. Decisions and open questions:
`docs/design-notes.md`, `docs/design-tokens.md`, `docs/asset-manifest.md`, `CONTENT_TODO.md`.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL`: the Neon **pooled** connection string (host contains `-pooler`, add `&pgbouncer=true`)
   - `DIRECT_URL`: the Neon **direct** connection string (used by Prisma Migrate)

   For local Postgres instead, run `docker compose up -d` and use the commented localhost URLs.
3. `npm run db:setup` applies the migrations and seeds the content.
   Local development uses the PostgreSQL database in `.env`; the Neon preview database is migrated and seeded only at deploy time (`docs/deploy.md`).
   QA scripts (`scripts/compare-figma.mts`, `measure-figma.mts`, `home-qa.mts`, `axe-check.mts`, `glass-contrast.mts`, `menu-shots.mts`, `event-smoke.mts`) run with `PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/<name>.mts`; Lighthouse via `npx lighthouse` with `CHROME_PATH` set.
4. `npm run dev`, then open http://localhost:3000. `/` redirects to your region's homepage.

`FIGMA_TOKEN` in `.env.local` (never committed) lets the build scripts read the design file.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run db:migrate` | Create and apply a migration after editing `prisma/schema.prisma` (dev) |
| `npm run db:deploy` | Apply migrations (CI / production) |
| `npm run db:seed` | Reload content from `content/` (clears content tables; never touches form submissions) |
| `npm run redirects:build` | Recompile `lib/generated/redirects.json` from the `Redirect` table |
| `node scripts/process-assets.mjs` | Regenerate `public/media` assets from `scripts/assets.manifest.json` (designer exports in `design-src/`, Figma fills in `design-ref/`) |
| `npm run screenshots -- http://localhost:3000 /in/` | Full-page QA screenshots at 360/768/1024/1280/1440 into `screenshots/` |
| `npx tsx scripts/chrome-shots.mts http://localhost:3100` | Header, mega-menu, drawer and footer screenshots at the Figma width |
| `npm run typecheck` / `lint` | TypeScript / ESLint |

## Structure

- `app/layout.tsx`: document shell and fonts (Manrope, Roboto, Figtree via `next/font/google`).
- `app/[region]/`: the regional homepages; `app/(site)/`: every global inner page. Both layouts render `components/nav/SiteChrome` (header, main, footer), so the homepages can tell the header their region server-side.
- `app/globals.css`: every design token (`@theme`), documented in `docs/design-tokens.md`.
- `components/nav/`: header, mega menu (hover intent, keyboard, Motion), region switcher and mobile drawer (both `<details>`-based, so they work without JavaScript), footer.
- `components/ui/`: `Icon` (Figma vectors as inline SVG), `Button`.
- `lib/actions/`: event-registration and newsletter server actions; `app/contact/actions.ts`: the contact form action.

## Environment

See `.env.example`. Key flags:

- `MEDIA_BASE_URL`: `/media` locally (files in `public/media`); the CloudFront origin in production.
- `DEFAULT_REGION`: homepage for countries outside IN / UK+IE / GCC (default `uk`).
- `PREVIEW_DRAFTS=true`: renders DRAFT content, for local review. Ignored when `SITE_ENV=production`. `SHOW_DRAFT_BADGES=true` adds a "Draft" tag.
- `BLOCK_INDEXING=true`: noindex on staging.

## Regions & routing

- `/in/`, `/uk/`, `/gcc/` are regional homepages (one template, content from `RegionHome`). The Gulf region is labelled **GCC** in the UI; its old URL `/ae/` (and anything under it) is a 301 to `/gcc/`, and a saved `region=ae` cookie still counts as GCC.
- `proxy.ts` handles four things:
  - `/` only: region cookie → that homepage, otherwise IP country (CloudFront header) → region.
  - Homepages get a trailing slash.
  - Legacy WordPress URLs get 301s.
  - Any other trailing slash is removed.

## Content status

Placeholders, conflicts and missing assets are tracked in `CONTENT_TODO.md` and flagged in the DB (`needsReview`, `editorNote`).
Unverified stats are seeded with `verified = false` and never render.
