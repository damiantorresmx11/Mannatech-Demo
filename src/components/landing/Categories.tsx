"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HeartPulse, Leaf, Sparkles, Dumbbell, Pill } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Categoria } from "@/lib/types";

// ─── Icon map ────────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ReactNode> = {
  heartpulse: <HeartPulse size={14} />,
  leaf: <Leaf size={14} />,
  sparkles: <Sparkles size={14} />,
  dumbbell: <Dumbbell size={14} />,
  pill: <Pill size={14} />,
};

function getIcon(icono: string) {
  const key = icono.toLowerCase().replace(/[^a-z]/g, "");
  return iconMap[key] ?? <Sparkles size={14} />;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

// ─── Single card ──────────────────────────────────────────────────────────────

interface CardProps {
  cat: Categoria;
  className?: string;
}

function CategoryCard({ cat, className = "" }: CardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group ${className}`}
    >
      <Link href={`/productos?categoria=${cat.id}`} className="block h-full">
        {/* Background: real image or gradient fallback */}
        <div className="absolute inset-0">
          {cat.imagen ? (
            <Image
              src={cat.imagen}
              alt={cat.nombre}
              fill
              sizes="(max-width: 768px) 320px, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div
              className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.colorSecundario} 100%)`,
              }}
            />
          )}
        </div>

        {/* Gradient overlay — darkens bottom, lightens slightly on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500
            bg-gradient-to-t from-black/80 via-black/30 to-black/10
            group-hover:from-black/60 group-hover:via-black/20 group-hover:to-black/5"
        />

        {/* Subtle color tint on the bottom third */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to top, ${cat.color}88 0%, transparent 50%)`,
          }}
        />

        {/* Icon pill — top left */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md border border-white/20 text-white"
            style={{ backgroundColor: `${cat.color}55` }}
          >
            {getIcon(cat.icono)}
            {cat.nombre}
          </span>
        </div>

        {/* Content — bottom */}
        <div className="relative z-10 flex flex-col justify-end h-full p-6 pt-20">
          <h3 className="text-white font-heading font-bold text-xl sm:text-2xl leading-tight mb-2">
            {cat.nombre}
          </h3>
          <p className="text-white/75 text-sm leading-relaxed mb-4 line-clamp-2">
            {cat.descripcion}
          </p>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest
              text-white/60 group-hover:text-white transition-colors duration-300"
          >
            Explorar
            <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </span>
        </div>

        {/* Thin accent line bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: cat.color }}
        />
      </Link>
    </motion.div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoriesProps {
  categorias: Categoria[];
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Categories({ categorias }: CategoriesProps) {
  const t = useTranslations("landing.categories");

  // We expect up to 5 categories; split into top 2 and bottom row
  const topRow = categorias.slice(0, 2);
  const bottomRow = categorias.slice(2, 5);

  return (
    <section
      id="categorias"
      data-label="Categorias"
      className="py-28 bg-[#0A0A0A] scroll-snap-section overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* ── Section header ────────────────────────────────────── */}
        <motion.div
          className="mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mannatech mb-5 border border-mannatech/25 rounded-full inline-flex px-5 py-2 bg-mannatech/8">
            {t("overline")}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.05] max-w-xl">
              {t("headline")}
            </h2>
            <p className="text-white/50 max-w-sm lg:text-right text-base leading-relaxed">
              {t("description")}
            </p>
          </div>
        </motion.div>

        {/* ── Desktop: asymmetric bento grid ────────────────────── */}
        <div className="hidden lg:flex flex-col gap-4">
          {/* Top row — 2 equal halves */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {topRow.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} className="h-[420px]" />
            ))}
          </motion.div>

          {/* Bottom row — 3 equal thirds */}
          <motion.div
            className="grid grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {bottomRow.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} className="h-[300px]" />
            ))}
          </motion.div>
        </div>

        {/* ── Mobile: horizontal scroll ─────────────────────────── */}
        <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <motion.div
            className="flex gap-4"
            style={{ minWidth: "max-content" }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {categorias.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                className="w-[280px] h-[380px] flex-shrink-0"
              />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
