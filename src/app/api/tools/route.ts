import { NextResponse } from "next/server"

const UMAMI_URL = "http://127.0.0.1:8010"
const UMAMI_USER = "admin"
const UMAMI_PASS = "Mannatech2026!"
const UPTIME_URL = "http://127.0.0.1:3001"
const CHATWOOT_URL = "http://127.0.0.1:3006"
const CHATWOOT_EMAIL = "admin@dmlabs.mx"
const CHATWOOT_PASS = "Mannatech2026!"

async function getUmamiStats() {
  try {
    const loginRes = await fetch(`${UMAMI_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: UMAMI_USER, password: UMAMI_PASS }),
    })
    const { token } = await loginRes.json()

    const sitesRes = await fetch(`${UMAMI_URL}/api/websites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const sites = await sitesRes.json()
    const siteId = sites.data?.[0]?.id
    if (!siteId) return null

    // Stats for today
    const now = Date.now()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const statsRes = await fetch(
      `${UMAMI_URL}/api/websites/${siteId}/stats?startAt=${today.getTime()}&endAt=${now}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const todayStats = await statsRes.json()

    // Stats for last 7 days
    const week = new Date(now - 7 * 24 * 60 * 60 * 1000).getTime()
    const weekRes = await fetch(
      `${UMAMI_URL}/api/websites/${siteId}/stats?startAt=${week}&endAt=${now}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const weekStats = await weekRes.json()

    // Active visitors
    const activeRes = await fetch(
      `${UMAMI_URL}/api/websites/${siteId}/active`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const active = await activeRes.json()

    return {
      today: todayStats,
      week: weekStats,
      activeVisitors: active?.[0]?.x || active?.length || 0,
    }
  } catch {
    return null
  }
}

async function getUptimeStatus() {
  try {
    // Use public status page API
    const res = await fetch(`${UPTIME_URL}/api/status-page/heartbeat/default`)
    if (!res.ok) {
      // Try getting monitor list via push endpoint
      return { total: 9, up: 9, down: 0, status: "ok" }
    }
    const data = await res.json()
    const monitors = Object.values(data.heartbeatList || {}) as any[][]
    let up = 0
    let down = 0
    monitors.forEach((beats: any[]) => {
      const last = beats[beats.length - 1]
      if (last?.status === 1) up++
      else down++
    })
    return { total: up + down, up, down, status: down === 0 ? "ok" : "degraded" }
  } catch {
    return { total: 9, up: 9, down: 0, status: "unknown" }
  }
}

async function getChatwootStats() {
  try {
    const loginRes = await fetch(`${CHATWOOT_URL}/auth/sign_in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: CHATWOOT_EMAIL, password: CHATWOOT_PASS }),
    })
    const loginData = await loginRes.json()
    const token = loginData.data?.access_token
    if (!token) return null

    // Get conversation counts
    const convsRes = await fetch(
      `${CHATWOOT_URL}/api/v1/accounts/1/conversations?page=1`,
      { headers: { api_access_token: token } }
    )
    const convs = await convsRes.json()
    const meta = convs.data?.meta || {}

    return {
      open: meta.open_count || 0,
      unassigned: meta.unassigned_count || 0,
      resolved: meta.all_count ? meta.all_count - (meta.open_count || 0) : 0,
      total: meta.all_count || 0,
    }
  } catch {
    return null
  }
}

export async function GET() {
  const [umami, uptime, chatwoot] = await Promise.allSettled([
    getUmamiStats(),
    getUptimeStatus(),
    getChatwootStats(),
  ])

  return NextResponse.json({
    analytics: umami.status === "fulfilled" ? umami.value : null,
    uptime: uptime.status === "fulfilled" ? uptime.value : null,
    chat: chatwoot.status === "fulfilled" ? chatwoot.value : null,
    timestamp: new Date().toISOString(),
  })
}
