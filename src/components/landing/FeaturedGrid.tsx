"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Flame, Star } from "lucide-react";
import type { Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";

interface FeaturedGridProps {
  productos: Producto[];
  allProductos: Producto[];
}

function QuickCard({ producto, large = false }: { producto: Producto; large?: boolean }) {
  const addItem = useCartStore((s) => s.addItem);
  const vendidos = producto.slug.length * 7;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ slug: producto.slug, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen });
  }

  return (
    <div className="group h-full">
      <Link href={`/productos/${producto.slug}`} className="block h-full">
        <div className="relative bg-[#F2F0ED] dark:bg-zinc-800 rounded-2xl overflow-hidden h-full flex flex-col hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] transition-all duration-300">
          {/* Image */}
          <div className={`relative ${large ? "h-[380px] sm:h-[440px]" : "h-[260px] sm:h-[300px]"}`}>
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
              sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
            />
            {producto.badge && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-mannatech text-white text-[11px] font-bold rounded-lg shadow-md z-10">
                {producto.badge}
              </span>
            )}
            <button
              onClick={handleAdd}
              className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-[#0A0A0A] dark:bg-white dark:text-black text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
              aria-label={`Agregar ${producto.nombre}`}
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Info */}
          <div className="p-5 bg-white dark:bg-zinc-900 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">(48)</span>
            </div>
            <h3 className={`font-semibold text-foreground leading-snug mb-1 group-hover:text-mannatech transition-colors ${large ? "text-lg" : "text-sm"}`}>
              {producto.nombre}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
              {producto.descripcionCorta}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className={`font-extrabold text-foreground ${large ? "text-2xl" : "text-lg"}`}>
                {formatPrecio(producto.precio)}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-orange-500 font-medium">
                <Flame size={10} />
                {vendidos} vendidos
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function FeaturedGrid({ productos, allProductos }: FeaturedGridProps) {
  const heroProducts = productos.slice(0, 2);
  const gridProducts = productos.slice(2, 6);
  const otherProducts = allProductos
    .filter((p) => !productos.some((fp) => fp.slug === p.slug))
    .slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.3em] mb-3">
              Lo más vendido
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05]">
              Productos{" "}
              <span className="font-heading italic font-normal text-mannatech">destacados</span>
            </h2>
          </div>
          <Link
            href="/productos"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-mannatech transition-colors group"
          >
            Ver todos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Hero row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {heroProducts.map((p) => (
            <QuickCard key={p.slug} producto={p} large />
          ))}
        </div>

        {/* Grid row */}
        {gridProducts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {gridProducts.map((p) => (
              <QuickCard key={p.slug} producto={p} />
            ))}
          </div>
        )}

        {/* Also like */}
        {otherProducts.length > 0 && (
          <>
            <div className="flex items-center gap-4 my-10">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground whitespace-nowrap">
                También te puede interesar
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {otherProducts.map((p) => (
                <QuickCard key={p.slug} producto={p} />
              ))}
            </div>
          </>
        )}

        <div className="sm:hidden text-center mt-8">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-mannatech text-white font-semibold rounded-xl text-sm"
          >
            Ver todos los productos <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
