"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  titulo: string;
  subtitulo: string;
  ctaPrimario: string;
  ctaSecundario: string;
}

interface Slide {
  src: string;
  headline: string;
  subtitle: string;
  cta: string;
  href: string;
}

const SLIDES: Slide[] = [
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2026/05/OsoLean-Chocolate-Banner-WEB.png",
    headline: "OsoLean Chocolate",
    subtitle: "Nuevo sabor, misma ciencia. Proteína para pérdida de grasa.",
    cta: "Descubrir",
    href: "/productos/osolean",
  },
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2026/05/MannaBears-Banner-WEB-2.png",
    headline: "MannaBears",
    subtitle: "Gliconutrientes en gomitas para toda la familia.",
    cta: "Ver Producto",
    href: "/productos/mannabears",
  },
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2024/11/MX-Luminovation.jpg",
    headline: "Luminovation K-Beauty",
    subtitle: "Tecnología de glicanos para una piel radiante.",
    cta: "Explorar",
    href: "/productos/luminovation",
  },
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2024/07/MANNA-ZENWEB.jpg",
    headline: "Manna Zen Prime",
    subtitle: "Equilibrio y bienestar para cuerpo y mente.",
    cta: "Conocer",
    href: "/productos/ambrotose-life",
  },
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2024/05/TRUCONTROL_hero-scaled.jpg",
    headline: "TruControl",
    subtitle: "Control de peso con ciencia avanzada.",
    cta: "Ver Más",
    href: "/productos/osolean",
  },
];

const INTERVAL = 5500;

export function Hero({ ctaPrimario }: HeroProps) {
  const t = useTranslations("landing.hero");
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => setCurrent(i), []);
  const goNext = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(goNext, INTERVAL);
    return () => clearTimeout(id);
  }, [current, paused, goNext]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative w-full overflow-hidden -mt-[72px] bg-black"
      style={{ height: "100vh", minHeight: "600px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt={slide.headline}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-[1]" />
      <div className="absolute inset-0 z-[2] opacity-[0.03]">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute top-28 right-8 z-20 hidden lg:flex flex-col items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30 [writing-mode:vertical-lr]">
          Scroll
        </span>
        <ArrowDown size={14} className="text-white/30 animate-bounce" />
      </div>

      {/* Progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] z-30 bg-white/10">
        <motion.div
          key={`p-${current}`}
          className="h-full bg-mannatech"
          initial={{ width: "0%" }}
          animate={{ width: paused ? undefined : "100%" }}
          transition={{ duration: INTERVAL / 1000, ease: "linear" }}
        />
      </div>

      {/* Bottom panel — ALWAYS VISIBLE, no animation dependency */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="bg-black/70 backdrop-blur-xl border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-end">
              {/* Slide content */}
              <div>
                <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-4">
                  Ciencia que transforma
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`t-${current}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.08] mb-2">
                      {slide.headline}
                    </h1>
                    <p className="text-white/50 text-sm sm:text-base max-w-lg mb-6">
                      {slide.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-mannatech text-white font-semibold rounded-xl hover:bg-mannatech-dark transition-colors text-sm shadow-lg shadow-mannatech/25"
                  >
                    {slide.cta} →
                  </Link>
                  <Link
                    href="/productos"
                    className="inline-flex items-center px-7 py-3 border border-white/20 text-white/70 font-medium rounded-xl hover:border-white/40 hover:text-white transition-colors text-sm"
                  >
                    {ctaPrimario}
                  </Link>

                  {/* Dots */}
                  <div className="flex items-center gap-2 ml-2">
                    {SLIDES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === current ? "w-6 h-2 bg-mannatech" : "w-2 h-2 bg-white/25 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats — visible immediately */}
              <div className="hidden lg:flex gap-8">
                {[
                  { val: "90+", label: t("stats.patents") },
                  { val: "30+", label: t("stats.years") },
                  { val: "25+", label: t("stats.clients") },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-3xl font-bold text-white">{s.val}</p>
                    <p className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
