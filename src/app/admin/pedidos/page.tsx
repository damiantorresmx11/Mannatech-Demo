"use client";

import { useState } from "react";
import { mockAdmin } from "@/lib/mock-data";
import { StatusBadge } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const { pedidos } = mockAdmin;

const STATUS_LABELS: Record<string, string> = {
  completado: "Completado",
  en_proceso: "En Proceso",
  pendiente: "Pendiente",
  cancelado: "Cancelado",
};

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "pendiente", label: "Pendientes" },
  { key: "en_proceso", label: "En Proceso" },
  { key: "completado", label: "Completados" },
  { key: "cancelado", label: "Cancelados" },
];

const columns: DataTableColumn[] = [
  { key: "id", label: "ID" },
  { key: "fecha", label: "Fecha" },
  { key: "cliente", label: "Cliente" },
  { key: "items", label: "Items" },
  { key: "total", label: "Total", render: (v: number) => `$${v.toLocaleString("es-MX")}.00 MXN` },
  { key: "metodoPago", label: "Metodo Pago" },
  {
    key: "estatus",
    label: "Estatus",
    render: (v: string) => <StatusBadge status={STATUS_LABELS[v] ?? v} />,
  },
];

export default function PedidosPage() {
  const [filter, setFilter] = useState("todos");
  const router = useRouter();

  const filtered = filter === "todos" ? pedidos : pedidos.filter((p) => p.estatus === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Pedidos</h1>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              filter === f.key
                ? "bg-[#00A88F] text-white dark:bg-[#00C9A7]"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-zinc-400">
                  No hay pedidos en esta categoria
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/admin/pedidos/${row.id}`)}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50 cursor-pointer"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {col.render
                        ? col.render(row[col.key as keyof typeof row], row)
                        : (row[col.key as keyof typeof row] as string) ?? "---"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
