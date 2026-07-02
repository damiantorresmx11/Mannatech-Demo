import { cn } from "@/lib/utils";

interface TimelineStep {
  label: string;
  description?: string;
  date?: string;
  completed: boolean;
}

interface TimelineTrackerProps {
  steps: TimelineStep[];
}

export function TimelineTracker({ steps }: TimelineTrackerProps) {
  // Find the index of the current step (first non-completed)
  const currentIdx = steps.findIndex((s) => !s.completed);

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isCurrent = i === currentIdx;
        const isCompleted = step.completed;
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className="flex gap-3">
            {/* Dot + Line */}
            <div className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={cn(
                  "mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                  isCompleted &&
                    "border-[#00A88F] bg-[#00A88F] dark:border-[#00C9A7] dark:bg-[#00C9A7]",
                  isCurrent &&
                    "border-[#00A88F] bg-white dark:border-[#00C9A7] dark:bg-zinc-950 animate-pulse",
                  !isCompleted &&
                    !isCurrent &&
                    "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900"
                )}
              >
                {isCompleted && (
                  <svg
                    className="size-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {isCurrent && (
                  <span className="size-2 rounded-full bg-[#00A88F] dark:bg-[#00C9A7]" />
                )}
              </div>

              {/* Line */}
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-6",
                    isCompleted
                      ? "bg-[#00A88F] dark:bg-[#00C9A7]"
                      : "border-l-2 border-dashed border-zinc-300 dark:border-zinc-600"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  isCompleted || isCurrent
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400 dark:text-zinc-500"
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </p>
              )}
              {step.date && (
                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                  {step.date}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
