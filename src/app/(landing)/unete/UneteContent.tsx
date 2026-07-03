"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { CheckCircle, ShoppingBag, Smartphone, BarChart3, GraduationCap, Globe, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "REGISTRATE",
    description: "Llena el formulario en menos de 5 minutos y elige tu kit de inicio.",
  },
  {
    number: 2,
    title: "RECIBE TU KIT",
    description: "Obtén productos premium con tu Kit Digital desde $49.99 USD para comenzar tu negocio.",
  },
  {
    number: 3,
    title: "COMPARTE Y GANA",
    description: "Vende productos, invita a mas personas y construye tu red de bienestar.",
  },
];

const benefits = [
  {
    icon: ShoppingBag,
    title: "Sitio web de comercio electronico",
    description: "Tu propio sitio web listo para usar, emparejado con un sistema vanguardista de embudo de ventas para agilizar tu exito.",
  },
  {
    icon: Smartphone,
    title: "App MannaGO",
    description: "Acceso gratuito a MannaGO, nuestra aplicacion lider del sector para movil y escritorio, disenada para ayudarte a gestionar y hacer crecer tu negocio.",
  },
  {
    icon: BarChart3,
    title: "Panel de informes",
    description: "Un potente panel que ofrece informacion sobre tu genealogia, volumen de ventas, actividad del equipo y mucho mas.",
  },
  {
    icon: GraduationCap,
    title: "Formacion y apoyo",
    description: "Un sistema paso a paso con formacion, entrenamiento y apoyo personalizados para guiarte en cada paso del camino.",
  },
  {
    icon: Globe,
    title: "Negocio global",
    description: "Un negocio flexible y escalable que se adapta a tu horario y estilo de vida, con presencia en mas de 25 paises.",
  },
  {
    icon: Package,
    title: "Sin problemas de inventario",
    description: "Mannatech se encarga de toda la logistica de inventario y envio, con acceso a mas de 30 paises con entrega a domicilio.",
  },
];

export function UneteContent() {
  return (
    <div className="min-h-screen">
      {/* Hero split */}
      <section className="bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
          {/* Image side */}
          <div className="relative bg-gradient-to-br from-mannatech/10 to-mannatech/5 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center min-h-[300px] lg:min-h-0">
            <div className="text-center p-12">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-mannatech/10 flex items-center justify-center">
                <Globe size={56} className="text-mannatech" />
              </div>
              <p className="text-lg text-mannatech font-semibold">Tu negocio, tu tiempo</p>
              <p className="text-sm text-muted-foreground mt-2">+25 paises | +30 anos de ciencia</p>
            </div>
          </div>

          {/* Content side */}
          <div className="flex items-center px-6 sm:px-10 lg:px-16 py-16">
            <div>
              <BlurFade delay={0.1}>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-[#262626] dark:text-foreground leading-tight mb-4">
                  UNETE A MANNATECH Y COMIENZA TU NEGOCIO DE BIENESTAR
                </h1>
              </BlurFade>
              <BlurFade delay={0.2}>
                <p className="text-muted-foreground mb-8">Unete en solo 3 pasos</p>
              </BlurFade>

              <BlurFade delay={0.3}>
                <div className="space-y-6 mb-10">
                  {steps.map((step) => (
                    <div key={step.number} className="flex gap-4">
                      <span className="text-lg font-bold text-[#262626] dark:text-foreground flex-shrink-0">
                        {step.number}.
                      </span>
                      <div>
                        <span className="font-bold text-[#262626] dark:text-foreground uppercase">
                          {step.title}
                        </span>{" "}
                        <span className="text-mannatech">{step.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </BlurFade>

              <BlurFade delay={0.4}>
                <p className="font-semibold text-[#262626] dark:text-foreground mb-4">¡Comencemos!</p>
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 bg-[#262626] dark:bg-mannatech hover:bg-black dark:hover:bg-mannatech-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors text-sm uppercase tracking-wider"
                >
                  Elegir Mi Kit
                  <ArrowRight size={16} />
                </Link>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section — "Su negocio, simplificado" */}
      <section className="py-16 sm:py-24 bg-muted/30 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <BlurFade delay={0.1}>
              <p className="text-mannatech font-semibold text-sm uppercase tracking-wider mb-2">
                Empiece Hoy Mismo
              </p>
            </BlurFade>
            <BlurFade delay={0.2}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#262626] dark:text-foreground">
                Su negocio, simplificado
              </h2>
            </BlurFade>
            <BlurFade delay={0.3}>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Esto es lo que obtendras como Asociado de Mannatech:
              </p>
            </BlurFade>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <BlurFade key={benefit.title} delay={0.1 + i * 0.08}>
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 h-full border border-border/50 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-mannatech/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={18} className="text-mannatech" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#262626] dark:text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-mannatech dark:bg-mannatech-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            ¿Listo para transformar vidas?
          </h2>
          <p className="text-white/70 mb-8">
            Unete a miles de asociados que ya construyen su futuro con la ciencia de Mannatech.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/productos"
              className="bg-white text-mannatech font-semibold px-8 py-3.5 rounded-lg hover:bg-white/90 transition-colors text-sm uppercase tracking-wider"
            >
              Elegir Mi Kit
            </Link>
            <Link
              href="/login/socio"
              className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors text-sm uppercase tracking-wider"
            >
              Ya soy Asociado
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
