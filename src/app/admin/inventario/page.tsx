"use client";

import { mockAdmin } from "@/lib/mock-data";
import { DataTable, StatusBadge } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const { inventario } = mockAdmin;

const alertasCriticas = inventario.filter((i) => i.nivel === "critico");
const alertasBajas = inventario.filter((i) => i.nivel === "bajo");

const columns: DataTableColumn[] = [
  { key: "producto", label: "Producto" },
  { key: "stockActual", label: "Stock Actual" },
  { key: "stockMinimo", label: "Stock Minimo" },
  {
    key: "nivel",
    label: "Nivel",
    render: (v: string) => {
      const labels: Record<string, string> = {
        critico: "Critico",
        bajo: "Bajo",
        normal: "Normal",
      };
      const variants: Record<string, "danger" | "warning" | "success"> = {
        critico: "danger",
        bajo: "warning",
        normal: "success",
      };
      return <StatusBadge status={labels[v] ?? v} variant={variants[v]} />;
    },
  },
  { key: "ultimoRestock", label: "Ultimo Restock" },
];

export default function InventarioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Inventario</h1>

      {/* Alert cards */}
      {(alertasCriticas.length > 0 || alertasBajas.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {alertasCriticas.map((a, i) => (
            <Card key={`c-${i}`} className="border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
              <CardContent className="pt-1">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-5 text-red-500 shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-300">{a.producto}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Stock critico: {a.stockActual} unidades (min: {a.stockMinimo})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {alertasBajas.map((a, i) => (
            <Card key={`b-${i}`} className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
              <CardContent className="pt-1">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-300">{a.producto}</p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Stock bajo: {a.stockActual} unidades (min: {a.stockMinimo})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table with color-coded rows */}
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
            {inventario.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-zinc-100 transition-colors dark:border-zinc-800/50",
                  row.nivel === "critico" && "bg-red-50/60 dark:bg-red-950/20",
                  row.nivel === "bajo" && "bg-amber-50/60 dark:bg-amber-950/20",
                  row.nivel === "normal" && "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {col.render
                      ? col.render(row[col.key as keyof typeof row], row)
                      : (row[col.key as keyof typeof row] as string) ?? "---"}
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
