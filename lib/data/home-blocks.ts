import { z } from "zod";
import type { Block } from "@/lib/data/site";
import { mediaUrl } from "@/lib/media";

/**
 * Typed readers for the homepage ContentBlock rows' `extra` JSON (seeded in content/blocks.ts). Each section of the
 * approved design that carries lists (stories, features, cards) stores them here, so the Phase 2 CMS edits one row per
 * section. Invalid JSON falls back to an empty list rather than breaking the page.
 */

const media = z.string().min(1).transform((key) => mediaUrl(key));

const story = z.object({
  date: z.string().optional(),
  title: z.string(),
  body: z.string().optional(),
  href: z.string(),
  image: media.optional(),
  imageAlt: z.string().default(""),
});

const aboutExtra = z.object({
  image: media.optional(),
  imageAlt: z.string().default(""),
  features: z.array(z.object({ icon: z.string(), label: z.string() })).default([]),
  approach: z.object({ label: z.string(), text: z.string() }).optional(),
});

const outcomesExtra = z.object({
  feature: z
    .object({
      label: z.string(),
      title: z.string(),
      href: z.string(),
      image: media.optional(),
      imageAlt: z.string().default(""),
      /** Stat key (lib/data/home.ts `claims`) for the headline figure; draft until verified. */
      metricStat: z.string().optional(),
      linkLabel: z.string().default("Read Case Study"),
    })
    .optional(),
  cards: z
    .array(z.object({ label: z.string(), title: z.string(), body: z.string().optional(), href: z.string(), linkLabel: z.string().default("Read Case Study") }))
    .default([]),
});

const differenceExtra = z.object({
  centre: z.string().default("One connected delivery ecosystem"),
  items: z.array(z.object({ icon: z.string(), title: z.string(), body: z.string() })).default([]),
});

const insightsExtra = z.object({
  insights: z.array(z.object({ label: z.string(), title: z.string(), href: z.string(), linkLabel: z.string().default("Read Insight") })).default([]),
});

const perspectivesExtra = z.object({
  items: z
    .array(
      z.object({
        variant: z.enum(["feature", "small", "dark"]),
        label: z.string(),
        title: z.string(),
        body: z.string().optional(),
        href: z.string(),
        image: media.optional(),
        imageAlt: z.string().default(""),
        linkLabel: z.string().default("Read More"),
      }),
    )
    .default([]),
});

const techExtra = z.object({
  items: z.array(z.object({ title: z.string(), body: z.string(), image: media.optional(), showCertifications: z.boolean().default(false) })).default([]),
});

const contactExtra = z.object({
  image: media.optional(),
  imageAlt: z.string().default(""),
  placeholders: z
    .object({ name: z.string().default("Full Name"), email: z.string().default("Your Email"), phone: z.string().default("Your Phone"), message: z.string().default("What's your Project about?") })
    .default({ name: "Full Name", email: "Your Email", phone: "Your Phone", message: "What's your Project about?" }),
  submitLabel: z.string().default("Submit Now!"),
  consentLabel: z.string().default("I agree to the Privacy Policy and Terms of Use."),
});

const heroExtra = z.object({
  secondaryLabel: z.string().optional(),
  secondaryHref: z.string().optional(),
});

const storiesExtra = z.object({ items: z.array(story).default([]) });

const schemas = {
  hero: heroExtra,
  stories: storiesExtra,
  about: aboutExtra,
  outcomes: outcomesExtra,
  difference: differenceExtra,
  insights: insightsExtra,
  perspectives: perspectivesExtra,
  tech: techExtra,
  contact: contactExtra,
} as const;

export type BlockExtra<K extends keyof typeof schemas> = z.infer<(typeof schemas)[K]>;

/** Parses a block's `extra` for one section; an invalid or missing payload yields the schema defaults. */
export function blockExtra<K extends keyof typeof schemas>(block: Block | undefined, kind: K): BlockExtra<K> {
  const schema = schemas[kind] as unknown as z.ZodType<BlockExtra<K>>;
  const parsed = schema.safeParse(block?.extra ?? {});
  if (parsed.success) return parsed.data;
  console.warn(`[home-blocks] invalid extra for ${kind}:`, z.prettifyError(parsed.error));
  return schema.parse({});
}
