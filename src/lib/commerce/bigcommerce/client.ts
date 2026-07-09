// ── BigCommerce API Client ─────────────────────────────────────────────
// Centralized fetch wrapper for BigCommerce V2/V3 REST APIs.
// Server-side: calls BigCommerce directly with X-Auth-Token.
// Client-side: proxies through /api/commerce/ to avoid CORS issues.

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
    // Direct call to BigCommerce API
    const base = version === "v2" ? BASE_V2 : BASE_V3
    return `${base}${endpoint}`
  }
  // Client-side: proxy through our API route
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

  // V2 endpoints return data directly, V3 wraps in { data, meta }
  const json = await res.json()

  if (version === "v3" && json.data !== undefined) {
    return json.data as T
  }

  return json as T
}

// Helper for V3 responses that include pagination meta
export async function bcFetchWithMeta<T>(
  endpoint: string,
  options: BCFetchOptions = {},
): Promise<{ data: T; meta: { pagination: { total: number; count: number; per_page: number; current_page: number; total_pages: number } } }> {
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

  return res.json()
}

export function isConfigured(): boolean {
  if (isServer) {
    return Boolean(STORE_HASH && ACCESS_TOKEN)
  }
  // Client-side can't check env vars — assume configured, proxy will return 503 if not
  return true
}
