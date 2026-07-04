"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getOrders } from "@/lib/medusa-admin";
import {
  ShoppingCart,
  RefreshCw,
  Search,
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

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

const STATUS_MAP: Record<string, string> = {
  pending: "Pendiente",
  completed: "Completado",
  archived: "Archivado",
  canceled: "Cancelado",
  requires_action: "Accion Requerida",
};

const FULFILLMENT_MAP: Record<string, string> = {
  not_fulfilled: "Sin Enviar",
  fulfilled: "Enviado",
  partially_fulfilled: "Parcial",
  shipped: "Enviado",
  delivered: "Entregado",
  returned: "Devuelto",
  canceled: "Cancelado",
};

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "pending", label: "Pendientes" },
  { key: "completed", label: "Completados" },
  { key: "canceled", label: "Cancelados" },
];

function formatCurrency(amount: number, currency: string) {
  return `$${(amount / 100).toLocaleString("es-MX", {
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

function getItemsSummary(items: { title: string; quantity: number }[]) {
  if (!items || items.length === 0) return "Sin items";
  const first = items[0].title;
  if (items.length === 1) return first;
  return `${first} y ${items.length - 1} mas`;
}

export default function PedidosPage() {
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<MedusaOrder[]>([]);
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
    let result = filter === "todos" ? orders : orders.filter((o) => o.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.email?.toLowerCase().includes(q) ||
          String(o.display_id).includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, filter, search]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const completed = orders.filter((o) => o.status === "completed").length;
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
          {
            label: "Total Pedidos",
            value: stats.total,
            icon: Package,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Pendientes",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Completados",
            value: stats.completed,
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Ingresos",
            value: formatCurrency(stats.revenue, "mxn"),
            icon: DollarSign,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
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
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-zinc-50 mt-1">
                  {stat.value}
                </p>
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
        {/* Search */}
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

        {/* Filter Tabs */}
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
              <span
                className={`relative z-10 ${
                  filter === f.key ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
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
          {/* Table Header */}
          <div className="grid grid-cols-[80px_1fr_1.5fr_1fr_100px_120px_100px] gap-2 px-5 py-3 border-b border-zinc-800 bg-zinc-950/50">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Orden
            </span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Cliente
            </span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Items
            </span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total
            </span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Estatus
            </span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Envio
            </span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Fecha
            </span>
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            <motion.div key={filter + search}>
              {filtered.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  onClick={() => router.push(`/admin/pedidos/${order.id}`)}
                  className="grid grid-cols-[80px_1fr_1.5fr_1fr_100px_120px_100px] gap-2 px-5 py-3.5 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/50 transition-colors group"
                >
                  {/* Order ID */}
                  <span className="font-mono font-bold text-sm text-zinc-100 group-hover:text-blue-400 transition-colors">
                    #{order.display_id}
                  </span>

                  {/* Email */}
                  <span className="text-sm text-zinc-300 truncate">
                    {order.email || "---"}
                  </span>

                  {/* Items */}
                  <span className="text-sm text-zinc-400 truncate">
                    {getItemsSummary(order.items)}
                  </span>

                  {/* Total */}
                  <span className="text-sm font-medium text-zinc-100">
                    {formatCurrency(order.total, order.currency_code)}
                  </span>

                  {/* Status Badge */}
                  <span>
                    <StatusBadge status={order.status} />
                  </span>

                  {/* Fulfillment Badge */}
                  <span>
                    <FulfillmentBadge status={order.fulfillment_status} />
                  </span>

                  {/* Date */}
                  <span className="text-sm text-zinc-500">
                    {formatDate(order.created_at)}
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

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    completed: {
      bg: "bg-emerald-500/10 border-emerald-500/20",
      text: "text-emerald-400",
      label: STATUS_MAP.completed,
    },
    pending: {
      bg: "bg-amber-500/10 border-amber-500/20",
      text: "text-amber-400",
      label: STATUS_MAP.pending,
    },
    canceled: {
      bg: "bg-red-500/10 border-red-500/20",
      text: "text-red-400",
      label: STATUS_MAP.canceled,
    },
    archived: {
      bg: "bg-zinc-500/10 border-zinc-500/20",
      text: "text-zinc-400",
      label: STATUS_MAP.archived,
    },
    requires_action: {
      bg: "bg-orange-500/10 border-orange-500/20",
      text: "text-orange-400",
      label: STATUS_MAP.requires_action,
    },
  };

  const c = config[status] || {
    bg: "bg-zinc-500/10 border-zinc-500/20",
    text: "text-zinc-400",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

function FulfillmentBadge({ status }: { status: string }) {
  const isShipped =
    status === "fulfilled" || status === "shipped" || status === "delivered";
  const label = FULFILLMENT_MAP[status] || status || "---";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        isShipped
          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
          : "bg-zinc-500/10 border-zinc-600/20 text-zinc-400"
      }`}
    >
      {label}
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
        <div
          key={i}
          className="grid grid-cols-[80px_1fr_1.5fr_1fr_100px_120px_100px] gap-2 px-5 py-4 border-b border-zinc-800/50"
        >
          <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
          <div className="h-5 w-16 bg-zinc-800 rounded-full animate-pulse" />
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
