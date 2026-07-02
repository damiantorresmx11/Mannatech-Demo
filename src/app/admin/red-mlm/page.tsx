"use client";

import { mockAdmin } from "@/lib/mock-data";
import { StatsCard, ChartCard, DataTable } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Award } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const { redMLM } = mockAdmin;

const LEVEL_COLORS: Record<string, string> = {
  Diamante: "#8B5CF6",
  Platino: "#6366F1",
  Oro: "#F59E0B",
  Plata: "#94A3B8",
  Bronce: "#CD7F32",
};

const columns: DataTableColumn[] = [
  { key: "nivel", label: "Nivel" },
  { key: "miembros", label: "Miembros" },
  {
    key: "pvTotal",
    label: "PV Total",
    render: (v: number) => v.toLocaleString("es-MX"),
  },
];

export default function RedMLMPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Red MLM -- Vista Global</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Miembros"
          value={redMLM.totalMiembros}
          icon={Users}
          change={redMLM.crecimientoMensual}
          trend="up"
        />
        <StatsCard
          title="PV Total de la Red"
          value={redMLM.pvTotalRed.toLocaleString("es-MX")}
          icon={TrendingUp}
        />
        <StatsCard
          title="Crecimiento Mensual"
          value={`${redMLM.crecimientoMensual}%`}
          icon={Award}
          trend="up"
          change={redMLM.crecimientoMensual}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <ChartCard title="Miembros por Nivel" description="Distribucion de la red por rango">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={redMLM.niveles} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
              <XAxis type="number" tick={{ fill: "#71717a", fontSize: 12 }} />
              <YAxis type="category" dataKey="nivel" tick={{ fill: "#71717a", fontSize: 12 }} width={80} />
              <Tooltip
                formatter={(value: any) => [value, "Miembros"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "13px" }}
              />
              <Bar dataKey="miembros" radius={[0, 4, 4, 0]}>
                {redMLM.niveles.map((entry, i) => (
                  <Cell key={i} fill={LEVEL_COLORS[entry.nivel] ?? "#00A88F"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Data table */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle por Nivel</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={redMLM.niveles} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
