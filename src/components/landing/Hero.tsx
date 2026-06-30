"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  src: string;
  srcMobile?: string;
  alt: string;
  href: string;
}

const SLIDES: Slide[] = [
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2026/05/OsoLean-Chocolate-Banner-WEB.png",
    srcMobile: "https://mx.mannatech.com/wp-content/uploads/sites/16/2026/05/OsoLean-Chocolate-Banner-WEB.png",
    alt: "OsoLean Chocolate",
    href: "/productos/osolean",
  },
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2026/05/MannaBears-Banner-WEB-2.png",
    srcMobile: "https://mx.mannatech.com/wp-content/uploads/sites/16/2026/05/MannaBears-Banner-WEB-2.png",
    alt: "MannaBears",
    href: "/productos/mannabears",
  },
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2024/11/MX-Luminovation.jpg",
    srcMobile: "https://mx.mannatech.com/wp-content/uploads/sites/16/2024/11/MX-Luminovation.jpg",
    alt: "Luminovation K-Beauty",
    href: "/productos/luminovation",
  },
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2024/07/MANNA-ZENWEB.jpg",
    srcMobile: "https://mx.mannatech.com/wp-content/uploads/sites/16/2024/07/MANNA-ZENWEB.jpg",
    alt: "Manna Zen Prime",
    href: "/productos/ambrotose-life",
  },
  {
    src: "https://mx.mannatech.com/wp-content/uploads/sites/16/2024/05/TRUCONTROL_hero-scaled.jpg",
    srcMobile: "https://mx.mannatech.com/wp-content/uploads/sites/16/2024/05/TRUCONTROL_hero-scaled.jpg",
    alt: "TruControl",
    href: "/productos/osolean",
  },
];

const INTERVAL = 5500;

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((i: number) => setCurrent(i), []);
  const goNext = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const goPrev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(goNext, INTERVAL);
    return () => clearTimeout(id);
  }, [current, paused, goNext]);

  // GSAP ScrollTrigger parallax on hero images
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const img = sectionRef.current.querySelector("img");
    if (!img) return;

    gsap.to(img, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white dark:bg-zinc-950"
      aria-roledescription="carousel"
      aria-label="Hero Carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative w-full" style={{ aspectRatio: "16/5.5" }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Link href={SLIDES[current].href} className="block w-full h-full">
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet={SLIDES[current].srcMobile || SLIDES[current].src}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SLIDES[current].src}
                  alt={SLIDES[current].alt}
                  className="w-full h-full object-cover"
                />
              </picture>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 text-foreground/70 hover:bg-white dark:hover:bg-zinc-700 shadow-md transition-all hover:scale-110"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 text-foreground/70 hover:bg-white dark:hover:bg-zinc-700 shadow-md transition-all hover:scale-110"
        aria-label="Siguiente slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] z-20 bg-border/30">
        <motion.div
          key={`progress-${current}`}
          className="h-full bg-mannatech"
          initial={{ width: "0%" }}
          animate={{ width: paused ? undefined : "100%" }}
          transition={{ duration: INTERVAL / 1000, ease: "linear" }}
        />
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-2.5 bg-mannatech"
                : "w-2.5 h-2.5 bg-white/60 dark:bg-zinc-400/60 hover:bg-white dark:hover:bg-zinc-300"
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
