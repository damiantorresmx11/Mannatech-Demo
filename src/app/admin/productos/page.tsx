"use client";

import { Button } from "@/components/ui/button";
import { Plus, Package, RefreshCw, Loader2, X, Trash2, Search, Box, TrendingUp, Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { getProducts, createProduct, deleteProduct } from "@/lib/medusa-admin";
import { motion, AnimatePresence } from "framer-motion";

interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  status: string;
  thumbnail: string | null;
  collection: { title: string } | null;
  categories: { name: string }[] | null;
  variants: {
    prices: { amount: number; currency_code: string }[];
    inventory_quantity: number;
  }[];
}

function CreateProductModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createProduct({
        title: title.trim(),
        description: description.trim() || undefined,
        status: "draft",
        options: [{ title: "Default", values: ["Default"] }],
        variants: [{
          title: "Default",
          options: { Default: "Default" },
          prices: price ? [{ amount: Math.round(parseFloat(price) * 100), currency_code: "mxn" }] : [],
          manage_inventory: true,
        }],
      });
      onCreated();
      onClose();
    } catch {
      setError("Error al crear producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-2xl border border-zinc-700/50 bg-zinc-900 p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-zinc-100">Nuevo Producto</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
              <X className="size-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400 uppercase tracking-wider">Nombre *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Ambrotose Complex" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400 uppercase tracking-wider">Descripcion</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                placeholder="Suplemento de glyconutrientes..." />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400 uppercase tracking-wider">Precio (MXN)</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="1299.00" />
            </div>
            {error && <p className="text-sm text-red-400 bg-red-950/50 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving || !title.trim()} className="bg-blue-600 hover:bg-blue-500 text-white border-0 disabled:opacity-50">
                {saving ? <><Loader2 className="size-4 animate-spin mr-1.5" /> Creando...</> : "Crear Producto"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

type FilterTab = "all" | "active" | "draft";

export default function ProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchFocused, setSearchFocused] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (!confirm(`Eliminar "${title}"?`)) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Error al eliminar producto");
    } finally {
      setDeleting(null);
    }
  };

  const getPrice = (product: MedusaProduct) => {
    const variant = product.variants?.[0];
    if (!variant?.prices?.length) return "---";
    const price = variant.prices[0];
    return `$${(price.amount / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${price.currency_code.toUpperCase()}`;
  };

  const getStock = (product: MedusaProduct) => product.variants?.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0) ?? 0;

  const getCategory = (product: MedusaProduct) => {
    if (product.categories?.length) return product.categories[0].name;
    if (product.collection) return product.collection.title;
    return "---";
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (activeTab === "active") filtered = filtered.filter((p) => p.status === "published");
    if (activeTab === "draft") filtered = filtered.filter((p) => p.status === "draft");
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q));
    }
    return filtered;
  }, [products, activeTab, search]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((p) => p.status === "published").length,
    draft: products.filter((p) => p.status === "draft").length,
    totalStock: products.reduce((sum, p) => sum + getStock(p), 0),
  }), [products]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "active", label: "Activos" },
    { key: "draft", label: "Borrador" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">Productos</h1>
          <p className="text-sm text-zinc-400 mt-1">Gestiona tu catalogo de productos</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading}
            className="gap-1.5 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
          <Button onClick={() => setShowCreate(true)}
            className="gap-1.5 bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-600/20">
            <Plus className="size-4" /> Agregar
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Productos", value: stats.total, icon: Package, color: "blue" },
          { label: "Activos", value: stats.active, icon: TrendingUp, color: "emerald" },
          { label: "Borrador", value: stats.draft, icon: Archive, color: "amber" },
          { label: "Stock Total", value: stats.totalStock, icon: Box, color: "violet" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{stat.label}</span>
              <div className={`rounded-lg p-1.5 ${
                stat.color === "blue" ? "bg-blue-500/10 text-blue-400" :
                stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                stat.color === "amber" ? "bg-amber-500/10 text-amber-400" :
                "bg-violet-500/10 text-violet-400"
              }`}>
                <stat.icon className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search + Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <motion.div
            animate={{ boxShadow: searchFocused ? "0 0 0 3px rgba(59, 130, 246, 0.15)" : "0 0 0 0px rgba(59, 130, 246, 0)" }}
            className="rounded-xl"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar productos..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-800/60 p-1 border border-zinc-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors"
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-zinc-700"
                  transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
                />
              )}
              <span className={`relative z-10 ${activeTab === tab.key ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200"}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      {showCreate && <CreateProductModal onClose={() => setShowCreate(false)} onCreated={fetchProducts} />}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-800/50 bg-red-950/30 p-4 text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        /* Loading Skeleton */
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
          <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-3 flex gap-4">
            {[200, 100, 80, 60, 80, 60].map((w, i) => (
              <div key={i} className="h-4 rounded-md bg-zinc-800 animate-pulse" style={{ width: w }} />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-zinc-800/50 px-4 py-4">
              <div className="size-10 rounded-lg bg-zinc-800 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded-md bg-zinc-800 animate-pulse" />
                <div className="h-3 w-24 rounded-md bg-zinc-800/60 animate-pulse" />
              </div>
              <div className="h-5 w-16 rounded-full bg-zinc-800 animate-pulse" />
              <div className="h-4 w-20 rounded-md bg-zinc-800 animate-pulse" />
              <div className="h-4 w-10 rounded-md bg-zinc-800 animate-pulse" />
              <div className="h-5 w-16 rounded-full bg-zinc-800 animate-pulse" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="rounded-2xl bg-zinc-800/50 border border-zinc-700/50 p-6 mb-5">
            <Package className="size-12 text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-100">
            {search || activeTab !== "all" ? "Sin resultados" : "Sin productos"}
          </h3>
          <p className="text-sm text-zinc-400 mt-2 max-w-sm">
            {search || activeTab !== "all"
              ? "No se encontraron productos con los filtros actuales. Intenta ajustar tu busqueda."
              : "Comienza agregando tu primer producto al catalogo con el boton de arriba."
            }
          </p>
        </motion.div>
      ) : (
        /* Table */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Producto</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Categoria</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Precio</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Estatus</th>
                <th className="px-5 py-3.5 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider w-20"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredProducts.map((product, index) => {
                  const stock = getStock(product);
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      onClick={() => router.push(`/admin/productos/${product.id}`)}
                      className="group border-b border-zinc-800/50 hover:bg-zinc-800/40 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {product.thumbnail ? (
                            <motion.img
                              whileHover={{ scale: 1.05 }}
                              src={product.thumbnail}
                              alt=""
                              className="size-10 rounded-lg object-cover ring-1 ring-zinc-700"
                            />
                          ) : (
                            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                              <Package className="size-5 text-blue-400" />
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-zinc-100 group-hover:text-white transition-colors">{product.title}</span>
                            <p className="text-xs text-zinc-500 mt-0.5">{product.handle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300 ring-1 ring-zinc-700/50">
                          {getCategory(product)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-zinc-100">{getPrice(product)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`size-2 rounded-full ${
                            stock > 10 ? "bg-emerald-400" : stock > 0 ? "bg-amber-400" : "bg-red-400"
                          }`} />
                          <span className={`text-sm font-medium ${
                            stock > 10 ? "text-emerald-400" : stock > 0 ? "text-amber-400" : "text-red-400"
                          }`}>
                            {stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {product.status === "published" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                            <div className="size-1.5 rounded-full bg-emerald-400" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">
                            <div className="size-1.5 rounded-full bg-amber-400" />
                            Borrador
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <motion.button
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          onClick={(e) => handleDelete(e, product.id, product.title)}
                          disabled={deleting === product.id}
                          className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all disabled:opacity-50"
                        >
                          {deleting === product.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
