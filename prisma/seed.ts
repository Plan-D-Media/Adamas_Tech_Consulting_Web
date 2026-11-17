/**
 * Loads the typed content in /content into the database.
 *
 * Idempotent: content tables are cleared and re-created on every run.
 * Submissions (contact, event registrations, newsletter) are never touched.
 *
 * Also writes lib/generated/redirects.json, which proxy.ts reads, so legacy
 * redirects cost no database round-trip per request.
 */
import { PrismaClient, Prisma } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import * as content from "../content";
import type { Meta, NavItemSeed, Seo, Status } from "../content/types";
import { normalisePath, writeRedirectsFile, writeUnpublishedFile, writeUnpublishedPagesFile } from "../scripts/generated-files";

export const prisma = new PrismaClient();
const ROOT = path.resolve(__dirname, "..");
const MEDIA_DIR = path.join(ROOT, "public", "media");

// ── helpers ────────────────────────────────────────────────────────────

const mediaIds = new Map<string, string>();

function meta(m: Meta, fallbackOrder = 0) {
  const status: Status = m.status ?? "DRAFT";
  return {
    status,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
    sortOrder: m.sortOrder ?? fallbackOrder,
    needsReview: m.needsReview ?? false,
    editorNote: m.editorNote ?? null,
  };
}

function mediaId(key: string | undefined): string | null {
  if (!key) return null;
  const id = mediaIds.get(key);
  if (!id) throw new Error(`Unknown media key "${key}". Add it to content/media.ts.`);
  return id;
}

function seo(s: Seo) {
  return {
    seoTitle: s.seoTitle ?? null,
    seoDescription: s.seoDescription ?? null,
    ogImageId: mediaId(s.ogImage),
    noindex: s.noindex ?? false,
  };
}

const json = (v: unknown) => (v === undefined ? Prisma.DbNull : (v as Prisma.InputJsonValue));

/** The three homepages are canonical with a trailing slash; every other path is canonical without one (proxy.ts). */
async function connectTechnologies(names: string[] | undefined) {
  if (!names?.length) return undefined;
  for (const name of names) {
    await prisma.technology.upsert({ where: { name }, update: {}, create: { name, status: "PUBLISHED" } });
  }
  return { connect: names.map((name) => ({ name })) };
}

// ── steps ──────────────────────────────────────────────────────────────

async function clearContent() {
  // Order matters: children before parents.
  await prisma.$transaction([
    prisma.navItem.deleteMany({ where: { parentId: { not: null } } }),
    prisma.navItem.deleteMany(),
    prisma.contentBlock.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.heroSlide.deleteMany(),
    prisma.homeServiceCard.deleteMany(),
    prisma.regionHome.deleteMany(),
    prisma.faq.deleteMany(),
    prisma.approachStep.deleteMany(),
    prisma.caseResult.deleteMany(),
    prisma.caseStudy.deleteMany(),
    prisma.solutionFeature.deleteMany(),
    prisma.solutionScreenshot.deleteMany(),
    prisma.solution.updateMany({ data: { parentId: null } }),
    prisma.solution.deleteMany(),
    prisma.service.deleteMany(),
    prisma.servicePillar.deleteMany(),
    prisma.industry.deleteMany(),
    prisma.technology.deleteMany(),
    prisma.stat.deleteMany(),
    prisma.logoItem.deleteMany(),
    prisma.certification.deleteMany(),
    prisma.eventSpeaker.deleteMany(),
    prisma.agendaItem.deleteMany(),
    // Events with registrations are kept (registrations are submissions); see upsert below.
    prisma.event.deleteMany({ where: { registrations: { none: {} } } }),
    prisma.person.deleteMany(),
    prisma.milestone.deleteMany(),
    prisma.page.deleteMany(),
    prisma.redirect.deleteMany(),
    prisma.region.updateMany({ data: { featuredOfficeId: null } }),
    prisma.office.deleteMany(),
  ]);
}

async function seedMedia() {
  for (const m of content.media) {
    const file = path.join(MEDIA_DIR, m.key);
    let width: number | null = null;
    let height: number | null = null;
    let blurDataUrl: string | null = null;
    const kind = m.kind ?? "IMAGE";
    if (kind === "IMAGE" && fs.existsSync(file)) {
      try {
        const img = sharp(file);
        const info = await img.metadata();
        width = info.width ?? null;
        height = info.height ?? null;
        if (!m.key.endsWith(".svg")) {
          const buf = await sharp(file).resize(16).webp({ quality: 40 }).toBuffer();
          blurDataUrl = `data:image/webp;base64,${buf.toString("base64")}`;
        }
      } catch {
        console.warn(`  ! could not read ${m.key}`);
      }
    } else if (!fs.existsSync(file)) {
      console.warn(`  ! missing file for media key ${m.key}`);
    }
    const data = {
      kind,
      mimeType: m.mimeType ?? null,
      width,
      height,
      alt: m.alt,
      blurDataUrl,
      isPlaceholder: m.isPlaceholder ?? false,
      sourceUrl: m.sourceUrl ?? null,
    };
    const row = await prisma.mediaAsset.upsert({ where: { key: m.key }, update: data, create: { key: m.key, ...data } });
    mediaIds.set(m.key, row.id);
  }
}

async function seedRegionsAndOffices() {
  for (const r of content.regions) {
    const data = {
      slug: r.slug,
      label: r.label,
      locale: r.locale,
      hreflang: r.hreflang,
      phone: r.phone ?? null,
      phoneHref: r.phoneHref ?? null,
      whatsapp: r.whatsapp ?? null,
      email: r.email ?? null,
      sortOrder: r.sortOrder,
    };
    await prisma.region.upsert({ where: { code: r.code }, update: data, create: { code: r.code, ...data } });
  }
  for (const [i, o] of content.offices.entries()) {
    await prisma.office.create({
      data: {
        slug: o.slug,
        city: o.city,
        label: o.label,
        country: o.country,
        region: o.region,
        addressLines: o.addressLines,
        phone: o.phone ?? null,
        phoneHref: o.phoneHref ?? null,
        whatsapp: o.whatsapp ?? null,
        lat: o.lat ?? null,
        lng: o.lng ?? null,
        confirmed: o.confirmed ?? false,
        ...meta(o, i),
      },
    });
  }
  for (const r of content.regions) {
    if (!r.featuredOffice) continue;
    const office = await prisma.office.findUniqueOrThrow({ where: { slug: r.featuredOffice } });
    await prisma.region.update({ where: { code: r.code }, data: { featuredOfficeId: office.id } });
  }
}

async function seedIndustries() {
  for (const [i, ind] of content.industries.entries()) {
    await prisma.industry.create({
      data: { slug: ind.slug, tabLabel: ind.tabLabel, title: ind.title, body: ind.body, imageId: mediaId(ind.image), ...meta(ind, i) },
    });
  }
}

async function seedServices() {
  for (const [pi, p] of content.pillars.entries()) {
    const pillar = await prisma.servicePillar.create({
      data: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline ?? null,
        summary: p.summary ?? null,
        outcomeLine: p.outcomeLine ?? null,
        challenge: p.challenge ?? null,
        imageId: mediaId(p.image),
        ...meta(p, pi),
        ...seo(p),
        faqs: p.faqs ? { create: p.faqs.map((f, i) => ({ question: f.question, answer: f.answer, ...meta(f, i) })) } : undefined,
      },
    });
    for (const [si, s] of p.services.entries()) {
      await prisma.service.create({
        data: {
          pillarId: pillar.id,
          slug: s.slug,
          name: s.name,
          descriptor: s.descriptor ?? null,
          summary: s.summary ?? null,
          whoFor: s.whoFor ?? null,
          whatWeDo: json(s.whatWeDo),
          highlights: json(s.highlights),
          imageId: mediaId(s.image),
          legacyPath: s.legacyPath ?? null,
          ...meta(s, si),
          ...seo(s),
          steps: s.steps ? { create: s.steps.map((st, i) => ({ title: st.title, body: st.body ?? null, ...meta({ status: "PUBLISHED", ...st }, i) })) } : undefined,
          technologies: await connectTechnologies(s.technologies),
          faqs: s.faqs ? { create: s.faqs.map((f, i) => ({ question: f.question, answer: f.answer, ...meta(f, i) })) } : undefined,
        },
      });
    }
  }
}

async function seedSolutions() {
  // Parents first so children can link to them.
  const ordered = [...content.solutions].sort((a, b) => Number(!!a.parent) - Number(!!b.parent));
  for (const [i, s] of ordered.entries()) {
    const parent = s.parent ? await prisma.solution.findUniqueOrThrow({ where: { slug: s.parent } }) : null;
    await prisma.solution.create({
      data: {
        slug: s.slug,
        kind: s.kind,
        name: s.name,
        tagline: s.tagline ?? null,
        summary: s.summary ?? null,
        body: s.body ?? null,
        externalUrl: s.externalUrl ?? null,
        parentId: parent?.id ?? null,
        imageId: mediaId(s.image),
        ...meta(s, s.sortOrder ?? i),
        ...seo(s),
        features: s.features ? { create: s.features.map((f, j) => ({ title: f.title, body: f.body ?? null, ...meta({ status: "PUBLISHED", ...f }, j) })) } : undefined,
        screenshots: s.screenshots ? { create: s.screenshots.map((sc, j) => ({ imageId: mediaId(sc.image)!, caption: sc.caption ?? null, sortOrder: j })) } : undefined,
        integrations: await connectTechnologies(s.integrations),
        faqs: s.faqs ? { create: s.faqs.map((f, j) => ({ question: f.question, answer: f.answer, ...meta(f, j) })) } : undefined,
      },
    });
  }
}

async function seedCaseStudies() {
  for (const [i, c] of content.caseStudies.entries()) {
    const industry = c.industry ? await prisma.industry.findUnique({ where: { slug: c.industry } }) : null;
    if (c.industry && !industry) console.warn(`  ! case study ${c.slug}: unknown industry ${c.industry}`);
    const services = [];
    for (const ref of c.services ?? []) {
      const [pillarSlug, serviceSlug] = ref.split("/");
      const svc = await prisma.service.findFirst({ where: { slug: serviceSlug, pillar: { slug: pillarSlug } } });
      if (svc) services.push({ id: svc.id });
      else console.warn(`  ! case study ${c.slug}: unknown service ${ref}`);
    }
    await prisma.caseStudy.create({
      data: {
        slug: c.slug,
        label: c.label,
        title: c.title,
        summary: c.summary ?? null,
        headlineMetric: c.headlineMetric,
        metricLabel: c.metricLabel ?? null,
        clientDescriptor: c.clientDescriptor ?? null,
        overview: c.overview ?? null,
        challenge: c.challenge ?? null,
        solution: json(c.solution),
        quote: c.quote ?? null,
        quoteBy: c.quoteBy ?? null,
        industryId: industry?.id ?? null,
        regions: c.regions ?? [],
        featuredIn: c.featuredIn ?? [],
        imageId: mediaId(c.image),
        legacyPath: c.legacyPath ?? null,
        ...meta(c, i),
        ...seo(c),
        results: c.results ? { create: c.results.map((r, j) => ({ value: r.value, label: r.label, sortOrder: j })) } : undefined,
        services: services.length ? { connect: services } : undefined,
        pillars: c.pillars?.length ? { connect: c.pillars.map((slug) => ({ slug })) } : undefined,
        solutions: c.solutions?.length ? { connect: c.solutions.map((slug) => ({ slug })) } : undefined,
        technologies: await connectTechnologies(c.technologies),
      },
    });
  }
}

async function seedTrust() {
  for (const [i, s] of content.stats.entries()) {
    await prisma.stat.create({
      data: {
        key: s.key,
        value: s.value,
        numeric: s.numeric ?? null,
        prefix: s.prefix ?? null,
        suffix: s.suffix ?? null,
        label: s.label,
        verified: s.verified,
        sourceNote: s.sourceNote ?? null,
        placements: s.placements,
        regions: s.regions ?? ["IN", "UK", "GCC"],
        ...meta(s, i),
      },
    });
  }
  for (const [i, l] of content.logos.entries()) {
    await prisma.logoItem.create({
      data: { kind: l.kind, name: l.name, logoId: mediaId(l.logo)!, url: l.url ?? null, regions: l.regions ?? ["IN", "UK", "GCC"], ...meta(l, i) },
    });
  }
  for (const [i, c] of content.certifications.entries()) {
    await prisma.certification.create({
      data: {
        slug: c.slug,
        name: c.name,
        issuer: c.issuer ?? null,
        standard: c.standard ?? null,
        description: c.description ?? null,
        badgeId: mediaId(c.badge),
        certificateFileId: mediaId(c.certificateFile),
        certificateNumber: c.certificateNumber ?? null,
        validUntil: c.validUntil ? new Date(c.validUntil) : null,
        verified: c.verified ?? false,
        ...meta(c, i),
        ...seo(c),
      },
    });
  }
}

async function seedPeopleAndEvents() {
  for (const [i, p] of content.people.entries()) {
    await prisma.person.create({
      data: {
        slug: p.slug,
        name: p.name,
        role: p.role,
        bio: p.bio ?? null,
        photoId: mediaId(p.photo),
        linkedinUrl: p.linkedinUrl ?? null,
        showOnTeam: p.showOnTeam ?? true,
        ...meta(p, i),
      },
    });
  }
  for (const [i, e] of content.events.entries()) {
    const data = {
      title: e.title,
      eyebrow: e.eyebrow ?? null,
      summary: e.summary ?? null,
      body: e.body ?? null,
      startsAt: new Date(e.startsAt),
      endsAt: e.endsAt ? new Date(e.endsAt) : null,
      timezone: e.timezone ?? "Europe/London",
      venueName: e.venueName ?? null,
      venueAddress: e.venueAddress ?? null,
      imageId: mediaId(e.image),
      registrationOpen: e.registrationOpen ?? false,
      capacity: e.capacity ?? null,
      ...meta(e, i),
      ...seo(e),
    };
    const event = await prisma.event.upsert({ where: { slug: e.slug }, update: data, create: { slug: e.slug, ...data } });
    for (const [j, a] of (e.agenda ?? []).entries()) {
      await prisma.agendaItem.create({
        data: { eventId: event.id, startsAt: new Date(a.startsAt), title: a.title, body: a.body ?? null, ...meta({ status: "PUBLISHED", ...a }, j) },
      });
    }
    for (const [j, slug] of (e.speakers ?? []).entries()) {
      const person = await prisma.person.findUniqueOrThrow({ where: { slug } });
      await prisma.eventSpeaker.create({ data: { eventId: event.id, personId: person.id, sortOrder: j } });
    }
  }
}

async function seedHomes() {
  for (const h of content.homes) {
    const event = h.featuredEvent ? await prisma.event.findUnique({ where: { slug: h.featuredEvent } }) : null;
    await prisma.regionHome.create({
      data: {
        region: h.region,
        featuredEventId: event?.id ?? null,
        eventProminence: h.eventProminence ?? "STANDARD",
        showTrustStrip: h.showTrustStrip ?? true,
        showWhyUs: h.showWhyUs ?? true,
        promoBanner: json(h.promoBanner),
        ...meta(h),
        ...seo(h),
        heroSlides: {
          create: h.heroSlides.map((s, i) => ({
            navLabel: s.navLabel,
            eyebrow: s.eyebrow ?? null,
            headline: s.headline,
            body: s.body ?? null,
            ctaLabel: s.ctaLabel,
            ctaHref: s.ctaHref,
            vimeoId: s.vimeoId ?? null,
            videoId: mediaId(s.video),
            posterId: mediaId(s.poster),
            ...meta(s, i),
          })),
        },
        serviceCards: h.serviceCards
          ? { create: h.serviceCards.map((c, i) => ({ title: c.title, body: c.body ?? null, href: c.href ?? null, ...meta(c, i) })) }
          : undefined,
      },
    });
  }
  for (const [i, b] of content.contentBlocks.entries()) {
    await prisma.contentBlock.create({
      data: {
        key: b.key,
        region: b.region ?? null,
        eyebrow: b.eyebrow ?? null,
        heading: b.heading ?? null,
        body: b.body ?? null,
        ctaLabel: b.ctaLabel ?? null,
        ctaHref: b.ctaHref ?? null,
        extra: json(b.extra),
        ...meta(b, i),
      },
    });
  }
}

async function seedAnnouncements() {
  for (const [i, a] of content.announcements.entries()) {
    await prisma.announcement.create({
      data: {
        label: a.label,
        text: a.text,
        href: a.href ?? null,
        startsAt: a.startsAt ? new Date(a.startsAt) : null,
        endsAt: a.endsAt ? new Date(a.endsAt) : null,
        regions: a.regions,
        ...meta(a, i),
      },
    });
  }
}

async function seedNav() {
  const create = async (item: NavItemSeed, menu: "HEADER" | "FOOTER" | "LEGAL" | "SOCIAL", order: number, parentId: string | null) => {
    const cs = item.featuredCaseStudy ? await prisma.caseStudy.findUnique({ where: { slug: item.featuredCaseStudy } }) : null;
    const ev = item.featuredEvent ? await prisma.event.findUnique({ where: { slug: item.featuredEvent } }) : null;
    const row = await prisma.navItem.create({
      data: {
        menu,
        parentId,
        key: item.key ?? null,
        label: item.label,
        descriptor: item.descriptor ?? null,
        href: item.href ?? null,
        external: item.external ?? false,
        comingSoon: item.comingSoon ?? false,
        featuredCaseStudyId: cs?.id ?? null,
        featuredEventId: ev?.id ?? null,
        ...meta(item, order),
      },
    });
    for (const [i, child] of (item.children ?? []).entries()) await create(child, menu, i, row.id);
  };
  const n = content.navigation;
  for (const [i, it] of n.header.entries()) await create(it, "HEADER", i, null);
  for (const [i, it] of n.footer.entries()) await create(it, "FOOTER", i, null);
  for (const [i, it] of n.legal.entries()) await create(it, "LEGAL", i, null);
  for (const [i, it] of n.social.entries()) await create(it, "SOCIAL", i, null);
}

/** Company journey on /about (content/milestones.ts). */
async function seedMilestones() {
  for (const [i, m] of content.milestones.entries()) {
    await prisma.milestone.create({
      data: { year: m.year, title: m.title, description: m.description ?? null, imageId: mediaId(m.image), ...meta(m, i) },
    });
  }
}

/** Company, utility and legal pages (content/pages.ts). `blocks` is validated per template in lib/data/pages.ts. */
async function seedPages() {
  for (const [i, p] of content.pages.entries()) {
    await prisma.page.create({
      data: {
        path: normalisePath(p.path),
        template: p.template,
        title: p.title,
        eyebrow: p.eyebrow ?? null,
        intro: p.intro ?? null,
        blocks: json(p.blocks),
        imageId: mediaId(p.image),
        ...meta(p, i),
        ...seo(p),
        faqs: p.faqs ? { create: p.faqs.map((f, j) => ({ question: f.question, answer: f.answer, ...meta(f, j) })) } : undefined,
      },
    });
  }
}

async function seedRedirects() {
  const seen = new Set<string>();
  for (const r of content.redirects) {
    const fromPath = normalisePath(r.fromPath);
    if (seen.has(fromPath)) continue;
    seen.add(fromPath);
    await prisma.redirect.create({
      data: {
        fromPath,
        toPath: normalisePath(r.toPath),
        statusCode: r.statusCode ?? 301,
        active: r.active ?? true,
        decisionRef: r.decisionRef ?? null,
        note: r.note ?? null,
      },
    });
  }
  await writeRedirects();
}

/**
 * The proxy's two maps, compiled from what has just been seeded. The rules live in scripts/generated-files.ts so
 * the seed, `npm run redirects:build` and the build's prebuild step cannot drift apart.
 */
export const writeRedirects = () => writeRedirectsFile(prisma);
export const writeUnpublished = () => writeUnpublishedFile(prisma);
export const writeUnpublishedPages = () => writeUnpublishedPagesFile(prisma);

/** If the site is running, ask it to drop cached content so the new seed shows immediately. */
async function revalidateRunningSite() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!site || !secret) return;
  try {
    const res = await fetch(`${site}/api/revalidate`, { method: "POST", headers: { "x-revalidate-secret": secret }, signal: AbortSignal.timeout(5000) });
    console.log(res.ok ? "  revalidated running site" : `  revalidate skipped (${res.status})`);
  } catch {
    // Site not running; nothing cached to clear.
  }
}

async function main() {
  const t = Date.now();
  const step = async (name: string, fn: () => Promise<void>) => {
    process.stdout.write(`• ${name}\n`);
    await fn();
  };
  await step("clear content", clearContent);
  await step("media", seedMedia);
  await step("regions + offices", seedRegionsAndOffices);
  await step("industries", seedIndustries);
  await step("services", seedServices);
  await step("solutions", seedSolutions);
  await step("case studies", seedCaseStudies);
  await step("trust", seedTrust);
  await step("people + events", seedPeopleAndEvents);
  await step("milestones", seedMilestones);
  await step("homes + blocks", seedHomes);
  await step("announcements", seedAnnouncements);
  await step("navigation", seedNav);
  await step("pages", seedPages);
  await step("redirects", seedRedirects);
  await step("unpublished fallbacks", async () => { await writeUnpublished(); await writeUnpublishedPages(); });
  console.log(`Seed complete in ${((Date.now() - t) / 1000).toFixed(1)}s`);
  await revalidateRunningSite();
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main()
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
