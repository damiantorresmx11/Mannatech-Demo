// ── BigCommerce API Client ─────────────────────────────────────────────
// Centralized fetch wrapper for BigCommerce V2/V3 REST APIs.
// Uses static X-Auth-Token — no login/session needed.

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

export async function bcFetch<T>(
  endpoint: string,
  options: BCFetchOptions = {},
): Promise<T> {
  const { version = "v3", ...fetchOptions } = options
  const base = version === "v2" ? BASE_V2 : BASE_V3

  const res = await fetch(`${base}${endpoint}`, {
    ...fetchOptions,
    headers: {
      "X-Auth-Token": ACCESS_TOKEN,
      "Content-Type": "application/json",
      Accept: "application/json",
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
  const base = version === "v2" ? BASE_V2 : BASE_V3

  const res = await fetch(`${base}${endpoint}`, {
    ...fetchOptions,
    headers: {
      "X-Auth-Token": ACCESS_TOKEN,
      "Content-Type": "application/json",
      Accept: "application/json",
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
  return Boolean(STORE_HASH && ACCESS_TOKEN)
}
