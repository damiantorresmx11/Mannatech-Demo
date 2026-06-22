"use client";

import { useCompany } from "@/providers/CompanyProvider";
import { useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import type { LocaleCode } from "@/lib/types";

const locales: LocaleCode[] = ["es-MX", "en-US"];

export function LocaleSwitcher() {
  const { locale, setLocale } = useCompany();
  const t = useTranslations("common.locale");

  return (
    <div className="relative flex items-center gap-1.5">
      <Languages size={14} className="text-muted-foreground" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as LocaleCode)}
        className="appearance-none bg-transparent text-xs font-medium text-foreground/80 cursor-pointer focus:outline-none pr-4"
        aria-label={t("switcherLabel")}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}
