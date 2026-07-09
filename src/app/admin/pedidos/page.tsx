"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getOrders } from "@/lib/commerce/client";
import type { Order } from "@/lib/commerce/types";
import {
  ShoppingCart,
  RefreshCw,
  Search,
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

const STATUS_MAP: Record<string, string> = {
  pending: "Pendiente",
  processing: "En Proceso",
  shipped: "Enviado",
  completed: "Completado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "pending", label: "Pendientes" },
  { key: "completed", label: "Completados" },
  { key: "cancelled", label: "Cancelados" },
];

function formatCurrency(amount: number, currency: string) {
  return `$${amount.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
  })} ${currency?.toUpperCase() || "MXN"}`;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getItemsSummary(items: Order["items"]) {
  if (!items || items.length === 0) return "Sin items";
  const first = items[0].nombre;
  if (items.length === 1) return first;
  return `${first} y ${items.length - 1} mas`;
}

export default function PedidosPage() {
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data.orders || []);
    } catch {
      setError("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    let result = filter === "todos" ? orders : orders.filter((o) => o.estado === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.cliente?.email?.toLowerCase().includes(q) ||
          o.numero.includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, filter, search]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.estado === "pending").length;
    const completed = orders.filter((o) => o.estado === "completed").length;
    const revenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    return { total, pending, completed, revenue };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Pedidos</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Gestiona los pedidos de tu tienda
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Pedidos", value: stats.total, icon: Package, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Pendientes", value: stats.pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Completados", value: stats.completed, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Ingresos", value: formatCurrency(stats.revenue, "mxn"), icon: DollarSign, color: "text-blue-400", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xl font-bold text-zinc-50 mt-1">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por email o ID de orden..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
          />
        </div>
        <div className="relative flex items-center gap-1 rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors z-10"
            >
              {filter === f.key && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-md bg-blue-500"
                  transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${filter === f.key ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}>
                {f.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg border border-red-900/50 bg-red-950/50 p-4 text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden"
        >
          <div className="grid grid-cols-[80px_1fr_1.5fr_1fr_100px_100px] gap-2 px-5 py-3 border-b border-zinc-800 bg-zinc-950/50">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Orden</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Cliente</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Items</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Estatus</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Fecha</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={filter + search}>
              {filtered.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  onClick={() => router.push(`/admin/pedidos/${order.id}`)}
                  className="grid grid-cols-[80px_1fr_1.5fr_1fr_100px_100px] gap-2 px-5 py-3.5 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/50 transition-colors group"
                >
                  <span className="font-mono font-bold text-sm text-zinc-100 group-hover:text-blue-400 transition-colors">
                    #{order.numero}
                  </span>
                  <span className="text-sm text-zinc-300 truncate">
                    {order.cliente?.email || "---"}
                  </span>
                  <span className="text-sm text-zinc-400 truncate">
                    {getItemsSummary(order.items)}
                  </span>
                  <span className="text-sm font-medium text-zinc-100">
                    {formatCurrency(order.total, order.moneda)}
                  </span>
                  <span>
                    <OrderStatusBadge status={order.estado} />
                  </span>
                  <span className="text-sm text-zinc-500">
                    {formatDate(order.creadoEn)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", label: STATUS_MAP.completed },
    pending: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400", label: STATUS_MAP.pending },
    processing: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", label: STATUS_MAP.processing },
    shipped: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", label: STATUS_MAP.shipped },
    cancelled: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", label: STATUS_MAP.cancelled },
    refunded: { bg: "bg-zinc-500/10 border-zinc-500/20", text: "text-zinc-400", label: STATUS_MAP.refunded },
  };
  const c = config[status] || { bg: "bg-zinc-500/10 border-zinc-500/20", text: "text-zinc-400", label: status };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950/50">
        <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid grid-cols-[80px_1fr_1.5fr_1fr_100px_100px] gap-2 px-5 py-4 border-b border-zinc-800/50">
          <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
          <div className="h-5 w-16 bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="rounded-full bg-zinc-800 p-4 mb-4">
        <ShoppingCart className="size-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-medium text-zinc-100">Sin pedidos</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-sm">
        No hay pedidos que coincidan con los filtros seleccionados.
      </p>
    </motion.div>
  );
}
