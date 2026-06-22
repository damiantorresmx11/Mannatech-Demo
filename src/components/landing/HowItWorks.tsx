"use client";

import { motion } from "framer-motion";
import { Leaf, FlaskConical, HeartPulse } from "lucide-react";
import { useTranslations } from "next-intl";

const icons = [Leaf, FlaskConical, HeartPulse];
const STEP_COUNT = 3;

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.25, ease: "easeOut" as const },
  }),
};

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, delay: 0.3 + i * 0.25, ease: "easeOut" as const },
  }),
};

export function HowItWorks() {
  const t = useTranslations("landing.howItWorks");

  return (
    <section className="py-24 bg-slate-50 dark:bg-zinc-950 scroll-snap-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mannatech mb-4">
            {t("overline")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            {t("headline")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block">
          <div className="relative flex items-start justify-between">
            {Array.from({ length: STEP_COUNT }).map((_, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={stepVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="flex flex-col items-center text-center flex-1 relative z-10"
                >
                  {/* Step number */}
                  <span className="text-xs font-semibold text-mannatech/60 uppercase tracking-widest mb-4">
                    {t("stepLabel", { number: i + 1 })}
                  </span>
                  {/* Circle icon */}
                  <div className="w-20 h-20 rounded-full bg-mannatech/10 border-2 border-mannatech/30 flex items-center justify-center mb-6 relative">
                    <Icon size={32} className="text-mannatech" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{t(`steps.${i}.title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                    {t(`steps.${i}.description`)}
                  </p>
                </motion.div>
              );
            })}

            {/* Connecting lines */}
            <svg
              className="absolute top-[5.5rem] left-0 w-full h-4 pointer-events-none z-0"
              viewBox="0 0 1000 20"
              preserveAspectRatio="none"
            >
              {[0, 1].map((i) => (
                <motion.line
                  key={i}
                  x1={i === 0 ? 200 : 550}
                  y1={10}
                  x2={i === 0 ? 450 : 800}
                  y2={10}
                  stroke="var(--mannatech)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  custom={i}
                  variants={lineVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden space-y-0">
          {Array.from({ length: STEP_COUNT }).map((_, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                custom={i}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex gap-6 relative"
              >
                {/* Vertical line + circle */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-mannatech/10 border-2 border-mannatech/30 flex items-center justify-center flex-shrink-0 relative z-10">
                    <Icon size={24} className="text-mannatech" />
                  </div>
                  {i < STEP_COUNT - 1 && (
                    <div className="w-px flex-1 bg-mannatech/20 my-2" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-12">
                  <span className="text-xs font-semibold text-mannatech/60 uppercase tracking-widest">
                    {t("stepLabel", { number: i + 1 })}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{t(`steps.${i}.title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`steps.${i}.description`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
