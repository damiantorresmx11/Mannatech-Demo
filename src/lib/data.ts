import fs from "fs";
import path from "path";
import type { CompanyId, Categoria, Producto, Textos, Distribuidor } from "./types";

const sharedDir = path.resolve(process.cwd(), "shared-content");

function readCompanyJSON<T>(companyId: CompanyId, filename: string): T {
  const companyPath = path.join(sharedDir, "companies", companyId, filename);

  // Fallback to "mx" if file doesn't exist for the requested company
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

export function getCategorias(companyId: CompanyId = "mx"): Categoria[] {
  return readCompanyJSON<ProductosData>(companyId, "productos.json").categorias;
}

export function getProductos(companyId: CompanyId = "mx"): Producto[] {
  return readCompanyJSON<ProductosData>(companyId, "productos.json").productos;
}

export function getProductoBySlug(slug: string, companyId: CompanyId = "mx"): Producto | undefined {
  return getProductos(companyId).find((p) => p.slug === slug);
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
