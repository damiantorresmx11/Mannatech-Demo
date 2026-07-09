import { NextRequest, NextResponse } from "next/server";
import { searchProducts, isConfigured } from "@/lib/commerce/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!q.trim()) {
    return NextResponse.json({ products: [] });
  }

  try {
    if (!isConfigured()) {
      return NextResponse.json({ products: [] });
    }

    const results = await searchProducts(q, limit);

    const products = results.map((p) => ({
      id: p.id,
      name: p.nombre,
      slug: p.slug,
      price: p.precio,
      currency: "mxn",
      image: p.imagen || null,
      category: p.categoria || null,
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
