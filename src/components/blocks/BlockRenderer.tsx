import type { PayloadBlock } from "@/lib/payload"
import { HeroBlockWrapper } from "./HeroBlockWrapper"
import { RichTextBlockWrapper } from "./RichTextBlockWrapper"
import { StatsBlockWrapper } from "./StatsBlockWrapper"
import { CTABlockWrapper } from "./CTABlockWrapper"
import { FAQBlockWrapper } from "./FAQBlockWrapper"
import { HowItWorksBlockWrapper } from "./HowItWorksBlockWrapper"
import { JoinSectionBlockWrapper } from "./JoinSectionBlockWrapper"
import { TestimonialsBlockWrapper } from "./TestimonialsBlockWrapper"
import { FeaturedProductsBlockWrapper } from "./FeaturedProductsBlockWrapper"
import { SocialProofBlockWrapper } from "./SocialProofBlockWrapper"
import { TeamGridBlockWrapper } from "./TeamGridBlockWrapper"
import { SpacerBlockWrapper } from "./SpacerBlockWrapper"
import { NewsletterBlockWrapper } from "./NewsletterBlockWrapper"
import { MarqueeBlockWrapper } from "./MarqueeBlockWrapper"
import { ImageBlockWrapper } from "./ImageBlockWrapper"
import { VideoBlockWrapper } from "./VideoBlockWrapper"

const BLOCK_MAP: Record<string, React.ComponentType<any>> = {
  hero: HeroBlockWrapper,
  richText: RichTextBlockWrapper,
  stats: StatsBlockWrapper,
  cta: CTABlockWrapper,
  faq: FAQBlockWrapper,
  howItWorks: HowItWorksBlockWrapper,
  joinSection: JoinSectionBlockWrapper,
  testimonials: TestimonialsBlockWrapper,
  featuredProducts: FeaturedProductsBlockWrapper,
  socialProof: SocialProofBlockWrapper,
  teamGrid: TeamGridBlockWrapper,
  spacer: SpacerBlockWrapper,
  newsletter: NewsletterBlockWrapper,
  marquee: MarqueeBlockWrapper,
  image: ImageBlockWrapper,
  video: VideoBlockWrapper,
}

export function BlockRenderer({ blocks }: { blocks: PayloadBlock[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        const Component = BLOCK_MAP[block.blockType]
        if (!Component) return null
        return <Component key={block.id || i} {...block} />
      })}
    </>
  )
}
