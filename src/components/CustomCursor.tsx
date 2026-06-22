"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isTouch, setIsTouch] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    const hasTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isNarrow = window.matchMedia("(max-width: 768px)").matches;
    if (hasTouch || isNarrow) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", onMouseMove);

    const style = document.createElement("style");
    style.id = "custom-cursor-styles";
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      const el = document.getElementById("custom-cursor-styles");
      if (el) el.remove();
    };
  }, [onMouseMove]);

  if (isTouch) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-foreground/40"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        width: 6,
        height: 6,
      }}
    />
  );
}
