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
} from "lucide-react";
import type { SidebarItem } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { AdminAuthProvider, useAdminAuth } from "@/providers/AdminAuthProvider";
import { useSidebar } from "@/components/dashboard/DashboardSidebar";
import { useState } from "react";

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
  { label: "Configuracion", href: "/admin/configuracion", icon: Settings },
  { label: "Soporte", href: "/admin/soporte", icon: Headphones, badge: "7" },
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

function AdminLoginGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login, error } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <MannatechLogo className="h-10 text-white" variant="white" />
          <div className="h-1 w-32 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        await login(email, password);
      } catch {
        // error handled by provider
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center gap-3">
            <MannatechLogo className="h-10 text-white" variant="white" />
            <p className="text-sm text-zinc-500">Panel de Administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="admin@dmlabs.mx"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              {submitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600">Mannatech Admin · Powered by Medusa</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLoginGate>
        <DashboardShell
          sidebarItems={sidebarItems}
          sidebarTheme="dark"
          sidebarLogo={<SidebarLogo />}
          sidebarFooter={<SidebarFooter />}
          user={adminUser}
        >
          {children}
        </DashboardShell>
      </AdminLoginGate>
    </AdminAuthProvider>
  );
}
