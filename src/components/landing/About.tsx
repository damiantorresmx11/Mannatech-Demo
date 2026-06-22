"use client";

import { Award, FlaskConical, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

interface AboutProps {
  titulo: string;
  texto: string;
  propuestaValor: string;
  patentes: number;
  anosInnovacion: number;
}

export function About({
  titulo,
  texto,
  propuestaValor,
  patentes,
  anosInnovacion,
}: AboutProps) {
  const t = useTranslations("landing.about");

  return (
    <section id="sobre" data-label="Nosotros" className="py-24 bg-white dark:bg-zinc-900 scroll-snap-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mannatech mb-4">
            {t("overline")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">{titulo}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{texto}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14">
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-mannatech/10 flex items-center justify-center mx-auto mb-3">
              <Award size={24} className="text-mannatech" />
            </div>
            <p className="text-3xl font-bold text-mannatech">+{patentes}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("globalPatents")}
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-mannatech/10 flex items-center justify-center mx-auto mb-3">
              <FlaskConical size={24} className="text-mannatech" />
            </div>
            <p className="text-3xl font-bold text-mannatech">
              +{anosInnovacion}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("yearsInnovation")}
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-mannatech/10 flex items-center justify-center mx-auto mb-3">
              <Globe size={24} className="text-mannatech" />
            </div>
            <p className="text-3xl font-bold text-mannatech">25+</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("countriesPresence")}
            </p>
          </div>
        </div>

        {/* Value proposition */}
        <div className="bg-gradient-to-r from-mannatech/5 to-mannatech-light/5 rounded-2xl p-8 text-center">
          <p className="text-lg text-foreground leading-relaxed max-w-2xl mx-auto">
            {propuestaValor}
          </p>
        </div>
      </div>
    </section>
  );
}
