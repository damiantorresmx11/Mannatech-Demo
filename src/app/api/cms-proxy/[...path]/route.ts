import { NextRequest, NextResponse } from "next/server"

const CMS_API = process.env.CMS_API_URL || "http://127.0.0.1:3002"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params)
}

async function proxyRequest(request: NextRequest, params: { path: string[] }) {
  const path = params.path.join("/")
  const url = new URL(`${CMS_API}/${path}`)

  // Forward query params
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {}
  const auth = request.headers.get("authorization")
  if (auth) headers["Authorization"] = auth
  const contentType = request.headers.get("content-type")
  if (contentType) headers["Content-Type"] = contentType

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  }

  // Forward body as raw bytes (supports file uploads)
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      fetchOptions.body = await request.arrayBuffer()
    } catch {}
  }

  try {
    const res = await fetch(url.toString(), fetchOptions)
    const resContentType = res.headers.get("Content-Type") || "application/json"

    // For binary responses (images, etc.), return as-is
    if (resContentType.startsWith("image/") || resContentType.startsWith("application/octet")) {
      const buffer = await res.arrayBuffer()
      return new NextResponse(buffer, {
        status: res.status,
        headers: { "Content-Type": resContentType },
      })
    }

    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": resContentType },
    })
  } catch (error) {
    return NextResponse.json({ error: "CMS API unavailable" }, { status: 502 })
  }
}
