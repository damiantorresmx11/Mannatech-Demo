"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

const TESTIMONIAL_COUNT = 3;

const avatarColors = ["#00A88F", "#00529D", "#E21C1F"];

export function Testimonials() {
  const t = useTranslations("landing.testimonials");
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % TESTIMONIAL_COUNT), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + TESTIMONIAL_COUNT) % TESTIMONIAL_COUNT), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <section className="py-24 bg-[#FAFAF8] dark:bg-zinc-950">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
          {/* Left — label + navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-4">
              {t("overline")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
              Lo que dicen{" "}
              <span className="font-heading italic font-normal text-mannatech">
                nuestros clientes
              </span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Miles de personas han transformado su bienestar con nuestros productos respaldados por ciencia.
            </p>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-mannatech hover:text-mannatech transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-mannatech hover:text-mannatech transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <span className="ml-3 text-sm text-muted-foreground font-mono">
                {String(current + 1).padStart(2, "0")} / {String(TESTIMONIAL_COUNT).padStart(2, "0")}
              </span>
            </div>
          </motion.div>

          {/* Right — testimonial card */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: "easeOut" as const }}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-10 shadow-[0_4px_40px_-8px_rgba(0,0,0,0.06)] border border-border/50"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg sm:text-xl text-foreground leading-relaxed mb-8 font-medium">
                  &ldquo;{t(`items.${current}.text`)}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: avatarColors[current] }}
                  >
                    {t(`items.${current}.initials`)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t(`items.${current}.name`)}</p>
                    <p className="text-sm text-muted-foreground">{t(`items.${current}.role`)}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
