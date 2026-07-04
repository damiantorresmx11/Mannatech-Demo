import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mannatech.dmlabs.mx"
const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"
const CMS_API_URL = process.env.CMS_API_URL || "http://127.0.0.1:3002"

interface MedusaProduct {
  id: string
  handle: string
  updated_at: string
}

interface CMSPage {
  slug: string
  updatedAt?: string
  updated_at?: string
}

async function getProducts(): Promise<MedusaProduct[]> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/products?limit=100`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.products || []
  } catch {
    return []
  }
}

async function getCMSPages(): Promise<CMSPage[]> {
  try {
    const res = await fetch(`${CMS_API_URL}/pages`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.pages || data || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, cmsPages] = await Promise.all([getProducts(), getCMSPages()])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/quienes-somos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/unete`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/impacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/productos/${product.handle}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const cmsPageEntries: MetadataRoute.Sitemap = cmsPages
    .filter((page) => page.slug !== "home")
    .map((page) => ({
      url: `${BASE_URL}/${page.slug}`,
      lastModified: new Date(page.updatedAt || page.updated_at || new Date().toISOString()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  return [...staticPages, ...productPages, ...cmsPageEntries]
}
