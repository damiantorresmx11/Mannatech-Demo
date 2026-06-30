"use client";

import { createContext, useContext, useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}

/** Hook to access the Lenis instance */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Hook to lock/unlock Lenis scroll (for modals, drawers, etc.)
 * This prevents the previous bug where cart drawer couldn't scroll.
 * Instead of stopping Lenis entirely, we just stop/start it.
 */
export function useLenisLock(locked: boolean) {
  const lockRef = useRef(locked);
  lockRef.current = locked;

  useEffect(() => {
    if (!locked) return;

    // Find the Lenis instance on window (Lenis stores itself there)
    // Use a small delay to ensure Lenis is initialized
    const timer = setTimeout(() => {
      const html = document.documentElement;
      if (locked) {
        html.setAttribute("data-lenis-prevent", "");
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.documentElement.removeAttribute("data-lenis-prevent");
    };
  }, [locked]);
}
