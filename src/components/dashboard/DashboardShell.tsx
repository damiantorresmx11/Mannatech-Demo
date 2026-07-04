"use client";

import { cn } from "@/lib/utils";
import {
  DashboardSidebar,
  SidebarProvider,
  useSidebar,
  type SidebarItem,
} from "./DashboardSidebar";
import { DashboardHeader, type DashboardUser } from "./DashboardHeader";
import type { ReactNode } from "react";

interface DashboardShellProps {
  sidebarItems: SidebarItem[];
  sidebarTheme: "light" | "dark";
  sidebarLogo: ReactNode;
  sidebarFooter?: ReactNode;
  user: DashboardUser;
  headerActions?: ReactNode;
  children: ReactNode;
}

function ShellInner({
  sidebarItems,
  sidebarTheme,
  sidebarLogo,
  sidebarFooter,
  user,
  headerActions,
  children,
}: DashboardShellProps) {
  const { collapsed, setMobileOpen } = useSidebar();

  return (
    <div className="dark min-h-screen bg-zinc-950">
      <DashboardSidebar
        items={sidebarItems}
        theme={sidebarTheme}
        logo={sidebarLogo}
        footer={sidebarFooter}
      />

      {/* Main area */}
      <div
        className={cn(
          "transition-[margin-left] duration-300 ease-in-out",
          collapsed ? "lg:ml-16" : "lg:ml-60"
        )}
      >
        <DashboardHeader
          user={user}
          onMenuClick={() => setMobileOpen(true)}
          actions={headerActions}
        />

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export function DashboardShell(props: DashboardShellProps) {
  return (
    <SidebarProvider>
      <ShellInner {...props} />
    </SidebarProvider>
  );
}
