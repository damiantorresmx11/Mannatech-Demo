import { cookies } from "next/headers";
import { CarritoContent } from "./CarritoContent";
import { getProductos } from "@/lib/data";
import { COMPANY_COOKIE } from "@/config/companies";
import type { CompanyId } from "@/lib/types";

export const metadata = {
  title: "Carrito | Mannatech",
};

export default async function CarritoPage() {
  const store = await cookies();
  const companyId = (store.get(COMPANY_COOKIE)?.value ?? "mx") as CompanyId;
  const productos = getProductos(companyId);
  return <CarritoContent todosLosProductos={productos} />;
}
