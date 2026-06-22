"use client";

import { useTranslations } from "next-intl";

export function MarqueeBanner() {
  const t = useTranslations("landing.marquee");
  const text = t("text");

  return (
    <section className="group bg-[#1a1a2e] py-3.5 overflow-hidden">
      <div className="relative flex">
        <div className="animate-marquee group-hover:[animation-play-state:paused] flex shrink-0 whitespace-nowrap">
          <span className="text-sm font-medium text-white/90 tracking-wide">
            {text}
          </span>
        </div>
        <div className="animate-marquee group-hover:[animation-play-state:paused] flex shrink-0 whitespace-nowrap" aria-hidden>
          <span className="text-sm font-medium text-white/90 tracking-wide">
            {text}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
