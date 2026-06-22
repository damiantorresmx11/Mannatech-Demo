"use client";

import { useCartStore } from "@/lib/cart-store";
import { formatPrecio } from "@/lib/format";
import type { Producto } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_COST = 99;

interface CarritoContentProps {
  todosLosProductos?: Producto[];
}

export function CarritoContent({ todosLosProductos = [] }: CarritoContentProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { items, removeItem, updateQuantity, getSubtotal, getIVA, getTotal, addItem } =
    useCartStore();
  const total = getTotal();
  const faltaParaEnvioGratis = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const shippingProgress = Math.min(1, total / FREE_SHIPPING_THRESHOLD);
  const envioGratis = total >= FREE_SHIPPING_THRESHOLD;
  const costoEnvio = envioGratis ? 0 : SHIPPING_COST;

  // Pick 3 products not already in cart
  const recomendados = useMemo(() => {
    const slugsEnCarrito = new Set(items.map((i) => i.slug));
    const disponibles = todosLosProductos.filter((p) => !slugsEnCarrito.has(p.slug));
    // Deterministic pseudo-random: pick first 3 from filtered list, offset by items count
    const offset = items.length % Math.max(1, disponibles.length);
    const result: Producto[] = [];
    for (let i = 0; i < 3 && i < disponibles.length; i++) {
      result.push(disponibles[(offset + i) % disponibles.length]);
    }
    return result;
  }, [items, todosLosProductos]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-mannatech border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated floating shopping bag */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-mannatech/10 flex items-center justify-center mx-auto">
              <ShoppingBag size={40} className="text-mannatech/40" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold mb-3">Tu carrito esta vacio</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Descubre nuestros productos y agrega los que mas te interesen
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-mannatech text-white font-semibold rounded-xl hover:bg-mannatech-dark transition-colors"
          >
            Ver Productos
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Tu Carrito</h1>

      {/* Free shipping progress bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 p-4 rounded-2xl bg-mannatech/[0.04] border border-mannatech/10"
      >
        <div className="flex items-center gap-2 text-sm mb-2.5">
          <Truck size={16} className="text-mannatech flex-shrink-0" />
          {faltaParaEnvioGratis > 0 ? (
            <span className="text-muted-foreground">
              Agrega <span className="font-bold text-mannatech">{formatPrecio(faltaParaEnvioGratis)}</span> mas para <span className="font-semibold">envio gratis</span>
            </span>
          ) : (
            <span className="font-semibold text-mannatech">Felicidades! Tu envio es gratis</span>
          )}
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-mannatech rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${shippingProgress * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, x: -40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: -80,
                  scale: 0.9,
                  transition: { duration: 0.3, ease: "easeIn" as const },
                }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="flex gap-4 p-4 sm:p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm"
              >
                {/* Image */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-border bg-secondary">
                  <Image
                    src={item.imagen}
                    alt={item.nombre}
                    fill
                    className="object-contain p-1"
                    sizes="96px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground leading-snug line-clamp-2 mb-1">
                    {item.nombre}
                  </h3>
                  <p className="text-lg font-bold text-mannatech mb-3">
                    {formatPrecio(item.precio)}
                  </p>

                  <div className="flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.slug, item.cantidad - 1)}
                        className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-mannatech/10 hover:text-mannatech transition-colors"
                        aria-label="Reducir cantidad"
                      >
                        <Minus size={14} />
                      </button>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={item.cantidad}
                          initial={{ scale: 1.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="w-10 text-center font-semibold text-sm"
                        >
                          {item.cantidad}
                        </motion.span>
                      </AnimatePresence>
                      <button
                        onClick={() => updateQuantity(item.slug, item.cantidad + 1)}
                        className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-mannatech/10 hover:text-mannatech transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line total + remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground hidden sm:block">
                        {formatPrecio(item.precio * item.cantidad)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.slug)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-red-50"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-mannatech/40 via-mannatech-light/20 to-mannatech/40 sticky top-24">
            <div className="bg-white rounded-[14px] p-6">
              <h2 className="font-bold text-lg mb-5">Resumen del pedido</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal (sin IVA)</span>
                  <span>{formatPrecio(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>IVA (16%)</span>
                  <span>{formatPrecio(getIVA())}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envio</span>
                  {envioGratis ? (
                    <span className="font-semibold text-mannatech">Gratis</span>
                  ) : (
                    <span>{formatPrecio(costoEnvio)}</span>
                  )}
                </div>
                <div className="flex justify-between font-bold text-base text-foreground pt-3 border-t border-border">
                  <span>Total</span>
                  <motion.span
                    key={total + costoEnvio}
                    initial={{ scale: 1.15, color: "#00897B" }}
                    animate={{ scale: 1, color: "#00897B" }}
                    transition={{ duration: 0.3 }}
                    className="text-lg"
                  >
                    {formatPrecio(total + costoEnvio)}
                  </motion.span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-mannatech text-white font-semibold rounded-xl hover:bg-mannatech-dark transition-colors"
              >
                Proceder al Checkout
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/productos"
                className="block text-center mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommended products */}
      {recomendados.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-10 border-t border-border"
        >
          <h2 className="text-xl font-heading font-bold mb-6">Productos que te pueden interesar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recomendados.map((p) => (
              <motion.div
                key={p.slug}
                whileHover={{ y: -4 }}
                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/productos/${p.slug}`}>
                  <div className="relative h-40 overflow-hidden bg-mannatech/[0.03]">
                    <Image
                      src={p.imagen}
                      alt={p.nombre}
                      fill
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {p.categoria}
                  </p>
                  <Link href={`/productos/${p.slug}`}>
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-mannatech transition-colors">
                      {p.nombre}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-mannatech">
                      {formatPrecio(p.precio)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => addItem({ slug: p.slug, nombre: p.nombre, precio: p.precio, imagen: p.imagen })}
                      className="w-9 h-9 rounded-full bg-mannatech text-white flex items-center justify-center hover:bg-mannatech-dark transition-colors shadow-sm"
                      aria-label={`Agregar ${p.nombre}`}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
