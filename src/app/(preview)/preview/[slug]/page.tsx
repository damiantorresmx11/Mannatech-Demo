import { cookies } from "next/headers"
import { getCMSPageForPreview } from "@/lib/cms-api"
import { PreviewClient } from "@/components/cms/PreviewClient"
import { COMPANY_COOKIE } from "@/config/companies"
import type { CompanyId } from "@/lib/types"
import {
  getCategorias,
  getProductosDestacados,
  getProductosCombined,
} from "@/lib/data"

import { Hero } from "@/components/landing/Hero"
import { QuickCategoryMenu } from "@/components/landing/QuickCategoryMenu"
import { FeaturedGrid } from "@/components/landing/FeaturedGrid"
import { MissionSection } from "@/components/landing/MissionSection"
import { ScienceSection } from "@/components/landing/ScienceSection"
import { GlycansSection } from "@/components/landing/GlycansSection"
import { WhyGlycansSection } from "@/components/landing/WhyGlycansSection"
import { Categories } from "@/components/landing/Categories"
import { TrustMarquee } from "@/components/landing/TrustMarquee"
import { Testimonials } from "@/components/landing/Testimonials"
import { CTABanner } from "@/components/landing/CTABanner"

interface Props {
  params: Promise<{ slug: string }>
}

// Map block types to landing components
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  quickCategoryMenu: QuickCategoryMenu,
  missionSection: MissionSection,
  scienceSection: ScienceSection,
  glycansSection: GlycansSection,
  whyGlycansSection: WhyGlycansSection,
  trustMarquee: TrustMarquee,
  testimonials: Testimonials,
  ctaBanner: CTABanner,
}

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params
  const page = await getCMSPageForPreview(slug)

  const store = await cookies()
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId
  const categorias = getCategorias(companyId)
  const productosDestacados = getProductosDestacados(companyId)
  const todosProductos = await getProductosCombined(companyId)

  // If CMS has blocks, render landing components in CMS block order
  if (page?.blocks?.length) {
    return (
      <div className="min-h-screen">
        {page.blocks.map((block) => {
          const Component = COMPONENT_MAP[block.type]

          // Special cases that need props
          if (block.type === "featuredGrid") {
            return (
              <div key={block.id} data-block-id={block.id} data-block-type={block.type}>
                <FeaturedGrid productos={productosDestacados} allProductos={todosProductos} />
              </div>
            )
          }
          if (block.type === "categories") {
            return (
              <div key={block.id} data-block-id={block.id} data-block-type={block.type}>
                <Categories categorias={categorias} cms={block.content} />
              </div>
            )
          }

          // Standard components — pass CMS content
          if (Component) {
            return (
              <div key={block.id} data-block-id={block.id} data-block-type={block.type}>
                <Component cms={block.content} />
              </div>
            )
          }

          // Unknown block type
          return (
            <div key={block.id} data-block-id={block.id} data-block-type={block.type} className="py-8 text-center border-y border-dashed border-zinc-200">
              <p className="text-zinc-400 text-sm">Bloque: <strong>{block.type}</strong></p>
            </div>
          )
        })}
        <PreviewClient />
      </div>
    )
  }

  // Fallback: render default home layout with block IDs for editing
  return (
    <div className="min-h-screen">
      <div data-block-id="default-hero" data-block-type="hero"><Hero /></div>
      <div data-block-id="default-categories-menu" data-block-type="quickCategoryMenu"><QuickCategoryMenu /></div>
      <div data-block-id="default-featured" data-block-type="featuredGrid"><FeaturedGrid productos={productosDestacados} allProductos={todosProductos} /></div>
      <div data-block-id="default-mission" data-block-type="missionSection"><MissionSection /></div>
      <div data-block-id="default-science" data-block-type="scienceSection"><ScienceSection /></div>
      <div data-block-id="default-glycans" data-block-type="glycansSection"><GlycansSection /></div>
      <div data-block-id="default-why-glycans" data-block-type="whyGlycansSection"><WhyGlycansSection /></div>
      <div data-block-id="default-categories" data-block-type="categories"><Categories categorias={categorias} /></div>
      <div data-block-id="default-trust" data-block-type="trustMarquee"><TrustMarquee /></div>
      <div data-block-id="default-testimonials" data-block-type="testimonials"><Testimonials /></div>
      <div data-block-id="default-cta" data-block-type="ctaBanner"><CTABanner /></div>
      <PreviewClient />
    </div>
  )
}
