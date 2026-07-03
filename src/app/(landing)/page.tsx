import { cookies } from "next/headers";
import {
  getCategorias,
  getProductosDestacados,
  getProductosCombined,
} from "@/lib/data";
import { COMPANY_COOKIE } from "@/config/companies";
import type { CompanyId } from "@/lib/types";
import { getPage } from "@/lib/payload";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Hero } from "@/components/landing/Hero";
import { QuickCategoryMenu } from "@/components/landing/QuickCategoryMenu";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { MissionSection } from "@/components/landing/MissionSection";
import { ScienceSection } from "@/components/landing/ScienceSection";
import { GlycansSection } from "@/components/landing/GlycansSection";
import { WhyGlycansSection } from "@/components/landing/WhyGlycansSection";
import { Categories } from "@/components/landing/Categories";
import { TrustMarquee } from "@/components/landing/TrustMarquee";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTABanner } from "@/components/landing/CTABanner";

export default async function HomePage() {
  // Try Payload CMS first
  const cmsPage = await getPage("home");
  if (cmsPage?.layout?.length) {
    return <BlockRenderer blocks={cmsPage.layout} />;
  }

  // Fallback to existing hardcoded layout
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;

  const categorias = getCategorias(companyId);
  const productosDestacados = getProductosDestacados(companyId);
  const todosProductos = await getProductosCombined(companyId);

  return (
    <>
      <Hero />
      <QuickCategoryMenu />
      <FeaturedGrid productos={productosDestacados} allProductos={todosProductos} />
      <MissionSection />
      <ScienceSection />
      <GlycansSection />
      <WhyGlycansSection />
      <Categories categorias={categorias} />
      <TrustMarquee />
      <Testimonials />
      <CTABanner />
    </>
  );
}
