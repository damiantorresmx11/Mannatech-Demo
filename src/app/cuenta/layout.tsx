"use client";

import { DashboardShell } from "@/components/dashboard";
import type { SidebarItem } from "@/components/dashboard";
import { MannatechLogo } from "@/components/shared/MannatechLogo";
import { mockCliente } from "@/lib/mock-data/cliente";
import {
  User,
  Package,
  Heart,
  RefreshCw,
  Star,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const sidebarItems: SidebarItem[] = [
  { label: "Mi Cuenta", href: "/cuenta/mi-cuenta", icon: User },
  { label: "Mis Pedidos", href: "/cuenta/pedidos", icon: Package },
  { label: "Favoritos", href: "/cuenta/favoritos", icon: Heart },
  { label: "Autoenvio", href: "/cuenta/autoenvio", icon: RefreshCw },
  { label: "Puntos", href: "/cuenta/puntos", icon: Star },
  { label: "Mi Asociado", href: "/cuenta/mi-asociado", icon: Users },
];

const user = {
  name: mockCliente.perfil.nombre,
  email: mockCliente.perfil.email,
  avatar: mockCliente.perfil.avatar ?? undefined,
  role: "Cliente",
};

function SidebarFooter() {
  return (
    <Link
      href="/productos"
      className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-[#00A88F] dark:text-zinc-400 dark:hover:text-[#00C9A7] transition-colors"
    >
      <ArrowLeft className="size-4" />
      <span>Volver a la tienda</span>
    </Link>
  );
}

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      sidebarItems={sidebarItems}
      sidebarTheme="light"
      sidebarLogo={<MannatechLogo className="h-8" />}
      sidebarFooter={<SidebarFooter />}
      user={user}
    >
      {children}
    </DashboardShell>
  );
}
