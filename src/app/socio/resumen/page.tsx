"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  Users,
  UserPlus,
  ShoppingCart,
  Network,
  Award,
  CalendarClock,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatsCard, ChartCard } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSocio } from "@/lib/mock-data";
import { formatPrecio } from "@/lib/format";
import { cn } from "@/lib/utils";

const NOTIFICATION_ICONS: Record<string, typeof TrendingUp> = {
  venta: ShoppingCart,
  red: Network,
  comision: DollarSign,
  logro: Award,
  evento: CalendarClock,
};

const NOTIFICATION_COLORS: Record<string, { bg: string; text: string }> = {
  venta: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400" },
  red: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
  comision: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
  logro: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
  evento: { bg: "bg-[#00A88F]/10 dark:bg-[#00C9A7]/15", text: "text-[#00A88F] dark:text-[#00C9A7]" },
};

export default function ResumenPage() {
  const { kpis, ventasHistorial, notificaciones } = mockSocio;

  const chartData = ventasHistorial.map((v) => ({
    mes: v.mes,
    ventas: v.ventas,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground">
          Resumen
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
          Hola, Carlos
          <Sparkles className="size-4 text-amber-500" />
          <span className="text-sm">Tu negocio esta creciendo</span>
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCard
            title="Ventas del Mes"
            value={formatPrecio(kpis.ventasMes)}
            icon={TrendingUp}
            change={kpis.tendenciaVentas}
            trend="up"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatsCard
            title="PV Personal"
            value={`${kpis.pvPersonal} PV`}
            icon={Star}
            change={kpis.tendenciaPV}
            trend="up"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard
            title="PV Grupal"
            value={`${kpis.pvGrupal.toLocaleString("es-MX")} PV`}
            icon={Users}
            change={kpis.tendenciaGrupal}
            trend="up"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <StatsCard
            title="Comisiones"
            value={formatPrecio(kpis.comisionesMes)}
            icon={DollarSign}
            change={kpis.tendenciaComisiones}
            trend="up"
          />
        </motion.div>
      </div>

      {/* Chart + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales chart - spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <ChartCard
            title="Ventas Ultimos 6 Meses"
            description="Tendencia de ventas en MXN"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVentasSocio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00A88F" stopOpacity={0.3} />
                    <stop offset="50%" stopColor="#00A88F" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#00A88F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
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
                  stroke="#00A88F"
                  strokeWidth={2.5}
                  fill="url(#colorVentasSocio)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificaciones.slice(0, 5).map((n) => {
                  const Icon = NOTIFICATION_ICONS[n.tipo] || Star;
                  const colors = NOTIFICATION_COLORS[n.tipo] || NOTIFICATION_COLORS.evento;
                  return (
                    <div key={n.id} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",
                          colors.bg
                        )}
                      >
                        <Icon className={cn("size-4", colors.text)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">
                          {n.mensaje}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                          {n.fecha} · {n.hora}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="pt-1">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#00A88F]/10 dark:bg-[#00C9A7]/15">
                  <Users className="size-6 text-[#00A88F] dark:text-[#00C9A7]" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Clientes Activos
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {kpis.clientesActivos}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <CardContent className="pt-1">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <UserPlus className="size-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Nuevos Miembros este Mes
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {kpis.nuevosEsteMes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
