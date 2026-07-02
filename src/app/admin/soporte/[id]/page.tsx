"use client";

import { mockAdmin } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { use } from "react";

const { soporte } = mockAdmin;

const ESTATUS_LABELS: Record<string, string> = {
  abierto: "Abierto",
  en_progreso: "En Progreso",
  resuelto: "Resuelto",
};

const PRIORIDAD_STYLES: Record<string, string> = {
  alta: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  media: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  baja: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
};

export default function TicketDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ticket = soporte.tickets.find((t) => t.id === id) ?? soporte.tickets[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/soporte"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Soporte
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600">/</span>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{ticket.id}</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{ticket.asunto}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={ESTATUS_LABELS[ticket.estatus] ?? ticket.estatus} />
            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", PRIORIDAD_STYLES[ticket.prioridad])}>
              Prioridad: {ticket.prioridad}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Conversacion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {ticket.mensajes.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      msg.esCliente ? "justify-start" : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        msg.esCliente
                          ? "bg-zinc-100 dark:bg-zinc-800 rounded-bl-md"
                          : "bg-[#00A88F] text-white dark:bg-[#00C9A7] rounded-br-md"
                      )}
                    >
                      <p className={cn(
                        "text-xs font-medium mb-1",
                        msg.esCliente
                          ? "text-zinc-500 dark:text-zinc-400"
                          : "text-white/80"
                      )}>
                        {msg.autor}
                      </p>
                      <p className={cn(
                        "text-sm",
                        msg.esCliente
                          ? "text-zinc-700 dark:text-zinc-300"
                          : "text-white"
                      )}>
                        {msg.contenido}
                      </p>
                      <p className={cn(
                        "text-[11px] mt-1.5",
                        msg.esCliente
                          ? "text-zinc-400 dark:text-zinc-500"
                          : "text-white/70"
                      )}>
                        {msg.fecha}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply area */}
              <div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <div className="flex gap-3">
                  <textarea
                    placeholder="Escribe una respuesta..."
                    rows={3}
                    className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 resize-none focus:border-[#00A88F] focus:ring-1 focus:ring-[#00A88F]/30 outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-[#00C9A7] dark:focus:ring-[#00C9A7]/30"
                  />
                  <button className="self-end flex items-center gap-1.5 rounded-lg bg-[#00A88F] px-4 py-2 text-sm font-medium text-white hover:bg-[#00A88F]/90 transition-colors dark:bg-[#00C9A7] dark:hover:bg-[#00C9A7]/90">
                    <Send className="size-4" />
                    Enviar
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ticket info */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">ID</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{ticket.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">Cliente</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{ticket.cliente}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">Prioridad</span>
              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", PRIORIDAD_STYLES[ticket.prioridad])}>
                {ticket.prioridad}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">Estatus</span>
              <StatusBadge status={ESTATUS_LABELS[ticket.estatus] ?? ticket.estatus} />
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 dark:text-zinc-400">Fecha</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{ticket.fecha}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
