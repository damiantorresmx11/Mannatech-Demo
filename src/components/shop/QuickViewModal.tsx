"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { useNotification } from "@/components/Notification";

interface QuickViewModalProps {
  producto: Producto | null;
  onClose: () => void;
}

export function QuickViewModal({ producto, onClose }: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { notify } = useNotification();

  function handleAdd() {
    if (!producto) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        slug: producto.slug,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
      });
    }
    notify("success", `${producto.nombre} agregado al carrito`);
    onClose();
    setQty(1);
  }

  return (
    <AnimatePresence>
      {producto && (
        <>
          <motion.div
            key="qv-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="qv-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[71] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 sm:h-full min-h-[300px]">
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  fill
                  className="object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {producto.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-mannatech text-white text-xs font-semibold rounded-full">
                    {producto.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                  {producto.categoria}
                </p>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {producto.nombre}
                </h2>
                <p className="text-2xl font-bold text-mannatech mb-3">
                  {formatPrecio(producto.precio)}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {producto.descripcionCorta}
                </p>

                {/* Benefits */}
                {producto.beneficios.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-2">
                      Beneficios
                    </p>
                    <ul className="space-y-1">
                      {producto.beneficios.slice(0, 3).map((b, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-mannatech flex-shrink-0 mt-1" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto space-y-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground/70">Cantidad:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-mannatech transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">{qty}</span>
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-mannatech transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-mannatech text-white text-sm font-semibold rounded-xl hover:bg-mannatech-dark transition-colors"
                  >
                    <ShoppingCart size={16} />
                    Agregar al carrito
                  </button>

                  {/* Full detail link */}
                  <Link
                    href={`/productos/${producto.slug}`}
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-mannatech hover:underline"
                  >
                    Ver detalle completo
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
