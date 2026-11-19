import "server-only";
import { previewingDrafts } from "@/lib/preview";

/**
 * Figma copy for About sections the client has not supplied content for yet (round 8, 18 Nov 2026).
 *
 * The fidelity rule for this round is that every Figma section is built, in Figma's order, with Figma's layout -
 * content gating changes what is *inside* a section, never whether the section exists. Where the client has content
 * it comes from the database as usual. Where it does not, the drafts preview shows the designer's copy with a Draft
 * badge so the client can approve or replace it; the public build renders nothing, because `figmaDraft()` returns
 * null whenever drafts are not being previewed.
 *
 * This module is deliberately not in the database. It is the *designer's* copy awaiting client sign-off, not client
 * content, and it must never be publishable by accident; the moment the client approves a block it moves into
 * content/pages.ts as a real Page block and the entry here is deleted. Every item below is also listed in
 * CONTENT_TODO.md and docs/qa/evidence/phase2/client-content-request.md.
 *
 * Filler that must never be shown, even in the preview, is NOT here: HCLTech's figures, the "Miyah Myles"
 * testimonials, the Lorem Ipsum / HP client logos, the fake award badges, the "1790 / 491 / 245 / 1090" stats and
 * the stock leadership names. Those sections keep their Figma layout but are filled with neutral placeholders by
 * their components (see `placeholderSlots`).
 */

export interface FigmaDraftContent {
  company: {
    /** "12 Years' Experience In It" in the frame. Unverified, so drafts-preview only, with a Draft tag. */
    figureValue: string;
    figureLabel: string;
  };
  commitment: {
    eyebrow: string;
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    points: { lead: string; rest: string }[];
  };
  direction: {
    eyebrow: string;
    heading: string;
    body: string;
    items: string[];
  };
  progress: {
    heading: string;
    body: string;
  };
  clients: {
    eyebrow: string;
    heading: string;
    /** Unverified in the design; shown DRAFT, never in the public build. */
    figures: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
  statement: {
    /** Alternating runs: the design sets the emphasised phrases white over grey (styleOverrideTable 3). */
    runs: { text: string; emphasis: boolean }[];
    footLead: string;
    footLink: string;
    footHref: string;
  };
  life: {
    eyebrow: string;
    heading: string;
    videoLabel: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    ctaLabel: string;
    ctaHref: string;
    callLabel: string;
  };
}

const CONTENT: FigmaDraftContent = {
  // Figma band y 588-1094. No Stat row is verified yet, so the design's figure stands in, marked Draft.
  company: {
    figureValue: "12",
    figureLabel: "Years' Experience In It",
  },

  // Figma band y 2089-3081. "Our Commitment", the blue gradient band under the video card.
  commitment: {
    eyebrow: "Our Commitment",
    heading: "We Strive to Make Technology Work Better for Your Business",
    body: "We focus on simplifying complex operations through practical technology solutions, strategic consulting and reliable implementation.",
    ctaLabel: "Start a project",
    ctaHref: "/contact",
    points: [
      { lead: "The World:", rest: "Scalable digital transformation" },
      { lead: "Individually:", rest: "Connected enterprise capabilities" },
      { lead: "Team:", rest: "Scalable digital transformation" },
    ],
  },

  // Figma band y 3164-3747. "Middle East" in the second item is rendered "GCC" per the region-label rule
  // (docs/design-notes.md); that is one of the listed allowed differences from the design.
  direction: {
    eyebrow: "Our Strategic Direction",
    heading: "Building What's Next, Together.",
    body: "We aim to empower enterprises through reliable technology, deep domain expertise and meaningful partnerships - creating sustainable business value through every stage of digital transformation.",
    items: [
      "Build deeper capabilities across Cloud, SAP and enterprise application services to deliver scalable, business-focused solutions.",
      "Strengthen our reach across India, the UK, Ireland and the GCC while building lasting relationships with enterprise clients.",
      "Work closely with clients to understand their business priorities and deliver tailored technology solutions that create lasting value.",
      "Embed security, quality standards and strong governance into every engagement to ensure reliable and responsible delivery.",
      "Foster continuous improvement, operational efficiency and innovation to support sustainable growth for our clients and our organisation.",
    ],
  },

  // Figma band y 3859-4664. The nine figures in the design are HCLTech's and are never rendered; the component
  // draws nine neutral placeholder cards instead.
  progress: {
    heading: "Progress in Numbers",
    body: "Powered by a global team, we deliver smarter, better ways for all our stakeholders to benefit from technology.",
  },

  // Figma band y 6440-6877.
  clients: {
    eyebrow: "Our Clients & Partners",
    heading: "Organisations That Inspire Our Work",
    figures: "150+ Satisfied Clients. 1M+ ROI Increased",
    body: "We value every relationship built on collaboration, technology expertise and a shared commitment to business progress.",
    ctaLabel: "Start a project",
    ctaHref: "/contact",
  },

  // Figma band y 6997-7972.
  statement: {
    runs: [
      { text: "The Future Starts With ", emphasis: false },
      { text: "Better Technology. We combine", emphasis: true },
      { text: " innovation and expertise to deliver meaningful ", emphasis: false },
      { text: "business impact.", emphasis: true },
    ],
    footLead: "Choose your initial foundation and plan.",
    footLink: "Start right here & now.",
    footHref: "/contact",
  },

  // Figma band y 8092-9111.
  life: {
    eyebrow: "Life at Adamas",
    heading: "People. Collaboration. Innovation.",
    videoLabel: "Watch video",
  },

  // Figma band y 9474-10052. The four figures under the band are the template's and are never rendered.
  cta: {
    eyebrow: "Do you have any project?",
    heading: "Let's Talk About Your Business Technology Goals",
    ctaLabel: "Free consultation",
    ctaHref: "/contact",
    callLabel: "Call us",
  },
};

/** The designer's About copy while drafts are previewed; `null` in the public build. */
export function figmaDraft(): FigmaDraftContent | null {
  return previewingDrafts ? CONTENT : null;
}

/**
 * `count` neutral placeholder slots for a band whose Figma content is filler that must never be shown (another
 * company's figures, stock testimonials, borrowed logos, invented award badges). The layout is kept; only the
 * contents are replaced, and every slot is marked Draft.
 */
export function placeholderSlots(count: number): { key: string }[] {
  return Array.from({ length: count }, (_, i) => ({ key: `slot-${i + 1}` }));
}
