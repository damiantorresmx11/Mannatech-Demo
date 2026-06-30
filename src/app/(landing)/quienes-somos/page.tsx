"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  FlaskConical,
  DollarSign,
  FileCheck,
  Globe,
  TrendingUp,
  Award,
  Users,
  Heart,
  Briefcase,
  ShieldCheck,
  Plane,
  HandHeart,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: TrendingUp, value: "MTEX", suffix: "", label: "Cotiza en NASDAQ", isText: true },
  { icon: DollarSign, value: 50, suffix: "M+", label: "Inversion total en I+D" },
  { icon: FileCheck, value: 155, suffix: "", label: "Patentes concedidas" },
  { icon: Award, value: 50, suffix: "", label: "Patentes vigentes" },
  { icon: Globe, value: 26, suffix: "", label: "Mercados mundiales" },
  { icon: DollarSign, value: 5, suffix: "B+", label: "Ingresos totales obtenidos" },
];

const leaders = [
  { name: "Landen Fredrick", role: "Presidente y CEO", initials: "LF" },
  { name: "Erin Barta", role: "Consejera General", initials: "EB" },
  { name: "James Clavijo", role: "Director Financiero", initials: "JC" },
  { name: "Dr. Steve Nugent", role: "Director Cientifico y Sanitario", initials: "SN" },
];

const benefits = [
  { icon: ShieldCheck, text: "Bajos costes de puesta en marcha" },
  { icon: Globe, text: "Trabaja desde cualquier lugar del mundo" },
  { icon: Briefcase, text: "No necesitas comprar ni almacenar inventario" },
  { icon: Award, text: "Garantia de satisfaccion de 180 dias con devolucion del dinero" },
  { icon: Users, text: "Tutorias y formacion personalizada por veteranos del sector" },
  { icon: HandHeart, text: "Una parte de cada venta ayuda a alimentar a los ninos" },
  { icon: Plane, text: "Programa de incentivos de viajes a destinos internacionales" },
  { icon: Heart, text: "Comunidad global de personas comprometidas con el bienestar" },
];

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mannatech/5 via-white to-mannatech/5 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <BlurFade delay={0.1}>
            <p className="text-mannatech font-semibold text-sm uppercase tracking-widest mb-4">
              Nuestra Historia
            </p>
          </BlurFade>
          <BlurFade delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#262626] dark:text-foreground leading-tight mb-6">
              Pioneros en la ciencia<br className="hidden sm:block" /> de los gliconutrientes
            </h1>
          </BlurFade>
          <BlurFade delay={0.3}>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              En 1995, Mannatech introdujo Ambrotose Complex®, un innovador suplemento de gliconutrientes
              elaborado a partir de una potente mezcla de Manapol® y varios ingredientes glicanos de origen vegetal.
              Desde entonces, nos hemos consolidado como pioneros de la gliconutricion con presencia en mas de 25 paises.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* Stats grid */}
      <section className="py-16 bg-white dark:bg-zinc-950 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <BlurFade delay={0.1}>
            <h2 className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10">
              Respaldado por Resultados Medibles
            </h2>
          </BlurFade>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, i) => (
              <BlurFade key={stat.label} delay={0.1 + i * 0.06}>
                <div className="text-center p-4">
                  <stat.icon size={24} className="mx-auto mb-3 text-mannatech" />
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#262626] dark:text-foreground mb-1">
                    {stat.isText ? (
                      stat.value
                    ) : (
                      <NumberTicker value={stat.value as number} suffix={stat.suffix} duration={2} />
                    )}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider leading-tight">
                    {stat.label}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Two-column story sections */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Glyconutrition */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <BlurFade delay={0.1} className="w-full lg:w-1/2">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-mannatech/10 to-mannatech/5 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                <FlaskConical size={64} className="text-mannatech/30" />
              </div>
            </BlurFade>
            <BlurFade delay={0.2} className="w-full lg:w-1/2">
              <p className="text-mannatech font-semibold text-sm uppercase tracking-widest mb-2">
                A la Cabeza de la Gliconutricion
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] dark:text-foreground mb-4">
                Ciencia que transforma vidas
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nuestro producto estrella, Ambrotose Complex®, se gano rapidamente el reconocimiento por su
                notable capacidad para favorecer la comunicacion celula a celula, convirtiendose en una sensacion
                adoptada por millones de personas y celebrada en todo el mundo por sus beneficios para la salud.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Con mas de $50 millones invertidos en investigacion y desarrollo, y 155 patentes concedidas,
                Mannatech sigue liderando la innovacion en nutricion celular basada en ciencia real.
              </p>
            </BlurFade>
          </div>

          {/* Opportunity */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
            <BlurFade delay={0.1} className="w-full lg:w-1/2">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                <Users size={64} className="text-amber-400/40" />
              </div>
            </BlurFade>
            <BlurFade delay={0.2} className="w-full lg:w-1/2">
              <p className="text-mannatech font-semibold text-sm uppercase tracking-widest mb-2">
                La Oportunidad de Vivir Bien
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] dark:text-foreground mb-4">
                Mas que productos: un estilo de vida
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vivir bien es mas que bienestar fisico — es tambien crear nuevas amistades, divertirse y
                encontrar nuevas oportunidades. En Mannatech, ofrecemos algo mas que productos: ofrecemos
                una forma de mejorar tu vida y la de los demas.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Puedes ganar dinero extra compartiendo y vendiendo nuestros productos. Nuestro programa de
                incentivos para viajes convierte el sueno de conocer nuevos paises en realidad.
              </p>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-16 bg-muted/30 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1}>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-[#262626] dark:text-foreground mb-3">
              Beneficios de ser Asociado
            </h2>
          </BlurFade>
          <BlurFade delay={0.15}>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Descubre como puedes mejorar tu vida y alcanzar tus objetivos con Mannatech
            </p>
          </BlurFade>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b, i) => (
              <BlurFade key={b.text} delay={0.1 + i * 0.05}>
                <div className="flex items-start gap-3 bg-white dark:bg-zinc-800 rounded-xl p-5 border border-border/50 h-full">
                  <b.icon size={20} className="text-mannatech flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 leading-relaxed">{b.text}</p>
                </div>
              </BlurFade>
            ))}
          </div>
          <BlurFade delay={0.5}>
            <div className="text-center mt-10">
              <Link
                href="/unete"
                className="inline-block bg-mannatech hover:bg-mannatech-dark text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wider"
              >
                Unete Ahora
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1}>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-[#262626] dark:text-foreground mb-3">
              Liderazgo Empresarial
            </h2>
          </BlurFade>
          <BlurFade delay={0.15}>
            <p className="text-center text-muted-foreground mb-12">
              El equipo que guia la vision de Mannatech
            </p>
          </BlurFade>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {leaders.map((leader, i) => (
              <BlurFade key={leader.name} delay={0.1 + i * 0.08}>
                <div className="text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-mannatech/20 to-mannatech/5 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-mannatech/60">
                      {leader.initials}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#262626] dark:text-foreground text-sm sm:text-base">
                    {leader.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{leader.role}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-mannatech to-mannatech-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Unete a una comunidad que marca la diferencia
          </h2>
          <p className="text-white/70 mb-8">
            Sientete bien, ten buen aspecto, haz el bien y vive bien.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/unete"
              className="bg-white text-mannatech font-semibold px-8 py-3.5 rounded-lg hover:bg-white/90 transition-colors text-sm uppercase tracking-wider"
            >
              Ser Asociado
            </Link>
            <Link
              href="/productos"
              className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors text-sm uppercase tracking-wider"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
