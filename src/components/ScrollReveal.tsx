"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  offset?: number;
}

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  offset = 60,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const yUp = useTransform(progress, [0, 0.3], [offset, 0]);
  const xLeft = useTransform(progress, [0, 0.3], [-offset, 0]);
  const xRight = useTransform(progress, [0, 0.3], [offset, 0]);
  const scale = useTransform(progress, [0, 0.3], [0.9, 1]);
  const opacity = useTransform(progress, [0, 0.2], [0, 1]);

  const transforms: Record<string, object> = {
    up: { y: yUp, opacity },
    left: { x: xLeft, opacity },
    right: { x: xRight, opacity },
    scale: { scale, opacity },
  };

  return (
    <motion.div
      ref={ref}
      style={{ ...transforms[direction], transitionDelay: `${delay}s` }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxImageProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxLayer({ children, className = "", speed = 0.3 }: ParallaxImageProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -100}px`, `${speed * 100}px`]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
