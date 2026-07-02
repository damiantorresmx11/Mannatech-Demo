"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, ShoppingBag, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarWithStatus, StatusBadge } from "@/components/dashboard";
import { mockSocio } from "@/lib/mock-data";
import { formatPrecio } from "@/lib/format";

export default function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const cliente = mockSocio.clientes.find((c) => c.id === id);

  if (!cliente) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">Cliente no encontrado</p>
        <Link
          href="/socio/clientes"
          className="inline-flex items-center gap-2 mt-4 text-sm text-[#00A88F] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Volver a clientes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/socio/clientes"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#00A88F] dark:text-zinc-400 dark:hover:text-[#00C9A7] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver a clientes
        </Link>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <AvatarWithStatus
                name={cliente.nombre}
                status={cliente.estatus === "activo" ? "online" : "offline"}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {cliente.nombre}
                  </h1>
                  <StatusBadge
                    status={
                      cliente.estatus.charAt(0).toUpperCase() +
                      cliente.estatus.slice(1)
                    }
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    {cliente.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    {cliente.telefono}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="shrink-0">
                <Phone className="size-4 mr-1.5" />
                Contactar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-[#00A88F]" />
                Historial de Compras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Total acumulado
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPrecio(cliente.totalCompras)}
                </p>
              </div>
              <div className="space-y-3">
                {cliente.compras.map((compra, i) => {
                  const date = new Date(compra.fecha + "T00:00:00");
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {compra.productos.join(", ")}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                          {date.toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {formatPrecio(compra.total)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Favorite Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="size-4 text-rose-500" />
                Productos Favoritos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cliente.productosFavoritos.map((prod) => (
                  <div
                    key={prod}
                    className="flex items-center gap-3 rounded-lg border border-zinc-100 dark:border-zinc-800 p-3"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#00A88F]/10 dark:bg-[#00C9A7]/15">
                      <ShoppingBag className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {prod}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
