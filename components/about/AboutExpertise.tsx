import { Img } from "@/components/media/Img";
import { DraftNote } from "@/components/ui/DraftTag";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  items: { title: string; body: string | null }[];
  /** The design's three card photographs; null in the public build, where the cards keep their shape without them. */
  photos: boolean;
  /** Items beyond the design's three slots, listed for the client rather than dropped silently. */
  overflow: { title: string; body: string | null }[];
}

const CARDS = 3;
const PHOTOS = ["images/about/expertise-1.webp", "images/about/expertise-2.webp", "images/about/expertise-3.webp"];

/**
 * "Our Expertise" (Figma 274:1617, band y 4774-5469): a centred eyebrow, 42px heading and lead, then three
 * 378x291 photo cards (r10, drop shadow) with a dark gradient foot carrying the card title, a paragraph under each
 * card, and a closing line.
 *
 * Round 8 replaced the icon cards with the design's image cards. The design has **three** slots; the client's
 * `whyUs` block currently carries six items, so the first three fill the cards and the remaining three are listed
 * in CONTENT_TODO.md and shown to the reviewer below the row rather than wrapped onto a second row that the design
 * does not have. Which three belong here is a question for the client.
 *
 * The photographs are the designer's, so they are drafts-preview only; without them the cards keep their size and
 * the title sits on the gradient alone.
 */
export function AboutExpertise({ eyebrow, heading, body, items, photos, overflow }: Props) {
  if (items.length === 0) return null;
  const cards = items.slice(0, CARDS);
  return (
    <section data-compare="about-expertise" aria-labelledby="about-expertise-heading" className="bg-white py-14 lg:py-[48px]">
      <div className="container-about">
        <div className="mx-auto max-w-[838px] text-center" data-reveal>
          {eyebrow && <p className="font-ui text-[1.25rem] font-medium uppercase tracking-[0.04em] text-blue-500">{eyebrow}</p>}
          {heading && (
            <h2 id="about-expertise-heading" className="mt-3 font-ui text-[clamp(1.75rem,1.1rem+2vw,2.625rem)] font-bold leading-[1.31] text-[#333E63]">
              {heading}
            </h2>
          )}
          {body && <p className="mx-auto mt-4 max-w-[687px] font-ui text-[1.125rem] leading-[1.45] text-[#132B50]/80">{body}</p>}
        </div>

        <ul className="mt-9 grid gap-[30px] sm:grid-cols-2 lg:mt-[37px] lg:grid-cols-3" role="list">
          {cards.map((it, i) => (
            <li key={it.title} data-reveal>
              <div className="relative overflow-hidden rounded-[10px] shadow-[0_3px_14px_rgb(0_0_0/0.16)]">
                {photos ? (
                  <Img src={PHOTOS[i]} alt="" aria-hidden="true" width={378} height={291} sizes="(min-width: 1024px) 378px, 100vw" className="h-[291px] w-full object-cover" />
                ) : (
                  <div className="h-[291px] w-full bg-navy-900" aria-hidden="true" />
                )}
                {/* The foot gradient and title, exactly as the frame stacks them (104px tall, title 24/55). */}
                <div className="absolute inset-x-0 bottom-0 flex h-[104px] items-center bg-[linear-gradient(180deg,rgb(10_10_10/0)_0%,#021526_100%)] px-5">
                  <h3 className="font-ui text-[1.5rem] font-bold leading-[1.3] text-white">{it.title}</h3>
                </div>
              </div>
              {it.body && <p className="mt-7 font-ui text-[1.125rem] leading-[1.45] text-[#132B50]/80">{it.body}</p>}
            </li>
          ))}
        </ul>

        {/* Review aid only: a visitor never sees which items the design had no room for. */}
        {photos && overflow.length > 0 && (
          <DraftNote className="mt-8">
            the design has three cards and the client&rsquo;s copy has {items.length} items. Not shown here:{" "}
            {overflow.map((o) => o.title).join("; ")}. Which three belong in this band is a question for the client (CONTENT_TODO.md).
          </DraftNote>
        )}
      </div>
    </section>
  );
}
