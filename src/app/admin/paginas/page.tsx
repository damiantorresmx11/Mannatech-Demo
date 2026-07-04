"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, FileText, Eye, Pencil, Globe, FileX, Search,
  LayoutGrid, List, Clock, ArrowUpRight, Loader2, X,
} from "lucide-react"

interface PageItem {
  id: string
  title: string
  slug: string
  status: string
  updatedAt: string
  blocks?: any[]
}

const CMS_API = "/api/cms-proxy"
const SITE_ID = "e1d8c609-d3ad-4a15-ab8c-18d031f10a09"

const PAGE_ACCENTS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  home: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
  productos: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
  "quienes-somos": { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", glow: "shadow-violet-500/10" },
  unete: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
  impacto: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "shadow-rose-500/10" },
}

const PAGE_LABELS: Record<string, string> = {
  home: "Inicio",
  productos: "Tienda",
  "quienes-somos": "Nosotros",
  unete: "Registro",
  impacto: "Social",
}

const DEFAULT_ACCENT = { text: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", glow: "shadow-zinc-500/10" }

async function fetchPages(): Promise<PageItem[]> {
  const res = await fetch(`${CMS_API}/pages?siteId=${SITE_ID}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.pages || []
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Ahora"
  if (mins < 60) return `Hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Hace ${days}d`
  return new Date(dateStr).toLocaleDateString("es-MX", { day: "numeric", month: "short" })
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
}

const listItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 28 },
  },
}

const modalVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 400, damping: 26 } },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.15 } },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function PaginasPage() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchPages().then(setPages).finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!newTitle || !newSlug) return
    setCreating(true)
    try {
      const token = localStorage.getItem("cms-token") || ""
      const res = await fetch(`${CMS_API}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ siteId: SITE_ID, title: newTitle, slug: newSlug }),
      })
      if (res.ok) {
        const page = await res.json()
        setPages(prev => [...prev, page])
        setShowNew(false)
        setNewTitle("")
        setNewSlug("")
      }
    } finally {
      setCreating(false)
    }
  }

  const filtered = pages
    .filter(p => p.status !== "archived")
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()))

  const published = filtered.filter(p => p.status === "published").length
  const drafts = filtered.filter(p => p.status === "draft").length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 lg:p-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Paginas</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {pages.length} paginas &middot; {published} publicadas &middot; {drafts} borradores
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus size={16} />
          Nueva Pagina
        </motion.button>
      </motion.div>

      {/* Search + View toggle */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? "text-blue-400" : "text-zinc-500"}`} />
          <motion.input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Buscar paginas..."
            animate={{
              borderColor: searchFocused ? "rgba(59,130,246,0.5)" : "rgba(63,63,70,0.5)",
              boxShadow: searchFocused ? "0 0 0 3px rgba(59,130,246,0.1)" : "0 0 0 0px rgba(59,130,246,0)",
            }}
            transition={{ duration: 0.2 }}
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <LayoutGrid size={16} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <List size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* Create new page modal overlay */}
      <AnimatePresence>
        {showNew && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => { setShowNew(false); setNewTitle(""); setNewSlug("") }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            >
              <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/60 rounded-2xl p-6 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold text-white">Crear Nueva Pagina</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setShowNew(false); setNewTitle(""); setNewSlug("") }}
                    className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Titulo</label>
                    <input
                      value={newTitle}
                      onChange={(e) => {
                        setNewTitle(e.target.value)
                        setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
                      }}
                      placeholder="Titulo de la pagina"
                      className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1.5 block">URL</label>
                    <div className="flex items-center gap-2 bg-zinc-800/60 rounded-xl px-4 py-3 border border-zinc-700/50 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                      <span className="text-xs text-zinc-500 whitespace-nowrap">mannatech.dmlabs.mx/</span>
                      <input
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                        placeholder="slug"
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setShowNew(false); setNewTitle(""); setNewSlug("") }}
                      className="px-4 py-2.5 text-sm text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreate}
                      disabled={!newTitle || !newSlug || creating}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                    >
                      {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      Crear Pagina
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      {loading && (
        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-3"}>
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`bg-zinc-800/20 border border-zinc-800/40 rounded-2xl animate-pulse ${view === "grid" ? "h-56" : "h-16"}`}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      <AnimatePresence>
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-center py-24"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-3xl bg-zinc-800/40 border border-zinc-700/30 flex items-center justify-center mx-auto mb-6"
            >
              <FileX size={40} className="text-zinc-600" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold text-zinc-300 mb-2"
            >
              {search ? "Sin resultados" : "No hay paginas"}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-zinc-600 mb-6 max-w-xs mx-auto"
            >
              {search ? `No se encontraron paginas para "${search}"` : "Crea tu primera pagina para empezar a construir tu sitio"}
            </motion.p>
            {!search && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowNew(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20"
              >
                <Plus size={16} /> Crear Pagina
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID VIEW */}
      <AnimatePresence mode="wait">
        {!loading && filtered.length > 0 && view === "grid" && (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map(page => {
              const accent = PAGE_ACCENTS[page.slug] || DEFAULT_ACCENT
              const label = PAGE_LABELS[page.slug] || page.slug
              return (
                <motion.div key={page.id} variants={cardVariants} layout>
                  <Link
                    href={`/admin/paginas/${page.slug}`}
                    className="group relative block bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-600/60 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    {/* Card header area with icon */}
                    <div className="h-36 relative flex items-center justify-center bg-zinc-900/80">
                      {/* Subtle dot pattern */}
                      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                      {/* Subtle radial glow behind icon */}
                      <div className={`absolute w-32 h-32 rounded-full ${accent.bg} blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />
                      {/* Icon */}
                      <div className="relative flex flex-col items-center gap-2.5">
                        <motion.div
                          whileHover={{ rotate: 3 }}
                          className={`w-14 h-14 rounded-2xl ${accent.bg} border ${accent.border} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                        >
                          <FileText size={24} className={accent.text} />
                        </motion.div>
                        <span className={`text-[10px] font-bold ${accent.text} uppercase tracking-[0.2em] opacity-50 group-hover:opacity-80 transition-opacity`}>
                          {label}
                        </span>
                      </div>

                      {/* Status badge */}
                      <div className="absolute top-3.5 right-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md ${
                          page.status === "published"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                            : "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                        }`}>
                          {page.status === "published" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                          {page.status === "published" ? "Publicado" : "Borrador"}
                        </span>
                      </div>

                      {/* Quick actions — slide in on hover */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        {page.status === "published" && (
                          <a
                            href={`/${page.slug === "home" ? "" : page.slug}`}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            className="p-2 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 rounded-xl transition-colors"
                            title="Ver en sitio"
                          >
                            <Globe size={13} />
                          </a>
                        )}
                        <a
                          href={`/preview/${page.slug}`}
                          target="_blank"
                          onClick={e => e.stopPropagation()}
                          className="p-2 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 rounded-xl transition-colors"
                          title="Vista previa"
                        >
                          <Eye size={13} />
                        </a>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-4 border-t border-zinc-800/50">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors duration-200">
                        {page.title}
                      </h3>
                      <p className="text-[11px] text-zinc-600 font-mono mt-0.5">/{page.slug}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/40">
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                          <Clock size={11} />
                          {timeAgo(page.updatedAt)}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-600">
                          <FileText size={11} />
                          {page.blocks?.length || 0} bloques
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}

            {/* Add new page card */}
            <motion.div variants={cardVariants}>
              <motion.button
                whileHover={{ scale: 1.02, borderColor: "rgba(59,130,246,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNew(true)}
                className="flex flex-col items-center justify-center w-full h-full min-h-[240px] border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 hover:text-blue-400 transition-all duration-300 hover:bg-blue-500/[0.03] group"
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring" as const, stiffness: 300 }}
                  className="w-14 h-14 rounded-2xl bg-zinc-800/40 group-hover:bg-blue-500/10 border border-zinc-700/30 group-hover:border-blue-500/20 flex items-center justify-center mb-3 transition-colors duration-300"
                >
                  <Plus size={24} />
                </motion.div>
                <span className="text-xs font-semibold">Nueva Pagina</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIST VIEW */}
      <AnimatePresence mode="wait">
        {!loading && filtered.length > 0 && view === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 rounded-2xl overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-[1fr_100px_120px_90px] gap-4 px-5 py-3.5 border-b border-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              <span>Pagina</span>
              <span>Estado</span>
              <span>Modificado</span>
              <span className="text-right">Acciones</span>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filtered.map((page, i) => {
                const accent = PAGE_ACCENTS[page.slug] || DEFAULT_ACCENT
                return (
                  <motion.div key={page.id} variants={listItemVariants}>
                    <Link
                      href={`/admin/paginas/${page.slug}`}
                      className={`grid grid-cols-[1fr_100px_120px_90px] gap-4 items-center px-5 py-4 hover:bg-zinc-800/30 transition-all duration-200 group ${
                        i < filtered.length - 1 ? "border-b border-zinc-800/30" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                          <FileText size={15} className={accent.text} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors duration-200">{page.title}</p>
                          <p className="text-[10px] text-zinc-600 font-mono">/{page.slug}</p>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        page.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {page.status === "published" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        {page.status === "published" ? "Publicado" : "Borrador"}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                        <Clock size={11} />
                        {timeAgo(page.updatedAt)}
                      </span>

                      {/* Actions — slide in */}
                      <div className="flex items-center justify-end gap-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                        <span className="p-1.5 text-zinc-500 hover:text-blue-400 rounded-lg hover:bg-zinc-700/50 transition-colors" title="Editar">
                          <Pencil size={13} />
                        </span>
                        <a
                          href={`/preview/${page.slug}`}
                          target="_blank"
                          onClick={e => e.stopPropagation()}
                          className="p-1.5 text-zinc-500 hover:text-blue-400 rounded-lg hover:bg-zinc-700/50 transition-colors"
                          title="Vista previa"
                        >
                          <Eye size={13} />
                        </a>
                        {page.status === "published" && (
                          <a
                            href={`/${page.slug === "home" ? "" : page.slug}`}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            className="p-1.5 text-zinc-500 hover:text-emerald-400 rounded-lg hover:bg-zinc-700/50 transition-colors"
                            title="Ver en sitio"
                          >
                            <ArrowUpRight size={13} />
                          </a>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
