import type { CMSBlock } from "@/lib/cms-api"
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
import { FAQ } from "@/components/landing/FAQ"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { JoinSection } from "@/components/landing/JoinSection"
import { Newsletter } from "@/components/landing/Newsletter"
import { SocialProof } from "@/components/landing/SocialProof"
import { StatsSection } from "@/components/landing/StatsSection"
import { MarqueeBanner } from "@/components/landing/MarqueeBanner"
import { FeaturedProducts } from "@/components/landing/FeaturedProducts"
import { About } from "@/components/landing/About"

// Maps CMS block types to existing landing components
// Components that don't accept props are rendered as-is
// Components that accept props get their data from block.content
const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  quickCategoryMenu: QuickCategoryMenu,
  missionSection: MissionSection,
  scienceSection: ScienceSection,
  glycansSection: GlycansSection,
  whyGlycansSection: WhyGlycansSection,
  trustMarquee: TrustMarquee,
  testimonials: Testimonials,
  ctaBanner: CTABanner,
  faq: FAQ,
  howItWorks: HowItWorks,
  newsletter: Newsletter,
  socialProof: SocialProof,
  statsSection: StatsSection,
  stats: StatsSection,
  marquee: MarqueeBanner,
}

// Components that need props from CMS content
const PROP_COMPONENTS: Record<string, (content: any) => React.ReactNode> = {
  joinSection: (c) => (
    <JoinSection titulo={c.heading || c.titulo || ""} subtitulo={c.subtitle || c.subtitulo || ""} beneficios={c.benefits || c.beneficios || []} cta={c.cta || ""} />
  ),
  featuredGrid: (c) => (
    <FeaturedGrid productos={c.products || []} allProductos={c.products || []} />
  ),
  featuredProducts: (c) => (
    <FeaturedProducts productos={c.products || []} />
  ),
  categories: (c) => (
    <Categories categorias={c.categories || []} />
  ),
  about: (c) => (
    <About titulo={c.title || ""} texto={c.text || ""} propuestaValor={c.proposition || ""} patentes={c.patentes || 90} anosInnovacion={c.anosInnovacion || 30} />
  ),
}

function BlockWrapper({ block }: { block: CMSBlock }) {
  const customStyles: React.CSSProperties = {}
  if (block.styles?.paddingTop) customStyles.paddingTop = `${block.styles.paddingTop}px`
  if (block.styles?.paddingBottom) customStyles.paddingBottom = `${block.styles.paddingBottom}px`
  if (block.styles?.bgColor && block.styles?.bgType !== "gradient") customStyles.backgroundColor = block.styles.bgColor

  // Try prop components first
  if (PROP_COMPONENTS[block.type]) {
    return (
      <div data-block-id={block.id} data-block-type={block.type} style={customStyles}>
        {PROP_COMPONENTS[block.type](block.content)}
      </div>
    )
  }

  // Then static components
  const Component = BLOCK_COMPONENTS[block.type]
  if (Component) {
    return (
      <div data-block-id={block.id} data-block-type={block.type} style={customStyles}>
        <Component />
      </div>
    )
  }

  // Unknown block type — render placeholder
  return (
    <div data-block-id={block.id} data-block-type={block.type} className="py-12 text-center text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border-y border-dashed border-zinc-200 dark:border-zinc-800">
      <p className="text-sm">Bloque: <strong>{block.type}</strong></p>
    </div>
  )
}

export function CMSPageRenderer({ blocks }: { blocks: CMSBlock[] }) {
  return (
    <>
      {blocks.map((block) => (
        <BlockWrapper key={block.id} block={block} />
      ))}
    </>
  )
}
