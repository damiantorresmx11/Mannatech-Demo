"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCustomers } from "@/lib/commerce/client";
import type { Customer } from "@/lib/commerce/types";
import {
  Users,
  UserCheck,
  UserX,
  CalendarPlus,
  Search,
  LayoutGrid,
  List,
  RefreshCw,
} from "lucide-react";

function getAvatarColor(name: string): string {
  const colors = [
    "from-blue-500 to-blue-700", "from-emerald-500 to-emerald-700",
    "from-violet-500 to-violet-700", "from-amber-500 to-amber-700",
    "from-rose-500 to-rose-700", "from-cyan-500 to-cyan-700",
    "from-fuchsia-500 to-fuchsia-700", "from-indigo-500 to-indigo-700",
    "from-teal-500 to-teal-700", "from-orange-500 to-orange-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function UsuariosPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data.customers || []);
    } catch {
      setError("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const getName = (c: Customer) => {
    if (c.nombre || c.apellido)
      return `${c.nombre ?? ""} ${c.apellido ?? ""}`.trim();
    return c.email?.split("@")[0] ?? "---";
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) => getName(c).toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      total: customers.length,
      withOrders: customers.filter((c) => c.pedidos > 0).length,
      noOrders: customers.filter((c) => c.pedidos === 0).length,
      newThisMonth: customers.filter((c) => new Date(c.creadoEn) >= startOfMonth).length,
    };
  }, [customers]);

  const statCards = [
    { label: "Total Clientes", value: stats.total, icon: Users, color: "text-blue-400" },
    { label: "Con Pedidos", value: stats.withOrders, icon: UserCheck, color: "text-emerald-400" },
    { label: "Sin Pedidos", value: stats.noOrders, icon: UserX, color: "text-zinc-400" },
    { label: "Nuevos este mes", value: stats.newThisMonth, icon: CalendarPlus, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Clientes</h1>
          <p className="text-sm text-zinc-400 mt-1">Gestiona los clientes registrados en tu tienda</p>
        </div>
        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-800 p-2">
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-50">{loading ? "-" : stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          <button onClick={() => setViewMode("grid")} className={`rounded-md p-2 transition-colors ${viewMode === "grid" ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}>
            <LayoutGrid className="size-4" />
          </button>
          <button onClick={() => setViewMode("list")} className={`rounded-md p-2 transition-colors ${viewMode === "list" ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}>
            <List className="size-4" />
          </button>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg border border-red-900/50 bg-red-950/50 p-4 text-sm text-red-400">
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60 ${viewMode === "grid" ? "p-5" : "p-4 flex items-center gap-4"}`}>
              <div className={`rounded-full bg-zinc-800 ${viewMode === "grid" ? "size-14 mx-auto mb-4" : "size-10 shrink-0"}`} />
              <div className={viewMode === "grid" ? "space-y-3 text-center" : "flex-1 space-y-2"}>
                <div className="h-4 bg-zinc-800 rounded w-2/3 mx-auto" />
                <div className="h-3 bg-zinc-800/60 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-2xl bg-zinc-800/50 p-6 mb-4"><Users className="size-12 text-zinc-600" /></div>
          <h3 className="text-lg font-semibold text-zinc-200">{search ? "Sin resultados" : "Sin clientes"}</h3>
          <p className="text-sm text-zinc-500 mt-2 max-w-sm">
            {search ? `No se encontraron clientes que coincidan con "${search}"` : "Los clientes apareceran aqui cuando se registren o realicen compras."}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            variants={container}
            initial="hidden"
            animate="show"
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"}
          >
            {filtered.map((c) => {
              const name = getName(c);
              const initials = getInitials(name);
              const avatarColor = getAvatarColor(name);
              const hasOrders = c.pedidos > 0;

              if (viewMode === "list") {
                return (
                  <motion.div key={c.id} variants={item}
                    className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-blue-500/5">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor} text-white text-sm font-bold shadow-lg`}>{initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-100 truncate">{name}</p>
                      <p className="text-xs text-zinc-500 truncate">{c.email}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${hasOrders ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-zinc-700/50 text-zinc-400 ring-1 ring-zinc-600/30"}`}>
                      {hasOrders ? `${c.pedidos} pedidos` : "Sin pedidos"}
                    </span>
                    <span className="text-xs text-zinc-600 hidden sm:block">
                      {new Date(c.creadoEn).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </motion.div>
                );
              }

              return (
                <motion.div key={c.id} variants={item} whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 transition-all duration-200 hover:border-zinc-700 hover:shadow-xl hover:shadow-blue-500/5">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative flex flex-col items-center text-center">
                    <div className={`flex size-14 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor} text-white text-lg font-bold shadow-lg ring-2 ring-zinc-800 group-hover:ring-zinc-700 transition-all`}>{initials}</div>
                    <h3 className="mt-3 text-sm font-semibold text-zinc-100 truncate w-full">{name}</h3>
                    <p className="text-xs text-zinc-500 truncate w-full mt-0.5">{c.email}</p>
                    <span className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${hasOrders ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-zinc-700/50 text-zinc-400 ring-1 ring-zinc-600/30"}`}>
                      {hasOrders ? `${c.pedidos} pedidos` : "Sin pedidos"}
                    </span>
                    <p className="mt-2 text-xs text-zinc-600">
                      {new Date(c.creadoEn).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
