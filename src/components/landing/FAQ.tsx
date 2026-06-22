"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

const FAQ_COUNT = 5;

export function FAQ() {
  const t = useTranslations("landing.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(idx: number) {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  }

  return (
    <section id="faq" data-label="FAQ" className="py-24 bg-white dark:bg-zinc-900 scroll-snap-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mannatech mb-4">
            {t("overline")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
            {t("headline")}
          </h2>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </motion.div>

        <div className="space-y-3">
          {Array.from({ length: FAQ_COUNT }).map((_, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.08,
                  ease: "easeOut" as const,
                }}
                className="border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span className="pr-4">{t(`items.${idx}.question`)}</span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mannatech/10 flex items-center justify-center text-mannatech" aria-hidden="true">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" as const }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-muted-foreground leading-relaxed text-sm">
                        {t(`items.${idx}.answer`)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
