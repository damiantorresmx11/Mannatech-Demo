"use client";

import { mockAdmin } from "@/lib/mock-data";
import { DataTable } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const { configuracion } = mockAdmin;

const columns: DataTableColumn[] = [
  { key: "zona", label: "Zona" },
  {
    key: "costo",
    label: "Costo",
    render: (v: number) => (v === 0 ? "Gratis" : `$${v.toLocaleString("es-MX")}.00 MXN`),
  },
  { key: "tiempoEstimado", label: "Tiempo Estimado" },
];

export default function EnviosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/configuracion"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Configuracion
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Zonas de Envio</h1>
        <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="size-4" />
          Agregar Zona
        </Button>
      </div>

      <DataTable columns={columns} data={configuracion.envios} />
    </div>
  );
}
