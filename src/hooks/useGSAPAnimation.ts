"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface UseGSAPAnimationOptions {
  scope?: React.RefObject<HTMLElement | null>;
  dependencies?: unknown[];
  matchMedia?: string;
}

/**
 * Wrapper around useGSAP with automatic cleanup, scope, and matchMedia support.
 * All animations created inside the callback are auto-cleaned on unmount.
 */
export function useGSAPAnimation(
  callback: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void,
  options: UseGSAPAnimationOptions = {}
) {
  const { scope, dependencies = [], matchMedia } = options;

  useGSAP(
    () => {
      if (matchMedia) {
        const mm = gsap.matchMedia();
        mm.add(matchMedia, () => {
          callback({ gsap, ScrollTrigger });
        });
      } else {
        callback({ gsap, ScrollTrigger });
      }
    },
    {
      scope: scope?.current ? scope : undefined,
      dependencies,
    }
  );
}

/**
 * Standard matchMedia queries for responsive GSAP animations.
 * Combines min-width with prefers-reduced-motion.
 */
export const GSAP_DESKTOP = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
export const GSAP_ALL = "(prefers-reduced-motion: no-preference)";
