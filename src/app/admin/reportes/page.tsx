"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const PERIODS = [
  { label: "Este Mes", value: "1m" },
  { label: "Ultimo Mes", value: "last" },
  { label: "3 Meses", value: "3m" },
  { label: "6 Meses", value: "6m" },
  { label: "Este Ano", value: "year" },
] as const;

const PIE_COLORS = ["#facc15", "#22c55e", "#ef4444", "#6366f1"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, ease: "easeOut" as const },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
} as const;

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  newCustomers: number;
  ordersByStatus: Record<string, number>;
  topProducts: { name: string; quantity: number; revenue: number }[];
  revenueOverTime: { month: string; revenue: number }[];
  customerGrowth: { month: string; customers: number }[];
  currency: string;
}

export default function ReportesPage() {
  const [period, setPeriod] = useState<string>("6m");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/tools/reportes?period=${period}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener datos");
        return res.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [period]);

  const pieData = data
    ? Object.entries(data.ordersByStatus).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-zinc-50">Reportes y Analitica</h1>
        <div className="flex gap-2 flex-wrap">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p.value
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-zinc-400" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-900/30 border border-red-700 rounded-xl p-4">
          <AlertCircle className="size-5 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Content */}
      {data && !loading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* KPI Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Ingresos Totales"
              value={`$${(data?.totalRevenue || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${data.currency}`}
              icon={DollarSign}
              color="emerald"
            />
            <KPICard
              title="Pedidos"
              value={data.totalOrders.toString()}
              icon={ShoppingCart}
              color="blue"
            />
            <KPICard
              title="Ticket Promedio"
              value={`$${(data?.avgOrderValue || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${data.currency}`}
              icon={TrendingUp}
              color="purple"
            />
            <KPICard
              title="Clientes Nuevos"
              value={data.newCustomers.toString()}
              icon={Users}
              color="amber"
            />
          </motion.div>

          {/* Revenue Line Chart */}
          <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Ingresos por Mes</h2>
            {data.revenueOverTime.length === 0 ? (
              <p className="text-sm text-zinc-500 py-10 text-center">Sin datos de ingresos en este periodo</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.revenueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                    labelStyle={{ color: "#e4e4e7" }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, "Ingresos"]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Pie + Bar row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders by Status Pie */}
            <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Pedidos por Estado</h2>
              {pieData.length === 0 || pieData.every((d) => d.value === 0) ? (
                <p className="text-sm text-zinc-500 py-10 text-center">Sin pedidos en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name} (${value})`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      wrapperStyle={{ color: "#a1a1aa", fontSize: "12px" }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Customer Growth Bar */}
            <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Crecimiento de Clientes</h2>
              {data.customerGrowth.length === 0 ? (
                <p className="text-sm text-zinc-500 py-10 text-center">Sin datos de clientes en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.customerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                    <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                      labelStyle={{ color: "#e4e4e7" }}
                      formatter={(value: any) => [value, "Clientes"]}
                    />
                    <Bar dataKey="customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          {/* Top Products Table */}
          <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Top 10 Productos</h2>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-zinc-500 py-6 text-center">Sin datos de productos vendidos</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="py-3 px-4 text-left font-medium text-zinc-400">#</th>
                      <th className="py-3 px-4 text-left font-medium text-zinc-400">Producto</th>
                      <th className="py-3 px-4 text-right font-medium text-zinc-400">Unidades Vendidas</th>
                      <th className="py-3 px-4 text-right font-medium text-zinc-400">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((p, i) => (
                      <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                        <td className="py-3 px-4 text-zinc-500">{i + 1}</td>
                        <td className="py-3 px-4 font-medium text-zinc-100">{p.name}</td>
                        <td className="py-3 px-4 text-right text-zinc-300">{p.quantity}</td>
                        <td className="py-3 px-4 text-right text-zinc-300">
                          ${(p?.revenue || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function KPICard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: "emerald" | "blue" | "purple" | "amber";
}) {
  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  const iconBgMap = {
    emerald: "bg-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    amber: "bg-amber-500/20 text-amber-400",
  };

  return (
    <div className={`bg-zinc-950 border rounded-xl p-5 ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-zinc-400">{title}</span>
        <div className={`p-2 rounded-lg ${iconBgMap[color]}`}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-50">{value}</p>
    </div>
  );
}
