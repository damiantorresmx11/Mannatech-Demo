"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Star, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";

interface FeaturedGridProps {
  productos: Producto[];
  allProductos: Producto[];
}

function TiltImage({ producto, onAdd }: { producto: Producto; onAdd: (e: React.MouseEvent) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 25 });
  const shine = useTransform(mx, [0, 0.5, 1], [0, 0.12, 0]);

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <div className="perspective-1200">
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => { setHovering(false); mx.set(0.5); my.set(0.5); }}
        style={{
          rotateX: hovering ? rotateX : 0,
          rotateY: hovering ? rotateY : 0,
        }}
        className="relative bg-[#F2F0ED] dark:bg-zinc-800 rounded-xl overflow-hidden h-[220px] sm:h-[240px]"
      >
        <div className="relative w-full h-full p-4">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            sizes="260px"
          />
        </div>
        {producto.badge && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-mannatech text-white text-[10px] font-bold tracking-wide">
            {producto.badge}
          </span>
        )}
        <button
          onClick={onAdd}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-mannatech text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-mannatech-dark z-10"
          aria-label={`Agregar ${producto.nombre}`}
        >
          <Plus size={16} />
        </button>
        {/* Shine */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-20"
          style={{
            opacity: hovering ? shine : 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}

function SliderCard({ producto }: { producto: Producto }) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ slug: producto.slug, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen });
  }

  return (
    <div className="w-[240px] sm:w-[260px] flex-shrink-0 snap-start group">
      <Link href={`/productos/${producto.slug}`} className="block">
        {/* 3D tilt image */}
        <div className="mb-3">
          <TiltImage producto={producto} onAdd={handleAdd} />
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">(48)</span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-foreground leading-snug mb-0.5 line-clamp-1 group-hover:text-mannatech transition-colors">
          {producto.nombre}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-foreground">
            {formatPrecio(producto.precio)}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            {formatPrecio(Math.round(producto.precio * 1.1))}
          </span>
        </div>
      </Link>
    </div>
  );
}

export function FeaturedGrid({ productos, allProductos }: FeaturedGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const displayProducts = productos.length > 0 ? productos : allProductos.slice(0, 10);

  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [updateScrollButtons]);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  }

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.35em] mb-2">
              Lo Mejor de Mannatech
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Productos Destacados
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                canScrollLeft
                  ? "border-border text-foreground hover:bg-muted"
                  : "border-border/30 text-muted-foreground/30 cursor-not-allowed"
              }`}
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                canScrollRight
                  ? "border-border text-foreground hover:bg-muted"
                  : "border-border/30 text-muted-foreground/30 cursor-not-allowed"
              }`}
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayProducts.map((producto) => (
            <SliderCard key={producto.slug} producto={producto} />
          ))}
        </div>

        {/* View all */}
        <div className="mt-8 text-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-mannatech hover:text-mannatech-dark transition-colors group"
          >
            Ver todos los productos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
