"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard";
import { ArrowLeft, Save, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getProduct, updateProduct } from "@/lib/medusa-admin";

interface MedusaProductDetail {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  subtitle: string | null;
  status: string;
  thumbnail: string | null;
  variants: { id: string; title: string; sku: string; prices: { amount: number; currency_code: string }[]; inventory_quantity: number }[];
  categories: { name: string }[];
  collection: { title: string } | null;
}

export default function ProductoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<MedusaProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    getProduct(id).then((data) => {
      const p = data.product;
      setProduct(p);
      setTitle(p.title || "");
      setDescription(p.description || "");
      setStatus(p.status || "draft");
    }).catch(() => setError("Error al cargar producto"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateProduct(id, { title, description, status });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-zinc-400" /></div>;
  }

  if (!product) {
    return <div className="py-20 text-center text-zinc-500">Producto no encontrado</div>;
  }

  const variant = product.variants?.[0];
  const price = variant?.prices?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/productos" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
          <ArrowLeft className="size-4" /> Productos
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600">/</span>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{product.title}</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Editar Producto</h1>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-emerald-500">Guardado</span>}
          <Button onClick={handleSave} disabled={saving} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nombre</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Handle</label>
                  <input type="text" value={product.handle || ""} disabled
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">SKU</label>
                  <input type="text" value={variant?.sku || "---"} disabled
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descripción</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Estatus</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="proposed">Propuesto</option>
                  <option value="rejected">Rechazado</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Imagen</CardTitle></CardHeader>
            <CardContent>
              {product.thumbnail ? (
                <img src={product.thumbnail} alt="" className="w-full rounded-lg object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <Package className="size-8 text-zinc-400 mb-2" />
                  <p className="text-sm text-zinc-500">Sin imagen</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Variante</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Precio</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {price ? `$${(price.amount / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${price.currency_code.toUpperCase()}` : "---"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Stock</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{variant?.inventory_quantity ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Categoría</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {product.categories?.[0]?.name || product.collection?.title || "---"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Estatus</span>
                <StatusBadge status={status === "published" ? "Publicado" : status === "draft" ? "Borrador" : status} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
