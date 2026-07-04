import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";
  const limit = searchParams.get("limit") || "10";

  if (!q.trim()) {
    return NextResponse.json({ products: [] });
  }

  try {
    const headers: Record<string, string> = {};
    const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    if (pubKey && pubKey !== "pk_placeholder") {
      headers["x-publishable-api-key"] = pubKey;
    }

    const res = await fetch(
      `http://127.0.0.1:9000/store/products?q=${encodeURIComponent(q)}&limit=${limit}`,
      { headers, next: { revalidate: 0 } }
    );

    if (!res.ok) {
      throw new Error(`Medusa API responded with ${res.status}`);
    }

    const data = await res.json();

    const products = (data.products || []).map((p: any) => ({
      id: p.id,
      name: p.title,
      slug: p.handle,
      price: p.variants?.[0]?.calculated_price?.calculated_amount
        ?? p.variants?.[0]?.prices?.[0]?.amount
        ?? null,
      currency: p.variants?.[0]?.calculated_price?.currency_code
        ?? p.variants?.[0]?.prices?.[0]?.currency_code
        ?? "mxn",
      image: p.thumbnail || p.images?.[0]?.url || null,
      category: p.categories?.[0]?.name || p.collection?.title || null,
    }));

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("[Search API]", error.message);
    return NextResponse.json(
      { products: [], error: "Error al buscar productos" },
      { status: 500 }
    );
  }
}
