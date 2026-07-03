import { JoinSection } from "@/components/landing/JoinSection"

interface JoinSectionBlockProps {
  heading: string
  subtitle?: string
  benefits?: { text: string }[]
  cta?: { label: string; url: string }
}

export function JoinSectionBlockWrapper({ heading, subtitle, benefits, cta }: JoinSectionBlockProps) {
  return (
    <JoinSection
      titulo={heading}
      subtitulo={subtitle || ""}
      beneficios={benefits?.map((b) => b.text) || []}
      cta={cta?.label || "Unete"}
    />
  )
}
