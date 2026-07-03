"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQBlockProps {
  items: { question: string; answer: string }[]
}

export function FAQBlockWrapper({ items }: FAQBlockProps) {
  const [open, setOpen] = useState<number | null>(null)

  if (!items?.length) return null

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {item.question}
                <ChevronDown className={`w-5 h-5 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
