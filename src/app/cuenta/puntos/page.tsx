"use client";

import { mockCliente } from "@/lib/mock-data/cliente";
import { StatsCard, ChartCard, ProgressRing } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Award, Gift, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const LEVEL_COLORS: Record<string, string> = {
  Bronce: "#CD7F32",
  Plata: "#A8A9AD",
  Oro: "#FFD700",
  Platino: "#E5E4E2",
  Diamante: "#B9F2FF",
};

export default function PuntosPage() {
  const { puntos } = mockCliente;

  const progressToNext =
    puntos.pvParaSiguienteNivel > 0
      ? Math.round(
          ((puntos.pvEsteMes) /
            (puntos.pvEsteMes + puntos.pvParaSiguienteNivel)) *
            100
        )
      : 100;

  const chartData = puntos.historial.map((h) => ({
    name: h.mes.split(" ")[0], // Just the month name
    pv: h.pv,
  }));

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground mb-6">
        Mis Puntos y Recompensas
      </h1>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="PV Acumulados"
          value={puntos.pvAcumulados}
          icon={Star}
          trend="up"
          change={12}
        />
        <StatsCard
          title="PV Este Mes"
          value={puntos.pvEsteMes}
          icon={TrendingUp}
          trend="up"
          change={8}
        />

        {/* Level + Progress */}
        <Card>
          <CardContent className="pt-1">
            <div className="flex items-center gap-4">
              <ProgressRing
                value={progressToNext}
                size={72}
                strokeWidth={5}
                color={LEVEL_COLORS[puntos.nivelLealtad] ?? "#00A88F"}
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Award
                    className="size-4"
                    style={{
                      color:
                        LEVEL_COLORS[puntos.nivelLealtad] ?? "#00A88F",
                    }}
                  />
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Nivel {puntos.nivelLealtad}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Faltan{" "}
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {puntos.pvParaSiguienteNivel} PV
                  </span>{" "}
                  para{" "}
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {puntos.siguienteNivel}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
            Recompensas Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {puntos.recompensasDisponibles.map((reward) => (
              <div
                key={reward.id}
                className="flex flex-col justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700 hover:border-[#00A88F]/30 dark:hover:border-[#00C9A7]/30 transition-colors"
              >
                <div className="mb-3">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {reward.nombre}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-2"
                  >
                    {reward.pvCosto} PV
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 text-[#00A88F] border-[#00A88F]/30 hover:bg-[#00A88F]/10 dark:text-[#00C9A7] dark:border-[#00C9A7]/30 dark:hover:bg-[#00C9A7]/10"
                  disabled={puntos.pvEsteMes < reward.pvCosto}
                >
                  <Gift className="size-3.5" />
                  Canjear
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PV History chart */}
      <ChartCard
        title="Historial de PV"
        description="Tus puntos de volumen de los ultimos 6 meses"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-zinc-200 dark:stroke-zinc-700"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                className="text-zinc-500"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-zinc-500"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-background, #fff)",
                  border: "1px solid var(--color-border, #e4e4e7)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value: any) => [`${value} PV`, "Puntos"]}
              />
              <Bar
                dataKey="pv"
                fill="#00A88F"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </motion.div>
  );
}
