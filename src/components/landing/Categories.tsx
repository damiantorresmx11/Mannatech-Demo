"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeartPulse, Dumbbell, Sparkles, Package, ArrowRight } from "lucide-react";

const shopCategories = [
  {
    name: "Nutrición + Bienestar",
    desc: "Suplementos esenciales para tu salud diaria",
    href: "/productos",
    icon: HeartPulse,
    gradient: "from-mannatech to-emerald-700",
    iconBg: "bg-white/20",
  },
  {
    name: "Fitness + Control de Peso",
    desc: "Proteína y fórmulas para tu mejor versión",
    href: "/productos",
    icon: Dumbbell,
    gradient: "from-blue-500 to-blue-700",
    iconBg: "bg-white/20",
  },
  {
    name: "Cuidado Personal",
    desc: "K-Beauty y tecnología de glicanos para tu piel",
    href: "/productos",
    icon: Sparkles,
    gradient: "from-purple-500 to-purple-700",
    iconBg: "bg-white/20",
  },
  {
    name: "Kits y Paquetes",
    desc: "Ahorra con nuestras combinaciones más populares",
    href: "/productos",
    icon: Package,
    gradient: "from-amber-500 to-amber-700",
    iconBg: "bg-white/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

interface CategoriesProps {
  categorias?: unknown[];
}

export function Categories(_props: CategoriesProps) {
  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-3">
            Siente lo Mejor
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Compra por Categoría
          </h2>
        </div>

        {/* 2x2 Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {shopCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.name} variants={cardVariants}>
                <Link
                  href={cat.href}
                  className={`group block relative h-[180px] sm:h-[220px] rounded-2xl overflow-hidden bg-gradient-to-br ${cat.gradient} transition-shadow duration-300 hover:shadow-xl`}
                >
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.05]" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
                    <div className={`w-12 h-12 rounded-xl ${cat.iconBg} backdrop-blur-sm flex items-center justify-center`}>
                      <Icon size={24} className="text-white" />
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                          {cat.name}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0 ml-4">
                        <ArrowRight size={16} className="text-white group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
