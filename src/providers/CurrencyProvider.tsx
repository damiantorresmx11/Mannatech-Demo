"use client";

import { createContext, useContext, useMemo } from "react";
import { useCompany } from "@/providers/CompanyProvider";
import type { CurrencyCode } from "@/lib/types";

interface CurrencyContextValue {
  currency: CurrencyCode;
  format: (amount: number) => string;
  taxRate: number;
  taxLabel: string;
  freeShippingThreshold: number;
  shippingCost: number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { company } = useCompany();

  const value = useMemo<CurrencyContextValue>(() => {
    const formatter = new Intl.NumberFormat(company.defaultLocale, {
      style: "currency",
      currency: company.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return {
      currency: company.currency,
      format: (amount: number) => formatter.format(amount),
      taxRate: company.taxRate,
      taxLabel: company.taxLabel,
      freeShippingThreshold: company.freeShippingThreshold,
      shippingCost: company.shippingCost,
    };
  }, [company]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
