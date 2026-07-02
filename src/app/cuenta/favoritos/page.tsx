"use client";

import { mockCliente } from "@/lib/mock-data/cliente";
import { EmptyState } from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Package, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

function formatMXN(value: number): string {
  return `$${value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FavoritosPage() {
  const favoritos = [...mockCliente.favoritos];

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground mb-6">
        Mis Favoritos
      </h1>

      {favoritos.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Heart}
              title="No tienes favoritos aun"
              description="Explora nuestro catalogo y guarda los productos que mas te gusten."
            />
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {favoritos.map((fav) => (
            <motion.div key={fav.slug} variants={item}>
              <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                {/* Image placeholder */}
                <div className="flex aspect-square items-center justify-center bg-[#F2F0ED] dark:bg-zinc-800">
                  <Package className="size-12 text-zinc-300 dark:text-zinc-600 transition-transform group-hover:scale-110" />
                </div>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[#00A88F] dark:text-[#00C9A7] uppercase tracking-wide">
                      {fav.categoria}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {fav.nombre}
                    </p>
                  </div>
                  <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {formatMXN(fav.precio)}
                  </p>
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full gap-2 bg-[#00A88F] hover:bg-[#00A88F]/90 dark:bg-[#00C9A7] dark:hover:bg-[#00C9A7]/90 text-white"
                  >
                    <ShoppingCart className="size-4" />
                    Agregar al carrito
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
