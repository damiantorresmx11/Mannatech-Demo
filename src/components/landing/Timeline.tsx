"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Award, FlaskConical, Globe, Users, Leaf, Star } from "lucide-react";

const ICON_MAP: Record<string, any> = { Award, FlaskConical, Globe, Users, Leaf, Star };

const DEFAULT_EVENTS = [
  { year: "1994", title: "Fundación", desc: "Mannatech es fundada con la visión de llevar los gliconutrientes al mundo.", icon: "Star", color: "bg-mannatech" },
  { year: "1996", title: "Primera Patente", desc: "Se otorga la primera patente para la tecnología de gliconutrientes Ambrotose.", icon: "Award", color: "bg-amber-600" },
  { year: "2004", title: "Expansión Global", desc: "Operaciones en más de 25 países, llevando bienestar a millones.", icon: "Globe", color: "bg-blue-600" },
  { year: "2009", title: "Mission 5 Million", desc: "Lanzamiento del programa M5M para combatir la desnutrición infantil global.", icon: "Users", color: "bg-purple-600" },
  { year: "2018", title: "Innovación Continua", desc: "Más de 100 patentes otorgadas. Lanzamiento de línea de cuidado personal Uth.", icon: "FlaskConical", color: "bg-emerald-600" },
  { year: "2024", title: "Liderazgo en Ciencia", desc: "154 patentes, presencia en 30+ países, millones de vidas transformadas.", icon: "Leaf", color: "bg-rose-600" },
];

export function Timeline({ cms }: { cms?: Record<string, any> }) {
  const events = cms?.events?.length ? cms.events : DEFAULT_EVENTS;
  const heading = cms?.heading || "Nuestra Historia";
  const overline = cms?.overline || "Desde 1994";
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-3">{overline}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">{heading}</h2>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Animated line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800">
            <motion.div className="w-full bg-gradient-to-b from-mannatech to-emerald-600 origin-top" style={{ height: lineHeight }} />
          </div>

          {events.map((event: any, i: number) => {
            const Icon = ICON_MAP[event.icon] || Star;
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className={`relative flex items-center mb-12 last:mb-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"} pl-20 md:pl-0`}>
                  <span className="text-xs font-bold text-mannatech uppercase tracking-wider">{event.year}</span>
                  <h3 className="text-xl font-bold text-foreground mt-1 mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{event.desc}</p>
                </div>

                {/* Center dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-white dark:border-zinc-950 flex items-center justify-center z-10" style={{ background: "var(--color-mannatech, #00A88F)" }}>
                  <Icon size={16} className="text-white" />
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
