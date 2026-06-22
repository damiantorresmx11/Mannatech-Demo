"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, Star, ArrowRight } from "lucide-react";
import type { Distribuidor, Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";

interface DistributorPageProps {
  distribuidor: Distribuidor;
  productosFavoritos: Producto[];
}

export function DistributorPage({ distribuidor, productosFavoritos }: DistributorPageProps) {
  const waUrl = `https://wa.me/${distribuidor.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hola ${distribuidor.nombre}, me interesa conocer más sobre los productos Mannatech.`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mannatech/5 to-mannatech-light/5 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-mannatech/6 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-mannatech/20">
                <Image
                  src={distribuidor.foto}
                  alt={distribuidor.nombre}
                  fill
                  className="object-cover"
                  sizes="176px"
                />
              </div>
              {/* Nivel badge */}
              <div className="mt-3 flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-mannatech text-white text-xs font-semibold rounded-full shadow">
                  <Star size={11} />
                  {distribuidor.nivel}
                </span>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex-1 text-center sm:text-left"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
                {distribuidor.nombre}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-muted-foreground mb-5">
                <MapPin size={14} />
                {distribuidor.ubicacion}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
                {distribuidor.bio}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20BD5A] transition-colors shadow-lg shadow-green-500/20"
                >
                  <MessageCircle size={20} />
                  Contáctame por WhatsApp
                </motion.a>
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border text-foreground font-semibold rounded-xl hover:border-mannatech hover:text-mannatech transition-colors"
                >
                  Ver Catálogo
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Favorite products */}
      {productosFavoritos.length > 0 && (
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-6">
              Mis Productos Recomendados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productosFavoritos.map((producto, idx) => (
                <motion.div
                  key={producto.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.08 }}
                >
                  <Link href={`/productos/${producto.slug}`}>
                    <div className="group bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={producto.imagen}
                          alt={producto.nombre}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-400"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {producto.badge && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 bg-mannatech text-white text-xs font-semibold rounded-full">
                            {producto.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-1">
                          {producto.nombre}
                        </h3>
                        <p className="text-mannatech font-bold">
                          {formatPrecio(producto.precio)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
