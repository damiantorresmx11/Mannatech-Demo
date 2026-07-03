"use client";

import { motion } from "framer-motion";
import { Dna, FlaskConical, Microscope, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

const ICON_MAP: Record<string, any> = { Dna, FlaskConical, Microscope, HeartPulse, ShieldCheck, Sparkles };

const DEFAULT_CONTENT = {
  overline: "Por Qué Elegirnos",
  heading: "Ciencia Real, Resultados Reales",
  subheading: "Lo que nos hace diferentes de cualquier otra empresa de suplementos",
  features: [
    { icon: "Dna", title: "Tecnología Patentada", desc: "154 patentes globales protegen nuestra fórmula exclusiva de gliconutrientes", gradient: "from-mannatech to-emerald-600" },
    { icon: "FlaskConical", title: "Respaldo Científico", desc: "Más de 100 estudios clínicos publicados en revistas médicas peer-reviewed", gradient: "from-blue-500 to-indigo-600" },
    { icon: "Microscope", title: "Calidad Farmacéutica", desc: "Fabricados bajo estándares cGMP en instalaciones registradas ante la FDA", gradient: "from-purple-500 to-violet-600" },
    { icon: "HeartPulse", title: "Ingredientes Naturales", desc: "Formulados con ingredientes de origen vegetal, veganos y sin GMO", gradient: "from-rose-500 to-pink-600" },
    { icon: "ShieldCheck", title: "Garantía 180 Días", desc: "Si no estás satisfecho, te devolvemos tu dinero. Sin preguntas", gradient: "from-amber-500 to-orange-600" },
    { icon: "Sparkles", title: "Impacto Social", desc: "Cada compra nutre a un niño en necesidad a través de Mission 5 Million", gradient: "from-cyan-500 to-teal-600" },
  ],
};

export function AnimatedFeatures({ cms }: { cms?: Record<string, any> }) {
  const c = { ...DEFAULT_CONTENT, ...cms };

  return (
    <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden">
      {/* Background SVG pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-mannatech/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-3">{c.overline}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">{c.heading}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{c.subheading}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {c.features.map((feat: any, i: number) => {
            const Icon = ICON_MAP[feat.icon] || Sparkles;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white dark:bg-zinc-800 rounded-3xl p-7 border border-zinc-100 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Gradient accent on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient || "from-mannatech to-emerald-600"} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient || "from-mannatech to-emerald-600"} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-mannatech transition-colors">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>

                {/* Bottom gradient line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.gradient || "from-mannatech to-emerald-600"} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
