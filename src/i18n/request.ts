import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { getCompany, COMPANY_COOKIE, LOCALE_COOKIE } from "@/config/companies";
import type { CompanyId, LocaleCode } from "@/lib/types";

export default getRequestConfig(async () => {
  const store = await cookies();

  // Read company from cookie (SSR-safe)
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;
  const company = getCompany(companyId);

  // Check for manual locale override, otherwise use company default
  const localeOverride = store.get(LOCALE_COOKIE)?.value as
    | LocaleCode
    | undefined;
  const locale = localeOverride ?? company.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
