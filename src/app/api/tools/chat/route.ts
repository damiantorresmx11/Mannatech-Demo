import { NextRequest, NextResponse } from "next/server";

const CHATWOOT_URL = "http://127.0.0.1:3006";
const CHATWOOT_EMAIL = "admin@dmlabs.mx";
const CHATWOOT_PASSWORD = "Mannatech2026!";

// Cache token to avoid rate limiting
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAuthToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(`${CHATWOOT_URL}/auth/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CHATWOOT_EMAIL, password: CHATWOOT_PASSWORD }),
  });

  if (!res.ok) throw new Error(`Chatwoot auth failed: ${res.status}`);

  const data = await res.json();
  cachedToken = data.data?.access_token ?? data.access_token;
  tokenExpiry = Date.now() + 3600000; // 1 hour
  return cachedToken!;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "open";
    const conversationId = searchParams.get("conversation_id");

    if (conversationId) {
      const res = await fetch(
        `${CHATWOOT_URL}/api/v1/accounts/1/conversations/${conversationId}/messages`,
        { headers: { api_access_token: token } }
      );
      if (!res.ok) return NextResponse.json({ messages: [] });
      const data = await res.json();
      return NextResponse.json({ messages: data.payload || [] });
    }

    const res = await fetch(
      `${CHATWOOT_URL}/api/v1/accounts/1/conversations?status=${status}&page=1`,
      { headers: { api_access_token: token } }
    );
    if (!res.ok) return NextResponse.json({ conversations: [], meta: {} });
    const data = await res.json();
    return NextResponse.json({
      conversations: data.data?.payload || [],
      meta: data.data?.meta || {},
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, conversations: [], meta: {} }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthToken();
    const body = await req.json();

    if (body.action === "send_message") {
      const res = await fetch(
        `${CHATWOOT_URL}/api/v1/accounts/1/conversations/${body.conversation_id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", api_access_token: token },
          body: JSON.stringify({ content: body.content, message_type: "outgoing" }),
        }
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (body.action === "toggle_status") {
      const res = await fetch(
        `${CHATWOOT_URL}/api/v1/accounts/1/conversations/${body.conversation_id}/toggle_status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", api_access_token: token },
        }
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 200 });
  }
}
