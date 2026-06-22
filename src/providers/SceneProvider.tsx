"use client";

import { createContext, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";

type DeviceTier = "high" | "mid" | "low" | "none";

interface SceneContextValue {
  tier: DeviceTier;
  canvasReady: boolean;
}

const SceneContext = createContext<SceneContextValue>({ tier: "none", canvasReady: false });

export function useDeviceTier() {
  return useContext(SceneContext).tier;
}

export function useCanvasReady() {
  return useContext(SceneContext).canvasReady;
}

// Lazy load the Canvas only when needed
const LazyCanvas = dynamic(
  () => import("./SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false }
);

function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "none";

  // No WebGL support
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return "none";

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
      : "";

    // Mobile GPU detection
    const isMobile = /android|iphone|ipad|mobile/i.test(navigator.userAgent);
    if (isMobile) return "low";

    // Integrated GPUs
    if (/intel|mesa|swiftshader|llvmpipe/i.test(renderer)) return "mid";

    // Dedicated GPUs
    return "high";
  } catch {
    return "none";
  }
}

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<DeviceTier>("none");
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const detected = detectTier();
    setTier(detected);

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setTier("none");
    }
  }, []);

  return (
    <SceneContext.Provider value={{ tier, canvasReady }}>
      {children}
    </SceneContext.Provider>
  );
}
