"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/dashboard";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

const REPORT_TYPES = [
  { value: "ventas", label: "Reporte de Ventas" },
  { value: "pedidos", label: "Reporte de Pedidos" },
  { value: "inventario", label: "Reporte de Inventario" },
  { value: "comisiones", label: "Reporte de Comisiones" },
  { value: "usuarios", label: "Reporte de Usuarios" },
  { value: "red-mlm", label: "Reporte de Red MLM" },
];

const FORMATS = [
  { value: "csv", label: "CSV" },
  { value: "pdf", label: "PDF" },
];

export default function ExportarPage() {
  const [dateRange, setDateRange] = useState({ from: "2026-06-01", to: "2026-06-30" });
  const [reportType, setReportType] = useState("ventas");
  const [format, setFormat] = useState("csv");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/reportes"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Reportes
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Exportar Reporte</h1>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Generar Reporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Tipo de Reporte
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {REPORT_TYPES.map((rt) => (
                <option key={rt.value} value={rt.value}>{rt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Rango de Fechas
            </label>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Formato
            </label>
            <div className="flex gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    format === f.value
                      ? "bg-[#00A88F] text-white dark:bg-[#00C9A7]"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="size-4" />
            Generar Reporte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
