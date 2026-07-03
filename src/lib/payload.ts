const CMS_URL = process.env.PAYLOAD_CMS_URL || "https://cms.mannatech.dmlabs.mx"

async function payloadFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}/api${endpoint}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ── Pages ────────────────────────────────────────────────────────────

export interface PayloadPage {
  id: number
  title: string
  slug: string
  layout: PayloadBlock[]
  meta?: { title?: string; description?: string; image?: any }
  status: "draft" | "published"
  publishedAt?: string
}

export interface PayloadBlock {
  blockType: string
  id?: string
  [key: string]: any
}

export async function getPage(slug: string): Promise<PayloadPage | null> {
  const data = await payloadFetch<{ docs: PayloadPage[] }>(
    `/pages?where[slug][equals]=${slug}&where[status][equals]=published&depth=2&limit=1`
  )
  return data?.docs?.[0] || null
}

export async function getAllPageSlugs(): Promise<string[]> {
  const data = await payloadFetch<{ docs: { slug: string }[] }>(
    `/pages?where[status][equals]=published&limit=100&depth=0`
  )
  return data?.docs?.map((d) => d.slug) || []
}

// ── Globals ──────────────────────────────────────────────────────────

export async function getGlobal<T = any>(slug: string): Promise<T | null> {
  return payloadFetch<T>(`/globals/${slug}?depth=2`)
}

// ── Collections ──────────────────────────────────────────────────────

export async function getProducts(params?: string) {
  const qs = params || "limit=50&depth=1"
  const data = await payloadFetch<{ docs: any[] }>(`/products?${qs}`)
  return data?.docs || []
}

export async function getCategories() {
  const data = await payloadFetch<{ docs: any[] }>(`/categories?limit=20&depth=1`)
  return data?.docs || []
}

export async function getTestimonials() {
  const data = await payloadFetch<{ docs: any[] }>(`/testimonials?limit=20&depth=1`)
  return data?.docs || []
}

export async function getDistributors() {
  const data = await payloadFetch<{ docs: any[] }>(`/distributors?limit=20&depth=1`)
  return data?.docs || []
}
