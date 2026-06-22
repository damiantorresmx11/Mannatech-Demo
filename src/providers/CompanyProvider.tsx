"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getCompany,
  COMPANY_COOKIE,
  LOCALE_COOKIE,
  COOKIE_MAX_AGE,
  type CompanyConfig,
} from "@/config/companies";
import type { CompanyId, LocaleCode } from "@/lib/types";

interface CompanyContextValue {
  company: CompanyConfig;
  setCompany: (id: CompanyId) => void;
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;sameSite=lax;max-age=${COOKIE_MAX_AGE}`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;path=/;max-age=0`;
}

export function CompanyProvider({
  initialCompanyId,
  initialLocale,
  children,
}: {
  initialCompanyId: CompanyId;
  initialLocale: LocaleCode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [company, setCompanyState] = useState(() => getCompany(initialCompanyId));
  const [locale, setLocaleState] = useState<LocaleCode>(initialLocale);

  const setCompany = useCallback(
    (id: CompanyId) => {
      const newCompany = getCompany(id);
      setCompanyState(newCompany);
      setLocaleState(newCompany.defaultLocale);
      writeCookie(COMPANY_COOKIE, id);
      deleteCookie(LOCALE_COOKIE);
      router.refresh();
    },
    [router],
  );

  const setLocale = useCallback(
    (newLocale: LocaleCode) => {
      setLocaleState(newLocale);
      writeCookie(LOCALE_COOKIE, newLocale);
      router.refresh();
    },
    [router],
  );

  return (
    <CompanyContext.Provider value={{ company, setCompany, locale, setLocale }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
