"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Radio, Shield, Brain, HeartPulse, Sparkles } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";

const benefits = [
  {
    icon: Radio,
    title: "Comunicación Celular",
    desc: "Estudios han demostrado el papel de los glicanos en facilitar la comunicación celular para una mejor salud general.*",
    color: "bg-mannatech",
  },
  {
    icon: Shield,
    title: "Soporte al Sistema Inmunológico",
    desc: "Los glicanos apoyan las defensas naturales del cuerpo contra patógenos y enfermedades.*",
    color: "bg-emerald-600",
  },
  {
    icon: Brain,
    title: "Soporte a la Función Cognitiva",
    desc: "Apoyan la función cerebral saludable, la memoria y la claridad mental.*",
    color: "bg-blue-600",
  },
  {
    icon: HeartPulse,
    title: "Salud Digestiva y Equilibrio del Microbioma",
    desc: "Fomentan un ecosistema intestinal saludable para una digestión óptima.*",
    color: "bg-amber-600",
  },
  {
    icon: Sparkles,
    title: "Salud de la Piel y Envejecimiento Saludable",
    desc: "Promueven la regeneración celular para una piel radiante y juvenil.*",
    color: "bg-purple-600",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function GlycansSection() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Overline */}
        <BlurFade delay={0.1}>
          <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-3">
            Glicanos
          </p>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
          {/* Left — educational text */}
          <div>
            <BlurFade delay={0.15}>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
                Nuestra Base de{" "}
                <span className="font-heading italic font-normal text-mannatech">
                  Bienestar
                </span>
              </h2>
            </BlurFade>

            <BlurFade delay={0.2}>
              <p className="text-muted-foreground leading-relaxed mb-6">
                En el corazón de nuestro camino se encuentra una creencia simple y profunda:
                que los bloques fundamentales de la vida pueden mejorar la forma en que vivimos.
                Los glicanos, azúcares complejos que facilitan la comunicación celular, encarnan
                este potencial.* Estos azúcares complejos hacen más que solo existir dentro de
                nosotros; hablan el lenguaje de la vida, guiando nuestras células hacia una salud,
                vitalidad y funcionalidad óptimas.*
              </p>
            </BlurFade>

            <BlurFade delay={0.25}>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nuestra tecnología pionera de glicanos es la base de nuestra misión aquí en
                Mannatech, establecida en 1994 con una visión singular — desbloquear y compartir
                el poder transformador de los glicanos con el mundo.
              </p>
            </BlurFade>

            <BlurFade delay={0.3}>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Imagina los glicanos como una red de comunicación dentro de tu cuerpo, como una
                red telefónica ultraavanzada, pero para tus células. Esta red asiste la comunicación
                celular de tu cuerpo, como las llamadas cristalinas conectan amigos alrededor del
                mundo. Cuando tus células se comunican efectivamente, tu cuerpo opera como una
                máquina bien aceitada — apoyando tu comunicación celular, sistema inmunológico,
                función cognitiva, trabajando mejor, juntos.*
              </p>
            </BlurFade>

            <BlurFade delay={0.35}>
              <Link
                href="/productos"
                className="btn-magnetic btn-ripple inline-flex items-center px-7 py-3.5 bg-mannatech text-white font-semibold rounded-xl hover:bg-mannatech-dark transition-colors text-sm shadow-lg shadow-mannatech/20"
              >
                Comprar Ahora
              </Link>
            </BlurFade>
          </div>

          {/* Right — benefit cards */}
          <div className="space-y-3">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <BlurFade key={b.title} delay={0.2 + i * 0.08}>
                  <motion.div
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-[#FAFAF8] dark:bg-zinc-900 border border-border/50 hover:border-mannatech/30 hover:shadow-md transition-all cursor-default"
                  >
                    <div className={`w-10 h-10 rounded-lg ${b.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-1">{b.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
