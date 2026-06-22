"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  Check,
  Shield,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { useNotification } from "@/components/Notification";

interface ProductShowcaseProps {
  productos: Producto[];
}

// Maps benefit index to icon
const benefitIcons = [Shield, HeartPulse, Sparkles] as const;

// Per-category glow palette — hex values for inline style radial gradients
const categoryGlow: Record<string, string> = {
  nutricion:    "#00897B",
  bienestar:    "#7C3AED",
  belleza:      "#DB2777",
  energia:      "#D97706",
  suplementos:  "#0369A1",
};

function getCategoryGlow(categoria: string): string {
  const key = categoria.toLowerCase().replace(/\s+/g, "");
  for (const [k, v] of Object.entries(categoryGlow)) {
    if (key.includes(k)) return v;
  }
  return "#00897B";
}

// Progress bar for auto-rotate
function ProgressBar({ duration, paused }: { duration: number; paused: boolean }) {
  return (
    <div className="h-[2px] bg-foreground/10 rounded-full overflow-hidden w-full">
      <motion.div
        key={paused ? "paused" : "running"}
        className="h-full bg-mannatech rounded-full origin-left"
        initial={{ scaleX: 0 }}
        animate={paused ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: duration / 1000, ease: "linear" as const }}
      />
    </div>
  );
}

// ── Image panel (left) ──────────────────────────────────────────────────────
function ImagePanel({
  producto,
  isBestSeller,
  bestSellerLabel,
}: {
  producto: Producto;
  isBestSeller: boolean;
  bestSellerLabel: string;
}) {
  const glowColor = getCategoryGlow(producto.categoria);

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 55%, ${glowColor}22 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Outer card shell */}
      <div
        className="relative w-full max-w-[520px] mx-auto aspect-square rounded-3xl overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${glowColor}12 0%, transparent 75%)`,
          boxShadow: `0 32px 80px -16px ${glowColor}28, 0 4px 24px -4px rgba(0,0,0,0.08)`,
        }}
      >
        {/* Frosted glass ring */}
        <div
          className="absolute inset-0 rounded-3xl border border-white/30 dark:border-white/10 pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Product image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={producto.slug}
            initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: "easeInOut" as const }}
            className="absolute inset-0"
          >
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Best seller badge — top left */}
        <AnimatePresence>
          {isBestSeller && (
            <motion.span
              key="best-seller"
              initial={{ opacity: 0, scale: 0.7, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -8 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 20 }}
              className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
            >
              <Sparkles size={11} />
              {bestSellerLabel}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Category badge — top right */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`cat-${producto.slug}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white shadow"
            style={{ backgroundColor: glowColor }}
          >
            {producto.categoria}
          </motion.span>
        </AnimatePresence>

        {/* Subtle inner bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none z-10 rounded-b-3xl"
          style={{
            background: `linear-gradient(to top, ${glowColor}10, transparent)`,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

// ── Info panel (right) ──────────────────────────────────────────────────────
function InfoPanel({
  producto,
  added,
  onAdd,
  tActions,
}: {
  producto: Producto;
  added: boolean;
  onAdd: () => void;
  tActions: ReturnType<typeof useTranslations>;
}) {
  const glowColor = getCategoryGlow(producto.categoria);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`info-${producto.slug}`}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.45, ease: "easeOut" as const }}
        className="flex flex-col"
      >
        {/* Category pill */}
        <span
          className="self-start inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5"
          style={{
            color: glowColor,
            background: `${glowColor}14`,
            border: `1px solid ${glowColor}30`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: glowColor }}
            aria-hidden="true"
          />
          {producto.categoria}
        </span>

        {/* Product name */}
        <h3 className="font-heading text-[2rem] sm:text-[2.35rem] lg:text-[2.6rem] font-bold leading-[1.1] text-foreground mb-5 tracking-tight">
          {producto.nombre}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-base leading-relaxed mb-7 max-w-[42ch]">
          {producto.descripcionCorta}
        </p>

        {/* Price */}
        <p
          className="text-4xl font-extrabold mb-8 tabular-nums"
          style={{ color: "var(--mannatech)" }}
        >
          {formatPrecio(producto.precio)}
          <span className="text-sm font-normal text-muted-foreground ml-2">MXN</span>
        </p>

        {/* Benefits */}
        <ul className="space-y-3 mb-9" aria-label="Beneficios del producto">
          {producto.beneficios.slice(0, 3).map((beneficio, i) => {
            const Icon = benefitIcons[i % benefitIcons.length];
            return (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${glowColor}15` }}
                  aria-hidden="true"
                >
                  <Icon size={15} style={{ color: glowColor }} />
                </span>
                <span className="text-sm text-foreground/80 leading-relaxed pt-1">
                  {beneficio}
                </span>
              </li>
            );
          })}
        </ul>

        {/* CTA row */}
        <div className="flex items-center gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAdd}
            aria-label={added ? tActions("added") : tActions("addToCart")}
            className={`relative inline-flex items-center justify-center gap-2.5 px-9 py-4 text-sm font-semibold rounded-full transition-colors duration-300 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-mannatech focus-visible:ring-offset-2 ${
              added
                ? "bg-emerald-500 text-white shadow-emerald-500/25"
                : "bg-mannatech text-white hover:bg-mannatech-dark shadow-mannatech/25"
            }`}
            style={
              !added
                ? { boxShadow: `0 8px 24px -6px ${glowColor}55` }
                : undefined
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Check size={17} strokeWidth={2.5} />
                  {tActions("added")}
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart size={17} />
                  {tActions("addToCart")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <Link
            href={`/productos/${producto.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-mannatech hover:text-mannatech-dark transition-colors group"
          >
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Thumbnail row ───────────────────────────────────────────────────────────
function ThumbnailRow({
  productos,
  activeIdx,
  onSelect,
  selectLabel,
  viewProductLabel,
  autoRotateDuration,
  paused,
}: {
  productos: Producto[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  selectLabel: string;
  viewProductLabel: (name: string) => string;
  autoRotateDuration: number;
  paused: boolean;
}) {
  return (
    <div className="mt-14">
      {/* Progress bar */}
      <div className="mb-5 max-w-[520px]">
        <ProgressBar duration={autoRotateDuration} paused={paused} />
      </div>

      {/* Thumbnails */}
      <div
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
        role="tablist"
        aria-label={selectLabel}
      >
        {productos.map((p, idx) => {
          const isActive = idx === activeIdx;
          const glowColor = getCategoryGlow(p.categoria);
          return (
            <button
              key={p.slug}
              role="tab"
              aria-selected={isActive}
              aria-label={viewProductLabel(p.nombre)}
              onClick={() => onSelect(idx)}
              className="relative flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mannatech focus-visible:ring-offset-2 rounded-full"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1 : 0.92,
                  opacity: isActive ? 1 : 0.5,
                }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" as const }}
                className="relative w-[72px] h-[72px] rounded-full overflow-hidden bg-white dark:bg-zinc-800"
                style={
                  isActive
                    ? {
                        boxShadow: `0 0 0 2.5px ${glowColor}, 0 4px 16px -4px ${glowColor}55`,
                      }
                    : { boxShadow: "0 0 0 1.5px rgba(0,0,0,0.10)" }
                }
              >
                <Image
                  src={p.imagen}
                  alt={p.nombre}
                  fill
                  className="object-contain p-2"
                  sizes="72px"
                />
              </motion.div>

              {/* Active dot indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="thumb-active-dot"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: glowColor }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
const AUTO_ROTATE_MS = 6000;

export function ProductShowcase({ productos }: ProductShowcaseProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const { notify } = useNotification();
  const t = useTranslations("landing.productShowcase");
  const tActions = useTranslations("common.actions");

  const active = productos[activeIdx];

  // Auto-rotate — resets cleanly on manual selection
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % productos.length);
    }, AUTO_ROTATE_MS);
  }, [productos.length]);

  useEffect(() => {
    if (!paused) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, startTimer]);

  function handleSelect(idx: number) {
    setActiveIdx(idx);
    // Restart timer on manual pick
    startTimer();
  }

  function handleAdd() {
    if (!active) return;
    addItem({
      slug: active.slug,
      nombre: active.nombre,
      precio: active.precio,
      imagen: active.imagen,
    });
    notify("success", t("addedNotification", { name: active.nombre }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!active) return null;

  return (
    <section
      id="productos-dest"
      data-label="Productos"
      className="relative py-28 scroll-snap-section overflow-hidden bg-[#FAFAF8] dark:bg-zinc-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative background geometry */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large soft teal blob — top right */}
        <div
          className="absolute -top-32 -right-40 w-[640px] h-[640px] rounded-full opacity-[0.06] dark:opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, var(--mannatech) 0%, transparent 70%)",
          }}
        />
        {/* Smaller accent blob — bottom left */}
        <div
          className="absolute -bottom-24 -left-32 w-[480px] h-[480px] rounded-full opacity-[0.05] dark:opacity-[0.03]"
          style={{
            background:
              "radial-gradient(circle, var(--mannatech-light) 0%, transparent 70%)",
          }}
        />
        {/* Subtle dot-grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="text-center mb-20"
        >
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-mannatech mb-5 border border-mannatech/20 rounded-full px-5 py-2 bg-mannatech/5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-mannatech animate-pulse"
              aria-hidden="true"
            />
            {t("overline")}
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-5 leading-tight tracking-tight">
            {t("headline")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left — image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <ImagePanel
              producto={active}
              isBestSeller={activeIdx === 0}
              bestSellerLabel={t("bestSeller")}
            />
          </motion.div>

          {/* Right — info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
          >
            <InfoPanel
              producto={active}
              added={added}
              onAdd={handleAdd}
              tActions={tActions}
            />
          </motion.div>
        </div>

        {/* Thumbnail navigation + progress */}
        <ThumbnailRow
          productos={productos}
          activeIdx={activeIdx}
          onSelect={handleSelect}
          selectLabel={t("selectProduct")}
          viewProductLabel={(name) => t("viewProduct", { name })}
          autoRotateDuration={AUTO_ROTATE_MS}
          paused={paused}
        />

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-mannatech hover:text-mannatech-dark transition-colors group"
          >
            {t("viewAll")}
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
