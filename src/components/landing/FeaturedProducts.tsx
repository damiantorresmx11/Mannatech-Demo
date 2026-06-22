"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Producto } from "@/lib/types";
import { formatPrecio } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";

interface FeaturedProductsProps {
  productos: Producto[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function InlineCartButton({ producto }: { producto: Producto }) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItem = items.find((i) => i.slug === producto.slug);
  const qty = cartItem?.cantidad ?? 0;
  const t = useTranslations("landing.featuredProducts");

  function handleAdd() {
    addItem({
      slug: producto.slug,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    });
  }

  return (
    <div className="relative h-10">
      <AnimatePresence mode="wait">
        {qty === 0 ? (
          <motion.button
            key="add"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={handleAdd}
            className="w-full h-10 flex items-center justify-center gap-1.5 bg-mannatech text-white text-sm font-medium rounded-xl hover:bg-mannatech-dark transition-colors"
          >
            <ShoppingCart size={15} />
            {t("add")}
          </motion.button>
        ) : (
          <motion.div
            key="qty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between h-10 bg-mannatech/10 rounded-xl border border-mannatech/20 overflow-hidden"
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => updateQuantity(producto.slug, qty - 1)}
              className="w-10 h-full flex items-center justify-center text-mannatech hover:bg-mannatech/20 transition-colors"
              aria-label={t("decreaseQty")}
            >
              <Minus size={15} />
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.span
                key={qty}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-bold text-mannatech min-w-[2rem] text-center"
              >
                {qty}
              </motion.span>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleAdd}
              className="w-10 h-full flex items-center justify-center text-mannatech hover:bg-mannatech/20 transition-colors"
              aria-label={t("increaseQty")}
            >
              <Plus size={15} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FeaturedProducts({ productos }: FeaturedProductsProps) {
  const t = useTranslations("landing.featuredProducts");

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mannatech mb-4">
            {t("overline")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
            {t("headline")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t("description")}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {productos.map((producto) => (
            <motion.div key={producto.slug} variants={cardVariants}>
              <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg">
                {/* Image */}
                <Link href={`/productos/${producto.slug}`} className="block relative overflow-hidden h-52">
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {producto.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-mannatech text-white text-xs font-semibold rounded-full shadow-sm">
                      {producto.badge}
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {producto.categoria}
                  </p>
                  <Link href={`/productos/${producto.slug}`}>
                    <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 hover:text-mannatech transition-colors line-clamp-2">
                      {producto.nombre}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mt-3 mb-4">
                    <span className="text-lg font-bold text-mannatech">
                      {formatPrecio(producto.precio)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {producto.presentacion}
                    </span>
                  </div>

                  <InlineCartButton producto={producto} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-mannatech text-mannatech font-semibold rounded-full hover:bg-mannatech hover:text-white transition-colors"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
