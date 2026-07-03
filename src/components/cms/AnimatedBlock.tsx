"use client"

import { motion } from "framer-motion"
import { PRESET_MAP } from "@/config/animation-presets"
import type { ReactNode } from "react"

interface Props {
  blockId: string
  blockType: string
  animation?: string
  children: ReactNode
}

export function AnimatedBlock({ blockId, blockType, animation, children }: Props) {
  const preset = animation && animation !== "none" ? PRESET_MAP[animation] : null

  if (!preset) {
    return (
      <div data-block-id={blockId} data-block-type={blockType}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      data-block-id={blockId}
      data-block-type={blockType}
      initial={preset.initial}
      whileInView={preset.whileInView || preset.animate}
      whileHover={preset.whileHover}
      whileTap={preset.whileTap}
      viewport={preset.viewport || { once: true, margin: "-60px" }}
      transition={preset.transition}
    >
      {children}
    </motion.div>
  )
}
