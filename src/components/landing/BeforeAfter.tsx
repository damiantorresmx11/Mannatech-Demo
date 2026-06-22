"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useTranslations } from "next-intl";

const PAIN_POINT_COUNT = 5;
const BENEFIT_COUNT = 5;

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.3 + i * 0.08, ease: "easeOut" as const },
  }),
};

export function BeforeAfter() {
  const t = useTranslations("landing.beforeAfter");

  return (
    <section className="py-24 bg-white dark:bg-zinc-900 scroll-snap-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mannatech mb-4">
            {t("overline")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground">
            {t("headline")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
          {/* Left - Without */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="rounded-3xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 p-8 sm:p-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <X size={20} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("without")}</h3>
            </div>
            <ul className="space-y-4">
              {Array.from({ length: PAIN_POINT_COUNT }).map((_, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  variants={listItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <span className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <X size={14} className="text-red-500" />
                  </span>
                  <span className="text-muted-foreground">{t(`painPoints.${i}`)}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Center divider */}
          <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 items-center z-10">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-mannatech/30 to-transparent" />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-mannatech/10 border-2 border-mannatech/30 flex items-center justify-center">
              <span className="text-mannatech font-bold text-lg">vs</span>
            </div>
          </div>

          {/* Right - With */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="rounded-3xl border border-mannatech/20 bg-gradient-to-br from-mannatech/5 to-mannatech/[0.02] p-8 sm:p-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check size={20} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("with")}</h3>
            </div>
            <ul className="space-y-4">
              {Array.from({ length: BENEFIT_COUNT }).map((_, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  variants={listItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <span className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-green-600" />
                  </span>
                  <span className="text-foreground font-medium">{t(`benefits.${i}`)}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
