import type { Metadata } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { LayoutShell } from "@/components/LayoutShell";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { CompanyProvider } from "@/providers/CompanyProvider";
import { CurrencyProvider } from "@/providers/CurrencyProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { SceneProvider } from "@/providers/SceneProvider";
import { COMPANY_COOKIE } from "@/config/companies";
import type { CompanyId, LocaleCode } from "@/lib/types";

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Mannatech | Nutricion Gliconutricional",
  description:
    "Pioneros en gliconutricion desde 1994. Mas de 90 patentes y 30 anos transformando vidas con ciencia real.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;

  return (
    <html lang={locale} className={`${openSans.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <Script
          src="https://analytics.mannatech.dmlabs.mx/script.js"
          data-website-id="17bb85db-0383-4936-82bf-4b7366754d7c"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <NextIntlClientProvider messages={messages}>
          <CompanyProvider initialCompanyId={companyId} initialLocale={locale as LocaleCode}>
            <CurrencyProvider>
              <SmoothScrollProvider>
                <SceneProvider>
                  <LayoutShell>
                    {children}
                  </LayoutShell>
                </SceneProvider>
              </SmoothScrollProvider>
            </CurrencyProvider>
          </CompanyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
