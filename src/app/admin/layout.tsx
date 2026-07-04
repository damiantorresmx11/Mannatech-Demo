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
  FileText,
  Activity,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import type { SidebarItem } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/dashboard/DashboardSidebar";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession, signOut } from "next-auth/react";

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Paginas", href: "/admin/paginas", icon: FileText },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Inventario", href: "/admin/inventario", icon: Warehouse },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart, badge: "23" },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users },
  { label: "Red MLM", href: "/admin/red-mlm", icon: Network },
  { label: "Comisiones", href: "/admin/comisiones", icon: DollarSign },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { label: "Reportes", href: "/admin/reportes", icon: BarChart3 },
  { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { label: "Monitoreo", href: "/admin/monitoreo", icon: Activity },
  { label: "Soporte", href: "/admin/soporte", icon: MessageCircle },
  { label: "Configuracion", href: "/admin/configuracion", icon: Settings },
  { label: "Auditoria", href: "/admin/auditoria", icon: Shield },
];

const adminUser = {
  name: "Admin DMLABS",
  email: "admin@dmlabs.mx",
  role: "Administrador",
};

function MannatechM({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 52 L24 8 L32 28 L40 8 L56 52" stroke="#00A88F" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 52 L32 12 L48 52" stroke="#69CA98" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

function SidebarLogo() {
  const { collapsed } = useSidebar();

  if (collapsed) {
    return <MannatechM className="h-8 w-8" />;
  }

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

function AdminSessionGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <MannatechLogo className="h-10 text-white" variant="white" />
          <div className="h-1 w-32 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Editor pages get fullscreen (no sidebar) — matches /admin/paginas/some-slug but NOT /admin/paginas
  const isEditor = /^\/admin\/paginas\/[^/]+$/.test(pathname || "");

  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return children;
  }

  return (
    <SessionProvider>
      <AdminSessionGate>
        {isEditor ? (
          children
        ) : (
          <DashboardShell
            sidebarItems={sidebarItems}
            sidebarTheme="dark"
            sidebarLogo={<SidebarLogo />}
            sidebarFooter={<SidebarFooter />}
            user={adminUser}
          >
            {children}
          </DashboardShell>
        )}
      </AdminSessionGate>
    </SessionProvider>
  );
}
