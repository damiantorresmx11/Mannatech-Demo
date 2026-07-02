"use client";

import { mockCliente } from "@/lib/mock-data/cliente";
import { StatusBadge } from "@/components/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

function formatMXN(value: number): string {
  return `$${value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AutoenvioPage() {
  const { autoenvio } = mockCliente;

  const totalMensual = autoenvio.productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground">
          Mi Autoenvio
        </h1>
        <Button variant="outline" size="lg" className="gap-2 self-start">
          <Settings className="size-4" />
          Modificar autoenvio
        </Button>
      </div>

      {/* Status card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
            Estado del Autoenvio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Estado
              </p>
              <StatusBadge status={autoenvio.activo ? "Activo" : "Inactivo"} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                <CalendarDays className="size-3.5" />
                Proximo envio
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatDate(autoenvio.proximoEnvio)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                <RefreshCw className="size-3.5" />
                Frecuencia
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {autoenvio.frecuencia}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                <CreditCard className="size-3.5" />
                Metodo de pago
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {autoenvio.metodoPago}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="size-3.5" />
            {autoenvio.direccion}
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
            Productos en Autoenvio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {autoenvio.productos.map((prod, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Package className="size-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {prod.nombre}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Cantidad: {prod.cantidad} &middot;{" "}
                    {formatMXN(prod.precio)} c/u
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatMXN(prod.precio * prod.cantidad)}
              </p>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span>Total mensual</span>
            <span>{formatMXN(totalMensual)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Shipment history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
            Historial de Envios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                    Estatus
                  </th>
                </tr>
              </thead>
              <tbody>
                {autoenvio.historial.map((envio, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-100 dark:border-zinc-800/50"
                  >
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {formatDate(envio.fecha)}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {formatMXN(envio.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={
                          envio.estatus.charAt(0).toUpperCase() +
                          envio.estatus.slice(1)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
