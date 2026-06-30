"use client";

import { NumberTicker } from "@/components/ui/number-ticker";

export function MissionSection() {
  return (
    <section id="mision" className="py-10 sm:py-14 bg-gradient-to-r from-mannatech-dark via-mannatech to-mannatech-dark dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left — tagline */}
          <div className="text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white dark:text-foreground leading-tight">
              Liderando con Innovación
            </h2>
            <p className="text-white/60 dark:text-muted-foreground text-sm mt-1">
              en la industria nutricional y de salud.
            </p>
          </div>

          {/* Right — stats */}
          <div className="flex items-center gap-8 sm:gap-12 lg:gap-16">
            {[
              { value: 154, suffix: "", label: "Patentes\nOtorgadas" },
              { value: 74, suffix: "", label: "Patentes\nActivas" },
              { value: 2, suffix: "", label: "Patentes\nPendientes" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-mannatech mb-1">
                  <NumberTicker value={stat.value} suffix={stat.suffix} duration={2.5} className="text-white dark:text-mannatech" />
                </p>
                <p className="text-[10px] sm:text-xs text-white/50 dark:text-muted-foreground font-medium uppercase tracking-wider whitespace-pre-line leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
