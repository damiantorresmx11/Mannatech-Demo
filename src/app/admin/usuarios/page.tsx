"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Plus, Users, Loader2, RefreshCw } from "lucide-react";
import { getCustomers } from "@/lib/medusa-admin";

interface MedusaCustomer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  has_account: boolean;
  created_at: string;
}

export default function UsuariosPage() {
  const [customers, setCustomers] = useState<MedusaCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => { setLoading(true); setError(null); try { const data = await getCustomers(); setCustomers(data.customers || []); } catch { setError("Error al cargar clientes"); } finally { setLoading(false); } };
  useEffect(() => { fetchCustomers(); }, []);

  const getName = (c: MedusaCustomer) => {
    if (c.first_name || c.last_name) return `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim();
    return c.email?.split("@")[0] ?? "---";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Clientes</h1>
          <p className="text-sm text-zinc-500 mt-1">{loading ? "Cargando..." : `${customers.length} clientes en Medusa`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchCustomers} disabled={loading} className="gap-1.5">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
          <Button className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"><Plus className="size-4" /> Nuevo Cliente</Button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-zinc-400" /></div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="size-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Sin clientes</h3>
          <p className="text-sm text-zinc-500 mt-1">Los clientes aparecerán aquí cuando se registren o hagan compras.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Email</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Cuenta</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{getName(c)}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{c.email}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.has_account ? "Registrado" : "Invitado"} /></td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{new Date(c.created_at).toLocaleDateString("es-MX")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
