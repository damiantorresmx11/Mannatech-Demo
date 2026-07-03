import Link from "next/link"

interface HeroBlockProps {
  heading: string
  subheading?: string
  image?: { url: string; alt: string }
  cta?: { label: string; url: string }
  style?: "centered" | "left" | "video"
}

export function HeroBlockWrapper({ heading, subheading, image, cta, style = "centered" }: HeroBlockProps) {
  const alignment = style === "left" ? "text-left items-start" : "text-center items-center"

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-mannatech-dark via-mannatech to-mannatech-dark overflow-hidden">
      {image?.url && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${image.url})` }}
        />
      )}
      <div className={`relative z-10 max-w-4xl mx-auto px-4 py-20 flex flex-col gap-6 ${alignment}`}>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {heading}
        </h1>
        {subheading && (
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            {subheading}
          </p>
        )}
        {cta?.label && cta?.url && (
          <Link
            href={cta.url}
            className="inline-flex px-8 py-3.5 bg-white text-mannatech font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  )
}
