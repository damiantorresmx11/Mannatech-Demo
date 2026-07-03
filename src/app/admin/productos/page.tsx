"use client";

import { StatusBadge } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Plus, Package, RefreshCw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/medusa-admin";

interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  status: string;
  thumbnail: string | null;
  collection: { title: string } | null;
  categories: { name: string }[] | null;
  variants: {
    prices: { amount: number; currency_code: string }[];
    inventory_quantity: number;
  }[];
}

export default function ProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getPrice = (product: MedusaProduct) => {
    const variant = product.variants?.[0];
    if (!variant?.prices?.length) return "---";
    const price = variant.prices[0];
    return `$${(price.amount / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${price.currency_code.toUpperCase()}`;
  };

  const getStock = (product: MedusaProduct) => {
    return product.variants?.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0) ?? 0;
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      published: "Activo",
      draft: "Borrador",
      proposed: "Propuesto",
      rejected: "Rechazado",
    };
    return map[status] || status;
  };

  const getCategory = (product: MedusaProduct) => {
    if (product.categories?.length) return product.categories[0].name;
    if (product.collection) return product.collection.title;
    return "---";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Productos</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {loading ? "Cargando..." : `${products.length} productos en Medusa`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white">
            <Plus className="size-4" />
            Agregar Producto
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-zinc-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="size-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Sin productos</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Agrega productos desde el panel de Medusa o desde aquí.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Producto</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Categoría</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Precio</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => router.push(`/admin/productos/${product.id}`)}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt="" className="size-10 rounded-lg object-cover" />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                          <Package className="size-5 text-zinc-400" />
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{product.title}</span>
                        <p className="text-xs text-zinc-500">{product.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{getCategory(product)}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{getPrice(product)}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{getStock(product)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={getStatusLabel(product.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
