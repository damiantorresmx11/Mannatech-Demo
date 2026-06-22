"use client";

import { Award, ShieldCheck, FlaskConical, Wheat, LeafyGreen, Heart, Microscope, Globe } from "lucide-react";

const badges = [
  { icon: Award, text: "+90 Patentes Globales" },
  { icon: ShieldCheck, text: "FDA Compliant" },
  { icon: FlaskConical, text: "GMP Certificado" },
  { icon: Wheat, text: "Sin OGM" },
  { icon: LeafyGreen, text: "Sin Gluten" },
  { icon: Heart, text: "Vegano Disponible" },
  { icon: Microscope, text: "Respaldado por Ciencia" },
  { icon: Globe, text: "+25 Países" },
];

export function TrustMarquee() {
  return (
    <section className="py-4 bg-[#0A0A0A] dark:bg-zinc-950 overflow-hidden border-y border-white/[0.06]">
      <div className="relative flex">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 animate-marquee-slow items-center gap-8 px-4"
            aria-hidden={copy === 1}
          >
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={`${badge.text}-${copy}`} className="flex items-center gap-2 text-white/50 whitespace-nowrap">
                  <Icon size={14} className="text-mannatech" />
                  <span className="text-xs font-medium tracking-wide">{badge.text}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
