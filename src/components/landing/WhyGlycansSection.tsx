"use client";

import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export function WhyGlycansSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <BlurFade delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              ¿Por Qué{" "}
              <span className="font-heading italic font-normal text-amber-200">
                Glicanos
              </span>
              ?
            </h2>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
              Los glicanos, esas moléculas intrincadas entrelazadas con el tejido mismo de nuestra
              biología, ofrecen un tesoro de beneficios que apenas estamos comenzando a apreciar
              plenamente. Incorporar la suplementación con glicanos en tu rutina no es solo otro
              paso en tu régimen de salud — es la base de bienestar personal.*
            </p>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
              Una oportunidad de sintonizar con el ritmo natural de tu cuerpo y desbloquear un
              nivel de salud que solo has soñado.* Bienvenido a la vanguardia de la evolución del
              bienestar, donde cada suplemento no es solo nutrición, sino un diálogo con tu yo
              más profundo.*
            </p>
          </BlurFade>
        </motion.div>
      </div>
    </section>
  );
}
