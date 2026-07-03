import { notFound } from "next/navigation"
import { getCMSPageForPreview } from "@/lib/cms-api"
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer"
import { PreviewClient } from "@/components/cms/PreviewClient"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params
  const page = await getCMSPageForPreview(slug)
  if (!page) return notFound()

  return (
    <>
      <CMSPageRenderer blocks={page.blocks} />
      <PreviewClient />
    </>
  )
}
