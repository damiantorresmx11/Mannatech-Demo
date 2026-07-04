import { NextRequest, NextResponse } from "next/server";

const UMAMI_URL = "http://127.0.0.1:8010";
const UMAMI_USERNAME = "admin";
const UMAMI_PASSWORD = "Mannatech2026!";

async function getToken(): Promise<string> {
  const res = await fetch(`${UMAMI_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: UMAMI_USERNAME, password: UMAMI_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Umami login failed: ${res.status}`);
  const data = await res.json();
  return data.token;
}

async function getSiteId(token: string): Promise<string> {
  const res = await fetch(`${UMAMI_URL}/api/websites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to get websites: ${res.status}`);
  const data = await res.json();
  const sites = data.data || data;
  if (!sites.length) throw new Error("No sites found in Umami");
  return sites[0].id;
}

function getPeriodRange(period: string): { startAt: number; endAt: number } {
  const now = Date.now();
  const endAt = now;
  let startAt: number;

  switch (period) {
    case "today": {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      startAt = today.getTime();
      break;
    }
    case "30d":
      startAt = now - 30 * 24 * 60 * 60 * 1000;
      break;
    case "7d":
    default:
      startAt = now - 7 * 24 * 60 * 60 * 1000;
      break;
  }

  return { startAt, endAt };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";
    const { startAt, endAt } = getPeriodRange(period);

    const token = await getToken();
    const siteId = await getSiteId(token);

    const headers = { Authorization: `Bearer ${token}` };
    const base = `${UMAMI_URL}/api/websites/${siteId}`;
    const qs = `startAt=${startAt}&endAt=${endAt}`;
    const unit = period === "today" ? "hour" : "day";

    const [stats, pageviews, topPages, referrers, browsers, devices, countries] =
      await Promise.all([
        fetch(`${base}/stats?${qs}`, { headers }).then((r) => r.json()),
        fetch(`${base}/pageviews?${qs}&unit=${unit}`, { headers }).then((r) => r.json()),
        fetch(`${base}/metrics?${qs}&type=url&limit=10`, { headers }).then((r) => r.json()),
        fetch(`${base}/metrics?${qs}&type=referrer&limit=10`, { headers }).then((r) => r.json()),
        fetch(`${base}/metrics?${qs}&type=browser`, { headers }).then((r) => r.json()),
        fetch(`${base}/metrics?${qs}&type=device`, { headers }).then((r) => r.json()),
        fetch(`${base}/metrics?${qs}&type=country`, { headers }).then((r) => r.json()),
      ]);

    return NextResponse.json({
      period,
      stats,
      pageviews,
      topPages,
      referrers,
      browsers,
      devices,
      countries,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Analytics API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
