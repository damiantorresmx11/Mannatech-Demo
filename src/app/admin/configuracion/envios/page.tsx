"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck, Loader2, RefreshCw, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getRegions, getShippingOptions } from "@/lib/medusa-admin";

interface MedusaRegion { id: string; name: string; currency_code: string; countries: { iso_2: string; display_name: string }[]; }
interface MedusaShippingOption { id: string; name: string; price_type: string; amount: number; region_id: string; is_return: boolean; }

export default function EnviosPage() {
  const [regions, setRegions] = useState<MedusaRegion[]>([]);
  const [shippingOptions, setShippingOptions] = useState<MedusaShippingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true); setError(null);
    try { const [r, s] = await Promise.all([getRegions(), getShippingOptions()]); setRegions(r.regions || []); setShippingOptions(s.shipping_options || []); }
    catch { setError("Error al cargar envíos"); } finally { setLoading(false); }
  };
  useEffect(() => { fetch_(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/configuracion" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"><ArrowLeft className="size-4" /> Configuración</Link>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Zonas de Envío</h1>
          <p className="text-sm text-zinc-500 mt-1">{loading ? "Cargando..." : `${regions.length} regiones · ${shippingOptions.length} opciones`}</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetch_} disabled={loading} className="gap-1.5"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Actualizar</Button>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-zinc-400" /></div>
      ) : regions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MapPin className="size-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Sin regiones</h3>
          <p className="text-sm text-zinc-500 mt-1">Configura regiones desde el admin de Medusa.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {regions.map((region) => {
            const options = shippingOptions.filter((s) => s.region_id === region.id && !s.is_return);
            return (
              <Card key={region.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><MapPin className="size-5 text-emerald-500" />{region.name}</CardTitle>
                    <StatusBadge status={region.currency_code.toUpperCase()} />
                  </div>
                  {region.countries?.length > 0 && <p className="text-sm text-zinc-500 mt-1">Países: {region.countries.map((c) => c.display_name || c.iso_2.toUpperCase()).join(", ")}</p>}
                </CardHeader>
                <CardContent>
                  {options.length === 0 ? <p className="text-sm text-zinc-400">Sin opciones de envío</p> : (
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-zinc-200 dark:border-zinc-700">
                        <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Opción</th>
                        <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Tipo</th>
                        <th className="py-2 px-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Costo</th>
                      </tr></thead>
                      <tbody>{options.map((opt) => (
                        <tr key={opt.id} className="border-b border-zinc-100 dark:border-zinc-800">
                          <td className="py-2 px-3 flex items-center gap-2 text-zinc-900 dark:text-zinc-100"><Truck className="size-4 text-zinc-400" />{opt.name}</td>
                          <td className="py-2 px-3 text-zinc-700 dark:text-zinc-300">{opt.price_type === "flat_rate" ? "Tarifa fija" : "Calculado"}</td>
                          <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">{opt.amount != null ? `$${(opt.amount / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${region.currency_code.toUpperCase()}` : "Variable"}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
