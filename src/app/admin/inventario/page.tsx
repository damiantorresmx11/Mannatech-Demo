"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Warehouse, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/medusa-admin";

interface InventoryItem { id: string; title: string; stock: number; level: "critico" | "bajo" | "normal"; }

export default function InventarioPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true); setError(null);
    try {
      const data = await getProducts();
      const mapped: InventoryItem[] = (data.products || []).map((p: any) => {
        const stock = p.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) ?? 0;
        const level: "critico" | "bajo" | "normal" = stock <= 5 ? "critico" : stock <= 20 ? "bajo" : "normal";
        return { id: p.id, title: p.title, stock, level };
      });
      mapped.sort((a, b) => a.stock - b.stock);
      setItems(mapped);
    } catch { setError("Error al cargar inventario"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchInventory(); }, []);

  const criticos = items.filter((i) => i.level === "critico");
  const bajos = items.filter((i) => i.level === "bajo");
  const getLevelLabel = (l: string) => ({ critico: "Crítico", bajo: "Bajo", normal: "Normal" }[l] || l);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Inventario</h1>
          <p className="text-sm text-zinc-500 mt-1">{loading ? "Cargando..." : `${items.length} productos · ${criticos.length} críticos · ${bajos.length} bajos`}</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchInventory} disabled={loading} className="gap-1.5">
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
        </Button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}

      {(criticos.length > 0 || bajos.length > 0) && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticos.map((a) => (
            <Card key={a.id} className="border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
              <CardContent className="pt-1">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-5 text-red-500 shrink-0" />
                  <div><p className="font-medium text-red-800 dark:text-red-300">{a.title}</p><p className="text-sm text-red-600 dark:text-red-400">Stock crítico: {a.stock} unidades</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
          {bajos.map((a) => (
            <Card key={a.id} className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
              <CardContent className="pt-1">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-5 text-amber-500 shrink-0" />
                  <div><p className="font-medium text-amber-800 dark:text-amber-300">{a.title}</p><p className="text-sm text-amber-600 dark:text-amber-400">Stock bajo: {a.stock} unidades</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-zinc-400" /></div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Warehouse className="size-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Sin inventario</h3>
          <p className="text-sm text-zinc-500 mt-1">Agrega productos para ver el inventario aquí.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Producto</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Stock Actual</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Nivel</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className={cn("border-b border-zinc-100 transition-colors dark:border-zinc-800/50", row.level === "critico" && "bg-red-50/60 dark:bg-red-950/20", row.level === "bajo" && "bg-amber-50/60 dark:bg-amber-950/20", row.level === "normal" && "hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{row.title}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{row.stock}</td>
                  <td className="px-4 py-3"><StatusBadge status={getLevelLabel(row.level)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
