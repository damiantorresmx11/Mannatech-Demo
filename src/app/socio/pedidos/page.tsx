"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, StatusBadge, type DataTableColumn } from "@/components/dashboard";
import { mockSocio } from "@/lib/mock-data";
import { formatPrecio } from "@/lib/format";

export default function PedidosPage() {
  const { pedidos } = mockSocio;

  const misPedidosColumns: DataTableColumn[] = [
    {
      key: "id",
      label: "ID",
      render: (value: string, row: any) => (
        <Link
          href={`/socio/pedidos/${value}`}
          className="font-medium text-[#00A88F] hover:underline dark:text-[#00C9A7]"
        >
          {value}
        </Link>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (value: string) => {
        const date = new Date(value + "T00:00:00");
        return date.toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      key: "total",
      label: "Total",
      render: (value: number) => (
        <span className="font-semibold">{formatPrecio(value)}</span>
      ),
    },
    {
      key: "estatus",
      label: "Estatus",
      render: (value: string) => (
        <StatusBadge status={value.charAt(0).toUpperCase() + value.slice(1)} />
      ),
    },
  ];

  const pedidosRedColumns: DataTableColumn[] = [
    {
      key: "id",
      label: "ID",
      render: (value: string) => (
        <Link
          href={`/socio/pedidos/${value}`}
          className="font-medium text-[#00A88F] hover:underline dark:text-[#00C9A7]"
        >
          {value}
        </Link>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (value: string) => {
        const date = new Date(value + "T00:00:00");
        return date.toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      key: "cliente",
      label: "Cliente",
    },
    {
      key: "total",
      label: "Total",
      render: (value: number) => (
        <span className="font-semibold">{formatPrecio(value)}</span>
      ),
    },
    {
      key: "estatus",
      label: "Estatus",
      render: (value: string) => (
        <StatusBadge status={value.charAt(0).toUpperCase() + value.slice(1)} />
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground flex items-center gap-2">
          <Package className="size-6 text-[#00A88F]" />
          Pedidos
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Rastrea tus pedidos y los de tu red
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="mis-pedidos">
          <TabsList>
            <TabsTrigger value="mis-pedidos">Mis Pedidos</TabsTrigger>
            <TabsTrigger value="pedidos-red">Pedidos de mi Red</TabsTrigger>
          </TabsList>

          <TabsContent value="mis-pedidos" className="mt-4">
            <DataTable
              columns={misPedidosColumns}
              data={pedidos.misPedidos}
              pageSize={10}
            />
          </TabsContent>

          <TabsContent value="pedidos-red" className="mt-4">
            <DataTable
              columns={pedidosRedColumns}
              data={pedidos.pedidosRed}
              pageSize={10}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
