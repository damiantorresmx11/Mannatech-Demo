"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Minus, Plus, Check, ChevronRight,
  Star, Truck, Flame, Shield, Leaf, Award,
} from "lucide-react";
import type { Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { ShareWhatsApp } from "@/components/shop/ShareWhatsApp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductDetailProps {
  producto: Producto;
  productosRelacionados?: Producto[];
}

const FREE_SHIPPING_THRESHOLD = 1500;
const thumbFilters = ["", "brightness(1.08)", "sepia(0.15) saturate(1.1)"];

export function ProductDetail({ producto, productosRelacionados = [] }: ProductDetailProps) {
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const vendidos = producto.slug.length * 17;

  function handleAddToCart() {
    for (let i = 0; i < cantidad; i++) {
      addItem({
        slug: producto.slug,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link href="/" className="hover:text-mannatech transition-colors">Inicio</Link>
          <ChevronRight size={14} />
          <Link href="/productos" className="hover:text-mannatech transition-colors">Productos</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium truncate">{producto.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT — Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-[#F2F0ED] dark:bg-zinc-800 mb-3">
              <div className="relative aspect-square">
                {producto.badge && (
                  <Badge className="absolute top-4 left-4 z-10 bg-mannatech hover:bg-mannatech text-white border-0 text-xs font-bold shadow-md">
                    {producto.badge}
                  </Badge>
                )}
                <motion.div
                  className="relative w-full h-full"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4, ease: "easeOut" as const }}
                >
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    className="object-contain p-10"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    style={{ filter: thumbFilters[activeThumb] }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {thumbFilters.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveThumb(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-[#F2F0ED] dark:bg-zinc-800 ${
                    activeThumb === idx ? "border-mannatech shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={producto.imagen}
                    alt=""
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                    style={{ filter: thumbFilters[idx] }}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            <Badge variant="secondary" className="bg-mannatech/10 text-mannatech border-mannatech/20 hover:bg-mannatech/15">
              {producto.categoria}
            </Badge>

            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground leading-tight">
              {producto.nombre}
            </h1>

            {/* Rating + social proof */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(48 reseñas)</span>
              </div>
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1.5 text-sm text-orange-600 font-semibold"
              >
                <Flame size={14} />
                {vendidos} vendidos esta semana
              </motion.span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-4xl font-extrabold text-mannatech">
                {formatPrecio(producto.precio)}
              </span>
              <span className="text-sm text-muted-foreground">IVA incluido</span>
            </div>

            {/* Free shipping */}
            {producto.precio >= FREE_SHIPPING_THRESHOLD && (
              <Tooltip>
                <TooltipTrigger className="inline-flex">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-mannatech/8 dark:bg-mannatech/15 border border-mannatech/15 rounded-xl text-sm font-medium text-mannatech cursor-help">
                    <Truck size={16} />
                    Envío gratis
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Envío gratis en pedidos mayores a ${FREE_SHIPPING_THRESHOLD.toLocaleString("es-MX")}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Separator />

            <p className="text-muted-foreground leading-relaxed">{producto.descripcionCorta}</p>
            <p className="text-sm text-muted-foreground">
              Presentación: <span className="font-medium text-foreground">{producto.presentacion}</span>
            </p>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center bg-secondary dark:bg-zinc-800 rounded-xl overflow-hidden border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="rounded-none h-12 w-11"
                >
                  <Minus size={16} />
                </Button>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cantidad}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="w-10 text-center font-bold text-sm"
                  >
                    {cantidad}
                  </motion.span>
                </AnimatePresence>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCantidad((c) => c + 1)}
                  className="rounded-none h-12 w-11"
                >
                  <Plus size={16} />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className={`flex-1 h-12 rounded-xl font-semibold text-base gap-2 transition-all duration-300 ${
                  added
                    ? "bg-green-500 hover:bg-green-500 text-white"
                    : "bg-mannatech hover:bg-mannatech-dark text-white shadow-lg shadow-mannatech/20"
                }`}
              >
                {added ? <><Check size={18} /> ¡Agregado!</> : <><ShoppingCart size={18} /> Agregar al Carrito</>}
              </Button>
            </div>

            {/* WhatsApp */}
            <ShareWhatsApp
              productoNombre={producto.nombre}
              productoSlug={producto.slug}
              size="md"
              className="w-full justify-center"
            />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { icon: Award, label: "Patentes Globales", value: "90+" },
                { icon: Leaf, label: "Certificado Sin OGM", value: "Sin OGM" },
                { icon: Shield, label: "Garantía", value: "90 días" },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <Tooltip key={badge.label}>
                    <TooltipTrigger className="inline-flex">
                      <div className="text-center p-3 rounded-xl bg-secondary dark:bg-zinc-800 border border-border cursor-help hover:border-mannatech/30 transition-colors">
                        <Icon size={18} className="text-mannatech mx-auto mb-1" />
                        <p className="text-xs font-bold text-foreground">{badge.value}</p>
                        <p className="text-[10px] text-muted-foreground">{badge.label}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{badge.value} {badge.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Accordion — Beneficios + Ingredientes */}
            <Accordion defaultValue={["beneficios"]} className="w-full">
              <AccordionItem value="beneficios" className="border rounded-2xl px-1 mb-2">
                <AccordionTrigger className="px-4 py-4 text-base font-semibold hover:no-underline">
                  Beneficios
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ul className="space-y-2.5">
                    {producto.beneficios.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check size={15} className="text-mannatech flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ingredientes" className="border rounded-2xl px-1">
                <AccordionTrigger className="px-4 py-4 text-base font-semibold hover:no-underline">
                  Ingredientes
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{producto.ingredientes}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>

        {/* Long description */}
        {producto.descripcionLarga && (
          <>
            <Separator className="my-12" />
            <div className="max-w-3xl">
              <h2 className="text-xl font-heading font-bold mb-4">Acerca de este producto</h2>
              <p className="text-muted-foreground leading-relaxed">{producto.descripcionLarga}</p>
            </div>
          </>
        )}

        {/* Related products carousel */}
        {productosRelacionados.length > 0 && (
          <>
            <Separator className="my-12" />
            <div>
              <h2 className="text-2xl font-heading font-bold mb-8">También te puede interesar</h2>
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {productosRelacionados.map((p) => (
                    <CarouselItem key={p.slug} className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                      <Link href={`/productos/${p.slug}`} className="group block">
                        <div className="rounded-2xl overflow-hidden bg-[#F2F0ED] dark:bg-zinc-800 mb-3">
                          <div className="relative aspect-square">
                            <Image
                              src={p.imagen}
                              alt={p.nombre}
                              fill
                              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 50vw, 25vw"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-0.5">{p.categoria}</p>
                        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-mannatech transition-colors">{p.nombre}</h3>
                        <p className="text-sm font-bold text-foreground mt-1">{formatPrecio(p.precio)}</p>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 hidden sm:flex" />
                <CarouselNext className="-right-4 hidden sm:flex" />
              </Carousel>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
