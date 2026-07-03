"use client";

import Image from "next/image";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { Heart, Users, Globe, Play } from "lucide-react";
import { useState } from "react";

const stats = [
  { value: 110, suffix: "M+", label: "Raciones de apoyo nutricional entregadas", icon: Heart },
  { value: 70, suffix: "+", label: "Paises beneficiados", icon: Globe },
  { value: 15, suffix: "+", label: "Anos de impacto global", icon: Users },
];

const pillars = [
  {
    title: "Mision del M5M",
    description:
      "La mision de M5M es ayudar a combatir la desnutricion global alimentando a los ninos de todo el mundo. Empezamos a lograrlo ayudando a los ninos necesitados a recibir una nutricion adecuada a traves de nuestros productos.",
    detail:
      "Desde 2009, los programas de Mannatech han generado mas de 110 millones de raciones de apoyo nutricional para ninos desnutridos.",
    image: "/images/m5m-kids.jpg",
  },
  {
    title: "Nutriendo Esperanza",
    description:
      "Cada vez que compras un producto Mannatech, contribuyes directamente a nutrir a un nino necesitado. Nuestro modelo de negocio social conecta tu bienestar con el de quienes mas lo necesitan.",
    detail:
      "Trabajamos con organizaciones locales en comunidades vulnerables de America Latina, Africa y Asia para garantizar que la ayuda llegue a quienes mas la necesitan.",
    image: "/images/m5m-hope.jpg",
  },
  {
    title: "PhytoBlend y OneMeal",
    description:
      "PhytoBlend y OneMeal son los productos base del programa M5M. Formulados con una mezcla optima de vitaminas, minerales y fitonutrientes para combatir la desnutricion infantil.",
    detail:
      "Cada racion contiene los nutrientes esenciales que un nino necesita para un desarrollo saludable.",
    image: "/images/m5m-products.jpg",
  },
];

export function ImpactoContent() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-amber-50 to-white dark:from-zinc-900 dark:to-zinc-950 py-20 sm:py-28 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <BlurFade delay={0.1}>
            <p className="text-mannatech font-semibold text-lg mb-3 tracking-wide">
              Nourishing Hope
            </p>
          </BlurFade>
          <BlurFade delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#262626] dark:text-foreground mb-6">
              Mission 5 Million<sup className="text-xl align-super">®</sup>
            </h1>
          </BlurFade>
          <BlurFade delay={0.3}>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Nuestra meta es nutrir a 5 millones de ninos alrededor del mundo combatiendo la desnutricion infantil con cada compra.
            </p>
          </BlurFade>
          <BlurFade delay={0.4}>
            <button
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-3 bg-[#F5922A] hover:bg-[#e0841f] text-white font-bold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-orange-200 dark:shadow-none"
            >
              VER PELICULA
              <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Play size={20} fill="white" className="ml-0.5" />
              </span>
            </button>
          </BlurFade>
        </div>

        {/* Video modal */}
        {showVideo && (
          <div
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Cerrar video"
              >
                ✕
              </button>
              <div className="w-full h-full flex items-center justify-center text-white/60">
                <p className="text-center">
                  <Play size={48} className="mx-auto mb-2 opacity-50" />
                  Video M5M — Proximamente
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Stats bar */}
      <section className="bg-mannatech dark:bg-mannatech-dark py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-around gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                <NumberTicker value={stat.value} suffix={stat.suffix} duration={2.5} className="text-white" />
              </p>
              <p className="text-xs text-white/70 font-medium uppercase tracking-wider max-w-[200px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Content sections */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`flex flex-col ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-10 lg:gap-16 mb-20 last:mb-0`}
            >
              {/* Image */}
              <BlurFade delay={0.1} className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <div className="text-center p-8">
                      <Heart size={48} className="mx-auto mb-3 text-mannatech/40" />
                      <p className="text-sm">{pillar.title}</p>
                    </div>
                  </div>
                </div>
              </BlurFade>

              {/* Text */}
              <BlurFade delay={0.2} className="w-full lg:w-1/2">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] dark:text-foreground mb-4">
                  {pillar.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {pillar.description}
                </p>
                <p className="text-muted-foreground/80 text-sm leading-relaxed italic">
                  {pillar.detail}
                </p>
              </BlurFade>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#262626] dark:text-foreground mb-4">
            Se parte del cambio
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Cada producto que compras nutre a un nino. Tu bienestar transforma vidas.
          </p>
          <a
            href="/productos"
            className="inline-block bg-[#F5922A] hover:bg-[#e0841f] text-white font-bold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-orange-200 dark:shadow-none"
          >
            Explorar Productos
          </a>
        </div>
      </section>
    </div>
  );
}
