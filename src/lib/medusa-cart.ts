"use client"

const API = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.mannatech.dmlabs.mx"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

async function storeFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }),
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  })

  return res.json()
}

export interface CartSyncItem {
  variant_id: string
  quantity: number
}

/**
 * Create a Medusa cart from local cart items.
 * Used at checkout time to sync the Zustand cart with Medusa.
 */
export async function createMedusaCart(regionId: string, items: CartSyncItem[]) {
  return storeFetch("/store/carts", {
    method: "POST",
    body: JSON.stringify({
      region_id: regionId,
      items,
    }),
  })
}

export async function getCart(cartId: string) {
  return storeFetch(`/store/carts/${cartId}`)
}

export async function addItemToCart(cartId: string, variantId: string, quantity: number) {
  return storeFetch(`/store/carts/${cartId}/line-items`, {
    method: "POST",
    body: JSON.stringify({ variant_id: variantId, quantity }),
  })
}

export async function updateCartItem(cartId: string, lineItemId: string, quantity: number) {
  return storeFetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  })
}

export async function deleteCartItem(cartId: string, lineItemId: string) {
  return storeFetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: "DELETE",
  })
}

export async function completeCart(cartId: string) {
  return storeFetch(`/store/carts/${cartId}/complete`, {
    method: "POST",
  })
}
