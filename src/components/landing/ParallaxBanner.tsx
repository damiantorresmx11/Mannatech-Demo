"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const DEFAULT_CONTENT = {
  heading: "Nutrición que Transforma",
  subheading: "Cada producto está respaldado por más de 30 años de investigación científica",
  image: "https://mx.mannatech.com/wp-content/themes/mannatech/img/transform-03.jpg",
  cta: { text: "Explorar Productos", href: "/productos" },
  stats: [
    { value: "30+", label: "Años" },
    { value: "154", label: "Patentes" },
    { value: "25+", label: "Países" },
  ],
};

export function ParallaxBanner({ cms }: { cms?: Record<string, any> }) {
  const c = { ...DEFAULT_CONTENT, ...cms };
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <div
          className="absolute inset-[-10%] bg-cover bg-center"
          style={{ backgroundImage: `url(${c.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-900/60 to-transparent" />
      </motion.div>

      {/* SVG wave decoration */}
      <svg className="absolute bottom-0 left-0 w-full h-24 text-white dark:text-zinc-950" viewBox="0 0 1440 96" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,64 C360,96 720,32 1080,64 C1260,80 1380,48 1440,64 L1440,96 L0,96 Z" />
      </svg>
      <svg className="absolute top-0 left-0 w-full h-24 text-white dark:text-zinc-950 rotate-180" viewBox="0 0 1440 96" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,64 C360,96 720,32 1080,64 C1260,80 1380,48 1440,64 L1440,96 L0,96 Z" />
      </svg>

      {/* Content */}
      <motion.div className="relative z-10 h-full flex items-center" style={{ opacity }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
          >
            {c.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 max-w-xl mb-8"
          >
            {c.subheading}
          </motion.p>

          {/* Stats row */}
          {c.stats?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex gap-8 mb-8"
            >
              {c.stats.map((s: any, i: number) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {c.cta && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <Link href={c.cta.href || "/productos"} className="inline-flex px-8 py-4 bg-white text-zinc-900 font-bold rounded-2xl hover:bg-white/90 transition-colors shadow-xl">
                {c.cta.text}
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
