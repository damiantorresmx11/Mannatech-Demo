"use client";

import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface DateRange {
  from: string;
  to: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function daysAgoISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function firstOfMonthISO() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split("T")[0];
}

const PRESETS = [
  { label: "Hoy", from: () => todayISO(), to: () => todayISO() },
  { label: "7 dias", from: () => daysAgoISO(7), to: () => todayISO() },
  { label: "30 dias", from: () => daysAgoISO(30), to: () => todayISO() },
  { label: "Este mes", from: () => firstOfMonthISO(), to: () => todayISO() },
] as const;

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Date inputs */}
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-900">
        <Calendar className="size-4 text-zinc-400" />
        <input
          type="date"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          className="bg-transparent text-sm text-zinc-700 outline-none dark:text-zinc-300 [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:dark:invert"
        />
        <span className="text-zinc-300 dark:text-zinc-600">—</span>
        <input
          type="date"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          className="bg-transparent text-sm text-zinc-700 outline-none dark:text-zinc-300 [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:dark:invert"
        />
      </div>

      {/* Presets */}
      <div className="flex gap-1">
        {PRESETS.map((preset) => {
          const isActive =
            value.from === preset.from() && value.to === preset.to();
          return (
            <button
              key={preset.label}
              onClick={() =>
                onChange({ from: preset.from(), to: preset.to() })
              }
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-[#00A88F] text-white dark:bg-[#00C9A7]"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
