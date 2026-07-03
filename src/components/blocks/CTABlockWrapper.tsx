import Link from "next/link"

interface CTABlockProps {
  heading: string
  text?: string
  buttonLabel: string
  buttonUrl: string
  style?: "primary" | "secondary"
}

export function CTABlockWrapper({ heading, text, buttonLabel, buttonUrl, style = "primary" }: CTABlockProps) {
  const isPrimary = style === "primary"

  return (
    <section className={`py-20 ${isPrimary ? "bg-gradient-to-br from-mannatech to-mannatech-dark text-white" : "bg-gray-50 dark:bg-gray-900"}`}>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isPrimary ? "" : "text-gray-900 dark:text-white"}`}>
          {heading}
        </h2>
        {text && (
          <p className={`text-lg mb-8 ${isPrimary ? "text-white/80" : "text-gray-600 dark:text-gray-400"}`}>
            {text}
          </p>
        )}
        <Link
          href={buttonUrl}
          className={`inline-flex px-8 py-3.5 font-semibold rounded-xl transition-all shadow-lg ${
            isPrimary
              ? "bg-white text-mannatech hover:bg-white/90"
              : "bg-mannatech text-white hover:bg-mannatech-dark"
          }`}
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  )
}
