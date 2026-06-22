"use client";

import { motion } from "framer-motion";

interface ShimmerButtonProps {
  children: React.ReactNode;
  shimmerColor?: string;
  background?: string;
  className?: string;
  onClick?: () => void;
}

export function ShimmerButton({
  children,
  shimmerColor = "rgba(255,255,255,0.2)",
  background = "var(--mannatech, #00A88F)",
  className = "",
  onClick,
}: ShimmerButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl px-8 py-4 font-semibold text-white shadow-lg ${className}`}
      style={{ background }}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(105deg, transparent 30%, ${shimmerColor} 50%, transparent 70%)`,
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
      />
    </motion.button>
  );
}
