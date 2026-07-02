"use client";

import { mockAdmin } from "@/lib/mock-data";
import { StatsCard } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MousePointerClick, Eye, Ticket, Newspaper } from "lucide-react";
import Link from "next/link";

const { marketing } = mockAdmin;

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Marketing</h1>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Suscriptores Newsletter"
          value={marketing.newsletter.suscriptores.toLocaleString("es-MX")}
          icon={Mail}
        />
        <StatsCard
          title="Tasa de Apertura"
          value={`${marketing.newsletter.tasaApertura}%`}
          icon={Eye}
        />
        <StatsCard
          title="Cupones Activos"
          value={marketing.cupones.filter((c) => c.activo).length}
          icon={Ticket}
        />
        <StatsCard
          title="Campanas Enviadas"
          value={marketing.newsletter.campanasEnviadas}
          icon={Newspaper}
        />
      </div>

      {/* Banners activos */}
      <Card>
        <CardHeader>
          <CardTitle>Banners Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketing.banners.map((banner) => (
              <div
                key={banner.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{banner.titulo}</h3>
                  <div
                    className={`size-3 rounded-full ${
                      banner.activo ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                    title={banner.activo ? "Activo" : "Inactivo"}
                  />
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                    <MousePointerClick className="size-3.5" />
                    {banner.clicks.toLocaleString("es-MX")} clicks
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                    <Eye className="size-3.5" />
                    {banner.impresiones.toLocaleString("es-MX")} impresiones
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Links to sub-pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/marketing/cupones">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-1">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
                  <Ticket className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Cupones</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Gestionar codigos de descuento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/marketing/newsletter">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-1">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40">
                  <Newspaper className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Newsletter</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Campanas de email marketing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
