"use client";

import { mockAdmin } from "@/lib/mock-data";
import { StatsCard, DataTable, StatusBadge } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle, CreditCard } from "lucide-react";

const { comisiones } = mockAdmin;

const columns: DataTableColumn[] = [
  { key: "id", label: "ID" },
  { key: "socio", label: "Socio" },
  {
    key: "monto",
    label: "Monto",
    render: (v: number) => `$${v.toLocaleString("es-MX")}.00 MXN`,
  },
  { key: "tipo", label: "Tipo" },
  {
    key: "estatus",
    label: "Estatus",
    render: (v: string) => {
      const labels: Record<string, string> = {
        pendiente: "Pendiente",
        pagada: "Pagada",
        procesando: "Procesando",
      };
      return <StatusBadge status={labels[v] ?? v} />;
    },
  },
  { key: "fecha", label: "Fecha" },
];

export default function ComisionesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Comisiones y Pagos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          title="Pendientes de Pago"
          value={`$${comisiones.pendientesPago.toLocaleString("es-MX")}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Pagadas este Mes"
          value={`$${comisiones.pagadasMes.toLocaleString("es-MX")}`}
          icon={CheckCircle}
        />
      </div>

      <div className="flex gap-2">
        <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <CheckCircle className="size-4" />
          Aprobar Pagos
        </Button>
        <Button className="gap-1.5 bg-[#00A88F] hover:bg-[#00A88F]/90 text-white">
          <CreditCard className="size-4" />
          Procesar Pagos
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={comisiones.detalle}
        searchable
        searchPlaceholder="Buscar por socio o tipo..."
      />
    </div>
  );
}
