"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, TimelineTracker } from "@/components/dashboard";
import { Separator } from "@/components/ui/separator";
import { mockSocio } from "@/lib/mock-data";
import { formatPrecio } from "@/lib/format";

export default function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Search in both own orders and network orders
  const allPedidos = [
    ...mockSocio.pedidos.misPedidos,
    ...mockSocio.pedidos.pedidosRed,
  ];
  const pedido = allPedidos.find((p) => p.id === id);

  if (!pedido) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">Pedido no encontrado</p>
        <Link
          href="/socio/pedidos"
          className="inline-flex items-center gap-2 mt-4 text-sm text-[#00A88F] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Volver a pedidos
        </Link>
      </div>
    );
  }

  const isRedOrder = "cliente" in pedido;
  const fecha = new Date(pedido.fecha + "T00:00:00");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/socio/pedidos"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#00A88F] dark:text-zinc-400 dark:hover:text-[#00C9A7] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver a pedidos
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground flex items-center gap-2">
            <Package className="size-5 text-[#00A88F]" />
            Pedido {pedido.id}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {fecha.toLocaleDateString("es-MX", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {isRedOrder &&
              ` · Cliente: ${(pedido as any).cliente}`}
          </p>
        </div>
        <StatusBadge
          status={
            pedido.estatus.charAt(0).toUpperCase() + pedido.estatus.slice(1)
          }
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Seguimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineTracker
                steps={pedido.timeline.map((t) => ({
                  label: t.paso,
                  date: t.fecha || undefined,
                  completed: t.completado,
                }))}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Items + Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pedido.productos.map((prod, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {prod.nombre}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        Cantidad: {prod.cantidad} ×{" "}
                        {formatPrecio(prod.precio)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatPrecio(prod.cantidad * prod.precio)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total
                </span>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPrecio(pedido.total)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
