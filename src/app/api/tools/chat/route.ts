import { NextRequest, NextResponse } from "next/server";

const CHATWOOT_URL = "http://127.0.0.1:3006";
const CHATWOOT_EMAIL = "admin@dmlabs.mx";
const CHATWOOT_PASSWORD = "Mannatech2026!";

async function getAuthToken(): Promise<string> {
  const res = await fetch(`${CHATWOOT_URL}/auth/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CHATWOOT_EMAIL, password: CHATWOOT_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`Chatwoot auth failed: ${res.status}`);
  }

  const data = await res.json();
  return data.data?.access_token ?? data.access_token;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "open";
    const conversationId = searchParams.get("conversation_id");

    // If conversation_id is provided, get messages for that conversation
    if (conversationId) {
      const res = await fetch(
        `${CHATWOOT_URL}/api/v1/accounts/1/conversations/${conversationId}/messages`,
        { headers: { api_access_token: token } }
      );
      if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Otherwise list conversations
    const page = searchParams.get("page") || "1";
    const res = await fetch(
      `${CHATWOOT_URL}/api/v1/accounts/1/conversations?page=${page}&status=${status}`,
      { headers: { api_access_token: token } }
    );
    if (!res.ok) throw new Error(`Failed to fetch conversations: ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthToken();
    const body = await req.json();
    const { action, conversation_id, content } = body;

    if (action === "send_message") {
      const res = await fetch(
        `${CHATWOOT_URL}/api/v1/accounts/1/conversations/${conversation_id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            api_access_token: token,
          },
          body: JSON.stringify({ content, message_type: "outgoing" }),
        }
      );
      if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === "toggle_status") {
      const res = await fetch(
        `${CHATWOOT_URL}/api/v1/accounts/1/conversations/${conversation_id}/toggle_status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            api_access_token: token,
          },
        }
      );
      if (!res.ok) throw new Error(`Failed to toggle status: ${res.status}`);
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
