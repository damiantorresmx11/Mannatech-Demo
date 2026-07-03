"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getPaymentProviders } from "@/lib/medusa-admin";

interface MedusaPaymentProvider { id: string; is_enabled: boolean; }

const NAMES: Record<string, string> = { pp_system_default: "Sistema Default", pp_stripe_stripe: "Stripe", pp_paypal_paypal: "PayPal", manual: "Manual" };

export default function PagosPage() {
  const [providers, setProviders] = useState<MedusaPaymentProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true); setError(null);
    try { const data = await getPaymentProviders(); setProviders(data.payment_providers || []); }
    catch { setError("Error al cargar proveedores"); } finally { setLoading(false); }
  };
  useEffect(() => { fetch_(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/configuracion" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"><ArrowLeft className="size-4" /> Configuración</Link>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Métodos de Pago</h1>
          <p className="text-sm text-zinc-500 mt-1">{loading ? "Cargando..." : `${providers.length} proveedores`}</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetch_} disabled={loading} className="gap-1.5"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Actualizar</Button>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-zinc-400" /></div>
      ) : providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CreditCard className="size-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Sin proveedores</h3>
          <p className="text-sm text-zinc-500 mt-1">Configura proveedores de pago desde Medusa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"><CreditCard className="size-5 text-zinc-500 dark:text-zinc-400" /></div>
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">{NAMES[p.id] || p.id.replace(/^pp_/, "").replace(/_/g, " ")}</h3>
                      <p className="text-xs text-zinc-500 font-mono">{p.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-full ${p.is_enabled !== false ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{p.is_enabled !== false ? "Activo" : "Inactivo"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
