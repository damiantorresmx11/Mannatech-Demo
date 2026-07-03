"use client"

import { motion } from "framer-motion"

interface SocialProofBlockProps {
  stats: { number: string; label: string }[]
  style?: "light" | "dark"
}

export function SocialProofBlockWrapper({ stats, style = "light" }: SocialProofBlockProps) {
  if (!stats?.length) return null

  const isDark = style === "dark"

  return (
    <section className={`py-16 ${isDark ? "bg-gray-900 text-white" : "bg-white dark:bg-gray-800"}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`text-4xl font-bold mb-1 ${isDark ? "text-mannatech-light" : "text-mannatech"}`}>
                {stat.number}
              </div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
