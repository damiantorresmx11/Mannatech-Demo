"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ── Context ──────────────────────────────────────────────────────────
interface SidebarState {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarState>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

// ── Provider (used internally by DashboardShell) ─────────────────────
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// ── Types ────────────────────────────────────────────────────────────
export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  theme: "light" | "dark";
  logo: ReactNode;
  footer?: ReactNode;
}

// ── Component ────────────────────────────────────────────────────────
export function DashboardSidebar({
  items,
  theme,
  logo,
  footer,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  const isDark = theme === "dark";

  const sidebarClasses = cn(
    "flex flex-col h-screen border-r transition-[width] duration-300 ease-in-out overflow-hidden",
    isDark
      ? "bg-zinc-900 border-zinc-800 text-zinc-100"
      : "bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
  );

  const content = (
    <>
      {/* Logo area */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b px-4",
          isDark ? "border-zinc-800" : "border-zinc-200 dark:border-zinc-800"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            collapsed ? "w-8 justify-center" : "w-full"
          )}
        >
          {logo}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-[#00A88F]/10 text-[#00A88F] dark:bg-[#00C9A7]/15 dark:text-[#00C9A7]"
                  : isDark
                    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r bg-[#00A88F] dark:bg-[#00C9A7]" />
              )}
              <Icon className="size-5 shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-[#00A88F] text-[10px] font-bold text-white dark:bg-[#00C9A7]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {footer && (
        <div
          className={cn(
            "shrink-0 border-t p-4",
            isDark ? "border-zinc-800" : "border-zinc-200 dark:border-zinc-800",
            collapsed && "px-2"
          )}
        >
          {footer}
        </div>
      )}

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "hidden lg:flex h-10 items-center justify-center border-t transition-colors",
          isDark
            ? "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
            : "border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800"
        )}
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        <ChevronLeft
          className={cn(
            "size-4 transition-transform duration-300",
            collapsed && "rotate-180"
          )}
        />
      </button>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          sidebarClasses,
          "hidden lg:flex fixed left-0 top-0 z-30",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              data-lenis-prevent
              className={cn(
                sidebarClasses,
                "fixed left-0 top-0 z-50 w-[280px] lg:hidden shadow-xl"
              )}
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                aria-label="Cerrar menu"
              >
                <X className="size-5" />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
