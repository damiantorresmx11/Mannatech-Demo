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
import { AnimatedBlock } from "@/components/cms/AnimatedBlock";

export default async function HomePage() {
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;
  const categorias = getCategorias(companyId);
  const productosDestacados = getProductosDestacados(companyId);
  const todosProductos = await getProductosCombined(companyId);

  // Fetch CMS content + animation styles
  const cmsPage = await getCMSPage("home");
  const cms = Object.fromEntries(
    (cmsPage?.blocks || []).map((b) => [b.type, b.content])
  );
  const styles = Object.fromEntries(
    (cmsPage?.blocks || []).map((b) => [b.type, b.styles])
  );
  const blockIds = Object.fromEntries(
    (cmsPage?.blocks || []).map((b) => [b.type, b.id])
  );

  return (
    <>
      <AnimatedBlock blockId={blockIds.hero || "hero"} blockType="hero" animation={styles.hero?.animation}>
        <Hero cms={cms.hero} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.quickCategoryMenu || "qcm"} blockType="quickCategoryMenu" animation={styles.quickCategoryMenu?.animation}>
        <QuickCategoryMenu cms={cms.quickCategoryMenu} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.featuredGrid || "fg"} blockType="featuredGrid" animation={styles.featuredGrid?.animation}>
        <FeaturedGrid productos={productosDestacados} allProductos={todosProductos} cms={cms.featuredGrid} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.missionSection || "ms"} blockType="missionSection" animation={styles.missionSection?.animation}>
        <MissionSection cms={cms.missionSection} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.scienceSection || "ss"} blockType="scienceSection" animation={styles.scienceSection?.animation}>
        <ScienceSection cms={cms.scienceSection} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.glycansSection || "gs"} blockType="glycansSection" animation={styles.glycansSection?.animation}>
        <GlycansSection cms={cms.glycansSection} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.whyGlycansSection || "wgs"} blockType="whyGlycansSection" animation={styles.whyGlycansSection?.animation}>
        <WhyGlycansSection cms={cms.whyGlycansSection} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.categories || "cat"} blockType="categories" animation={styles.categories?.animation}>
        <Categories categorias={categorias} cms={cms.categories} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.trustMarquee || "tm"} blockType="trustMarquee" animation={styles.trustMarquee?.animation}>
        <TrustMarquee cms={cms.trustMarquee} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.testimonials || "test"} blockType="testimonials" animation={styles.testimonials?.animation}>
        <Testimonials cms={cms.testimonials} />
      </AnimatedBlock>
      <AnimatedBlock blockId={blockIds.ctaBanner || "cta"} blockType="ctaBanner" animation={styles.ctaBanner?.animation}>
        <CTABanner cms={cms.ctaBanner} />
      </AnimatedBlock>
    </>
  );
}
