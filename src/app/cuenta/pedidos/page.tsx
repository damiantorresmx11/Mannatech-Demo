"use client";

import { mockCliente } from "@/lib/mock-data/cliente";
import { DataTable } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";
import { StatusBadge } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function PedidosPage() {
  const router = useRouter();

  const columns: DataTableColumn[] = [
    {
      key: "id",
      label: "ID Pedido",
      render: (value: string) => (
        <span className="font-medium text-[#00A88F] dark:text-[#00C9A7]">
          {value}
        </span>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (value: string) => formatDate(value),
    },
    {
      key: "items",
      label: "Productos",
      render: (_: unknown, row: (typeof mockCliente.pedidos)[number]) =>
        `${row.items.length} producto${row.items.length !== 1 ? "s" : ""}`,
    },
    {
      key: "total",
      label: "Total",
      render: (value: number) => (
        <span className="font-medium">{formatMXN(value)}</span>
      ),
    },
    {
      key: "estatus",
      label: "Estatus",
      render: (value: string) => {
        // Capitalize first letter for display
        const display = value.charAt(0).toUpperCase() + value.slice(1);
        return <StatusBadge status={display} />;
      },
    },
  ];

  // Map data so each row is clickable
  const data = mockCliente.pedidos.map((pedido) => ({
    ...pedido,
    onClick: () => router.push(`/cuenta/pedidos/${pedido.id}`),
  }));

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground mb-6">
        Mis Pedidos
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
            Historial de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="[&_tr]:cursor-pointer" onClick={(e) => {
            // Delegate click to row
            const target = e.target as HTMLElement;
            const row = target.closest("tr");
            if (!row) return;
            const rowIdx = row.rowIndex - 1; // subtract header row
            if (rowIdx >= 0 && rowIdx < data.length) {
              data[rowIdx].onClick();
            }
          }}>
            <DataTable
              columns={columns}
              data={data}
              searchable
              searchPlaceholder="Buscar por ID de pedido..."
              pageSize={5}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
