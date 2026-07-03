import { cookies } from "next/headers";
import {
  getCategorias,
  getProductosDestacados,
  getProductosCombined,
} from "@/lib/data";
import { getCMSPage } from "@/lib/cms-api";
import { COMPANY_COOKIE } from "@/config/companies";
import type { CompanyId } from "@/lib/types";
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
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;
  const categorias = getCategorias(companyId);
  const productosDestacados = getProductosDestacados(companyId);
  const todosProductos = await getProductosCombined(companyId);

  // Fetch CMS content to override defaults (won't change design, only content)
  const cmsPage = await getCMSPage("home");
  const cms = Object.fromEntries(
    (cmsPage?.blocks || []).map((b) => [b.type, b.content])
  );

  return (
    <>
      <Hero cms={cms.hero} />
      <QuickCategoryMenu cms={cms.quickCategoryMenu} />
      <FeaturedGrid productos={productosDestacados} allProductos={todosProductos} />
      <MissionSection cms={cms.missionSection} />
      <ScienceSection cms={cms.scienceSection} />
      <GlycansSection cms={cms.glycansSection} />
      <WhyGlycansSection cms={cms.whyGlycansSection} />
      <Categories categorias={categorias} cms={cms.categories} />
      <TrustMarquee cms={cms.trustMarquee} />
      <Testimonials cms={cms.testimonials} />
      <CTABanner cms={cms.ctaBanner} />
    </>
  );
}
