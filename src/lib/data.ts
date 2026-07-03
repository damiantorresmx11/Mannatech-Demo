import fs from "fs";
import path from "path";
import type { CompanyId, Categoria, Producto, Textos, Distribuidor } from "./types";

const sharedDir = path.resolve(process.cwd(), "shared-content");
const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.mannatech.dmlabs.mx";
const MEDUSA_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

// ── JSON fallback ─────────────────────────────────────────────────────
function readCompanyJSON<T>(companyId: CompanyId, filename: string): T {
  const companyPath = path.join(sharedDir, "companies", companyId, filename);

  let filePath = companyPath;
  if (!fs.existsSync(companyPath)) {
    filePath = path.join(sharedDir, "companies", "mx", filename);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

interface ProductosData {
  categorias: Categoria[];
  productos: Producto[];
}

interface DistribuidoresData {
  distribuidores: Distribuidor[];
}

// ── Medusa Store API fetch ────────────────────────────────────────────
async function medusaFetch(endpoint: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (MEDUSA_KEY) headers["x-publishable-api-key"] = MEDUSA_KEY;

  const res = await fetch(`${MEDUSA_URL}${endpoint}`, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

// ── Map Medusa product to our Producto interface ──────────────────────
function mapMedusaProduct(p: any): Producto {
  const variant = p.variants?.[0];
  const price = variant?.prices?.[0];
  const amount = price ? price.amount / 100 : 0;

  return {
    slug: p.handle || p.id,
    sku: variant?.sku || p.id,
    nombre: p.title,
    categoria: p.categories?.[0]?.name || p.collection?.title || "General",
    precio: amount,
    presentacion: variant?.title || "",
    descripcionCorta: p.subtitle || p.description?.slice(0, 120) || "",
    descripcionLarga: p.description || "",
    beneficios: p.metadata?.beneficios || [],
    ingredientes: p.metadata?.ingredientes || "",
    imagen: p.thumbnail || p.images?.[0]?.url || "",
    destacado: p.metadata?.destacado === true || p.metadata?.destacado === "true",
    badge: p.metadata?.badge || null,
  };
}

// ── Public API (tries Medusa first, falls back to JSON) ───────────────

export async function getProductosMedusa(): Promise<Producto[]> {
  try {
    const data = await medusaFetch("/store/products?limit=50&fields=*variants.prices,*categories,*collection");
    if (data?.products?.length > 0) {
      return data.products.map(mapMedusaProduct);
    }
  } catch {
    // Medusa unavailable, fall through to JSON
  }
  return [];
}

export function getCategorias(companyId: CompanyId = "mx"): Categoria[] {
  return readCompanyJSON<ProductosData>(companyId, "productos.json").categorias;
}

export function getProductos(companyId: CompanyId = "mx"): Producto[] {
  return readCompanyJSON<ProductosData>(companyId, "productos.json").productos;
}

export async function getProductosCombined(companyId: CompanyId = "mx"): Promise<Producto[]> {
  const medusaProducts = await getProductosMedusa();
  const jsonProducts = getProductos(companyId);
  // Medusa products first, then JSON products (deduped by slug)
  const slugs = new Set(medusaProducts.map((p) => p.slug));
  const unique = [...medusaProducts, ...jsonProducts.filter((p) => !slugs.has(p.slug))];
  return unique;
}

export function getProductoBySlug(slug: string, companyId: CompanyId = "mx"): Producto | undefined {
  return getProductos(companyId).find((p) => p.slug === slug);
}

export async function getProductoBySlugCombined(slug: string, companyId: CompanyId = "mx"): Promise<Producto | undefined> {
  // Try Medusa first
  try {
    const data = await medusaFetch(`/store/products?handle=${slug}&fields=*variants.prices,*categories,*collection`);
    if (data?.products?.[0]) return mapMedusaProduct(data.products[0]);
  } catch {}
  // Fallback to JSON
  return getProductoBySlug(slug, companyId);
}

export function getProductosDestacados(companyId: CompanyId = "mx"): Producto[] {
  return getProductos(companyId).filter((p) => p.destacado);
}

export function getTextos(companyId: CompanyId = "mx"): Textos {
  return readCompanyJSON<Textos>(companyId, "textos.json");
}

export function getDistribuidores(companyId: CompanyId = "mx"): Distribuidor[] {
  return readCompanyJSON<DistribuidoresData>(companyId, "distribuidores.json").distribuidores;
}

export function getDistribuidorBySlug(slug: string, companyId: CompanyId = "mx"): Distribuidor | undefined {
  return getDistribuidores(companyId).find((d) => d.slug === slug);
}

export { formatPrecio } from "./format";
export type { Categoria, Producto, Textos, Distribuidor } from "./types";
