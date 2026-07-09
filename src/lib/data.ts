import fs from "fs";
import path from "path";
import type { CompanyId, Categoria, Producto, Textos, Distribuidor } from "./types";
import { getPublicProducts, getProductBySlug as bcGetProductBySlug } from "./commerce/client";
import type { Product } from "./commerce/types";

const sharedDir = path.resolve(process.cwd(), "shared-content");

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

// ── Map commerce Product to our Producto interface ────────────────────
function mapCommerceProduct(p: Product): Producto {
  return {
    slug: p.slug,
    sku: p.sku,
    nombre: p.nombre,
    categoria: p.categoria,
    precio: p.precio,
    presentacion: p.presentacion,
    descripcionCorta: p.descripcionCorta,
    descripcionLarga: p.descripcionLarga,
    beneficios: p.beneficios,
    ingredientes: p.ingredientes,
    imagen: p.imagen,
    destacado: p.destacado,
    badge: p.badge,
  };
}

// ── Public API (tries BigCommerce first, falls back to JSON) ──────────

export async function getProductosMedusa(): Promise<Producto[]> {
  try {
    const products = await getPublicProducts();
    if (products?.length > 0) {
      return products.map(mapCommerceProduct);
    }
  } catch {
    // BigCommerce unavailable, fall through to JSON
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
  const commerceProducts = await getProductosMedusa();
  const jsonProducts = getProductos(companyId);
  // Commerce products first, then JSON products (deduped by slug)
  const slugs = new Set(commerceProducts.map((p) => p.slug));
  const unique = [...commerceProducts, ...jsonProducts.filter((p) => !slugs.has(p.slug))];
  return unique;
}

export function getProductoBySlug(slug: string, companyId: CompanyId = "mx"): Producto | undefined {
  return getProductos(companyId).find((p) => p.slug === slug);
}

export async function getProductoBySlugCombined(slug: string, companyId: CompanyId = "mx"): Promise<Producto | undefined> {
  // Try BigCommerce first
  try {
    const product = await bcGetProductBySlug(slug);
    if (product) return mapCommerceProduct(product);
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
