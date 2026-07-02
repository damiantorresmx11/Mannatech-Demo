import { cn } from "@/lib/utils";

type StatusVariant = "default" | "success" | "warning" | "danger" | "info";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
}

const AUTO_VARIANT_MAP: Record<string, StatusVariant> = {
  activo: "success",
  entregado: "success",
  completado: "success",
  aprobado: "success",
  pagado: "success",
  pendiente: "warning",
  "en proceso": "warning",
  "en progreso": "warning",
  procesando: "warning",
  revision: "warning",
  cancelado: "danger",
  inactivo: "danger",
  rechazado: "danger",
  error: "danger",
  vencido: "danger",
  suspendido: "danger",
  nuevo: "info",
  informacion: "info",
  borrador: "info",
};

const VARIANT_STYLES: Record<StatusVariant, { dot: string; bg: string; text: string }> = {
  default: {
    dot: "bg-zinc-400 dark:bg-zinc-500",
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-700 dark:text-zinc-300",
  },
  success: {
    dot: "bg-emerald-500 dark:bg-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  warning: {
    dot: "bg-amber-500 dark:bg-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
  },
  danger: {
    dot: "bg-red-500 dark:bg-red-400",
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300",
  },
  info: {
    dot: "bg-blue-500 dark:bg-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
  },
};

function resolveVariant(status: string, explicit?: StatusVariant): StatusVariant {
  if (explicit) return explicit;
  const normalized = status.toLowerCase().trim();
  return AUTO_VARIANT_MAP[normalized] ?? "default";
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolved = resolveVariant(status, variant);
  const styles = VARIANT_STYLES[resolved];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles.bg,
        styles.text
      )}
    >
      <span className={cn("size-1.5 rounded-full", styles.dot)} />
      {status}
    </span>
  );
}
