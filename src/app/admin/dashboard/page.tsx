"use client";

import { useEffect, useState, useRef } from "react";
import { mockAdmin } from "@/lib/mock-data";
import { StatsCard, ChartCard } from "@/components/dashboard";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
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
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  LayoutGrid,
  Zap,
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
  AreaChart,
  Area,
} from "recharts";
import { getProducts, getOrders, getCustomers } from "@/lib/medusa-admin";
import { motion } from "framer-motion";
import Link from "next/link";

const { ventasHistorial, ventasPorCategoria, actividadReciente, kpis } = mockAdmin;

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const cardHover = {
  y: -4,
  transition: { duration: 0.2, ease: "easeOut" as const },
};

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number>(undefined);

  useEffect(() => {
    if (target === 0) return;
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [target, duration]);

  return count;
}

// Mini sparkline component
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const sparkData = data.map((v, i) => ({ v, i }));
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sparkData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color.replace("#", "")})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Glass KPI Card
function GlassKPICard({
  title,
  value,
  formattedValue,
  delta,
  trend,
  icon: Icon,
  sparklineData,
  color = "#00A88F",
  prefix = "",
  suffix = "",
}: {
  title: string;
  value: number;
  formattedValue?: string;
  delta: number;
  trend: "up" | "down";
  icon: any;
  sparklineData: number[];
  color?: string;
  prefix?: string;
  suffix?: string;
}) {
  const animatedValue = useAnimatedCounter(value);
  const isPositive = delta >= 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={cardHover}
      className="relative overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-xl p-5 shadow-lg shadow-black/10 transition-colors hover:border-zinc-600/60"
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top right, ${color}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50">
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <MiniSparkline data={sparklineData} color={color} />
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-zinc-50 tabular-nums">
            {formattedValue
              ? formattedValue.replace(
                  /[\d,]+/,
                  animatedValue.toLocaleString("es-MX")
                )
              : `${prefix}${animatedValue.toLocaleString("es-MX")}${suffix}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
          )}
          <span
            className={`text-xs font-semibold ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {delta}%
          </span>
          <span className="text-xs text-zinc-500">vs mes anterior</span>
        </div>
      </div>
    </motion.div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

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

  // Generate sparkline data from ventas historial
  const ventasSparkline = ventasHistorial.map((v) => v.actual);
  const anteriorSparkline = ventasHistorial.map((v) => v.anterior);

  const quickActions = [
    { label: "Productos", href: "/admin/productos", icon: Package, color: "#00A88F" },
    { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart, color: "#3B82F6" },
    { label: "Paginas", href: "/admin/paginas", icon: FileText, color: "#8B5CF6" },
    { label: "Usuarios", href: "/admin/usuarios", icon: Users, color: "#F59E0B" },
  ];

  return (
    <motion.div
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-zinc-50">
          {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-[#00A88F] to-emerald-400 bg-clip-text text-transparent">
            Admin
          </span>
        </h1>
        <p className="text-sm text-zinc-400">
          Aqui esta el resumen de tu negocio hoy, {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <GlassKPICard
          title="Productos"
          value={loading ? 0 : stats.products}
          delta={5.2}
          trend="up"
          icon={Package}
          sparklineData={[8, 10, 9, 12, 11, 14, 13, 15]}
          color="#00A88F"
        />
        <GlassKPICard
          title="Pedidos"
          value={loading ? 0 : stats.orders}
          delta={kpis.pedidosDelta}
          trend={kpis.pedidosDelta >= 0 ? "up" : "down"}
          icon={ShoppingCart}
          sparklineData={[15, 18, 22, 19, 25, 23, 20, 23]}
          color="#3B82F6"
        />
        <GlassKPICard
          title="Clientes"
          value={loading ? 0 : stats.customers}
          delta={kpis.usuariosDelta}
          trend="up"
          icon={Users}
          sparklineData={[30, 35, 38, 42, 45, 50, 55, 58]}
          color="#8B5CF6"
        />
        <GlassKPICard
          title="Ventas del Mes"
          value={kpis.ventasMes}
          prefix="$"
          delta={kpis.ventasMesDelta}
          trend="up"
          icon={TrendingUp}
          sparklineData={ventasSparkline.slice(-8)}
          color="#00A88F"
        />
        <GlassKPICard
          title="Socios Activos"
          value={kpis.sociosActivos}
          delta={kpis.sociosDelta}
          trend="up"
          icon={UserPlus}
          sparklineData={[280, 290, 300, 310, 320, 330, 338, 342]}
          color="#F59E0B"
        />
        <GlassKPICard
          title="Tickets Abiertos"
          value={kpis.ticketsAbiertos}
          delta={kpis.ticketsDelta}
          trend="down"
          icon={Headphones}
          sparklineData={[12, 10, 9, 11, 8, 9, 7, 7]}
          color="#EF4444"
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-lg shadow-black/10"
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-zinc-100">Ventas Ultimos 12 Meses</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Comparativa ano actual vs anterior</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ventasHistorial}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00A88F" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString("es-MX")} MXN`, ""]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #3f3f46",
                  backgroundColor: "#18181b",
                  fontSize: "12px",
                  color: "#fafafa",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                }}
                labelStyle={{ color: "#a1a1aa" }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="url(#lineGradient)"
                strokeWidth={2.5}
                dot={{ fill: "#00A88F", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#00A88F", stroke: "#18181b", strokeWidth: 2 }}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="anterior"
                stroke="#52525b"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="Anterior"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-lg shadow-black/10"
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-zinc-100">Ventas por Categoria</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Distribucion del mes actual</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ventasPorCategoria}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={55}
                paddingAngle={3}
                cornerRadius={4}
                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={10}
              >
                {ventasPorCategoria.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString("es-MX")} MXN`, ""]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #3f3f46",
                  backgroundColor: "#18181b",
                  fontSize: "12px",
                  color: "#fafafa",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Bottom Row: Activity + Quick Actions */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 rounded-2xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-lg shadow-black/10"
        >
          <h3 className="text-base font-semibold text-zinc-100 mb-5">Actividad Reciente</h3>
          <div className="relative space-y-0">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-zinc-700 via-zinc-800 to-transparent" />

            {actividadReciente.map((item, i) => {
              const Icon = ICON_MAP[item.icono] || CheckCircle;
              const typeColors: Record<string, string> = {
                pedido: "#00A88F",
                usuario: "#3B82F6",
                pago: "#10B981",
                soporte: "#F59E0B",
                inventario: "#EF4444",
                comision: "#8B5CF6",
                marketing: "#EC4899",
              };
              const dotColor = typeColors[item.tipo] || "#71717a";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                  className="relative flex items-start gap-4 py-3 group"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-[31px] h-[31px] rounded-full flex items-center justify-center border-2 bg-zinc-950 transition-all group-hover:scale-110"
                      style={{ borderColor: dotColor }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: dotColor }} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-zinc-200 leading-snug">{item.mensaje}</p>
                    <p className="text-xs text-zinc-500 mt-1">{item.tiempo}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-lg shadow-black/10"
        >
          <h3 className="text-base font-semibold text-zinc-100 mb-5">Acciones Rapidas</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <Link
                  href={action.href}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-zinc-700/50 bg-zinc-800/40 hover:bg-zinc-800/80 hover:border-zinc-600/60 transition-all group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                    {action.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Extra stats summary */}
          <div className="mt-6 pt-5 border-t border-zinc-800">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              Resumen Rapido
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Ventas hoy</span>
                <span className="text-sm font-semibold text-zinc-100">
                  ${kpis.ventasHoy.toLocaleString("es-MX")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Pedidos nuevos</span>
                <span className="text-sm font-semibold text-zinc-100">{kpis.pedidosNuevos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Usuarios nuevos</span>
                <span className="text-sm font-semibold text-zinc-100">{kpis.usuariosNuevos}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
