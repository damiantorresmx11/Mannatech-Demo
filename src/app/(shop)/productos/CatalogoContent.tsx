"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import type { Categoria, Producto } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";

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

type SortOption = "featured" | "price-asc" | "price-desc" | "name-az";

function SidebarSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-3"
      >
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && children}
    </div>
  );
}

export function CatalogoContent({ productos, categorias, initialCategoria }: CatalogoContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoria, setActiveCategoria] = useState<string>(initialCategoria ?? "all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const filteredProductos = useMemo(() => {
    let result = productos.filter((p) => {
      const matchesCategoria = activeCategoria === "all" || p.categoria === activeCategoria;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcionCorta.toLowerCase().includes(q);
      return matchesCategoria && matchesSearch;
    });

    // Sort
    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.precio - b.precio);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.precio - a.precio);
        break;
      case "name-az":
        result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
    }

    return result;
  }, [productos, activeCategoria, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Todos los Productos</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Inicio / Tienda / Todos los Productos
      </p>

      {/* Search bar — full width */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar en la tienda"
          className="w-full pl-11 pr-5 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mannatech/20 focus:border-mannatech/40 transition-all text-sm"
        />
      </div>

      <div className="flex gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-[calc(72px+var(--announcement-bar-height)+2rem)]">
            {/* Category links */}
            <SidebarSection title="Categorías">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveCategoria("all")}
                    className={`text-sm w-full text-left transition-colors ${
                      activeCategoria === "all"
                        ? "text-mannatech font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Todos los Productos
                  </button>
                </li>
                {categorias.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategoria(cat.id)}
                      className={`text-sm w-full text-left transition-colors ${
                        activeCategoria === cat.id
                          ? "text-mannatech font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            </SidebarSection>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort + count bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredProductos.length}</span>{" "}
              producto{filteredProductos.length !== 1 ? "s" : ""}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground/70 focus:outline-none focus:ring-1 focus:ring-mannatech/30"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-az">A a Z</option>
            </select>
          </div>

          {/* Mobile category filter */}
          <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategoria("all")}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                activeCategoria === "all"
                  ? "bg-mannatech text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoria(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  activeCategoria === cat.id
                    ? "bg-mannatech text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Product Grid */}
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
                key={`grid-${activeCategoria}-${searchQuery}-${sortBy}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
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
      </div>
    </div>
  );
}
