"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, Users, MousePointerClick, Target, ArrowUpRight } from "lucide-react";
import type { Distribuidor, Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";

interface PanelContentProps {
  distribuidor: Distribuidor;
  productosFavoritos: Producto[];
}

const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];

const periods = ["Esta semana", "Este mes", "3 meses"];

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export function PanelContent({ distribuidor }: PanelContentProps) {
  const { stats } = distribuidor;
  const [activePeriod, setActivePeriod] = useState(1);

  const ventasData = meses.map((mes, i) => ({
    mes,
    ventas: stats.ventasHistorial[i] ?? 0,
  }));

  const compartidosData = stats.productosCompartidos.map((p) => ({
    slug: p.slug,
    cantidad: p.cantidad,
  }));

  const progreso = Math.min(
    Math.round((stats.ventasMes / stats.metaMensual) * 100),
    100
  );

  const statCards = [
    {
      label: "Ventas del Mes",
      value: formatPrecio(stats.ventasMes),
      icon: TrendingUp,
      color: "text-mannatech",
      bg: "bg-mannatech/10",
      trend: `+${stats.tendencia}%`,
    },
    {
      label: "Clics en Enlace",
      value: stats.clicsEnlace.toLocaleString("es-MX"),
      icon: MousePointerClick,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Clientes Activos",
      value: stats.clientesActivos.toLocaleString("es-MX"),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Meta Mensual",
      value: formatPrecio(stats.metaMensual),
      icon: Target,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Panel de {distribuidor.nombre}
            </h1>
            <p className="text-muted-foreground mt-1">
              {distribuidor.nivel} · {distribuidor.ubicacion}
            </p>
          </div>

          {/* Period selector tabs */}
          <div className="flex bg-white rounded-xl border border-border p-1 shadow-sm">
            {periods.map((period, i) => (
              <button
                key={period}
                onClick={() => setActivePeriod(i)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activePeriod === i
                    ? "bg-mannatech text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                custom={i}
                variants={statCardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon size={20} className={card.color} />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                <p className="text-xl font-bold text-foreground">{card.value}</p>
                {card.trend && (
                  <div className="flex items-center gap-1 mt-1 text-green-600 text-xs font-medium">
                    <ArrowUpRight size={12} />
                    {card.trend} vs mes anterior
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar toward goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="bg-white rounded-2xl border border-border p-6 shadow-sm mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-foreground">Progreso hacia meta mensual</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {formatPrecio(stats.ventasMes)} de {formatPrecio(stats.metaMensual)}
              </p>
            </div>
            <span
              className={`text-2xl font-bold ${
                progreso >= 100 ? "text-green-500" : "text-mannatech"
              }`}
            >
              {progreso}%
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full ${
                progreso >= 100
                  ? "bg-gradient-to-r from-green-400 to-green-500"
                  : "bg-gradient-to-r from-mannatech to-mannatech-light"
              }`}
            />
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales trend — gradient fill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm"
          >
            <h2 className="font-semibold text-foreground mb-1">Tendencia de Ventas</h2>
            <p className="text-xs text-muted-foreground mb-5">Ultimos 6 meses (MXN)</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={ventasData}>
                <defs>
                  <linearGradient id="colorVentasPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00897B" stopOpacity={0.3} />
                    <stop offset="50%" stopColor="#00897B" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#00897B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatPrecio(Number(value)), "Ventas"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: 13,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#00897B"
                  strokeWidth={2.5}
                  fill="url(#colorVentasPremium)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Products shared — gradient bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.6 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm"
          >
            <h2 className="font-semibold text-foreground mb-1">Productos Compartidos</h2>
            <p className="text-xs text-muted-foreground mb-5">Numero de veces compartido</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={compartidosData} barSize={28}>
                <defs>
                  <linearGradient id="colorBarPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00897B" stopOpacity={1} />
                    <stop offset="100%" stopColor="#4DB6AC" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="slug"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.split("-")[0]}
                />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [Number(value), "Compartidos"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: 13,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Bar
                  dataKey="cantidad"
                  fill="url(#colorBarPremium)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
