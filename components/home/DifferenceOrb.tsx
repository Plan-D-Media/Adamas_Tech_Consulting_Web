"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Img } from "@/components/media/Img";

/**
 * The lattice at the centre of "Why Organisations Choose Adamas", in the slot the flat polyhedron used to fill.
 *
 * This component is the gate. It renders the **poster** - the same flat artwork - and only then decides whether
 * to fetch the 3D at all. Everything that could make 3D a bad idea is checked here, so `PolyNodeOrb` and `three`
 * are never downloaded when the answer is no:
 *
 * - no WebGL, or a driver that refuses a context;
 * - `prefers-reduced-motion: reduce`;
 * - `navigator.connection.saveData`;
 * - a viewport under 768px;
 * - the section is not near the viewport yet (a 400px-margin IntersectionObserver).
 *
 * The poster is a real `<img>` in the server HTML at the final size, in a box that is square whatever happens,
 * so there is no layout shift and the page's LCP candidate is untouched. The canvas fades in over it once its
 * first frame has painted, and the blue circle behind stays the parent's - the scene is told not to paint one.
 */

const PolyNodeOrb = dynamic(() => import("@/components/polynode/PolyNodeOrb"), { ssr: false });

/** Cheap probe: a context dropped straight away, so a machine without WebGL never pays for the chunk. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function DifferenceOrb({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const allowed = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      if (window.matchMedia("(max-width: 767.98px)").matches) return false;
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (conn?.saveData) return false;
      return hasWebGL();
    };
    if (!allowed()) return;

    // Only fetch the chunk when the section is nearly in view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={`relative aspect-square ${className ?? ""}`}>
      <Img
        src="images/home/difference-network.webp"
        alt=""
        aria-hidden="true"
        width={193}
        height={193}
        sizes="193px"
        className={`h-full w-full object-contain transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {load && (
        <PolyNodeOrb
          onReady={onReady}
          background="none"
          figureScale={0.92}
          className={`transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
