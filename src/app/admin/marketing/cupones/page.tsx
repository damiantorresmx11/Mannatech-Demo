"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Tag, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getPromotions } from "@/lib/medusa-admin";

interface MedusaPromotion {
  id: string;
  code: string;
  type: string;
  status: string;
  is_automatic: boolean;
  starts_at: string | null;
  ends_at: string | null;
  application_method: { type: string; value: number; currency_code: string } | null;
}

export default function CuponesPage() {
  const [promotions, setPromotions] = useState<MedusaPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true); setError(null);
    try { const data = await getPromotions(); setPromotions(data.promotions || []); }
    catch { setError("Error al cargar promociones"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch_(); }, []);

  const getDiscount = (p: MedusaPromotion) => {
    if (!p.application_method) return "---";
    if (p.application_method.type === "percentage") return `${p.application_method.value}%`;
    return `$${(p.application_method.value / 100).toLocaleString("es-MX")}`;
  };
  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("es-MX") : "---";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/marketing" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"><ArrowLeft className="size-4" /> Marketing</Link>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Promociones y Cupones</h1>
          <p className="text-sm text-zinc-500 mt-1">{loading ? "Cargando..." : `${promotions.length} promociones en Medusa`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetch_} disabled={loading} className="gap-1.5"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Actualizar</Button>
          <Button className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"><Plus className="size-4" /> Nuevo Cupón</Button>
        </div>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-zinc-400" /></div>
      ) : promotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Tag className="size-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Sin promociones</h3>
          <p className="text-sm text-zinc-500 mt-1">Crea promociones desde el admin de Medusa o desde aquí.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Código</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Descuento</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Automático</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Inicio</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Fin</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => (
                <tr key={p.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">{p.code || "---"}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{getDiscount(p)}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{p.type === "standard" ? "Estándar" : p.type}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className={`size-3 rounded-full ${p.is_automatic ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />{p.is_automatic ? "Sí" : "No"}</div></td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{formatDate(p.starts_at)}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{formatDate(p.ends_at)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status === "active" ? "Activo" : p.status === "draft" ? "Borrador" : p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
