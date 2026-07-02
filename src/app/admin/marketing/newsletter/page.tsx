"use client";

import { mockAdmin } from "@/lib/mock-data";
import { StatsCard } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Eye, Calendar, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

const { newsletter } = mockAdmin.marketing;

const campanas = [
  { titulo: "Oferta Verano - 20% en Suplementos", fecha: "2026-06-28", abiertos: 1_543, enviados: 4_521 },
  { titulo: "Nuevo producto: Ambrotose LIFE 2.0", fecha: "2026-06-15", abiertos: 1_890, enviados: 4_480 },
  { titulo: "Dia del Padre - Descuentos especiales", fecha: "2026-06-01", abiertos: 1_234, enviados: 4_350 },
  { titulo: "Bienvenida nuevos suscriptores Mayo", fecha: "2026-05-20", abiertos: 980, enviados: 1_200 },
];

export default function NewsletterPage() {
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

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Newsletter</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Suscriptores"
          value={newsletter.suscriptores.toLocaleString("es-MX")}
          icon={Mail}
        />
        <StatsCard
          title="Tasa de Apertura"
          value={`${newsletter.tasaApertura}%`}
          icon={Eye}
        />
        <StatsCard
          title="Ultima Campana"
          value={newsletter.ultimaCampana}
          icon={Calendar}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campanas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campanas.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40">
                    <Send className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{c.titulo}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.fecha}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {c.abiertos.toLocaleString("es-MX")} abiertos
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    de {c.enviados.toLocaleString("es-MX")} enviados ({((c.abiertos / c.enviados) * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
