import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getProductoBySlug, getProductos } from "@/lib/data";
import { COMPANY_COOKIE } from "@/config/companies";
import type { CompanyId } from "@/lib/types";
import { ProductDetail } from "./ProductDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const productos = getProductos();
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;
  const producto = getProductoBySlug(slug, companyId);
  if (!producto) return { title: "Producto | Mannatech" };
  return {
    title: `${producto.nombre} | Mannatech`,
    description: producto.descripcionCorta,
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params;
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;
  const producto = getProductoBySlug(slug, companyId);

  if (!producto) {
    notFound();
  }

  // Get 3 related products (different from current)
  const todos = getProductos(companyId);
  const otros = todos.filter((p) => p.slug !== slug);
  // Deterministic: pick products from same category first, then fill
  const mismaCategoria = otros.filter((p) => p.categoria === producto.categoria);
  const resto = otros.filter((p) => p.categoria !== producto.categoria);
  const relacionados = [...mismaCategoria, ...resto].slice(0, 3);

  return <ProductDetail producto={producto} productosRelacionados={relacionados} />;
}
