"use client";

import { mockAdmin } from "@/lib/mock-data";
import { DataTable, StatusBadge } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const { marketing } = mockAdmin;

const columns: DataTableColumn[] = [
  {
    key: "codigo",
    label: "Codigo",
    render: (v: string) => (
      <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{v}</span>
    ),
  },
  {
    key: "descuento",
    label: "Descuento",
    render: (v: number, row: any) =>
      row.tipo === "envio_gratis" ? "Envio gratis" : `${v}%`,
  },
  {
    key: "tipo",
    label: "Tipo",
    render: (v: string) => {
      const labels: Record<string, string> = {
        porcentaje: "Porcentaje",
        envio_gratis: "Envio Gratis",
      };
      return labels[v] ?? v;
    },
  },
  {
    key: "usos",
    label: "Usos / Limite",
    render: (v: number, row: any) => `${v} / ${row.limite}`,
  },
  {
    key: "vigenciaInicio",
    label: "Vigencia",
    render: (_: string, row: any) => `${row.vigenciaInicio} - ${row.vigenciaFin}`,
  },
  {
    key: "activo",
    label: "Activo",
    render: (v: boolean) => (
      <div className="flex items-center gap-2">
        <div className={`size-3 rounded-full ${v ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />
        <span className="text-sm">{v ? "Si" : "No"}</span>
      </div>
    ),
  },
];

export default function CuponesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/marketing"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Marketing
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Cupones</h1>
        <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="size-4" />
          Nuevo Cupon
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={marketing.cupones}
        searchable
        searchPlaceholder="Buscar por codigo..."
      />
    </div>
  );
}
