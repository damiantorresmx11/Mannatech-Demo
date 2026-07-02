"use client";

import { mockAdmin } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, TimelineTracker } from "@/components/dashboard";
import { ArrowLeft, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const { pedidos } = mockAdmin;

const STATUS_LABELS: Record<string, string> = {
  completado: "Completado",
  en_proceso: "En Proceso",
  pendiente: "Pendiente",
  cancelado: "Cancelado",
};

export default function PedidoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pedido = pedidos.find((p) => p.id === id) ?? pedidos[0];

  const timelineSteps = pedido.timeline.map((t) => ({
    label: t.paso,
    date: t.fecha || undefined,
    completed: t.completado,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/pedidos"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Pedidos
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600">/</span>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{pedido.id}</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Pedido {pedido.id}</h1>
          <StatusBadge status={STATUS_LABELS[pedido.estatus] ?? pedido.estatus} />
        </div>
        <div className="flex gap-2">
          <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
            <Truck className="size-4" />
            Marcar como Enviado
          </Button>
          <Button variant="destructive" className="gap-1.5">
            <XCircle className="size-4" />
            Cancelar Pedido
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <Card>
            <CardHeader>
              <CardTitle>Informacion del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Nombre</span>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{pedido.cliente}</p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Email</span>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{pedido.email}</p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Telefono</span>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{pedido.telefono}</p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Direccion</span>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{pedido.direccion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items table */}
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="text-left py-2 px-3 font-medium text-zinc-600 dark:text-zinc-400">Producto</th>
                      <th className="text-right py-2 px-3 font-medium text-zinc-600 dark:text-zinc-400">Cantidad</th>
                      <th className="text-right py-2 px-3 font-medium text-zinc-600 dark:text-zinc-400">Precio</th>
                      <th className="text-right py-2 px-3 font-medium text-zinc-600 dark:text-zinc-400">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.productos.map((p, i) => (
                      <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="py-2 px-3 text-zinc-700 dark:text-zinc-300">{p.nombre}</td>
                        <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">{p.cantidad}</td>
                        <td className="py-2 px-3 text-right text-zinc-700 dark:text-zinc-300">${p.precio.toLocaleString("es-MX")}.00</td>
                        <td className="py-2 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100">
                          ${(p.precio * p.cantidad).toLocaleString("es-MX")}.00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                  <span className="text-zinc-700 dark:text-zinc-300">${pedido.subtotal.toLocaleString("es-MX")}.00 MXN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Envio</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {pedido.envio === 0 ? "Gratis" : `$${pedido.envio.toLocaleString("es-MX")}.00 MXN`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Impuestos (IVA)</span>
                  <span className="text-zinc-700 dark:text-zinc-300">${pedido.impuestos.toLocaleString("es-MX")}.00 MXN</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-zinc-200 pt-2 dark:border-zinc-700">
                  <span className="text-zinc-900 dark:text-zinc-100">Total</span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    ${(pedido.subtotal + pedido.envio + pedido.impuestos).toLocaleString("es-MX")}.00 MXN
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Timeline + Payment */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineTracker steps={timelineSteps} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informacion de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Metodo</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{pedido.metodoPago}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Fecha</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{pedido.fecha}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Total</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">${pedido.total.toLocaleString("es-MX")}.00 MXN</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
