"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, HeartPulse, Dumbbell, Droplets, Package, ShoppingBag } from "lucide-react";

const categories = [
  { name: "Novedades", href: "/productos", icon: Sparkles, gradient: "from-mannatech to-emerald-500" },
  { name: "Más Vendidos", href: "/productos", icon: TrendingUp, gradient: "from-amber-500 to-orange-500" },
  { name: "Nutrición", href: "/productos", icon: HeartPulse, gradient: "from-rose-500 to-pink-500" },
  { name: "Fitness", href: "/productos", icon: Dumbbell, gradient: "from-blue-500 to-indigo-500" },
  { name: "Cuidado Personal", href: "/productos", icon: Droplets, gradient: "from-purple-500 to-violet-500" },
  { name: "Kits", href: "/productos", icon: Package, gradient: "from-orange-500 to-amber-600" },
  { name: "Todo", href: "/productos", icon: ShoppingBag, gradient: "from-zinc-500 to-zinc-600 dark:from-zinc-600 dark:to-zinc-500" },
];

export function QuickCategoryMenu() {
  return (
    <nav className="bg-white dark:bg-zinc-950 border-b border-border/30" aria-label="Menú rápido de categorías">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide py-3">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.li
                key={cat.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="flex-1 min-w-0"
              >
                <Link
                  href={cat.href}
                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted/60 dark:hover:bg-zinc-900 transition-colors justify-center sm:justify-start"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}>
                    <Icon size={17} className="text-white" strokeWidth={2.2} />
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
