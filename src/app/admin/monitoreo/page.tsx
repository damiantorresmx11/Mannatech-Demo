"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

interface Monitor {
  name: string
  url: string
  type: string
  status: "up" | "down"
  responseTime: number
  httpCode: number | null
  checkedAt: string
}

interface UptimeData {
  summary: {
    up: number
    total: number
    allUp: boolean
    checkedAt: string
  }
  monitors: Monitor[]
}

export default function MonitoreoPage() {
  const [data, setData] = useState<UptimeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/tools/uptime")
      const json = await res.json()
      setData(json)
      setLastRefresh(new Date())
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const item = {
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
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Monitoreo de Servicios</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Estado en tiempo real de la infraestructura
            </p>
          </div>

          {data && (
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${
                  data.summary.allUp
                    ? "bg-green-950/40 border-green-800/50"
                    : "bg-red-950/40 border-red-800/50"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    data.summary.allUp ? "bg-green-400 animate-pulse" : "bg-red-400 animate-pulse"
                  }`}
                />
                <span
                  className={`text-lg font-semibold ${
                    data.summary.allUp ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {data.summary.up}/{data.summary.total} servicios activos
                </span>
              </div>

              {lastRefresh && (
                <span className="text-xs text-zinc-500">
                  Actualizado: {lastRefresh.toLocaleTimeString("es-MX")}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && !data && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-green-400 rounded-full animate-spin" />
          <span className="ml-3 text-zinc-400">Verificando servicios...</span>
        </div>
      )}

      {/* Monitor Grid */}
      {data && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {data.monitors.map((monitor) => (
            <motion.div
              key={monitor.name}
              variants={item}
              className={`relative overflow-hidden rounded-xl border p-5 transition-colors ${
                monitor.status === "up"
                  ? "bg-zinc-900/80 border-zinc-800 hover:border-green-800/60"
                  : "bg-zinc-900/80 border-red-900/60 hover:border-red-700/60"
              }`}
            >
              {/* Status glow */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 ${
                  monitor.status === "up" ? "bg-green-500" : "bg-red-500"
                }`}
              />

              <div className="relative">
                {/* Top row: name + status */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-zinc-100 font-semibold text-base">{monitor.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        monitor.status === "up"
                          ? "bg-green-900/60 text-green-300"
                          : "bg-red-900/60 text-red-300"
                      }`}
                    >
                      {monitor.status === "up" ? "Activo" : "Caido"}
                    </span>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        monitor.status === "up" ? "bg-green-400" : "bg-red-400"
                      }`}
                    />
                  </div>
                </div>

                {/* URL */}
                <p className="text-zinc-500 text-xs font-mono truncate mb-4">{monitor.url}</p>

                {/* Metrics row */}
                <div className="flex items-center gap-4 text-sm">
                  {/* Response time */}
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span
                      className={`font-mono ${
                        monitor.responseTime < 500
                          ? "text-green-400"
                          : monitor.responseTime < 2000
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {monitor.responseTime}ms
                    </span>
                  </div>

                  {/* HTTP Code */}
                  {monitor.httpCode !== null && (
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5 text-zinc-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span
                        className={`font-mono ${
                          monitor.httpCode < 300
                            ? "text-green-400"
                            : monitor.httpCode < 400
                              ? "text-blue-400"
                              : "text-red-400"
                        }`}
                      >
                        HTTP {monitor.httpCode}
                      </span>
                    </div>
                  )}

                  {/* Type badge */}
                  <span className="text-zinc-600 text-xs uppercase ml-auto">
                    {monitor.type}
                  </span>
                </div>

                {/* Timestamp */}
                <p className="text-zinc-600 text-xs mt-3">
                  {new Date(monitor.checkedAt).toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-zinc-600 text-xs">
          Auto-refresh cada 30 segundos
        </p>
      </motion.div>
    </div>
  )
}
