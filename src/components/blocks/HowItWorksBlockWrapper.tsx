"use client"

import { motion } from "framer-motion"

interface HowItWorksBlockProps {
  steps: { title: string; description: string; icon?: string }[]
}

export function HowItWorksBlockWrapper({ steps }: HowItWorksBlockProps) {
  if (!steps?.length) return null

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Como Funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-mannatech/10 text-mannatech font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
