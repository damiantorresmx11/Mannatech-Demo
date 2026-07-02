"use client";

import { use } from "react";
import { mockCliente } from "@/lib/mock-data/cliente";
import { TimelineTracker, StatusBadge } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  RefreshCw,
  Truck,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
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

function getTimelineSteps(estatus: string) {
  const statusOrder = ["confirmado", "procesando", "enviado", "entregado"];
  const statusMap: Record<string, number> = {
    confirmado: 0,
    procesando: 1,
    "en camino": 2,
    enviado: 2,
    entregado: 3,
    cancelado: -1,
  };

  const currentIdx = statusMap[estatus] ?? 0;

  if (estatus === "cancelado") {
    return [
      { label: "Confirmado", description: "Pedido recibido", completed: true },
      { label: "Cancelado", description: "Pedido cancelado por el cliente", completed: false },
    ];
  }

  return statusOrder.map((status, i) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    description:
      i === 0
        ? "Pedido recibido"
        : i === 1
          ? "Preparando tu pedido"
          : i === 2
            ? "En camino a tu direccion"
            : "Entregado con exito",
    completed: i <= currentIdx,
  }));
}

export default function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pedido = mockCliente.pedidos.find((p) => p.id === id);

  if (!pedido) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Link
          href="/cuenta/pedidos"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-[#00A88F] dark:text-zinc-400 dark:hover:text-[#00C9A7] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver a pedidos
        </Link>
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            Pedido no encontrado
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayStatus =
    pedido.estatus.charAt(0).toUpperCase() + pedido.estatus.slice(1);

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back button */}
      <Link
        href="/cuenta/pedidos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-[#00A88F] dark:text-zinc-400 dark:hover:text-[#00C9A7] transition-colors"
      >
        <ArrowLeft className="size-4" />
        Volver a pedidos
      </Link>

      {/* Order header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground">
            Pedido {pedido.id}
          </h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {formatDate(pedido.fecha)}
            </span>
            <StatusBadge status={displayStatus} />
          </div>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 self-start"
        >
          <RefreshCw className="size-4" />
          Reordenar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
              Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineTracker steps={getTimelineSteps(pedido.estatus)} />
          </CardContent>
        </Card>

        {/* Items + Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
              Productos del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items list */}
            <div className="space-y-3">
              {pedido.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <Package className="size-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {formatMXN(item.precio * item.cantidad)}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>{formatMXN(pedido.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                <span>Envio</span>
                <span>
                  {pedido.envio === 0 ? (
                    <span className="text-[#00A88F] dark:text-[#00C9A7] font-medium">
                      Gratis
                    </span>
                  ) : (
                    formatMXN(pedido.envio)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
                <span>Total</span>
                <span>{formatMXN(pedido.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
