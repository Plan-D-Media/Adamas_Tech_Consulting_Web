'use client';
// PolyNodeOrb — glass lattice on the blue orb, with hover-tilt + scroll-rotate.
// Requires: npm i three   (TS: npm i -D @types/three)
import { useEffect, useRef } from 'react';
import { mountPolyNodeOrb } from './polynode-orb';

type Props = {
  size?: number | string;     // orb diameter, default 353 (matches the design file)
  className?: string;
  turns?: number;             // full rotations across one pass of scroll
  hoverStrength?: number;     // 0 disables hover tilt
  figureScale?: number;       // figure diameter as a fraction of the orb (0.56 ≈ design)
};

export default function PolyNodeOrb({ size = 353, className, turns = 1, hoverStrength = 1, figureScale = 0.56 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dispose: (() => void) | undefined, cancelled = false;
    import('three').then((THREE) => {
      if (cancelled || !ref.current) return;
      dispose = mountPolyNodeOrb(ref.current, THREE, { turns, hoverStrength, figureScale });
    });
    return () => { cancelled = true; dispose?.(); };
  }, [turns, hoverStrength, figureScale]);

  return (
    <div
      ref={ref}
      className={className}
      role="img"
      aria-label="Rotating 3D lattice"
      style={{ width: size, aspectRatio: '1 / 1', position: 'relative', borderRadius: '50%', overflow: 'hidden', background: 'radial-gradient(circle closest-side at 50% 50%, #1167D8 0%, #328BFF 100%)' }}
    />
  );
}
