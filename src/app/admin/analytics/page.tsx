"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
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

type Period = "today" | "7d" | "30d";

interface AnalyticsData {
  period: string;
  stats: {
    pageviews: { value: number };
    visitors: { value: number };
    visits: { value: number };
    bounces: { value: number };
    totaltime: { value: number };
  };
  pageviews: {
    pageviews: Array<{ x: string; y: number }>;
    sessions: Array<{ x: string; y: number }>;
  };
  topPages: Array<{ x: string; y: number }>;
  referrers: Array<{ x: string; y: number }>;
  browsers: Array<{ x: string; y: number }>;
  devices: Array<{ x: string; y: number }>;
  countries: Array<{ x: string; y: number }>;
}

const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
];

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#f43f5e", "#84cc16"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/tools/analytics?period=${period}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const bounceRate =
    data && data.stats.visits.value > 0
      ? Math.round((data.stats.bounces.value / data.stats.visits.value) * 100)
      : 0;

  const avgTime =
    data && data.stats.visits.value > 0
      ? Math.round(data.stats.totaltime.value / data.stats.visits.value)
      : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const kpis = data
    ? [
        { label: "Visitantes", value: (data?.stats?.visitors?.value || 0).toLocaleString() },
        { label: "Paginas Vistas", value: (data?.stats?.pageviews?.value || 0).toLocaleString() },
        { label: "Sesiones", value: (data?.stats?.visits?.value || 0).toLocaleString() },
        { label: "Tasa de Rebote", value: `${bounceRate}%` },
        { label: "Tiempo Promedio", value: formatTime(avgTime) },
      ]
    : [];

  const chartData =
    data?.pageviews?.pageviews?.map((item, i) => ({
      date: item.x,
      pageviews: item.y,
      sessions: data.pageviews.sessions[i]?.y || 0,
    })) || [];

  return (
    <div className="min-h-screen bg-zinc-950 p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <div className="flex bg-zinc-800 rounded-lg p-1">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  period === p.key
                    ? "bg-indigo-600 text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div variants={itemVariants} className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
            {error}
          </motion.div>
        )}

        {/* Loading */}
        {loading && !data && (
          <motion.div variants={itemVariants} className="text-zinc-400 text-center py-20">
            Cargando datos...
          </motion.div>
        )}

        {data && (
          <>
            {/* KPIs */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                >
                  <p className="text-zinc-400 text-xs uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Line Chart */}
            <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-sm font-medium text-zinc-300 mb-4">Paginas Vistas</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                    <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#a1a1aa" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pageviews"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={false}
                      name="Paginas Vistas"
                    />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      name="Sesiones"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Grid: Tables + Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-sm font-medium text-zinc-300 mb-4">Top 10 Paginas</h2>
                <div className="space-y-2">
                  {(Array.isArray(data?.topPages) ? data.topPages : []).slice(0, 10).map((page, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-800 last:border-0">
                      <span className="text-sm text-zinc-300 truncate max-w-[70%]">{page.x || "(none)"}</span>
                      <span className="text-sm font-medium text-white">{page.y}</span>
                    </div>
                  ))}
                  {(Array.isArray(data?.topPages) ? data.topPages : []).length === 0 && (
                    <p className="text-zinc-500 text-sm">Sin datos</p>
                  )}
                </div>
              </motion.div>

              {/* Referrers */}
              <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-sm font-medium text-zinc-300 mb-4">Referrers</h2>
                <div className="space-y-2">
                  {(Array.isArray(data?.referrers) ? data.referrers : []).slice(0, 10).map((ref, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-800 last:border-0">
                      <span className="text-sm text-zinc-300 truncate max-w-[70%]">{ref.x || "(directo)"}</span>
                      <span className="text-sm font-medium text-white">{ref.y}</span>
                    </div>
                  ))}
                  {(Array.isArray(data?.referrers) ? data.referrers : []).length === 0 && (
                    <p className="text-zinc-500 text-sm">Sin datos</p>
                  )}
                </div>
              </motion.div>

              {/* Browsers Donut */}
              <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-sm font-medium text-zinc-300 mb-4">Navegadores</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                    <PieChart>
                      <Pie
                        data={(Array.isArray(data?.browsers) ? data.browsers : []).map((b) => ({ name: b.x || "Otro", value: b.y }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {(Array.isArray(data?.browsers) ? data.browsers : []).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #3f3f46",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Devices Donut */}
              <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-sm font-medium text-zinc-300 mb-4">Dispositivos</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                    <PieChart>
                      <Pie
                        data={(Array.isArray(data?.devices) ? data.devices : []).map((d) => ({ name: d.x || "Otro", value: d.y }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {(Array.isArray(data?.devices) ? data.devices : []).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #3f3f46",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Countries */}
            <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-sm font-medium text-zinc-300 mb-4">Paises</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {(Array.isArray(data?.countries) ? data.countries : []).map((country, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-zinc-300">{country.x || "Desconocido"}</span>
                    <span className="text-sm font-medium text-white">{country.y}</span>
                  </div>
                ))}
                {(Array.isArray(data?.countries) ? data.countries : []).length === 0 && (
                  <p className="text-zinc-500 text-sm col-span-full">Sin datos</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
