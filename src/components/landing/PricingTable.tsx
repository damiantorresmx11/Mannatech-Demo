"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star, Zap, Crown } from "lucide-react";

const ICON_MAP: Record<string, any> = { Star, Zap, Crown };

const DEFAULT_PLANS = [
  {
    name: "Cliente",
    icon: "Star",
    price: "$0",
    period: "sin costo",
    desc: "Acceso a todos los productos con precios de retail",
    features: ["Catálogo completo", "Envío a todo México", "Garantía 180 días", "Soporte por WhatsApp"],
    cta: { text: "Comprar Ahora", href: "/productos" },
    highlighted: false,
  },
  {
    name: "Asociado",
    icon: "Zap",
    price: "$549",
    period: "inscripción",
    desc: "Precios mayoreo + comisiones por ventas y red",
    features: ["Descuento 15-30%", "Comisiones por ventas", "Bono de inicio rápido", "Herramientas de negocio", "App MannaGO", "Capacitación"],
    cta: { text: "Unirme Ahora", href: "/unete" },
    highlighted: true,
    badge: "Más Popular",
  },
  {
    name: "Líder",
    icon: "Crown",
    price: "$1,999",
    period: "kit de inicio",
    desc: "Todo de Asociado + kit de productos premium",
    features: ["Todo de Asociado", "Kit de productos ($3,500 valor)", "Bonos de liderazgo", "Eventos VIP", "Mentoría 1-a-1", "Viajes de incentivo"],
    cta: { text: "Ser Líder", href: "/unete" },
    highlighted: false,
  },
];

export function PricingTable({ cms }: { cms?: Record<string, any> }) {
  const plans = cms?.plans?.length ? cms.plans : DEFAULT_PLANS;
  const heading = cms?.heading || "Elige Tu Camino";
  const overline = cms?.overline || "Planes";
  const subheading = cms?.subheading || "Desde cliente hasta líder de negocio";

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-3">{overline}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">{heading}</h2>
          <p className="text-muted-foreground text-lg">{subheading}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan: any, i: number) => {
            const Icon = ICON_MAP[plan.icon] || Star;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative rounded-3xl p-8 flex flex-col ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-mannatech to-mannatech-dark text-white shadow-2xl shadow-mannatech/20 scale-[1.03] z-10 border-0"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.highlighted ? "bg-white/20" : "bg-mannatech/10"}`}>
                  <Icon size={24} className={plan.highlighted ? "text-white" : "text-mannatech"} />
                </div>

                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-foreground"}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? "text-white/70" : "text-muted-foreground"}`}>{plan.desc}</p>

                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-foreground"}`}>{plan.price}</span>
                  <span className={`text-sm ml-2 ${plan.highlighted ? "text-white/60" : "text-muted-foreground"}`}>{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {(plan.features || []).map((f: string, j: number) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-emerald-300" : "text-mannatech"}`} />
                      <span className={plan.highlighted ? "text-white/90" : "text-foreground/80"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.cta?.href || "/productos"}
                  className={`w-full py-3.5 rounded-xl text-center font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? "bg-white text-mannatech-dark hover:bg-white/90 shadow-lg"
                      : "bg-mannatech/10 text-mannatech hover:bg-mannatech/20 dark:bg-mannatech/20"
                  }`}
                >
                  {plan.cta?.text || "Empezar"}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
