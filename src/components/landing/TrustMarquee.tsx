"use client";

import { Heart, Percent, Truck, ShieldCheck } from "lucide-react";

const benefits = [
  { icon: Heart, text: "Con tu compra, juntos nutrimos a quienes más lo necesitan" },
  { icon: Percent, text: "¡Suscríbete y ahorra 10% en tus productos favoritos!" },
  { icon: Truck, text: "Envío gratis en pedidos mayores a $2,999" },
  { icon: ShieldCheck, text: "¡Garantía de satisfacción de 180 días!" },
];

export function TrustMarquee({ cms }: { cms?: Record<string, any> }) {
  const overlineText = cms?.overline || "Bienestar";
  const headingText = cms?.heading || "Sin Esfuerzo";
  return (
    <section className="py-10 sm:py-14 bg-[#FAF9F7] dark:bg-zinc-900 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-6">
          <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-2">
            {overlineText}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            <span className="font-heading italic font-normal">{headingText}</span>
          </h2>
        </div>

        {/* Desktop: all 4 in a row */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.text} className="flex items-center gap-3 text-center justify-center">
                <Icon size={18} className="text-mannatech flex-shrink-0" />
                <span className="text-xs font-medium text-foreground/70 leading-tight">
                  {b.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile: scrolling marquee */}
        <div className="md:hidden relative flex overflow-hidden">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 animate-marquee-scroll items-center gap-10 px-4"
              aria-hidden={copy === 1}
            >
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={`${b.text}-${copy}`} className="flex items-center gap-2 whitespace-nowrap">
                    <Icon size={14} className="text-mannatech flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground/70">
                      {b.text}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
