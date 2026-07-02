"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Zap, ChevronRight } from "lucide-react";
import { StatsCard, AvatarWithStatus } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockSocio } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface MiembroNodo {
  id: string;
  nombre: string;
  rango: string;
  pvPersonal: number;
  activo: boolean;
  nivel: number;
  avatar: string | null;
  hijos: MiembroNodo[];
}

const NIVEL_COLORS: Record<number, { border: string; bg: string; label: string }> = {
  1: {
    border: "border-l-[#00A88F]",
    bg: "bg-[#00A88F]/5 dark:bg-[#00C9A7]/10",
    label: "bg-[#00A88F]/10 text-[#00A88F] dark:bg-[#00C9A7]/15 dark:text-[#00C9A7]",
  },
  2: {
    border: "border-l-blue-500",
    bg: "bg-blue-50/50 dark:bg-blue-900/10",
    label: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  3: {
    border: "border-l-purple-500",
    bg: "bg-purple-50/50 dark:bg-purple-900/10",
    label: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

function TreeNode({ node, depth = 0 }: { node: MiembroNodo; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.hijos.length > 0;
  const nivelStyle = NIVEL_COLORS[node.nivel] || NIVEL_COLORS[3];

  return (
    <div className={cn("relative", depth > 0 && "ml-4 sm:ml-8")}>
      {/* Connecting line */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700 -ml-4 sm:-ml-8" />
      )}

      <div
        className={cn(
          "relative rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 sm:p-4 mb-2 transition-all duration-200 hover:shadow-sm",
          nivelStyle.bg,
          "border-l-4",
          nivelStyle.border
        )}
      >
        {/* Horizontal connector */}
        {depth > 0 && (
          <div className="absolute left-0 top-5 w-4 sm:w-8 h-px bg-zinc-200 dark:bg-zinc-700 -ml-4 sm:-ml-8" />
        )}

        <div className="flex items-center gap-3">
          {/* Expand toggle */}
          {hasChildren && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              aria-label={expanded ? "Colapsar" : "Expandir"}
            >
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-200",
                  expanded && "rotate-90"
                )}
              />
            </button>
          )}
          {!hasChildren && <div className="w-7 shrink-0" />}

          {/* Avatar */}
          <AvatarWithStatus
            name={node.nombre}
            status={node.activo ? "online" : "offline"}
            size="sm"
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {node.nombre}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  nivelStyle.label
                )}
              >
                Nivel {node.nivel}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{node.rango}</span>
              <span className="font-medium">{node.pvPersonal} PV</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1",
                  node.activo
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    node.activo
                      ? "bg-emerald-500 dark:bg-emerald-400"
                      : "bg-red-500 dark:bg-red-400"
                  )}
                />
                {node.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          {/* Children count */}
          {hasChildren && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
              <Users className="size-3" />
              {node.hijos.length}
            </span>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
        >
          {node.hijos.map((hijo) => (
            <TreeNode key={hijo.id} node={hijo} depth={depth + 1} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function RedPage() {
  const { red } = mockSocio;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground">
          Mi Red / Genealogia
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Visualiza y gestiona tu estructura de red
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCard
            title="Total Miembros"
            value={red.totalMiembros}
            icon={Users}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatsCard
            title="Activos"
            value={red.activos}
            icon={UserCheck}
            change={Math.round((red.activos / red.totalMiembros) * 100)}
            trend="up"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard
            title="PV Grupal Total"
            value={`${red.pvGrupalTotal.toLocaleString("es-MX")} PV`}
            icon={Zap}
          />
        </motion.div>
      </div>

      {/* Tree */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Estructura de Red</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {red.arbol.map((miembro) => (
                <TreeNode key={miembro.id} node={miembro} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
