"use client";

import { useState } from "react";
import { mockAdmin } from "@/lib/mock-data";
import { DataTable, DateRangePicker, SearchInput } from "@/components/dashboard";
import type { DataTableColumn } from "@/components/dashboard";

const { auditoria } = mockAdmin;

const columns: DataTableColumn[] = [
  { key: "fecha", label: "Fecha" },
  {
    key: "usuario",
    label: "Usuario",
    render: (v: string) => (
      <span className="font-medium">{v}</span>
    ),
  },
  { key: "accion", label: "Accion" },
  { key: "detalle", label: "Detalle" },
  {
    key: "ip",
    label: "IP",
    render: (v: string) => (
      <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{v}</span>
    ),
  },
];

export default function AuditoriaPage() {
  const [dateRange, setDateRange] = useState({ from: "2026-06-28", to: "2026-07-01" });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Auditoria / Logs</h1>

      <DateRangePicker value={dateRange} onChange={setDateRange} />

      <DataTable
        columns={columns}
        data={auditoria}
        searchable
        searchPlaceholder="Buscar por usuario o accion..."
        pageSize={10}
      />
    </div>
  );
}
