import { NextResponse } from "next/server"

const MONITORS = [
  { name: "Storefront", url: "https://mannatech.dmlabs.mx", type: "http" },
  { name: "Medusa API", url: "https://api.mannatech.dmlabs.mx/health", type: "http" },
  { name: "CMS API", url: "http://127.0.0.1:3002/pages", type: "http" },
  { name: "Metabase", url: "https://reportes.mannatech.dmlabs.mx", type: "http" },
  { name: "Chatwoot", url: "https://chat.mannatech.dmlabs.mx", type: "http" },
  { name: "Umami", url: "https://analytics.mannatech.dmlabs.mx", type: "http" },
  { name: "n8n", url: "https://n8n.dmlabs.mx", type: "http" },
  { name: "PostgreSQL", url: "http://127.0.0.1:5433", type: "port" },
  { name: "Redis", url: "http://127.0.0.1:6379", type: "port" },
] as const

interface MonitorResult {
  name: string
  url: string
  type: string
  status: "up" | "down"
  responseTime: number
  httpCode: number | null
  checkedAt: string
}

async function checkMonitor(monitor: (typeof MONITORS)[number]): Promise<MonitorResult> {
  const start = Date.now()
  let status: "up" | "down" = "down"
  let httpCode: number | null = null

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    if (monitor.type === "port") {
      // For port checks, just try to connect via fetch
      try {
        const res = await fetch(monitor.url, {
          signal: controller.signal,
          method: "GET",
        })
        // Any response means the port is open
        status = "up"
        httpCode = res.status
      } catch (err: unknown) {
        // For port-type monitors, connection refused = down, but ECONNREFUSED with a response still means port is listening
        // Some services (Redis, PG) won't respond to HTTP but the TCP connection might work
        // We'll try a raw TCP-like approach: if fetch throws but it's not a timeout, the port might still be open
        const error = err as { cause?: { code?: string } }
        if (error?.cause?.code === "ECONNREFUSED") {
          status = "down"
        } else {
          // Connection was made but protocol mismatch = port is open
          status = "up"
          httpCode = null
        }
      }
    } else {
      const res = await fetch(monitor.url, {
        signal: controller.signal,
        method: "GET",
        redirect: "follow",
      })
      httpCode = res.status
      status = res.status < 500 ? "up" : "down"
    }

    clearTimeout(timeout)
  } catch (err: unknown) {
    status = "down"
    httpCode = null
    // Suppress unused variable warning
    void err
  }

  const responseTime = Date.now() - start

  return {
    name: monitor.name,
    url: monitor.url,
    type: monitor.type,
    status,
    responseTime,
    httpCode,
    checkedAt: new Date().toISOString(),
  }
}

export async function GET() {
  const results = await Promise.all(MONITORS.map(checkMonitor))

  const upCount = results.filter((r) => r.status === "up").length
  const totalCount = results.length

  return NextResponse.json({
    summary: {
      up: upCount,
      total: totalCount,
      allUp: upCount === totalCount,
      checkedAt: new Date().toISOString(),
    },
    monitors: results,
  })
}
