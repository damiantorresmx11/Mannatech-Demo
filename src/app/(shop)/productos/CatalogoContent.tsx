"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Categoria, Producto } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CatalogoContentProps {
  productos: Producto[];
  categorias: Categoria[];
  initialCategoria?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function CatalogoContent({ productos, categorias, initialCategoria }: CatalogoContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoria, setActiveCategoria] = useState<string>(initialCategoria ?? "all");

  const filteredProductos = useMemo(() => {
    return productos.filter((p) => {
      const matchesCategoria = activeCategoria === "all" || p.categoria === activeCategoria;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcionCorta.toLowerCase().includes(q);
      return matchesCategoria && matchesSearch;
    });
  }, [productos, activeCategoria, searchQuery]);

  const activeCatName = categorias.find((c) => c.id === activeCategoria)?.nombre;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero banner */}
      <div className="relative mb-10 overflow-hidden">
        <div className="relative h-[240px] sm:h-[280px] bg-gradient-to-br from-[#0A0A0A] via-[#1a2e35] to-[#0A0A0A] overflow-hidden rounded-2xl">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, rgba(0,168,143,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(105,202,152,0.3) 0%, transparent 40%)"
          }} />
          <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12">
            <p className="text-mannatech-light text-xs font-semibold uppercase tracking-[0.3em] mb-3">
              Colección Completa
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-[1.05]">
              Catálogo de{" "}
              <span className="font-heading italic font-normal text-mannatech-light">Productos</span>
            </h1>
            <p className="text-white/45 text-sm sm:text-base max-w-lg">
              {productos.length} productos respaldados por ciencia
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-lg mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-11 pr-5 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mannatech/20 focus:border-mannatech/40 transition-all text-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategoria} onValueChange={setActiveCategoria} className="mb-6">
        <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="rounded-xl data-[state=active]:bg-mannatech data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 text-sm"
          >
            Todos
          </TabsTrigger>
          {categorias.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="rounded-xl data-[state=active]:bg-mannatech data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 text-sm gap-2"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: activeCategoria === cat.id ? "white" : cat.color }}
              />
              {cat.nombre}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Separator className="mb-6" />

      {/* Results + sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredProductos.length}</span> producto{filteredProductos.length !== 1 ? "s" : ""}
            {activeCatName && (
              <> en <Badge variant="secondary" className="ml-1">{activeCatName}</Badge></>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-muted-foreground" />
          <select className="text-sm border border-border rounded-xl px-3 py-2 bg-background text-foreground/70 focus:outline-none focus:ring-1 focus:ring-mannatech/30">
            <option>Destacados</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
            <option>Nombre A-Z</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filteredProductos.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 text-muted-foreground"
          >
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No se encontraron productos</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategoria("all"); }}
              className="mt-4 text-mannatech text-sm hover:underline"
            >
              Limpiar filtros
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${activeCategoria}-${searchQuery}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {filteredProductos.map((producto, idx) => (
              <motion.div key={producto.slug} variants={itemVariants}>
                <ProductCard producto={producto} index={idx} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
