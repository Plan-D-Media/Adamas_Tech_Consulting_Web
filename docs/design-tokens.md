# Design tokens

Source of truth: the approved Figma file (`vpITDkp55Gla7w1HEP6zaL`, page "v2 uPDATED": Home Page 236:1395, Mega Menu 236:4658, Cloud Services 292:24608). Values were read from the node data through the REST API (saved under `design-ref/figma/`, gitignored), not guessed. Every token lives in **one** place, `app/globals.css` (`@theme`), and is wired into Tailwind from there. Components use tokens only.

Where the file is inconsistent (it mixes eight font families and several near-identical blues), the table says which value won and why. Those decisions are also in `docs/design-notes.md` for the designer to confirm.

## Colour

| Token | Hex | Figma use | Notes |
|---|---|---|---|
| `blue-500` | `#1C85FF` | Mega-menu links ("Services overview", "Explore Cloud Services"), contact heading | Text link colour |
| `blue-600` | `#1167D8` | Section eyebrows, "Talk to an expert", active menu item, footer phone links, card "Read Case Study" | Primary |
| `blue-650` | `#1266DF` | Industries section accents | Near-duplicate of blue-600; kept for the Industries section only |
| `blue-700` | `#0E5CA7` | Outline display word "IMPACT" | Decorative |
| `blue-800` | `#0C4A8B` | Outline display word "ADAMAS" | Decorative |
| `navy-950` | `#000C33` | Hero base, header band, mega-menu backdrop | |
| `navy-900` | `#071C36` | Footer, dark cards, mega-menu feature card, hero gradient | |
| `navy-800` | `#0A1930` | H2 headings, card titles | Default text colour |
| `navy-700` | `#1E3E66` | Footer rules and bordered buttons | |
| `ink` | `#14142B` | Nav links | |
| `ink-soft` | `#10263D` | Secondary button text | |
| `grey-700` | `#3A4B63` | Descriptor text on light (mega menu, presence cards) | |
| `grey-600` | `#5F6C7D` | Body copy on light | 4.9:1 on white |
| `grey-500` | `#5B6B80` | Menu descriptors, small labels | 5.4:1 on white |
| `grey-300` | `#B7C8DC` | Muted text on dark | 10.4:1 on navy-900 |
| `grey-200` | `#D5E0EB` | Rules on light | |
| `grey-150` | `#DCE2E8` | Secondary button stroke | |
| `grey-100` | `#CCCDCF` | Mega-menu panel background | As designed; probably a placeholder, flagged |
| `tint-100` | `#EEF6FC` | Active mega-menu category | |
| `tint-50` | `#F3F8FD` | Light section background | |
| `tint-25` | `#F9F9FB` | Card background | |
| `sky-400` | `#4FB6E2` | Footer column headings, dark-card eyebrows, "Explore" links on dark | |
| `sky-300` | `#70C7F0` | Dark-card eyebrows (Client Outcomes, Perspectives) | |
| `sky-200` | `#8FD3EF` | "Name to be confirmed" tags | |
| `sky-100` | `#CCE2FF` | "OUR APPROACH" label on the about image card | |
| `orange-500` | `#EE8D1B` | Hero eyebrow, carousel progress | 2.6:1 on navy: decorative/large text only |
| `orange-600` | `#DC7C12` | Mega-menu feature link "Read the story" | |
| `white` | `#FFFFFF` | | |

## Typography

Figma uses Manrope (most section copy), Roboto (nav, hero, card titles, form), Figtree (descriptors, footer, small text) and, in isolated nodes, Archivo, Inter, Poppins, 42dot Sans and Degulardisplay. Three families are loaded with `next/font/google` (variable fonts, latin subset, `display: swap`; only Manrope is preloaded). The stray families map to the nearest loaded one; see `docs/design-notes.md`.

| Token | Family | Figma family | Where |
|---|---|---|---|
| `font-heading` | Manrope | Manrope | Eyebrows, H2/H3, section copy, cards, footer office names (Figma: Archivo) |
| `font-ui` | Roboto | Roboto (buttons: Inter) | Nav, hero H1, card titles (22/32), form fields, buttons |
| `font-body` | Figtree | Figtree (hero line: Poppins) | Descriptors, footer, addresses, labels, tags |

| Token | Size / line-height / tracking | Weight | Figma node | Use |
|---|---|---|---|---|
| `display` | 62 / 72.7 | 700 Roboto | Hero H1 | One per homepage |
| `h2` | 43 / 49 / -1.5px | 700 Manrope | Section headings | |
| `h3` | 28 / 34 | 700 Manrope | Feature titles (event card, outcome card) | |
| `h4` | 22 / 29 / -0.44px | 700 Roboto | Tech Excellence and office card titles | |
| `menu` | 18 / 28 | 700 Roboto | Mega-menu categories | |
| `menu-link` | 17 / 28 | 600 Roboto | Mega-menu links | |
| `lead` | 20 / 29 | 400 Manrope | Section intros | |
| `body` | 16 / 25 | 400 Manrope / Figtree | Body copy | |
| `nav` | 16 / 19 | 400 Roboto | Main nav | |
| `small` | 15 / 25 | 400 Figtree | Footer links, descriptors | |
| `caption` | 14 / 21 | 400 Figtree | Addresses, meta, top bar | |
| `eyebrow` | 28 / 28 / +1.3px, caps | 800 Manrope | Section eyebrows ("OUR SERVICES") | Top Stories uses 18px in Figma: treated as the same style |
| `label` | 12 / 14.4 / +1.68px, caps | 700 Figtree | Footer column headings, "CASE STUDY" | |
| `button` | 13 / 20 | 700 (Inter in Figma) | Buttons | |

Mobile sizes are not designed; components scale the display and h2 sizes with `clamp()` and keep everything else as designed (recorded in `docs/design-notes.md`).

## Spacing and layout

| Token | Value | Figma |
|---|---|---|
| `container-site` | 1320px | Page sections at x 300-1620 (1920 frame) |
| `container-chrome` | 1312px | Header, mega menu, footer outer box at x 304-1616 |
| `container-chrome-inner` | 1216px | Their content (48px inset): logo at 352, nav, CTA ends at 1557 |
| Section padding | 96 top / 80 bottom (Partners section frame); 108/108 on Cloud Services sections | |
| Gutters | 16 (under 768), 32 (768+), 48 (1024+) | Not designed below 1920 |
| Breakpoints | Tailwind defaults plus `xs` 416 and `nav` 1200 (desktop nav) | |
| Header | Top bar 35, glass bar 70, total 118 | Group 21303 |
| Mega-menu panel | 45px below the header bar, padding 40/48, columns 280 / flexible / 280 | Container 236:4572 |

## Radius

| Token | px | Use |
|---|---|---|
| `xs` | 2 | Mega-menu link hover, flags, footer buttons |
| `sm` | 5 | Header "Talk to an expert" |
| `md` | 10 | Header glass bar, hero buttons |
| `lg` | 12 | Active menu category, feature cards |
| `xl` | 15 | Hero carousel cards |
| `2xl` | 24 | Section cards (Top Stories, Products) |
| `pill` | 30 | Hero eyebrow pill |

## Shadows and effects

| Token | Value | Figma |
|---|---|---|
| `card` | 0 2 6 -1 rgb(0 0 0 / .12) | Cards |
| `float` | 0 12 30 -2 rgb(0 0 0 / .06) | Floating cards |
| `lift` | 0 10 40 rgb(0 0 0 / .16) | Mega-menu panel, dropdowns |
| `hero-cards` | 0 24 6 rgb(0 0 0 / .25) | Hero carousel frame |
| `glow` | 0 4 16 rgb(255 255 255 / .16) | Light glow on dark |
| `header` | 0 8 24 -8 rgb(0 12 51 / .35) | Sticky header once scrolled (not in Figma) |
| Glass bar | white 80% + 1px white stroke + backdrop blur | Rectangle 3792 (Figma has no blur; added so text stays readable over images) |

## Motion

| Token | Value |
|---|---|
| `ease-out` | cubic-bezier(.2,.7,.2,1) |
| `ease-in-out` | cubic-bezier(.6,0,.4,1) |
| `duration-fast` | 160ms (hover) |
| `duration-base` | 240ms (menus, tabs; mega menu uses 200ms) |
| `duration-slow` | 600ms (reveals) |

`prefers-reduced-motion`: transitions and animations are disabled globally; Motion components check `useReducedMotion`.
