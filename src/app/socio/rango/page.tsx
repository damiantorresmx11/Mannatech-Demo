"use client";

import { motion } from "framer-motion";
import { Trophy, Star, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/dashboard";
import { mockSocio } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function RangoPage() {
  const { rango } = mockSocio;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground">
          Rango y Metas
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Tu progreso hacia el siguiente nivel
        </p>
      </motion.div>

      {/* Current Rank + Progress Ring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-1">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Current rank badge */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-400 dark:from-amber-700 dark:to-amber-500 shadow-lg">
                  <Trophy className="size-10 text-amber-800 dark:text-amber-100" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {rango.actual}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Rango actual
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex items-center">
                <ArrowRight className="size-6 text-zinc-300 dark:text-zinc-600" />
              </div>

              {/* Progress Ring */}
              <div className="flex flex-col items-center gap-2">
                <ProgressRing
                  value={rango.progresoGeneral}
                  size={120}
                  strokeWidth={8}
                  color="#D4A853"
                />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Progreso general
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex items-center">
                <ArrowRight className="size-6 text-zinc-300 dark:text-zinc-600" />
              </div>

              {/* Next rank */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 dark:from-yellow-600 dark:to-amber-400 shadow-lg opacity-60">
                  <Star className="size-10 text-yellow-800 dark:text-yellow-100" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {rango.siguiente}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Siguiente rango
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Requirements Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Requisitos para {rango.siguiente}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rango.requisitos.map((req, i) => {
                const progress = Math.min(
                  100,
                  Math.round((req.actual / req.requerido) * 100)
                );

                return (
                  <motion.div
                    key={req.nombre}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    className={cn(
                      "rounded-xl border p-4 transition-all",
                      req.cumplido
                        ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/20"
                        : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {req.cumplido ? (
                          <CheckCircle2 className="size-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="size-5 text-zinc-300 dark:text-zinc-600 shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {req.nombre}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-xs font-bold",
                          req.cumplido
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        )}
                      >
                        {progress}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                        className={cn(
                          "h-full rounded-full",
                          req.cumplido
                            ? "bg-emerald-500 dark:bg-emerald-400"
                            : "bg-amber-500 dark:bg-amber-400"
                        )}
                      />
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {req.actual.toLocaleString("es-MX")} /{" "}
                      {req.requerido.toLocaleString("es-MX")} {req.unidad}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Rank Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="border-amber-200 dark:border-amber-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Star className="size-5" />
              Beneficios de {rango.siguiente}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rango.beneficiosSiguienteRango.map((beneficio, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3"
                >
                  <Star className="size-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {beneficio}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
