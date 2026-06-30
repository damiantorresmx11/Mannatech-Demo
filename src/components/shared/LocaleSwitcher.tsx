"use client";

import { useCompany } from "@/providers/CompanyProvider";
import { useTranslations } from "next-intl";
import type { LocaleCode } from "@/lib/types";

const locales: LocaleCode[] = ["es-MX", "en-US"];

function MexicoFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-hidden="true">
      <rect width="213.3" fill="#006847" height="480" />
      <rect width="213.3" fill="#fff" height="480" x="213.3" />
      <rect width="213.3" fill="#ce1126" height="480" x="426.6" />
      <circle cx="320" cy="240" r="45" fill="#006847" />
    </svg>
  );
}

function USAFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-hidden="true">
      <rect width="640" height="480" fill="#fff" />
      <g fill="#b22234">
        {[0, 2, 4, 6, 8, 10, 12].map((i) => (
          <rect key={i} width="640" height={37} y={i * 37} />
        ))}
      </g>
      <rect width="256" height="259" fill="#3c3b6e" />
    </svg>
  );
}

const flags: Record<LocaleCode, React.ReactNode> = {
  "es-MX": <MexicoFlag className="w-5 h-3.5 rounded-[2px] object-cover" />,
  "en-US": <USAFlag className="w-5 h-3.5 rounded-[2px] object-cover" />,
};

export function LocaleSwitcher() {
  const { locale, setLocale } = useCompany();
  const t = useTranslations("common.locale");

  function toggle() {
    const next = locale === "es-MX" ? "en-US" : "es-MX";
    setLocale(next);
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label={`${t("switcherLabel")}: ${t(locale)}`}
      title={t(locale)}
    >
      {flags[locale]}
      <span className="text-xs font-medium text-foreground/70">
        {locale === "es-MX" ? "ES" : "EN"}
      </span>
    </button>
  );
}
