// ── BigCommerce Admin API ──────────────────────────────────────────────
// CRUD operations for products, orders, customers, inventory, etc.
// All functions return our generic types from commerce/types.ts.

import { bcFetch } from "./client"
import {
  mapBCProduct,
  mapBCOrder,
  mapBCCustomer,
  mapBCPromotion,
  mapBCShippingZone,
  mapBCPaymentMethod,
} from "./mappers"
import type {
  Product,
  Order,
  Customer,
  Promotion,
  ShippingZone,
  PaymentMethod,
  ProductListParams,
  OrderListParams,
} from "../types"

// ── Categories (for product mapping) ──────────────────────────────────

let categoryCache: Map<number, string> | null = null

async function getCategoryNames(): Promise<Map<number, string>> {
  if (categoryCache) return categoryCache
  try {
    const cats = await bcFetch<any[]>("/catalog/categories?limit=250")
    categoryCache = new Map(cats.map((c) => [c.id, c.name]))
    return categoryCache
  } catch {
    return new Map()
  }
}

export function clearCategoryCache(): void {
  categoryCache = null
}

// ── Products ──────────────────────────────────────────────────────────

export async function getProducts(params?: ProductListParams): Promise<{ products: Product[]; total: number }> {
  const query = new URLSearchParams()
  query.set("include", "variants,images,custom_fields")
  query.set("limit", String(params?.limit || 50))
  if (params?.page) query.set("page", String(params.page))
  if (params?.keyword) query.set("keyword", params.keyword)
  if (params?.isVisible !== undefined) query.set("is_visible", String(params.isVisible))
  if (params?.isFeatured) query.set("is_featured", "true")
  if (params?.sort) query.set("sort", params.sort)
  if (params?.direction) query.set("direction", params.direction)

  const data = await bcFetch<any[]>(`/catalog/products?${query}`)
  const categories = await getCategoryNames()
  const products = (data || []).map((p: any) => mapBCProduct(p, undefined, categories))

  return { products, total: products.length }
}

export async function getProduct(id: string): Promise<Product> {
  const data = await bcFetch<any>(`/catalog/products/${id}?include=variants,images,custom_fields`)
  const categories = await getCategoryNames()

  // Fetch metafields for extended data
  let metafields: any[] = []
  try {
    metafields = await bcFetch<any[]>(`/catalog/products/${id}/metafields`)
  } catch {
    // Metafields are optional
  }

  return mapBCProduct(data, metafields, categories)
}

export async function createProduct(data: {
  nombre: string
  descripcion?: string
  slug?: string
  precio: number
  sku?: string
  peso?: number
  tipo?: string
  categorias?: number[]
  estado?: "active" | "draft"
}): Promise<Product> {
  const bcData = {
    name: data.nombre,
    description: data.descripcion || "",
    price: data.precio,
    sku: data.sku || "",
    weight: data.peso || 0,
    type: data.tipo || "physical",
    categories: data.categorias || [],
    is_visible: data.estado !== "draft",
  }

  const created = await bcFetch<any>("/catalog/products", {
    method: "POST",
    body: JSON.stringify(bcData),
  })

  const categories = await getCategoryNames()
  return mapBCProduct(created, undefined, categories)
}

export async function updateProduct(id: string, data: Record<string, unknown>): Promise<Product> {
  // Map our generic fields to BC fields
  const bcData: Record<string, unknown> = {}
  if (data.nombre !== undefined) bcData.name = data.nombre
  if (data.descripcionLarga !== undefined) bcData.description = data.descripcionLarga
  if (data.precio !== undefined) bcData.price = data.precio
  if (data.sku !== undefined) bcData.sku = data.sku
  if (data.estado !== undefined) bcData.is_visible = data.estado === "active"
  if (data.destacado !== undefined) bcData.is_featured = data.destacado
  if (data.categorias !== undefined) bcData.categories = data.categorias

  const updated = await bcFetch<any>(`/catalog/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(bcData),
  })

  const categories = await getCategoryNames()
  return mapBCProduct(updated, undefined, categories)
}

export async function deleteProduct(id: string): Promise<void> {
  await bcFetch(`/catalog/products/${id}`, { method: "DELETE" })
}

// ── Product Metafields ────────────────────────────────────────────────

export async function setProductMetafield(
  productId: string,
  key: string,
  value: string,
  namespace: string = "custom",
): Promise<void> {
  // Check if metafield exists
  const existing = await bcFetch<any[]>(`/catalog/products/${productId}/metafields`)
  const found = existing?.find((m: any) => m.key === key && m.namespace === namespace)

  if (found) {
    await bcFetch(`/catalog/products/${productId}/metafields/${found.id}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    })
  } else {
    await bcFetch(`/catalog/products/${productId}/metafields`, {
      method: "POST",
      body: JSON.stringify({
        key,
        value,
        namespace,
        permission_set: "read",
      }),
    })
  }
}

// ── Orders (V2 API) ───────────────────────────────────────────────────

export async function getOrders(params?: OrderListParams): Promise<{ orders: Order[]; total: number }> {
  const query = new URLSearchParams()
  query.set("limit", String(params?.limit || 50))
  if (params?.page) query.set("page", String(params.page))
  if (params?.sort) query.set("sort", params.sort)
  if (params?.direction) query.set("direction", params.direction)
  if (params?.minDateCreated) query.set("min_date_created", params.minDateCreated)
  if (params?.maxDateCreated) query.set("max_date_created", params.maxDateCreated)
  if (params?.customerId) query.set("customer_id", params.customerId)

  // Map our generic status to BC status_id
  if (params?.status) {
    const statusMap: Record<string, number> = {
      pending: 1,
      processing: 11,
      shipped: 2,
      completed: 10,
      cancelled: 5,
      refunded: 4,
    }
    if (statusMap[params.status]) query.set("status_id", String(statusMap[params.status]))
  }

  const data = await bcFetch<any[]>(`/orders?${query}`, { version: "v2" })
  const orders = (data || []).map((o: any) => mapBCOrder(o))

  return { orders, total: orders.length }
}

export async function getOrder(id: string): Promise<Order> {
  const data = await bcFetch<any>(`/orders/${id}`, { version: "v2" })

  // Fetch order products
  let items: any[] = []
  try {
    items = await bcFetch<any[]>(`/orders/${id}/products`, { version: "v2" })
  } catch {
    // Items fetch optional
  }

  return mapBCOrder(data, items)
}

export async function updateOrderStatus(id: string, statusId: number): Promise<Order> {
  const data = await bcFetch<any>(`/orders/${id}`, {
    version: "v2",
    method: "PUT",
    body: JSON.stringify({ status_id: statusId }),
  })
  return mapBCOrder(data)
}

export async function cancelOrder(id: string): Promise<Order> {
  return updateOrderStatus(id, 5) // 5 = Cancelled
}

export async function createFulfillment(orderId: string, _items: { id: string; quantity: number }[]): Promise<Order> {
  return updateOrderStatus(orderId, 2) // 2 = Shipped
}

// ── Customers (V3) ───────────────────────────────────────────────────

export async function getCustomers(params?: { limit?: number; page?: number }): Promise<{ customers: Customer[]; total: number }> {
  const query = new URLSearchParams()
  query.set("limit", String(params?.limit || 50))
  if (params?.page) query.set("page", String(params.page))

  const data = await bcFetch<any[]>(`/customers?${query}`)
  const customers = (data || []).map(mapBCCustomer)

  return { customers, total: customers.length }
}

export async function getCustomer(id: string): Promise<Customer> {
  const data = await bcFetch<any[]>(`/customers?id:in=${id}`)
  if (!data?.length) throw new Error(`Customer ${id} not found`)
  return mapBCCustomer(data[0])
}

// ── Inventory ─────────────────────────────────────────────────────────

export async function updateInventory(productId: string, variantId: string, quantity: number): Promise<void> {
  await bcFetch(`/catalog/products/${productId}/variants/${variantId}`, {
    method: "PUT",
    body: JSON.stringify({ inventory_level: quantity }),
  })
}

// ── Promotions / Coupons ──────────────────────────────────────────────

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const data = await bcFetch<any[]>("/promotions?limit=50")
    return (data || []).map(mapBCPromotion)
  } catch {
    return []
  }
}

export async function getCoupons(): Promise<Promotion[]> {
  try {
    const data = await bcFetch<any[]>("/coupons?limit=50", { version: "v2" })
    return (data || []).map(mapBCPromotion)
  } catch {
    return []
  }
}

// ── Shipping ──────────────────────────────────────────────────────────

export async function getShippingZones(): Promise<ShippingZone[]> {
  try {
    const zones = await bcFetch<any[]>("/shipping/zones")
    const result: ShippingZone[] = []

    for (const zone of zones || []) {
      let methods: any[] = []
      try {
        methods = await bcFetch<any[]>(`/shipping/zones/${zone.id}/methods`)
      } catch {
        // No methods for this zone
      }
      result.push(mapBCShippingZone(zone, methods))
    }

    return result
  } catch {
    return []
  }
}

// ── Payment Methods ───────────────────────────────────────────────────

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const data = await bcFetch<any[]>("/payments/methods", { version: "v2" })
    return (data || []).map(mapBCPaymentMethod)
  } catch {
    return []
  }
}
