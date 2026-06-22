"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info, AlertTriangle, X } from "lucide-react";

type NotificationType = "success" | "info" | "warning";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notify: (type: NotificationType, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
});

export function useNotification() {
  return useContext(NotificationContext);
}

const icons: Record<NotificationType, typeof CheckCircle> = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors: Record<NotificationType, string> = {
  success: "bg-green-500",
  info: "bg-blue-500",
  warning: "bg-amber-500",
};

const bgColors: Record<NotificationType, string> = {
  success: "bg-white/95 dark:bg-zinc-900/95 border-green-200 dark:border-green-800",
  info: "bg-white/95 dark:bg-zinc-900/95 border-blue-200 dark:border-blue-800",
  warning: "bg-white/95 dark:bg-zinc-900/95 border-amber-200 dark:border-amber-800",
};

const iconColors: Record<NotificationType, string> = {
  success: "text-green-500",
  info: "text-blue-500",
  warning: "text-amber-500",
};

function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const Icon = icons[notification.type];
  const duration = notification.duration ?? 4000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [notification.id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-xl overflow-hidden max-w-sm ${bgColors[notification.type]}`}
    >
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${iconColors[notification.type]}`} />
      <p className="text-sm font-medium text-foreground flex-1">{notification.message}</p>
      <button
        onClick={() => onDismiss(notification.id)}
        className="p-0.5 rounded hover:bg-muted transition-colors flex-shrink-0"
      >
        <X size={14} className="text-muted-foreground" />
      </button>
      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${colors[notification.type]}`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback(
    (type: NotificationType, message: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setNotifications((prev) => {
        const next = [...prev, { id, type, message, duration }];
        // Keep max 3
        return next.slice(-3);
      });
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => (
            <div key={n.id} className="pointer-events-auto">
              <NotificationItem notification={n} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}
