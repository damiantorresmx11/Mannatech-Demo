"use client";

import { motion } from "framer-motion";
import { Award, FlaskConical, Globe, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface StatItem {
  icon: typeof Award;
  value: string;
  labelKey: string;
  sparkline: number[];
}

const stats: StatItem[] = [
  {
    icon: Award,
    value: "+90",
    labelKey: "globalPatents",
    sparkline: [20, 35, 40, 55, 60, 72, 80, 90],
  },
  {
    icon: FlaskConical,
    value: "30+",
    labelKey: "yearsInnovation",
    sparkline: [10, 15, 20, 25, 30, 28, 32, 35],
  },
  {
    icon: Globe,
    value: "25+",
    labelKey: "countriesPresence",
    sparkline: [5, 8, 10, 14, 18, 20, 22, 25],
  },
  {
    icon: Users,
    value: "1M+",
    labelKey: "satisfiedClients",
    sparkline: [100, 200, 350, 500, 650, 780, 900, 1000],
  },
];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 30;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((v - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <motion.path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" as const }}
        className="text-mannatech"
      />
    </svg>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function StatsSection() {
  const t = useTranslations("landing.stats");

  return (
    <section id="stats" data-label="Estadisticas" className="py-24 bg-white dark:bg-zinc-900 scroll-snap-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.labelKey}
                variants={itemVariants}
                className="text-center p-6 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-transparent hover:border-mannatech/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-mannatech/10 flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-mannatech" />
                </div>
                <p className="text-3xl font-bold text-mannatech mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground mb-3">{t(stat.labelKey)}</p>
                <div className="flex justify-center">
                  <Sparkline data={stat.sparkline} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
