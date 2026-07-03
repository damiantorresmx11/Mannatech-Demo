"use client";

import { useState, useEffect } from "react";
import { mockAdmin } from "@/lib/mock-data";
import { ChartCard, StatsCard } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, DollarSign, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getOrders, getProducts } from "@/lib/medusa-admin";

const { reportes } = mockAdmin;

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ReportesPage() {
  const [stats, setStats] = useState<{ totalRevenue: number; totalOrders: number; avgOrder: number; currency: string } | null>(null);
  const [topProducts, setTopProducts] = useState<{ name: string; stock: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getOrders(), getProducts()]).then((results) => {
      if (results[0].status === "fulfilled") {
        const orders = results[0].value.orders || [];
        const rev = orders.reduce((s: number, o: any) => s + (o.total || 0), 0) / 100;
        setStats({ totalRevenue: rev, totalOrders: orders.length, avgOrder: orders.length > 0 ? rev / orders.length : 0, currency: orders[0]?.currency_code?.toUpperCase() || "MXN" });
      }
      if (results[1].status === "fulfilled") {
        setTopProducts((results[1].value.products || []).map((p: any) => ({ name: p.title, stock: p.variants?.reduce((s: number, v: any) => s + (v.inventory_quantity || 0), 0) ?? 0 })).sort((a: any, b: any) => b.stock - a.stock).slice(0, 5));
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Reportes</h1>
        <Link href="/admin/reportes/exportar" className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"><FileDown className="size-4" /> Exportar</Link>
      </div>

      {loading ? <div className="flex items-center justify-center py-10"><Loader2 className="size-8 animate-spin text-zinc-400" /></div> : stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard title="Ingresos Totales" value={`$${stats.totalRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${stats.currency}`} change={0} trend="up" icon={DollarSign} />
          <StatsCard title="Total Pedidos" value={stats.totalOrders} change={0} trend="up" icon={ShoppingCart} />
          <StatsCard title="Ticket Promedio" value={`$${stats.avgOrder.toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${stats.currency}`} change={0} trend="up" icon={TrendingUp} />
        </div>
      )}

      <ChartCard title="Ventas por Región" description="Distribución geográfica (datos demo)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportes.ventasPorRegion} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
            <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: "#71717a", fontSize: 12 }} />
            <YAxis type="category" dataKey="region" tick={{ fill: "#71717a", fontSize: 12 }} width={120} />
            <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString("es-MX")}.00 MXN`, "Ventas"]} contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "13px" }} />
            <Bar dataKey="ventas" fill="#00A88F" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Top Productos (por stock)</CardTitle></CardHeader>
          <CardContent>
            {topProducts.length === 0 ? <p className="text-sm text-zinc-400">Sin productos</p> : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">#</th>
                  <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Producto</th>
                  <th className="py-2 px-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Stock</th>
                </tr></thead>
                <tbody>{topProducts.map((p, i) => (
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-2 px-3 text-zinc-400">{i + 1}</td>
                    <td className="py-2 px-3 font-medium text-zinc-900 dark:text-zinc-100">{p.name}</td>
                    <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">{p.stock}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Socios (datos demo)</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">#</th>
                <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Nombre</th>
                <th className="py-2 px-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Ventas</th>
                <th className="py-2 px-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Clientes</th>
              </tr></thead>
              <tbody>{reportes.topSocios.map((s, i) => (
                <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-2 px-3 text-zinc-400">{i + 1}</td>
                  <td className="py-2 px-3 font-medium text-zinc-900 dark:text-zinc-100">{s.nombre}</td>
                  <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">${s.ventas.toLocaleString("es-MX")}.00</td>
                  <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">{s.clientes}</td>
                </tr>
              ))}</tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
