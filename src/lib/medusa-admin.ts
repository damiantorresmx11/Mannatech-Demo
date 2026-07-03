"use client"

const API = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.mannatech.dmlabs.mx"

let cachedToken: string | null = null

export async function getAdminToken(): Promise<string> {
  if (cachedToken) return cachedToken

  const stored = typeof window !== "undefined" ? sessionStorage.getItem("medusa_admin_token") : null
  if (stored) {
    cachedToken = stored
    return stored
  }

  throw new Error("No admin token. Please login first.")
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  const res = await fetch(`${API}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) throw new Error("Login failed")

  const data = await res.json()
  cachedToken = data.token
  if (typeof window !== "undefined") {
    sessionStorage.setItem("medusa_admin_token", data.token)
  }
  return data.token
}

export async function adminFetch(path: string, options: RequestInit = {}) {
  const token = await getAdminToken()
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (res.status === 401) {
    cachedToken = null
    if (typeof window !== "undefined") sessionStorage.removeItem("medusa_admin_token")
    throw new Error("Unauthorized")
  }

  return res.json()
}

export async function getProducts() {
  return adminFetch("/admin/products?limit=50&fields=id,title,handle,status,thumbnail,variants.prices.*,variants.inventory_quantity,collection.*,categories.*")
}

export async function getProduct(id: string) {
  return adminFetch(`/admin/products/${id}`)
}

export async function getOrders() {
  return adminFetch("/admin/orders?limit=50")
}

export async function getOrder(id: string) {
  return adminFetch(`/admin/orders/${id}`)
}

export async function getCustomers() {
  return adminFetch("/admin/customers?limit=50")
}

export async function getInventory() {
  return adminFetch("/admin/inventory-items?limit=50")
}

export async function getPromotions() {
  return adminFetch("/admin/promotions?limit=50")
}

export async function getRegions() {
  return adminFetch("/admin/regions?limit=50")
}

export async function getShippingOptions() {
  return adminFetch("/admin/shipping-options?limit=50")
}

export async function getPaymentProviders() {
  return adminFetch("/admin/payment-providers?limit=50")
}

export async function getOrdersByDateRange(from: string, to: string) {
  return adminFetch(`/admin/orders?limit=100&created_at[gte]=${from}&created_at[lte]=${to}`)
}

// ── Product CRUD ──────────────────────────────────────────────────────

export async function createProduct(data: {
  title: string;
  description?: string;
  handle?: string;
  status?: string;
  options?: { title: string; values: string[] }[];
  variants?: { title: string; prices: { amount: number; currency_code: string }[]; options?: Record<string, string>; manage_inventory?: boolean }[];
}) {
  return adminFetch("/admin/products", { method: "POST", body: JSON.stringify(data) })
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  return adminFetch(`/admin/products/${id}`, { method: "POST", body: JSON.stringify(data) })
}

export async function deleteProduct(id: string) {
  return adminFetch(`/admin/products/${id}`, { method: "DELETE" })
}

// ── Stock ─────────────────────────────────────────────────────────────

export async function updateInventoryLevel(inventoryItemId: string, locationId: string, quantity: number) {
  return adminFetch(`/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`, {
    method: "POST",
    body: JSON.stringify({ stocked_quantity: quantity }),
  })
}

// ── Order actions ─────────────────────────────────────────────────────

export async function cancelOrder(id: string) {
  return adminFetch(`/admin/orders/${id}/cancel`, { method: "POST" })
}

export async function createFulfillment(orderId: string, items: { id: string; quantity: number }[]) {
  return adminFetch(`/admin/orders/${orderId}/fulfillments`, {
    method: "POST",
    body: JSON.stringify({ items }),
  })
}
