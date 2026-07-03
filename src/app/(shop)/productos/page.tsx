import { cookies } from "next/headers";
import { getCategorias, getProductosCombined } from "@/lib/data";
import { COMPANY_COOKIE } from "@/config/companies";
import type { CompanyId } from "@/lib/types";
import { CatalogoContent } from "./CatalogoContent";

export const metadata = {
  title: "Productos | Mannatech",
  description: "Explora todo nuestro catálogo de productos Mannatech",
};

interface PageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;
  const productos = await getProductosCombined(companyId);
  const categorias = getCategorias(companyId);

  return (
    <CatalogoContent
      productos={productos}
      categorias={categorias}
      initialCategoria={params.categoria}
    />
  );
}
