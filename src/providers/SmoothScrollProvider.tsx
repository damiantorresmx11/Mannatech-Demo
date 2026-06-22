"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Lenis disabled — native scroll + GSAP ScrollTrigger only */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ScrollTrigger.defaults({ scroller: window });
    ScrollTrigger.refresh();
  }, []);

  return <>{children}</>;
}

/** No-op hooks for components that imported them */
export function useLenis() {
  return null;
}

export function useLenisLock(_locked: boolean) {}
