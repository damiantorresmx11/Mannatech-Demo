import { cookies } from "next/headers";
import {
  getCategorias,
  getProductosDestacados,
  getTextos,
  getProductos,
} from "@/lib/data";
import { COMPANY_COOKIE } from "@/config/companies";
import type { CompanyId } from "@/lib/types";
import { Hero } from "@/components/landing/Hero";
import { TrustMarquee } from "@/components/landing/TrustMarquee";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { MissionSection } from "@/components/landing/MissionSection";
import { Categories } from "@/components/landing/Categories";
import { ScienceSection } from "@/components/landing/ScienceSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTABanner } from "@/components/landing/CTABanner";

export default async function HomePage() {
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;

  const textos = getTextos(companyId);
  const categorias = getCategorias(companyId);
  const productosDestacados = getProductosDestacados(companyId);
  const todosProductos = getProductos(companyId);

  return (
    <>
      <Hero
        titulo={textos.hero.titulo}
        subtitulo={textos.hero.subtitulo}
        ctaPrimario={textos.hero.ctaPrimario}
        ctaSecundario={textos.hero.ctaSecundario}
      />
      <TrustMarquee />
      <FeaturedGrid productos={productosDestacados} allProductos={todosProductos} />
      <MissionSection />
      <Categories categorias={categorias} />
      <ScienceSection />
      <Testimonials />
      <CTABanner />
    </>
  );
}
