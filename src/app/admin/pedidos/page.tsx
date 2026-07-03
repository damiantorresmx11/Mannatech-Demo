"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/dashboard";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/lib/medusa-admin";

interface MedusaOrder {
  id: string;
  display_id: number;
  created_at: string;
  email: string;
  currency_code: string;
  total: number;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  items: { title: string; quantity: number }[];
}

const STATUS_MAP: Record<string, string> = { pending: "Pendiente", completed: "Completado", archived: "Archivado", canceled: "Cancelado", requires_action: "Acción Requerida" };
const FULFILLMENT_MAP: Record<string, string> = { not_fulfilled: "Sin Enviar", fulfilled: "Enviado", partially_fulfilled: "Parcial", shipped: "Enviado", delivered: "Entregado", returned: "Devuelto", canceled: "Cancelado" };
const FILTERS = [{ key: "todos", label: "Todos" }, { key: "pending", label: "Pendientes" }, { key: "completed", label: "Completados" }, { key: "canceled", label: "Cancelados" }];

export default function PedidosPage() {
  const [filter, setFilter] = useState("todos");
  const [orders, setOrders] = useState<MedusaOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async () => { setLoading(true); setError(null); try { const data = await getOrders(); setOrders(data.orders || []); } catch { setError("Error al cargar pedidos"); } finally { setLoading(false); } };
  useEffect(() => { fetchOrders(); }, []);

  const filtered = filter === "todos" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Pedidos</h1>
          <p className="text-sm text-zinc-500 mt-1">{loading ? "Cargando..." : `${orders.length} pedidos en Medusa`}</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading} className="gap-1.5">
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", filter === f.key ? "bg-[#00A88F] text-white dark:bg-[#00C9A7]" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700")}>{f.label}</button>
        ))}
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-zinc-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="size-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Sin pedidos</h3>
          <p className="text-sm text-zinc-500 mt-1">No hay pedidos en esta categoría.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">#</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Fecha</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Items</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Total</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Envío</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} onClick={() => router.push(`/admin/pedidos/${order.id}`)} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50 cursor-pointer">
                  <td className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-100">#{order.display_id}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{new Date(order.created_at).toLocaleDateString("es-MX")}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{order.email || "---"}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{order.items?.length ?? 0}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">${(order.total / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })} {order.currency_code?.toUpperCase()}</td>
                  <td className="px-4 py-3"><StatusBadge status={FULFILLMENT_MAP[order.fulfillment_status] ?? order.fulfillment_status ?? "---"} /></td>
                  <td className="px-4 py-3"><StatusBadge status={STATUS_MAP[order.status] ?? order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
