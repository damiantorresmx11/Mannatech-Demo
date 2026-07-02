"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
}

export function NotificationDropdown({
  notifications: initialNotifications,
}: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sync prop changes
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Notificaciones
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs text-zinc-400">
                  {unreadCount} sin leer
                </span>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
                  Sin notificaciones
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 border-b border-zinc-50 last:border-0 dark:border-zinc-800/50 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                      !n.read && "bg-blue-50/50 dark:bg-blue-950/10"
                    )}
                  >
                    {/* Unread indicator */}
                    <div className="pt-1.5 shrink-0">
                      <span
                        className={cn(
                          "block size-2 rounded-full",
                          !n.read
                            ? "bg-[#00A88F] dark:bg-[#00C9A7]"
                            : "bg-transparent"
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {n.title}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                        {n.description}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-zinc-100 px-4 py-2 dark:border-zinc-800">
                <button
                  onClick={markAllRead}
                  className="w-full text-center text-xs font-medium text-[#00A88F] hover:text-[#00A88F]/80 dark:text-[#00C9A7] dark:hover:text-[#00C9A7]/80 py-1 transition-colors"
                >
                  Marcar todo como leido
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
