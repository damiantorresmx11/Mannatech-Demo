"use client";

import { DashboardShell } from "@/components/dashboard";
import { MannatechLogo } from "@/components/shared/MannatechLogo";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  Network,
  DollarSign,
  Megaphone,
  BarChart3,
  Settings,
  Headphones,
  Shield,
} from "lucide-react";
import type { SidebarItem } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Inventario", href: "/admin/inventario", icon: Warehouse },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart, badge: "23" },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users },
  { label: "Red MLM", href: "/admin/red-mlm", icon: Network },
  { label: "Comisiones", href: "/admin/comisiones", icon: DollarSign },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { label: "Reportes", href: "/admin/reportes", icon: BarChart3 },
  { label: "Configuracion", href: "/admin/configuracion", icon: Settings },
  { label: "Soporte", href: "/admin/soporte", icon: Headphones, badge: "7" },
  { label: "Auditoria", href: "/admin/auditoria", icon: Shield },
];

const adminUser = {
  name: "Admin DMLABS",
  email: "admin@dmlabs.mx",
  role: "Administrador",
};

function SidebarLogo() {
  return (
    <div className="flex items-center gap-2">
      <MannatechLogo className="h-7 text-white" variant="white" />
      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-[10px] px-1.5 py-0">
        Admin
      </Badge>
    </div>
  );
}

function SidebarFooter() {
  return (
    <p className="text-xs text-zinc-500 text-center">v1.0.0 Premium</p>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebarItems={sidebarItems}
      sidebarTheme="dark"
      sidebarLogo={<SidebarLogo />}
      sidebarFooter={<SidebarFooter />}
      user={adminUser}
    >
      {children}
    </DashboardShell>
  );
}
