"use client";

import { CheckCircle, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface JoinSectionProps {
  titulo: string;
  subtitulo: string;
  beneficios: string[];
  cta: string;
}

export function JoinSection({ titulo, subtitulo, beneficios, cta }: JoinSectionProps) {
  const t = useTranslations("landing.join");

  return (
    <section id="unete" data-label="Unete" className="py-20 bg-gradient-to-br from-mannatech to-mannatech-dark text-white scroll-snap-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white/15 rounded-full text-sm">
              <Users size={16} />
              {t("badge")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              {titulo}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              {subtitulo}
            </p>
            <button className="px-8 py-3.5 bg-white text-mannatech font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg">
              {cta}
            </button>
          </div>
          <div className="space-y-4">
            {beneficios.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <CheckCircle size={22} className="text-mannatech-light flex-shrink-0 mt-0.5" />
                <span className="text-white/90">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
