"use client";

import { useState } from "react";
import { mockAdmin } from "@/lib/mock-data";
import { ChartCard, DateRangePicker } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { reportes } = mockAdmin;

export default function ReportesPage() {
  const [dateRange, setDateRange] = useState({ from: "2026-06-01", to: "2026-06-30" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Reportes</h1>
        <Link
          href="/admin/reportes/exportar"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <FileDown className="size-4" />
          Exportar
        </Link>
      </div>

      <DateRangePicker value={dateRange} onChange={setDateRange} />

      {/* Ventas por Region */}
      <ChartCard title="Ventas por Region" description="Distribucion geografica del periodo">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportes.ventasPorRegion} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
            <XAxis
              type="number"
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <YAxis type="category" dataKey="region" tick={{ fill: "#71717a", fontSize: 12 }} width={120} />
            <Tooltip
              formatter={(value: any) => [`$${Number(value).toLocaleString("es-MX")}.00 MXN`, "Ventas"]}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "13px" }}
            />
            <Bar dataKey="ventas" fill="#00A88F" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">#</th>
                    <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Nombre</th>
                    <th className="py-2 px-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Unidades</th>
                    <th className="py-2 px-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Ventas</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.topProductos.map((p, i) => (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-2 px-3 text-zinc-400">{i + 1}</td>
                      <td className="py-2 px-3 font-medium text-zinc-900 dark:text-zinc-100">{p.nombre}</td>
                      <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">{p.unidades}</td>
                      <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">
                        ${p.ventas.toLocaleString("es-MX")}.00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Socios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">#</th>
                    <th className="py-2 px-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Nombre</th>
                    <th className="py-2 px-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Ventas</th>
                    <th className="py-2 px-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Clientes</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.topSocios.map((s, i) => (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-2 px-3 text-zinc-400">{i + 1}</td>
                      <td className="py-2 px-3 font-medium text-zinc-900 dark:text-zinc-100">{s.nombre}</td>
                      <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">
                        ${s.ventas.toLocaleString("es-MX")}.00
                      </td>
                      <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">{s.clientes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
