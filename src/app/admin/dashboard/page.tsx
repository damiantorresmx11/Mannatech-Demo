"use client";

import { mockAdmin } from "@/lib/mock-data";
import { StatsCard, ChartCard, DataTable, StatusBadge } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  UserPlus,
  Users,
  Headphones,
  AlertTriangle,
  CreditCard,
  CheckCircle,
  Tag,
  UserPlus2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const { kpis, ventasHistorial, ventasPorCategoria, pedidos, actividadReciente, inventario } = mockAdmin;

const pedidoColumns: DataTableColumn[] = [
  { key: "id", label: "ID" },
  { key: "fecha", label: "Fecha" },
  { key: "cliente", label: "Cliente" },
  { key: "total", label: "Total", render: (v: number) => `$${v.toLocaleString("es-MX")}.00 MXN` },
  {
    key: "estatus",
    label: "Estatus",
    render: (v: string) => {
      const labels: Record<string, string> = {
        completado: "Completado",
        en_proceso: "En Proceso",
        pendiente: "Pendiente",
        cancelado: "Cancelado",
      };
      return <StatusBadge status={labels[v] ?? v} />;
    },
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const ICON_MAP: Record<string, any> = {
  "shopping-cart": ShoppingCart,
  "user-plus": UserPlus2,
  "credit-card": CreditCard,
  headphones: Headphones,
  "alert-triangle": AlertTriangle,
  "dollar-sign": DollarSign,
  "check-circle": CheckCircle,
  tag: Tag,
};

const alertas = inventario.filter((i) => i.nivel === "critico" || i.nivel === "bajo");

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Ventas Hoy"
          value={`$${kpis.ventasHoy.toLocaleString("es-MX")}`}
          change={kpis.ventasHoyDelta}
          trend="up"
          icon={DollarSign}
        />
        <StatsCard
          title="Ventas del Mes"
          value={`$${kpis.ventasMes.toLocaleString("es-MX")}`}
          change={kpis.ventasMesDelta}
          trend="up"
          icon={TrendingUp}
        />
        <StatsCard
          title="Pedidos Nuevos"
          value={kpis.pedidosNuevos}
          change={kpis.pedidosDelta}
          trend="down"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Usuarios Nuevos"
          value={kpis.usuariosNuevos}
          change={kpis.usuariosDelta}
          trend="up"
          icon={UserPlus}
        />
        <StatsCard
          title="Socios Activos"
          value={kpis.sociosActivos}
          change={kpis.sociosDelta}
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Tickets Abiertos"
          value={kpis.ticketsAbiertos}
          change={kpis.ticketsDelta}
          trend="down"
          icon={Headphones}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Ventas Ultimos 12 Meses" description="Comparativa ano actual vs anterior">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventasHistorial}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
              <XAxis dataKey="mes" className="text-xs" tick={{ fill: "#71717a" }} />
              <YAxis tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} className="text-xs" tick={{ fill: "#71717a" }} />
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString("es-MX")} MXN`, ""]}
                labelStyle={{ color: "#18181b" }}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "13px" }}
              />
              <Line type="monotone" dataKey="actual" stroke="#00A88F" strokeWidth={2} dot={{ fill: "#00A88F", r: 3 }} name="Actual" />
              <Line type="monotone" dataKey="anterior" stroke="#a1a1aa" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Anterior" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ventas por Categoria" description="Distribucion del mes actual">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ventasPorCategoria}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={55}
                paddingAngle={3}
                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={11}
              >
                {ventasPorCategoria.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString("es-MX")} MXN`, ""]} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Pedidos recientes + Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={pedidoColumns} data={pedidos.slice(0, 5)} pageSize={5} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actividadReciente.map((item, i) => {
                const Icon = ICON_MAP[item.icono] || CheckCircle;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <Icon className="size-4 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">{item.mensaje}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{item.tiempo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Inventario */}
      {alertas.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Alertas de Inventario</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertas.map((alerta, i) => (
              <Card
                key={i}
                className={
                  alerta.nivel === "critico"
                    ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                    : "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                }
              >
                <CardContent className="pt-1">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={
                        alerta.nivel === "critico"
                          ? "size-5 text-red-500"
                          : "size-5 text-amber-500"
                      }
                    />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">{alerta.producto}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Stock: {alerta.stockActual} / Min: {alerta.stockMinimo}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
