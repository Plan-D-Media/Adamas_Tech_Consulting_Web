import { z } from "zod";
import type { Block } from "@/lib/data/site";
import { mediaUrl } from "@/lib/media";

/**
 * Typed readers for the service-page ContentBlock rows' `extra` JSON (seeded in content/blocks.ts under the keys
 * `services.<pillar>.<section>`), the Cloud Services design (Figma 292:24608) being the template for every pillar.
 * Invalid JSON falls back to the schema defaults rather than breaking the page.
 */

const media = z.string().min(1).transform((key) => mediaUrl(key));

const schemas = {
  hero: z.object({ image: media.optional(), imageAlt: z.string().default("") }),
  intro: z.object({
    secondaryLabel: z.string().optional(),
    secondaryHref: z.string().optional(),
    image: media.optional(),
    imageAlt: z.string().default(""),
    pills: z.array(z.string()).default([]),
  }),
  difference: z.object({}),
  stats: z.object({ items: z.array(z.object({ value: z.string(), label: z.string(), image: media.optional() })).default([]) }),
  expertise: z.object({
    accent: z.string().optional(),
    cards: z.array(z.object({ title: z.string(), body: z.string(), image: media.optional() })).default([]),
  }),
  platforms: z.object({
    accent: z.string().optional(),
    note: z.string().optional(),
    items: z.array(z.object({ title: z.string(), summary: z.string(), detail: z.string().optional(), image: media.optional() })).default([]),
  }),
  industries: z.object({ items: z.array(z.object({ label: z.string(), image: media.optional(), imageAlt: z.string().default(""), href: z.string().default("/contact") })).default([]) }),
  capabilities: z.object({ prefix: z.string().default("Adamas"), ctaLabel: z.string().default("Discuss This Service"), ctaHref: z.string().default("/contact") }),
  cases: z.object({ note: z.string().optional() }),
  ecosystem: z.object({ note: z.string().optional(), items: z.array(z.object({ name: z.string(), image: media.optional() })).default([]) }),
  quality: z.object({
    accent: z.string().optional(),
    items: z.array(z.string()).default([]),
    badge: z.string().default("Adamas"),
    badgeCaption: z.string().default("Delivery principles"),
    noteLabel: z.string().default("Important"),
    note: z.string().optional(),
  }),
  faq: z.object({}),
} as const;

export type ServiceBlockExtra<K extends keyof typeof schemas> = z.infer<(typeof schemas)[K]>;

export function serviceBlockExtra<K extends keyof typeof schemas>(block: Block | undefined, kind: K): ServiceBlockExtra<K> {
  const schema = schemas[kind] as unknown as z.ZodType<ServiceBlockExtra<K>>;
  const parsed = schema.safeParse(block?.extra ?? {});
  if (parsed.success) return parsed.data;
  console.warn(`[service-blocks] invalid extra for ${kind}:`, z.prettifyError(parsed.error));
  return schema.parse({});
}

/** Block lookup for one pillar: `services.<slug>.<section>`. */
export function pillarBlock(blocks: Record<string, Block>, slug: string, section: keyof typeof schemas): Block | undefined {
  return blocks[`services.${slug}.${section}`];
}
