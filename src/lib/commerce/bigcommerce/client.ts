// ── BigCommerce API Client ─────────────────────────────────────────────
// Centralized fetch wrapper for BigCommerce V2/V3 REST APIs.
// Server-side: calls BigCommerce directly with X-Auth-Token.
// Client-side: proxies through /api/commerce/ to avoid CORS issues.
// When not configured, returns null silently (no errors, no console spam).

const isServer = typeof window === "undefined"

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH || ""
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN || ""

const BASE_V3 = `https://api.bigcommerce.com/stores/${STORE_HASH}/v3`
const BASE_V2 = `https://api.bigcommerce.com/stores/${STORE_HASH}/v2`

export class BCError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`BigCommerce API error ${status}: ${body}`)
    this.name = "BCError"
  }
}

interface BCFetchOptions extends RequestInit {
  version?: "v2" | "v3"
}

function getUrl(endpoint: string, version: "v2" | "v3"): string {
  if (isServer) {
    const base = version === "v2" ? BASE_V2 : BASE_V3
    return `${base}${endpoint}`
  }
  return `/api/commerce/${version}${endpoint}`
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
  if (isServer) {
    headers["X-Auth-Token"] = ACCESS_TOKEN
  }
  return headers
}

export async function bcFetch<T>(
  endpoint: string,
  options: BCFetchOptions = {},
): Promise<T> {
  // Skip entirely if not configured (server-side check)
  if (isServer && !STORE_HASH) {
    return [] as unknown as T
  }

  const { version = "v3", ...fetchOptions } = options
  const url = getUrl(endpoint, version)

  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...getHeaders(),
      ...fetchOptions.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new BCError(res.status, body)
  }

  const json = await res.json()

  // Proxy returns _notConfigured flag when BC credentials are missing
  if (json._notConfigured) {
    return [] as unknown as T
  }

  if (version === "v3" && json.data !== undefined) {
    return json.data as T
  }

  return json as T
}

export async function bcFetchWithMeta<T>(
  endpoint: string,
  options: BCFetchOptions = {},
): Promise<{ data: T; meta: { pagination: { total: number; count: number; per_page: number; current_page: number; total_pages: number } } }> {
  if (isServer && !STORE_HASH) {
    return { data: [] as unknown as T, meta: { pagination: { total: 0, count: 0, per_page: 50, current_page: 1, total_pages: 0 } } }
  }

  const { version = "v3", ...fetchOptions } = options
  const url = getUrl(endpoint, version)

  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...getHeaders(),
      ...fetchOptions.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new BCError(res.status, body)
  }

  const json = await res.json()
  if (json._notConfigured) {
    return { data: [] as unknown as T, meta: { pagination: { total: 0, count: 0, per_page: 50, current_page: 1, total_pages: 0 } } }
  }

  return json
}

export function isConfigured(): boolean {
  if (isServer) {
    return Boolean(STORE_HASH && ACCESS_TOKEN)
  }
  return true
}
