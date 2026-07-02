import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
        <Icon className="size-7 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-[#00A88F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#00A88F]/90 dark:bg-[#00C9A7] dark:hover:bg-[#00C9A7]/90"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
