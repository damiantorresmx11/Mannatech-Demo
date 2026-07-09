// ── BigCommerce Storefront API ─────────────────────────────────────────
// Public catalog browsing, cart management, and checkout.
// Uses Server-to-Server Cart API (no storefront token needed).

import { bcFetch } from "./client"
import { mapBCProduct, mapBCCart } from "./mappers"
import type { Product, Cart } from "../types"
import { withCache } from "../cache"

// ── Catalog (public, with cache) ──────────────────────────────────────

let categoryCache: Map<number, string> | null = null

async function getCategoryNames(): Promise<Map<number, string>> {
  if (categoryCache) return categoryCache
  try {
    const cats = await bcFetch<any[]>("/catalog/categories?limit=250")
    categoryCache = new Map(cats.map((c: any) => [c.id, c.name]))
    return categoryCache
  } catch {
    return new Map()
  }
}

export async function getPublicProducts(): Promise<Product[]> {
  return withCache("public-products", async () => {
    const data = await bcFetch<any[]>(
      "/catalog/products?is_visible=true&include=variants,images,custom_fields&limit=100&sort=name&direction=asc"
    )
    const categories = await getCategoryNames()
    return (data || []).map((p: any) => mapBCProduct(p, undefined, categories))
  })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return withCache(`product-${slug}`, async () => {
    // BC custom URLs are stored as /slug/
    const data = await bcFetch<any[]>(
      `/catalog/products?custom_url:in=/${slug}/&include=variants,images,custom_fields`
    )
    if (!data?.length) {
      // Try by SKU as fallback
      const bySku = await bcFetch<any[]>(
        `/catalog/products?sku=${slug}&include=variants,images,custom_fields`
      )
      if (!bySku?.length) return null
      const categories = await getCategoryNames()
      return mapBCProduct(bySku[0], undefined, categories)
    }
    const categories = await getCategoryNames()

    // Fetch metafields for full product data
    let metafields: any[] = []
    try {
      metafields = await bcFetch<any[]>(`/catalog/products/${data[0].id}/metafields`)
    } catch {
      // Optional
    }

    return mapBCProduct(data[0], metafields, categories)
  }, 2 * 60 * 1000) // 2 min TTL for individual products
}

export async function searchProducts(query: string, limit: number = 10): Promise<Product[]> {
  const data = await bcFetch<any[]>(
    `/catalog/products?keyword=${encodeURIComponent(query)}&is_visible=true&include=images&limit=${limit}`
  )
  const categories = await getCategoryNames()
  return (data || []).map((p: any) => mapBCProduct(p, undefined, categories))
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return withCache("featured-products", async () => {
    const data = await bcFetch<any[]>(
      "/catalog/products?is_featured=true&is_visible=true&include=variants,images,custom_fields&limit=20"
    )
    const categories = await getCategoryNames()
    return (data || []).map((p: any) => mapBCProduct(p, undefined, categories))
  })
}

// ── Cart (Server-to-Server) ───────────────────────────────────────────

const CHANNEL_ID = process.env.BIGCOMMERCE_CHANNEL_ID || "1"

export async function createCart(items: { productId: number; variantId?: number; quantity: number }[]): Promise<Cart> {
  const lineItems = items.map((item) => ({
    product_id: item.productId,
    variant_id: item.variantId,
    quantity: item.quantity,
  }))

  const data = await bcFetch<any>("/carts", {
    method: "POST",
    body: JSON.stringify({
      line_items: lineItems,
      channel_id: parseInt(CHANNEL_ID),
    }),
  })

  return mapBCCart(data)
}

export async function getCart(cartId: string): Promise<Cart> {
  const data = await bcFetch<any>(`/carts/${cartId}?include=line_items.physical_items.options,line_items.digital_items.options`)
  return mapBCCart(data)
}

export async function addCartItem(
  cartId: string,
  productId: number,
  quantity: number,
  variantId?: number,
): Promise<Cart> {
  const data = await bcFetch<any>(`/carts/${cartId}/items`, {
    method: "POST",
    body: JSON.stringify({
      line_items: [{
        product_id: productId,
        variant_id: variantId,
        quantity,
      }],
    }),
  })
  return mapBCCart(data)
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number,
): Promise<Cart> {
  const data = await bcFetch<any>(`/carts/${cartId}/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({
      line_item: { quantity },
    }),
  })
  return mapBCCart(data)
}

export async function deleteCartItem(cartId: string, itemId: string): Promise<Cart | null> {
  try {
    const data = await bcFetch<any>(`/carts/${cartId}/items/${itemId}`, {
      method: "DELETE",
    })
    return mapBCCart(data)
  } catch (err: any) {
    // If last item was removed, cart is deleted — return null
    if (err?.status === 404) return null
    throw err
  }
}

// ── Checkout ──────────────────────────────────────────────────────────

export async function getCheckoutUrl(cartId: string): Promise<string> {
  const data = await bcFetch<any>(`/carts/${cartId}/redirect_urls`, {
    method: "POST",
  })
  return data.checkout_url
}

export async function getEmbeddedCheckoutUrl(cartId: string): Promise<string> {
  const data = await bcFetch<any>(`/carts/${cartId}/redirect_urls`, {
    method: "POST",
  })
  return data.embedded_checkout_url
}
