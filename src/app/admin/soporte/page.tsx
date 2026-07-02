"use client";

import { mockAdmin } from "@/lib/mock-data";
import { StatsCard, StatusBadge } from "@/components/dashboard";
import { Headphones, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const { soporte } = mockAdmin;

const PRIORIDAD_STYLES: Record<string, string> = {
  alta: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  media: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  baja: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
};

const ESTATUS_LABELS: Record<string, string> = {
  abierto: "Abierto",
  en_progreso: "En Progreso",
  resuelto: "Resuelto",
};

export default function SoportePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Soporte</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Tickets Abiertos" value={soporte.resumen.abiertos} icon={Headphones} />
        <StatsCard title="En Progreso" value={soporte.resumen.enProgreso} icon={Clock} />
        <StatsCard title="Resueltos" value={soporte.resumen.resueltos} icon={CheckCircle} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">ID</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Asunto</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Cliente</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Prioridad</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Estatus</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {soporte.tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => router.push(`/admin/soporte/${ticket.id}`)}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50 cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{ticket.id}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{ticket.asunto}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{ticket.cliente}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", PRIORIDAD_STYLES[ticket.prioridad])}>
                    {ticket.prioridad}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={ESTATUS_LABELS[ticket.estatus] ?? ticket.estatus} />
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{ticket.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
