"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useSpring, useInView, useMotionValue, useTransform } from "framer-motion";

interface NumberTickerProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export function NumberTicker({
  value,
  suffix = "",
  prefix = "",
  className = "",
  duration = 2,
}: NumberTickerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) => `${prefix}${Math.round(v)}${suffix}`);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      motionValue.set(value);
      setHasAnimated(true);
    }
  }, [isInView, value, motionValue, hasAnimated]);

  return (
    <motion.span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </motion.span>
  );
}
