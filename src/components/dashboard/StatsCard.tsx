"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  const numericValue = typeof value === "number" ? value : null;

  return (
    <Card>
      <CardContent className="pt-1">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {title}
            </p>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {numericValue !== null ? (
                <NumberTicker value={numericValue} />
              ) : (
                value
              )}
            </div>
            {change !== undefined && trend && (
              <div className="flex items-center gap-1 text-xs font-medium">
                {trend === "up" && (
                  <>
                    <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">
                      +{change}%
                    </span>
                  </>
                )}
                {trend === "down" && (
                  <>
                    <TrendingDown className="size-3.5 text-red-500 dark:text-red-400" />
                    <span className="text-red-500 dark:text-red-400">
                      {change}%
                    </span>
                  </>
                )}
                {trend === "neutral" && (
                  <>
                    <Minus className="size-3.5 text-zinc-400" />
                    <span className="text-zinc-400">{change}%</span>
                  </>
                )}
                <span className="text-zinc-400 dark:text-zinc-500 ml-1">
                  vs mes anterior
                </span>
              </div>
            )}
          </div>

          {/* Icon */}
          <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
