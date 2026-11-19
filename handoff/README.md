# PolyNodeOrb — implementation brief for Claude Code

Add an interactive 3D glass lattice (icosahedron, glowing nodes and struts) on a blue circular orb to the existing Next.js site.

## Files
- `PolyNodeOrb.tsx` — client React component (`'use client'`).
- `polynode-orb.js` — the three.js scene, motion and model. Framework-agnostic; keep it next to the component.

## Install
```
npm i three
npm i -D @types/three
```
Put both files in e.g. `components/polynode/`. `allowJs` is on by default in Next's tsconfig; if not, rename the module to `.ts`.

## Use
```tsx
import PolyNodeOrb from '@/components/polynode/PolyNodeOrb';

<PolyNodeOrb size={353} />
// responsive: <PolyNodeOrb size="min(80vw, 420px)" />
```
If the page is server-rendered and you see hydration/WebGL issues, load it with `dynamic(() => import('...'), { ssr: false })`.

## Props
- `size` (number | string, default 353): orb diameter.
- `turns` (default 1): full Y rotations as the orb travels through the viewport.
- `hoverStrength` (default 1): tilt amount toward the cursor; `0` disables.
- `figureScale` (default 0.56): figure diameter relative to the orb.

## Behaviour
- **Background:** only the orb. A circle with a radial gradient from `#1167D8` in the center to `#328BFF` at the edge, taken from the design file. The canvas is transparent, so there is no other background.
- **Hover:** the figure leans toward the cursor, scales to 1.07 and the core glow brightens. Everything is eased with lerp 0.08.
- **Scroll:** progress runs from 0 (orb enters the bottom of the viewport) to 1 (orb leaves the top). It drives the Y rotation (`turns` × 360°) and an X tip.
- **Idle:** a slow spin and a gentle float.
- **Reduced motion:** honours `prefers-reduced-motion`, with no easing, spin or float.
- **Performance:** rendering pauses offscreen (IntersectionObserver), pixel ratio is capped at 2, and the component cleans up on unmount.

## Note
The design file's orb also has a texture layer at 30% opacity, but its image data was empty in the export and could not be recovered. To restore it, put the texture in `/public` and add it to the orb's background in **both** files: the component's style and `ORB_BACKGROUND` in `polynode-orb.js`, which overwrites it on mount.
```
background: url(/orb-texture.png) center/cover, radial-gradient(circle closest-side, #1167D8, #328BFF)
```
Keep the texture at 30% opacity (for example, bake it into the PNG or use a pseudo-element overlay).
