const CMS_API = process.env.CMS_API_URL || "http://127.0.0.1:3002"
const SITE_ID = process.env.CMS_SITE_ID || "e1d8c609-d3ad-4a15-ab8c-18d031f10a09"

export interface CMSPage {
  id: string
  title: string
  slug: string
  status: string
  seoTitle: string | null
  seoDescription: string | null
  blocks: CMSBlock[]
}

export interface CMSBlock {
  id: string
  type: string
  position: number
  content: Record<string, any>
  styles: Record<string, any>
  visibility: { desktop: boolean; tablet: boolean; mobile: boolean }
}

export async function getCMSPage(slug: string): Promise<CMSPage | null> {
  try {
    const res = await fetch(`${CMS_API}/pages/by-slug/${SITE_ID}/${slug}`, {
      next: { revalidate: 30 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getCMSPageForPreview(slug: string): Promise<CMSPage | null> {
  try {
    const res = await fetch(`${CMS_API}/pages/by-slug/${SITE_ID}/${slug}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export { SITE_ID, CMS_API }
