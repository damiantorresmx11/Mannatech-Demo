"use client";

import { useEffect } from "react";
import { ShoppingBag, X, Trash2, Plus, Minus, Truck } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrecio } from "@/lib/format";
import { useLenisLock } from "@/providers/SmoothScrollProvider";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 1500;

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getSubtotal, getIVA, getTotal } =
    useCartStore();

  const total = getTotal();

  // Pause Lenis smooth scroll while drawer is open
  useLenisLock(open);
  const faltaParaEnvioGratis = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const envioGratis = total >= FREE_SHIPPING_THRESHOLD;
  const shippingProgress = Math.min(1, total / FREE_SHIPPING_THRESHOLD);

  // Scroll-lock
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tu carrito"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-mannatech" />
            <h2 className="text-lg font-medium text-foreground">Tu Carrito</h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-mannatech text-white text-xs font-bold rounded-full">
                {items.reduce((s, i) => s + i.cantidad, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="shrink-0 px-5 py-3 border-b border-border bg-mannatech/[0.03] dark:bg-mannatech/[0.06]">
            <div className="flex items-center gap-2 text-sm mb-2">
              <Truck size={15} className="text-mannatech shrink-0" />
              {faltaParaEnvioGratis > 0 ? (
                <span className="text-muted-foreground">
                  Agrega <span className="font-bold text-mannatech">{formatPrecio(faltaParaEnvioGratis)}</span> más para envío gratis
                </span>
              ) : (
                <span className="font-semibold text-mannatech">¡Envío gratis incluido!</span>
              )}
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-mannatech rounded-full transition-all duration-500 ease-out"
                style={{ width: `${shippingProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Items — ONLY scrollable zone */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm font-medium text-foreground mb-1">Tu carrito está vacío</p>
              <p className="text-xs text-muted-foreground mb-5">Agrega productos para comenzar</p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-mannatech text-white text-sm font-medium rounded-xl hover:bg-mannatech-dark transition-colors"
              >
                Explorar Productos
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-3 p-3 rounded-xl bg-secondary/50">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#F2F0ED] dark:bg-zinc-700 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>

                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {item.nombre}
                    </span>
                    <span className="text-sm font-bold text-mannatech mt-0.5">
                      {formatPrecio(item.precio * item.cantidad)}
                    </span>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center bg-background rounded-lg border border-border overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.slug, item.cantidad - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-mannatech/10 transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.slug, item.cantidad + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-mannatech/10 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.slug)}
                        aria-label={`Quitar ${item.nombre}`}
                        className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="shrink-0 border-t border-border px-5 py-4">
            <div className="mb-1.5 flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrecio(getSubtotal())}</span>
            </div>
            <div className="mb-2 flex justify-between text-sm text-muted-foreground">
              <span>IVA (16%)</span>
              <span>{formatPrecio(getIVA())}</span>
            </div>
            {envioGratis && (
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="font-semibold text-mannatech">Gratis</span>
              </div>
            )}
            <div className="mb-4 flex justify-between text-base font-bold text-foreground border-t border-border pt-2.5">
              <span>Total</span>
              <span className="text-mannatech">{formatPrecio(total)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-xl bg-mannatech py-3 text-center text-[15px] font-semibold text-white transition hover:bg-mannatech-dark"
            >
              Proceder al pago
            </Link>
            <button
              onClick={onClose}
              className="mt-2 block w-full rounded-xl border border-border py-2.5 text-center text-sm text-muted-foreground transition hover:bg-muted"
            >
              Seguir comprando
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
