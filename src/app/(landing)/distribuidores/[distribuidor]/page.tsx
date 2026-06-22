import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getDistribuidorBySlug, getProductos } from "@/lib/data";
import { COMPANY_COOKIE } from "@/config/companies";
import type { CompanyId } from "@/lib/types";
import { DistributorPage } from "./DistributorPage";

interface PageProps {
  params: Promise<{ distribuidor: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { distribuidor: slug } = await params;
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;
  const distribuidor = getDistribuidorBySlug(slug, companyId);
  if (!distribuidor) return { title: "Distribuidor | Mannatech" };
  return {
    title: `${distribuidor.nombre} | Mannatech`,
    description: distribuidor.bio,
  };
}

export default async function DistribuidorPage({ params }: PageProps) {
  const { distribuidor: slug } = await params;
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;
  const distribuidor = getDistribuidorBySlug(slug, companyId);

  if (!distribuidor) {
    notFound();
  }

  const todosProductos = getProductos(companyId);
  const productosFavoritos = distribuidor.productosFavoritos
    .map((s) => todosProductos.find((p) => p.slug === s))
    .filter(Boolean) as (typeof todosProductos)[number][];

  return (
    <DistributorPage
      distribuidor={distribuidor}
      productosFavoritos={productosFavoritos}
    />
  );
}
