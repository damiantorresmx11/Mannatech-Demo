import { NextRequest, NextResponse } from "next/server"

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH || ""
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN || ""

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params)
}

async function proxy(request: NextRequest, { path }: { path: string[] }) {
  if (!STORE_HASH || !ACCESS_TOKEN) {
    return NextResponse.json({ error: "Commerce backend not configured" }, { status: 503 })
  }

  const joinedPath = path.join("/")

  // Determine API version from path prefix
  const isV2 = joinedPath.startsWith("v2/")
  const cleanPath = joinedPath.replace(/^v[23]\//, "")
  const base = isV2
    ? `https://api.bigcommerce.com/stores/${STORE_HASH}/v2`
    : `https://api.bigcommerce.com/stores/${STORE_HASH}/v3`

  // Forward query params
  const url = new URL(request.url)
  const queryString = url.searchParams.toString()
  const targetUrl = `${base}/${cleanPath}${queryString ? `?${queryString}` : ""}`

  const headers: Record<string, string> = {
    "X-Auth-Token": ACCESS_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json",
  }

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      const body = await request.text()
      if (body) fetchOptions.body = body
    } catch {
      // No body
    }
  }

  try {
    const res = await fetch(targetUrl, fetchOptions)
    const data = await res.text()

    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Proxy error" },
      { status: 502 },
    )
  }
}
