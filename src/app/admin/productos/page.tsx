"use client";

import { mockAdmin } from "@/lib/mock-data";
import { DataTable, StatusBadge } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { useRouter } from "next/navigation";

const { productos } = mockAdmin;

export default function ProductosPage() {
  const router = useRouter();

  const columns: DataTableColumn[] = [
    {
      key: "nombre",
      label: "Producto",
      render: (_: string, row: (typeof productos)[0]) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <Package className="size-5 text-zinc-400" />
          </div>
          <span className="font-medium">{row.nombre}</span>
        </div>
      ),
    },
    { key: "sku", label: "SKU" },
    { key: "categoria", label: "Categoria" },
    {
      key: "precio",
      label: "Precio",
      render: (v: number) => `$${v.toLocaleString("es-MX")}.00 MXN`,
    },
    { key: "stock", label: "Stock" },
    { key: "ventas30d", label: "Ventas 30d" },
    {
      key: "estatus",
      label: "Estatus",
      render: (v: string) => {
        const labels: Record<string, string> = {
          activo: "Activo",
          pausado: "Pausado",
          agotado: "Agotado",
        };
        return <StatusBadge status={labels[v] ?? v} />;
      },
    },
  ];

  const dataWithClick = productos.map((p) => ({
    ...p,
    _onClick: () => router.push(`/admin/productos/${p.id}`),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Productos</h1>
        <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="size-4" />
          Agregar Producto
        </Button>
      </div>

      <div className="overflow-x-auto">
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
            {dataWithClick.map((row, i) => (
              <tr
                key={row.id}
                onClick={row._onClick}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50 cursor-pointer"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {col.render ? col.render(row[col.key as keyof typeof row], row) : (row[col.key as keyof typeof row] as string) ?? "---"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
