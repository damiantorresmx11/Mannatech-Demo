import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  slug: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cantidad">) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, cantidad: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getIVA: () => number;
  getTotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === item.slug
                  ? { ...i, cantidad: i.cantidad + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, cantidad: 1 }] };
        });
      },

      removeItem: (slug) => {
        set((state) => ({
          items: state.items.filter((i) => i.slug !== slug),
        }));
      },

      updateQuantity: (slug, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(slug);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug ? { ...i, cantidad } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        const items = get().items;
        return items.reduce((sum, item) => {
          const precioSinIVA = item.precio / 1.16;
          return sum + precioSinIVA * item.cantidad;
        }, 0);
      },

      getIVA: () => {
        return get().getSubtotal() * 0.16;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return subtotal + subtotal * 0.16;
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.cantidad, 0);
      },
    }),
    {
      name: "mannatech-cart",
    }
  )
);
