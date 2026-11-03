"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Loads only Motion's DOM animation features (no layout/drag), keeping the initial bundle small.
 * Components use `m.*` instead of `motion.*`; `strict` catches any accidental `motion.*` import.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
