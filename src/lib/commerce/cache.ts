// ── Commerce Cache ─────────────────────────────────────────────────────
// Smart cache: stores last successful API response as JSON file.
// On API failure, returns cached data (up to 24h stale).
// Only uses filesystem on server-side (Node.js). Client-side is pass-through.

const DEFAULT_TTL = 5 * 60 * 1000       // 5 minutes
const MAX_STALE = 24 * 60 * 60 * 1000   // 24 hours

const isServer = typeof window === "undefined"

interface CacheEntry<T> {
  data: T
  timestamp: number
}

// In-memory cache for both server and client
const memoryCache = new Map<string, CacheEntry<unknown>>()

function getCachePath(key: string): string {
  const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "_")
  return `data/commerce-cache/${safeKey}.json`
}

function readCache<T>(key: string): CacheEntry<T> | null {
  // Check memory cache first
  const mem = memoryCache.get(key) as CacheEntry<T> | undefined
  if (mem) return mem

  // Try filesystem on server
  if (isServer) {
    try {
      const fs = require("fs")
      const path = require("path")
      const filePath = path.resolve(process.cwd(), getCachePath(key))
      if (!fs.existsSync(filePath)) return null
      const raw = fs.readFileSync(filePath, "utf-8")
      const entry = JSON.parse(raw) as CacheEntry<T>
      memoryCache.set(key, entry)
      return entry
    } catch {
      return null
    }
  }

  return null
}

function writeCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = { data, timestamp: Date.now() }
  memoryCache.set(key, entry)

  if (isServer) {
    try {
      const fs = require("fs")
      const path = require("path")
      const cacheDir = path.resolve(process.cwd(), "data", "commerce-cache")
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      fs.writeFileSync(
        path.resolve(process.cwd(), getCachePath(key)),
        JSON.stringify(entry),
        "utf-8"
      )
    } catch (err) {
      console.warn(`[commerce-cache] Failed to write cache for "${key}":`, err)
    }
  }
}

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL,
): Promise<T> {
  // Check if we have a fresh cache hit
  const cached = readCache<T>(key)
  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.data
  }

  // Try fetching fresh data
  try {
    const data = await fetcher()
    writeCache(key, data)
    return data
  } catch (error) {
    // On failure, return stale cache if within max age
    if (cached && Date.now() - cached.timestamp < MAX_STALE) {
      console.warn(`[commerce-cache] Using stale cache for "${key}" (API error)`)
      return cached.data
    }
    throw error
  }
}

export function invalidateCache(key: string): void {
  memoryCache.delete(key)
  if (isServer) {
    try {
      const fs = require("fs")
      const path = require("path")
      const filePath = path.resolve(process.cwd(), getCachePath(key))
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch {
      // Ignore
    }
  }
}

export function invalidateAllCache(): void {
  memoryCache.clear()
  if (isServer) {
    try {
      const fs = require("fs")
      const path = require("path")
      const cacheDir = path.resolve(process.cwd(), "data", "commerce-cache")
      if (fs.existsSync(cacheDir)) {
        const files = fs.readdirSync(cacheDir)
        files.forEach((f: string) => {
          try { fs.unlinkSync(path.join(cacheDir, f)) } catch { /* ignore */ }
        })
      }
    } catch {
      // Ignore
    }
  }
}
