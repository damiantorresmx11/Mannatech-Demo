"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import type { Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";

interface ProductCard3DProps {
  producto: Producto;
  onQuickView?: (producto: Producto) => void;
}

export function ProductCard3D({ producto, onQuickView }: ProductCard3DProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Image */}
        <Link href={`/productos/${producto.slug}`} className="block relative overflow-hidden h-56">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {producto.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-mannatech text-white text-xs font-semibold rounded-full shadow-sm z-20">
              {producto.badge}
            </span>
          )}
          {/* Quick view overlay */}
          {onQuickView && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center z-20">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(producto);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-4 py-2.5 bg-white text-foreground text-sm font-medium rounded-xl shadow-lg"
              >
                <Eye size={16} />
                Vista Rapida
              </button>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
            {producto.categoria}
          </p>
          <Link href={`/productos/${producto.slug}`}>
            <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 hover:text-mannatech transition-colors line-clamp-2">
              {producto.nombre}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {producto.descripcionCorta}
          </p>

          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-xl font-bold text-mannatech">
                {formatPrecio(producto.precio)}
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                {producto.presentacion}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              addItem({
                slug: producto.slug,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
              })
            }
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-mannatech text-white text-sm font-medium rounded-xl hover:bg-mannatech-dark transition-colors"
          >
            <ShoppingCart size={15} />
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
