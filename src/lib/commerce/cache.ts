// ── Commerce Cache ─────────────────────────────────────────────────────
// Smart cache: stores last successful API response as JSON file.
// On API failure, returns cached data (up to 24h stale).

import fs from "fs"
import path from "path"

const CACHE_DIR = path.resolve(process.cwd(), "data", "commerce-cache")
const DEFAULT_TTL = 5 * 60 * 1000       // 5 minutes
const MAX_STALE = 24 * 60 * 60 * 1000   // 24 hours

interface CacheEntry<T> {
  data: T
  timestamp: number
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
}

function getCachePath(key: string): string {
  const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "_")
  return path.join(CACHE_DIR, `${safeKey}.json`)
}

function readCache<T>(key: string): CacheEntry<T> | null {
  try {
    const filePath = getCachePath(key)
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(raw) as CacheEntry<T>
  } catch {
    return null
  }
}

function writeCache<T>(key: string, data: T): void {
  try {
    ensureCacheDir()
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    fs.writeFileSync(getCachePath(key), JSON.stringify(entry), "utf-8")
  } catch (err) {
    console.warn(`[commerce-cache] Failed to write cache for "${key}":`, err)
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
  try {
    const filePath = getCachePath(key)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch {
    // Ignore
  }
}

export function invalidateAllCache(): void {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR)
      files.forEach((f) => {
        try { fs.unlinkSync(path.join(CACHE_DIR, f)) } catch { /* ignore */ }
      })
    }
  } catch {
    // Ignore
  }
}
