"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { CartDrawer } from "@/components/shop/cart/CartDrawer";

export function CartButton() {
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.cantidad, 0)
    : 0;

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Abrir carrito"
      >
        <ShoppingCart size={22} className="text-foreground/80" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-mannatech text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
