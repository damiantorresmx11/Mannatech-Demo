"use client";

import { NumberTicker } from "@/components/ui/number-ticker";

export function MissionSection() {
  return (
    <section className="py-24 bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission text */}
        <div className="mb-16">
          <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-6">
            Nuestra Misión
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/90 leading-[1.3] max-w-4xl">
            Creemos que la verdadera salud comienza a nivel celular.
            <span className="text-mannatech"> Con más de 90 patentes globales</span>, hemos transformado
            la ciencia de la gliconutrición en productos que millones de personas confían cada día.
          </p>
        </div>

        {/* Stats */}
        <div className="h-px bg-white/10 mb-12" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: 90, suffix: "+", label: "Patentes globales" },
            { value: 30, suffix: "+", label: "Años de innovación" },
            { value: 25, suffix: "+", label: "Países" },
            { value: 5, suffix: "M+", label: "Vidas impactadas" },
          ].map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="text-4xl sm:text-5xl font-extrabold text-mannatech mb-2">
                <NumberTicker value={stat.value} suffix={stat.suffix} duration={2.5} className="text-mannatech" />
              </p>
              <p className="text-sm text-white/40 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
