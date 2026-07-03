"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Heart, Smile, Shield, Leaf } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";

const benefits = [
  { icon: Heart, label: "Comunicación Celular", desc: "Bloques fundamentales para una mejor salud general*" },
  { icon: Brain, label: "Cognición", desc: "Apoya la función cerebral y la memoria saludable*" },
  { icon: Smile, label: "Estado de Ánimo", desc: "Reduce la irritabilidad y apoya el bienestar emocional*" },
  { icon: Shield, label: "Inmunidad", desc: "Apoya las defensas celulares de forma natural*" },
  { icon: Leaf, label: "Salud Digestiva", desc: "Fomenta un microbioma saludable*" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function ScienceSection({ cms }: { cms?: Record<string, any> }) {
  return (
    <section
      id="ciencia"
      className="py-20 sm:py-28 bg-white dark:bg-zinc-950 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Overline */}
        <BlurFade delay={0.1}>
          <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-4">
            Ambrotose® Complex
          </p>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text content */}
          <div>
            <BlurFade delay={0.2}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                Una{" "}
                <span className="font-heading italic font-normal text-mannatech">
                  Revolución
                </span>{" "}
                en Bienestar
              </h2>
            </BlurFade>

            <BlurFade delay={0.3}>
              <h3 className="text-lg font-semibold text-foreground/80 mb-4">
                Sentirse bien debería ser natural
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Descubre el secreto del bienestar natural con nuestro producto estrella,
                <strong> Mannatech Ambrotose Complex</strong>. Elaborado meticulosamente a partir de
                fuentes vegetales y veganas, representa la cúspide de la suplementación dietética,
                con respaldo clínico para la memoria, la salud digestiva, el sistema inmunológico
                y beneficios integrales para todo el cuerpo.*
              </p>
            </BlurFade>

            {/* Benefits list */}
            <div className="space-y-4 mb-8">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <BlurFade key={b.label} delay={0.35 + i * 0.08}>
                    <div className="flex items-start gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-mannatech/10 dark:bg-mannatech/20 flex items-center justify-center flex-shrink-0 group-hover:bg-mannatech/20 transition-colors">
                        <Icon size={18} className="text-mannatech" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{b.label}</p>
                        <p className="text-xs text-muted-foreground">{b.desc}</p>
                      </div>
                    </div>
                  </BlurFade>
                );
              })}
            </div>

            {/* CTAs */}
            <BlurFade delay={0.8}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/productos"
                  className="btn-magnetic btn-ripple inline-flex items-center px-6 py-3 bg-mannatech text-white font-semibold rounded-xl hover:bg-mannatech-dark transition-colors text-sm shadow-lg shadow-mannatech/20"
                >
                  Comprar Ahora
                </Link>
                <button className="inline-flex items-center px-6 py-3 border border-border text-foreground/70 font-medium rounded-xl hover:border-mannatech hover:text-mannatech transition-colors text-sm">
                  Ver Video
                </button>
              </div>
            </BlurFade>
          </div>

          {/* Right — product image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-mannatech/10 via-transparent to-mannatech-light/10 rounded-3xl blur-3xl" />

              {/* Product image */}
              <div className="relative bg-[#F2F0ED] dark:bg-zinc-800 rounded-3xl p-8 sm:p-12">
                <Image
                  src="/images/ambrotose-complex-hero.png"
                  alt="Ambrotose Complex"
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain product-glow animate-float"
                />
              </div>

              {/* Price badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 shadow-lg rounded-xl px-6 py-3 text-center border border-border">
                <p className="text-sm font-bold text-foreground">Ambrotose Complex</p>
                <p className="text-xs text-muted-foreground">
                  Desde <span className="text-mannatech font-semibold">$1,392</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
