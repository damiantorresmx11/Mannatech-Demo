"use client"

import { motion } from "framer-motion"

interface StatsBlockProps {
  stats: { number: string; label: string; icon?: string }[]
}

export function StatsBlockWrapper({ stats }: StatsBlockProps) {
  if (!stats?.length) return null

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-8`}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-mannatech mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
