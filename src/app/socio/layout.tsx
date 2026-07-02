"use client";

import {
  LayoutDashboard,
  Network,
  Users,
  DollarSign,
  Package,
  Wrench,
  Calendar,
  Trophy,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { MannatechLogo } from "@/components/shared/MannatechLogo";
import { DashboardShell, type SidebarItem } from "@/components/dashboard";
import { AvatarWithStatus } from "@/components/dashboard";
import { mockSocio } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const sidebarItems: SidebarItem[] = [
  { label: "Resumen", href: "/socio/resumen", icon: LayoutDashboard },
  { label: "Mi Red", href: "/socio/red", icon: Network },
  { label: "Mis Clientes", href: "/socio/clientes", icon: Users },
  { label: "Comisiones", href: "/socio/comisiones", icon: DollarSign },
  { label: "Pedidos", href: "/socio/pedidos", icon: Package },
  { label: "Herramientas", href: "/socio/herramientas", icon: Wrench },
  { label: "Calendario", href: "/socio/calendario", icon: Calendar },
  { label: "Rango y Metas", href: "/socio/rango", icon: Trophy },
  { label: "Aprendizaje", href: "/socio/aprendizaje", icon: GraduationCap },
];

export default function SocioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { perfil } = mockSocio;

  return (
    <DashboardShell
      sidebarItems={sidebarItems}
      sidebarTheme="light"
      sidebarLogo={
        <Link href="/socio/resumen">
          <MannatechLogo className="h-8" />
        </Link>
      }
      user={{
        name: perfil.nombreCompleto,
        email: perfil.email,
        role: perfil.rango,
      }}
      sidebarFooter={
        <div className="space-y-3">
          {/* Rank badge */}
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Trophy className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {perfil.rango}
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                ID: {perfil.id}
              </p>
            </div>
          </div>

          {/* Back to site link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-[#00A88F] dark:text-zinc-400 dark:hover:text-[#00C9A7] transition-colors"
          >
            <ExternalLink className="size-3.5" />
            Volver al sitio
          </Link>
        </div>
      }
    >
      {children}
    </DashboardShell>
  );
}
