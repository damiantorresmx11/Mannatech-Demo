"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";

interface SceneCanvasProps {
  tier: "high" | "mid" | "low";
  onReady: () => void;
}

export function SceneCanvas({ tier, onReady }: SceneCanvasProps) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[0]"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, tier === "high" ? 2 : 1.5]}
        gl={{
          antialias: tier === "high",
          alpha: true,
          powerPreference: tier === "high" ? "high-performance" : "default",
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Preload all />
      </Canvas>
    </div>
  );
}
