"use client";

import { useEffect, useState } from "react";
import { mockAdmin } from "@/lib/mock-data";
import { StatsCard, ChartCard } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  UserPlus,
  Users,
  Package,
  CheckCircle,
  CreditCard,
  Headphones,
  AlertTriangle,
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
import { getProducts, getOrders, getCustomers } from "@/lib/medusa-admin";

const { ventasHistorial, ventasPorCategoria, actividadReciente } = mockAdmin;

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

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getProducts(), getOrders(), getCustomers()]).then((results) => {
      setStats({
        products: results[0].status === "fulfilled" ? (results[0].value.products?.length ?? 0) : 0,
        orders: results[1].status === "fulfilled" ? (results[1].value.orders?.length ?? 0) : 0,
        customers: results[2].status === "fulfilled" ? (results[2].value.customers?.length ?? 0) : 0,
      });
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Productos" value={loading ? "..." : stats.products} change={0} trend="up" icon={Package} />
        <StatsCard title="Pedidos" value={loading ? "..." : stats.orders} change={0} trend="up" icon={ShoppingCart} />
        <StatsCard title="Clientes" value={loading ? "..." : stats.customers} change={0} trend="up" icon={Users} />
        <StatsCard title="Ventas del Mes" value={`$${mockAdmin.kpis.ventasMes.toLocaleString("es-MX")}`} change={mockAdmin.kpis.ventasMesDelta} trend="up" icon={TrendingUp} />
        <StatsCard title="Socios Activos" value={mockAdmin.kpis.sociosActivos} change={mockAdmin.kpis.sociosDelta} trend="up" icon={UserPlus} />
        <StatsCard title="Tickets Abiertos" value={mockAdmin.kpis.ticketsAbiertos} change={mockAdmin.kpis.ticketsDelta} trend="down" icon={Headphones} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Ventas Ultimos 12 Meses" description="Comparativa año actual vs anterior">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventasHistorial}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
              <XAxis dataKey="mes" className="text-xs" tick={{ fill: "#71717a" }} />
              <YAxis tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} className="text-xs" tick={{ fill: "#71717a" }} />
              <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString("es-MX")} MXN`, ""]} labelStyle={{ color: "#18181b" }} contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "13px" }} />
              <Line type="monotone" dataKey="actual" stroke="#00A88F" strokeWidth={2} dot={{ fill: "#00A88F", r: 3 }} name="Actual" />
              <Line type="monotone" dataKey="anterior" stroke="#a1a1aa" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Anterior" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ventas por Categoria" description="Distribución del mes actual">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ventasPorCategoria} dataKey="valor" nameKey="nombre" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {ventasPorCategoria.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString("es-MX")} MXN`, ""]} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <CardHeader><CardTitle>Actividad Reciente</CardTitle></CardHeader>
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
  );
}
