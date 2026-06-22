"use client";

import { useCompany } from "@/providers/CompanyProvider";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import type { CompanyId } from "@/lib/types";

const companyIds: CompanyId[] = ["mx", "us"];

export function CompanySelector() {
  const { company, setCompany } = useCompany();
  const t = useTranslations("common.company");

  return (
    <div className="relative flex items-center gap-1.5">
      <Globe size={14} className="text-muted-foreground" />
      <select
        value={company.id}
        onChange={(e) => setCompany(e.target.value as CompanyId)}
        className="appearance-none bg-transparent text-xs font-medium text-foreground/80 cursor-pointer focus:outline-none pr-4"
        aria-label={t("selectorLabel")}
      >
        {companyIds.map((id) => (
          <option key={id} value={id}>
            {t(id)}
          </option>
        ))}
      </select>
    </div>
  );
}
