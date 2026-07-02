"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Crown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StatsCard, ChartCard, DataTable, StatusBadge, type DataTableColumn } from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { mockSocio } from "@/lib/mock-data";
import { formatPrecio } from "@/lib/format";

export default function ComisionesPage() {
  const { comisiones } = mockSocio;

  const bonosCards = [
    {
      label: "Bono Retail",
      monto: comisiones.bonoRetail,
      icon: ShoppingCart,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Bono Grupal",
      monto: comisiones.bonoGrupal,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Bono Liderazgo",
      monto: comisiones.bonoLiderazgo,
      icon: Crown,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  const columns: DataTableColumn[] = [
    { key: "mes", label: "Mes" },
    { key: "tipo", label: "Tipo" },
    {
      key: "monto",
      label: "Monto",
      render: (value: number) => (
        <span className="font-semibold">{formatPrecio(value)}</span>
      ),
    },
    {
      key: "estatus",
      label: "Estatus",
      render: (value: string) => (
        <StatusBadge status={value.charAt(0).toUpperCase() + value.slice(1)} />
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground">
          Mis Comisiones
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Revisa tus ganancias y bonos mensuales
        </p>
      </motion.div>

      {/* Total Commission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatsCard
          title="Total Comisiones este Mes"
          value={formatPrecio(comisiones.totalMes)}
          icon={DollarSign}
          change={9.7}
          trend="up"
        />
      </motion.div>

      {/* Bonus Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {bonosCards.map((bono, i) => {
          const Icon = bono.icon;
          return (
            <motion.div
              key={bono.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <Card>
                <CardContent className="pt-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-xl ${bono.bg}`}
                    >
                      <Icon className={`size-5 ${bono.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {bono.label}
                      </p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {formatPrecio(bono.monto)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Stacked Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ChartCard
          title="Historial de Comisiones"
          description="Desglose por tipo, ultimos 6 meses"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comisiones.historial} barSize={32}>
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
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    retail: "Bono Retail",
                    grupal: "Bono Grupal",
                    liderazgo: "Bono Liderazgo",
                  };
                  return [formatPrecio(Number(value)), labels[name as string] || name];
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: 13,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Legend
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    retail: "Retail",
                    grupal: "Grupal",
                    liderazgo: "Liderazgo",
                  };
                  return labels[value] || value;
                }}
              />
              <Bar dataKey="retail" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="grupal" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="liderazgo" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Detailed Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <DataTable columns={columns} data={comisiones.detalle} pageSize={10} />
      </motion.div>
    </div>
  );
}
