"use client";

import { motion } from "framer-motion";

const DEFAULT_CONTENT = {
  overline: "Confianza",
  heading: "Certificaciones y Reconocimientos",
  subheading: "Respaldados por las organizaciones más exigentes del mundo",
  logos: [
    { name: "FDA Registered", svg: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15l-4-4 1.4-1.4L11 14.2l5.6-5.6L18 10l-7 7z" },
    { name: "NSF Certified", svg: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" },
    { name: "cGMP Certified", svg: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" },
    { name: "ISO 17025", svg: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { name: "Non-GMO", svg: "M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" },
    { name: "USDA Organic", svg: "M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.075.788-3.887.787-1.813 2.15-3.175Q6.3 3.575 8.125 2.788 9.95 2 12 2q2.075 0 3.887.788 1.813.787 3.175 2.15 1.363 1.362 2.15 3.175Q22 9.925 22 12q0 2.05-.788 3.875-.787 1.825-2.15 3.187-1.362 1.363-3.175 2.15Q14.075 22 12 22z" },
  ],
};

export function LogoGrid({ cms }: { cms?: Record<string, any> }) {
  const c = { ...DEFAULT_CONTENT, ...cms };

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-3">{c.overline}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{c.heading}</h2>
          <p className="text-muted-foreground">{c.subheading}</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {c.logos.map((logo: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:shadow-lg hover:border-mannatech/30 transition-all cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-mannatech/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-mannatech">
                  <path d={logo.svg} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-foreground/70 text-center leading-tight">{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
