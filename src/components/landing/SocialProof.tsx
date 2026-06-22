"use client";

import { Award, ShieldCheck, FlaskConical, Wheat, LeafyGreen, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

type BadgeDef = {
  icon: typeof Award;
  textKey: string;
  titleKey?: string;
};

const badgeDefs: BadgeDef[] = [
  { icon: Award, textKey: "badges.patents" },
  { icon: ShieldCheck, textKey: "badges.fda", titleKey: "titles.fda" },
  { icon: FlaskConical, textKey: "badges.gmp", titleKey: "titles.gmp" },
  { icon: Wheat, textKey: "badges.nonGmo", titleKey: "titles.nonGmo" },
  { icon: LeafyGreen, textKey: "badges.glutenFree" },
  { icon: Heart, textKey: "badges.vegan" },
];

// Duplicate for seamless loop
const allBadgeDefs = [...badgeDefs, ...badgeDefs];

export function SocialProof() {
  const t = useTranslations("landing.socialProof");
  return (
    <section className="py-6 bg-gray-50 dark:bg-zinc-900/50 overflow-hidden border-y border-border/50">
      <div className="flex items-center">
        <span className="flex-shrink-0 text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-6 pr-8">
          {t("label")}
        </span>
        <div className="social-proof-container relative flex overflow-hidden flex-1">
          <div className="social-proof-scroll flex shrink-0 gap-4">
            {allBadgeDefs.map((badge, i) => {
              const Icon = badge.icon;
              const text = t(badge.textKey);
              const title = badge.titleKey ? t(badge.titleKey) : "";
              return (
                <div
                  key={`${badge.textKey}-${i}`}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-zinc-800 border border-border/50 text-sm font-medium text-foreground whitespace-nowrap"
                  {...(title ? { title } : {})}
                >
                  <Icon size={16} className="text-mannatech" />
                  {text}
                </div>
              );
            })}
          </div>
          <div className="social-proof-scroll flex shrink-0 gap-4" aria-hidden="true">
            {allBadgeDefs.map((badge, i) => {
              const Icon = badge.icon;
              const text = t(badge.textKey);
              const title = badge.titleKey ? t(badge.titleKey) : "";
              return (
                <div
                  key={`dup-${badge.textKey}-${i}`}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-zinc-800 border border-border/50 text-sm font-medium text-foreground whitespace-nowrap"
                  {...(title ? { title } : {})}
                >
                  <Icon size={16} className="text-mannatech" />
                  {text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes socialScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .social-proof-scroll {
          animation: socialScroll 25s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .social-proof-scroll {
            animation: none;
          }
        }
        .social-proof-container:hover .social-proof-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
