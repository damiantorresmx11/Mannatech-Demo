"use client";

import { motion } from "framer-motion";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export function AnimatedGradientText({
  children,
  className = "",
  colors = ["#00A88F", "#69CA98", "#66C7EC", "#00A88F"],
  speed = 4,
}: AnimatedGradientTextProps) {
  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        backgroundSize: "300% 100%",
      }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}
