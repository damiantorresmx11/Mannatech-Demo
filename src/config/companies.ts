import type { CompanyId, CurrencyCode, LocaleCode } from "@/lib/types";

export interface CompanyConfig {
  id: CompanyId;
  name: string;
  defaultLocale: LocaleCode;
  currency: CurrencyCode;
  taxRate: number;
  taxLabel: string;
  freeShippingThreshold: number;
  shippingCost: number;
}

export const companies: Record<CompanyId, CompanyConfig> = {
  mx: {
    id: "mx",
    name: "Mannatech Mexico",
    defaultLocale: "es-MX",
    currency: "MXN",
    taxRate: 0.16,
    taxLabel: "IVA",
    freeShippingThreshold: 1500,
    shippingCost: 99,
  },
  us: {
    id: "us",
    name: "Mannatech USA",
    defaultLocale: "en-US",
    currency: "USD",
    // PLACEHOLDER: US sales tax varies by state (0% - 10.25%) and product type.
    // This demo uses a flat 8% for demonstration purposes only.
    // Production would integrate with a tax calculation service (TaxJar, Avalara, etc.).
    taxRate: 0.08,
    taxLabel: "Tax",
    freeShippingThreshold: 100,
    shippingCost: 9.99,
  },
};

export function getCompany(id: CompanyId): CompanyConfig {
  return companies[id] ?? companies.mx;
}

export const COMPANY_COOKIE = "mannatech_company";
export const LOCALE_COOKIE = "mannatech_locale";
export const COOKIE_MAX_AGE = 31536000; // 1 year in seconds
