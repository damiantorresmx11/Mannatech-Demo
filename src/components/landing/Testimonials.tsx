"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";

const testimonials = [
  {
    title: "Legado",
    quote: "Llevo un par de a\u00f1os tomando estos productos. Son efectivos y me dan la seguridad de que estoy nutriendo mi cuerpo y d\u00e1ndole lo mejor. Estoy construyendo un legado de salud para mi familia.",
    name: "Laura M.",
    color: "bg-mannatech",
  },
  {
    title: "Libertad",
    quote: "Mannatech me da libertad. Libertad para enfocarme en mi salud, en mi familia, y en construir un futuro. Saber que mis productos son de la m\u00e1s alta calidad me da confianza cada d\u00eda.",
    name: "Roberto S.",
    color: "bg-amber-600",
  },
  {
    title: "Transformador",
    quote: "Me encanta lo que encontr\u00e9 en Mannatech. Tengo que decir que es GENIAL. Me siento bien, me veo bien, la gente me dice que tengo buena piel. Ser parte de Mannatech ha transformado mi vida.",
    name: "Mar\u00eda F.",
    color: "bg-emerald-600",
  },
  {
    title: "Renovada",
    quote: "Mannatech ha cambiado mi salud de maneras que nunca imagin\u00e9. Me siento renovada. Tengo 73 a\u00f1os y me siento mejor que cuando ten\u00eda 50.",
    name: "Carla D.",
    color: "bg-purple-600",
  },
  {
    title: "Bendici\u00f3n",
    quote: "Mannatech ha sido una bendici\u00f3n. Siento que ha marcado una gran diferencia en mi vida. Me encanta el estilo de vida sustentable que he construido.",
    name: "Patricia L.",
    color: "bg-rose-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Testimonials({ cms }: { cms?: Record<string, any> }) {
  const items = cms?.testimonials?.length ? cms.testimonials : testimonials;
  const headingText = cms?.heading || "Lo Que la Gente Dice";
  const overlineText = cms?.overline || "Lo Que Dicen Nuestros Clientes";
  return (
    <section id="historia" className="py-20 sm:py-28 bg-[#FAFAF8] dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-14">
            <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-3">
              {overlineText}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {headingText}
            </h2>
          </div>
        </BlurFade>

        {/* Bubble collage grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {items.map((t: any, i: number) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border/50 shadow-sm hover:shadow-lg transition-shadow ${
                i === 0 ? "sm:col-span-1 lg:row-span-1" :
                i === 1 ? "sm:col-span-1" :
                i === 2 ? "sm:col-span-2 lg:col-span-1" :
                ""
              }`}
            >
              {/* Title badge */}
              <span className={`inline-block px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wider mb-4 ${t.color}`}>
                {t.title}
              </span>

              {/* Quote */}
              <p className="text-sm text-foreground/80 leading-relaxed mb-4 line-clamp-4">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  — {t.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <BlurFade delay={0.6}>
          <div className="text-center mt-12">
            <Link
              href="/productos"
              className="inline-flex items-center px-7 py-3 bg-foreground dark:bg-white text-background dark:text-zinc-950 font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              COMPRAR AHORA
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
