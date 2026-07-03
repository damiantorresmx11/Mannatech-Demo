"use client";

import { StatusBadge } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Plus, Package, RefreshCw, Loader2, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "@/lib/medusa-admin";

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

function CreateProductModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createProduct({
        title: title.trim(),
        description: description.trim() || undefined,
        status: "draft",
        options: [{ title: "Default", values: ["Default"] }],
        variants: [{
          title: "Default",
          options: { Default: "Default" },
          prices: price ? [{ amount: Math.round(parseFloat(price) * 100), currency_code: "mxn" }] : [],
          manage_inventory: true,
        }],
      });
      onCreated();
      onClose();
    } catch {
      setError("Error al crear producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Nuevo Producto</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"><X className="size-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Nombre *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Ambrotose Complex" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              placeholder="Suplemento de glyconutrientes..." />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Precio (MXN)</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="1299.00" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving || !title.trim()} className="bg-emerald-600 hover:bg-emerald-500 text-white">
              {saving ? <><Loader2 className="size-4 animate-spin mr-1.5" /> Creando...</> : "Crear Producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Error al eliminar producto");
    } finally {
      setDeleting(null);
    }
  };

  const getPrice = (product: MedusaProduct) => {
    const variant = product.variants?.[0];
    if (!variant?.prices?.length) return "---";
    const price = variant.prices[0];
    return `$${(price.amount / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${price.currency_code.toUpperCase()}`;
  };

  const getStock = (product: MedusaProduct) => product.variants?.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0) ?? 0;

  const getStatusLabel = (status: string) => ({ published: "Activo", draft: "Borrador", proposed: "Propuesto", rejected: "Rechazado" }[status] || status);

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
          <p className="text-sm text-zinc-500 mt-1">{loading ? "Cargando..." : `${products.length} productos en Medusa`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading} className="gap-1.5">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
          <Button onClick={() => setShowCreate(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white">
            <Plus className="size-4" /> Agregar Producto
          </Button>
        </div>
      </div>

      {showCreate && <CreateProductModal onClose={() => setShowCreate(false)} onCreated={fetchProducts} />}

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-zinc-400" /></div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="size-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Sin productos</h3>
          <p className="text-sm text-zinc-500 mt-1">Agrega productos con el botón de arriba.</p>
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
                <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} onClick={() => router.push(`/admin/productos/${product.id}`)}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50 cursor-pointer">
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
                  <td className="px-4 py-3"><StatusBadge status={getStatusLabel(product.status)} /></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={(e) => handleDelete(e, product.id, product.title)} disabled={deleting === product.id}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50">
                      {deleting === product.id ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                      Eliminar
                    </button>
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
