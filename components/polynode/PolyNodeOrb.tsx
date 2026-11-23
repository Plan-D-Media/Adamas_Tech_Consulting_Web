"use client";

import { useEffect, useRef, useState } from "react";
import { mountPolyNodeOrb, type PolyNodeHandle, type PolyNodeOptions } from "@/components/polynode/polynode-orb";

/**
 * The 3D lattice itself. It is only ever reached through `DifferenceOrb`, which decides whether 3D is wanted at
 * all and loads this file with a client-only dynamic import, so `three` never enters the initial bundle.
 *
 * It fills its positioned parent. The poster stays visible underneath until the first frame has painted, so
 * there is no flash of an empty circle and no layout shift: the parent owns the box, this fills it.
 */

interface Props extends PolyNodeOptions {
  className?: string;
  /** Called once the first frame is on screen, so the poster can fade out. */
  onReady?: () => void;
}

export default function PolyNodeOrb({ className, turns = 1, hoverStrength = 1, figureScale = 0.56, background = "orb", onReady }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let handle: PolyNodeHandle | undefined;
    let cancelled = false;

    (async () => {
      try {
        const THREE = await import("three");
        if (cancelled || !ref.current) return;
        handle = mountPolyNodeOrb(ref.current, THREE, { turns, hoverStrength, figureScale, background });
        // Two frames: one for the scene's own first render, one for the compositor to paint it.
        requestAnimationFrame(() => requestAnimationFrame(() => !cancelled && onReady?.()));
      } catch (e) {
        // A driver that refuses a context, a blocked chunk: keep the poster rather than an empty box.
        console.warn("[PolyNodeOrb] 3D unavailable, keeping the poster", e);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      handle?.dispose();
    };
  }, [turns, hoverStrength, figureScale, background, onReady]);

  if (failed) return null;
  return <div ref={ref} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0 }} />;
}
