"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Flame } from "lucide-react";
import type { Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { Product3DCard } from "@/components/Product3DCard";

interface ProductCardProps {
  producto: Producto;
  index?: number;
}

const EASE = "easeOut" as const;

function badgeColor(badge: string | null): string {
  if (!badge) return "";
  const b = badge.toLowerCase();
  if (b.includes("vendido") || b.includes("insignia")) return "bg-mannatech";
  if (b.includes("premium")) return "bg-amber-600";
  if (b.includes("favorito")) return "bg-pink-500";
  if (b.includes("fitness")) return "bg-red-500";
  if (b.includes("k-beauty")) return "bg-purple-500";
  return "bg-mannatech";
}

export function ProductCard({ producto, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItem = items.find((i) => i.slug === producto.slug);
  const qty = cartItem?.cantidad ?? 0;
  const vendidos = producto.slug.length * 7;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ slug: producto.slug, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen });
  }

  function handleMinus(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(producto.slug, qty - 1);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
      className="h-full"
    >
      <Product3DCard intensity={10} className="h-full">
        <div className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-300">
          {/* Image area */}
          <Link href={`/productos/${producto.slug}`} className="block relative" style={{ aspectRatio: "3/4" }}>
            <div className="absolute inset-0 bg-[#F2F0ED] dark:bg-zinc-800 overflow-hidden">
              <div className="relative w-full h-full p-3">
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-mannatech/5 via-transparent to-transparent" />
            </div>
            {producto.badge && (
              <span className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold tracking-wide shadow-md ${badgeColor(producto.badge)}`}>
                {producto.badge}
              </span>
            )}
          </Link>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 pt-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span className="w-2 h-2 rounded-full bg-mannatech inline-block" />
              {producto.categoria}
            </p>
            <Link href={`/productos/${producto.slug}`}>
              <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-2 hover:text-mannatech transition-colors">
                {producto.nombre}
              </h3>
            </Link>

            <div className="flex items-baseline gap-2 mb-3 mt-auto">
              <span className="text-xl font-extrabold text-foreground">
                {formatPrecio(producto.precio)}
              </span>
              <span className="text-xs text-muted-foreground">{producto.presentacion}</span>
            </div>

            {/* Cart controls */}
            <AnimatePresence mode="wait">
              {qty === 0 ? (
                <motion.button
                  key="add"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleAdd}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-mannatech text-white text-sm font-semibold rounded-xl hover:bg-mannatech-dark transition-colors shadow-sm active:scale-[0.97]"
                >
                  <Plus size={16} />
                  Agregar
                </motion.button>
              ) : (
                <motion.div
                  key="qty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-mannatech/10 rounded-xl border border-mannatech/20 overflow-hidden"
                >
                  <button onClick={handleMinus} className="w-12 h-11 flex items-center justify-center text-mannatech hover:bg-mannatech/20 transition-colors">
                    <Minus size={16} />
                  </button>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={qty}
                      initial={{ scale: 1.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="text-sm font-bold text-mannatech min-w-[2.5rem] text-center"
                    >
                      {qty}
                    </motion.span>
                  </AnimatePresence>
                  <button onClick={handleAdd} className="w-12 h-11 flex items-center justify-center text-mannatech hover:bg-mannatech/20 transition-colors">
                    <Plus size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="flex items-center gap-1 text-[11px] text-orange-500/70 mt-2.5 font-medium">
              <Flame size={11} />
              {vendidos} vendidos
            </p>
          </div>
        </div>
      </Product3DCard>
    </motion.div>
  );
}
