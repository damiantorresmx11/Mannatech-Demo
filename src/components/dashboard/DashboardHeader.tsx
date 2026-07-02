"use client";

import { cn } from "@/lib/utils";
import { Menu, LogOut } from "lucide-react";
import { AvatarWithStatus } from "./AvatarWithStatus";
import { NotificationDropdown } from "./NotificationDropdown";
import type { ReactNode } from "react";

export interface DashboardUser {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface DashboardHeaderProps {
  user: DashboardUser;
  onMenuClick: () => void;
  actions?: ReactNode;
}

export function DashboardHeader({
  user,
  onMenuClick,
  actions,
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center gap-4 border-b px-4 lg:px-6",
        "bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800"
      )}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Breadcrumb / spacer area */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb area – populated by page-level components */}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {actions}

        <NotificationDropdown notifications={[]} />

        {/* User info */}
        <div className="hidden sm:flex items-center gap-3 pl-2 ml-2 border-l border-zinc-200 dark:border-zinc-700">
          <AvatarWithStatus
            src={user.avatar}
            name={user.name}
            status="online"
            size="sm"
          />
          <div className="hidden md:block min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {user.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          aria-label="Cerrar sesion"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  );
}
