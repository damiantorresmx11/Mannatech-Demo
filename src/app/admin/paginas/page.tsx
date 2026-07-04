"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus, FileText, Eye, Pencil, Globe, FileX, Search,
  LayoutGrid, List, Clock, ArrowUpRight, Loader2, MoreVertical,
  Trash2, Copy, Archive,
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

// Thumbnail colors — subtle dark tones that match the admin theme
const PAGE_COLORS: Record<string, string> = {
  home: "from-zinc-800 to-zinc-900",
  productos: "from-zinc-800 to-zinc-900",
  "quienes-somos": "from-zinc-800 to-zinc-900",
  unete: "from-zinc-800 to-zinc-900",
  impacto: "from-zinc-800 to-zinc-900",
}

const PAGE_ACCENTS: Record<string, string> = {
  home: "text-blue-400",
  productos: "text-emerald-400",
  "quienes-somos": "text-violet-400",
  unete: "text-amber-400",
  impacto: "text-rose-400",
}

const PAGE_ACCENT_BG: Record<string, string> = {
  home: "bg-blue-500/10",
  productos: "bg-emerald-500/10",
  "quienes-somos": "bg-violet-500/10",
  unete: "bg-amber-500/10",
  impacto: "bg-rose-500/10",
}

const PAGE_ICONS: Record<string, string> = {
  home: "Inicio",
  productos: "Tienda",
  "quienes-somos": "Nosotros",
  unete: "Registro",
  impacto: "Social",
}

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

export default function PaginasPage() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [creating, setCreating] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Paginas
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {pages.length} paginas · {published} publicadas · {drafts} borradores
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
        >
          <Plus size={16} />
          Nueva Pagina
        </button>
      </div>

      {/* Search + View toggle */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar paginas..."
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="flex items-center bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Create new page modal */}
      {showNew && (
        <div className="mb-6 p-5 bg-zinc-800/60 backdrop-blur border border-zinc-700/60 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-white">Crear Nueva Pagina</h3>
          <input
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value)
              setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
            }}
            placeholder="Titulo de la pagina"
            className="w-full bg-zinc-900/60 border border-zinc-700/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none"
            autoFocus
          />
          <div className="flex items-center gap-2 bg-zinc-900/40 rounded-xl px-4 py-2 border border-zinc-700/30">
            <span className="text-xs text-zinc-500">mannatech.dmlabs.mx/</span>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="slug"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none font-mono"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setShowNew(false); setNewTitle(""); setNewSlug("") }} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={!newTitle || !newSlug || creating}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all"
            >
              {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Crear Pagina
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`bg-zinc-800/30 rounded-2xl animate-pulse ${view === "grid" ? "h-48" : "h-16"}`} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-3xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-5">
            <FileX size={36} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">
            {search ? "Sin resultados" : "No hay paginas"}
          </h3>
          <p className="text-sm text-zinc-600 mb-6">
            {search ? `No se encontraron paginas para "${search}"` : "Crea tu primera pagina para empezar"}
          </p>
          {!search && (
            <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl">
              <Plus size={16} /> Crear Pagina
            </button>
          )}
        </div>
      )}

      {/* ═══ GRID VIEW ═══ */}
      {!loading && filtered.length > 0 && view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(page => {
            const gradient = PAGE_COLORS[page.slug] || "from-zinc-800 to-zinc-900"
            const accent = PAGE_ACCENTS[page.slug] || "text-zinc-500"
            const accentBg = PAGE_ACCENT_BG[page.slug] || "bg-zinc-500/10"
            const label = PAGE_ICONS[page.slug] || page.slug
            return (
              <Link
                key={page.id}
                href={`/admin/paginas/${page.slug}`}
                className="group relative bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-800/50 hover:border-zinc-700/70 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
              >
                {/* Thumbnail */}
                <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-2xl ${accentBg} flex items-center justify-center`}>
                        <FileText size={22} className={accent} />
                      </div>
                      <span className={`text-xs font-semibold ${accent} opacity-60 uppercase tracking-widest`}>{label}</span>
                    </div>
                  </div>
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm ${
                      page.status === "published"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {page.status === "published" ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-white/90 text-zinc-900 rounded-xl text-xs font-semibold shadow-lg">
                      <Pencil size={12} />
                      Editar Pagina
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">/{page.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/60">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                      <Clock size={10} />
                      {timeAgo(page.updatedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      {page.status === "published" && (
                        <a
                          href={`/${page.slug === "home" ? "" : page.slug}`}
                          target="_blank"
                          onClick={e => e.stopPropagation()}
                          className="p-1.5 text-zinc-600 hover:text-emerald-400 rounded-lg hover:bg-zinc-800 transition-colors"
                          title="Ver en sitio"
                        >
                          <ArrowUpRight size={12} />
                        </a>
                      )}
                      <a
                        href={`/preview/${page.slug}`}
                        target="_blank"
                        onClick={e => e.stopPropagation()}
                        className="p-1.5 text-zinc-600 hover:text-blue-400 rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Vista previa"
                      >
                        <Eye size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          {/* Add new page card */}
          <button
            onClick={() => setShowNew(true)}
            className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-zinc-800 hover:border-blue-500/40 rounded-2xl text-zinc-600 hover:text-blue-400 transition-all hover:bg-blue-500/5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 group-hover:bg-blue-500/10 flex items-center justify-center mb-3 transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-xs font-semibold">Nueva Pagina</span>
          </button>
        </div>
      )}

      {/* ═══ LIST VIEW ═══ */}
      {!loading && filtered.length > 0 && view === "list" && (
        <div className="bg-zinc-800/20 border border-zinc-800/60 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_100px_100px_80px] gap-4 px-5 py-3 border-b border-zinc-800/60 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Pagina</span>
            <span>Estado</span>
            <span>Modificado</span>
            <span className="text-right">Acciones</span>
          </div>

          {filtered.map((page, i) => {
            const accent = PAGE_ACCENTS[page.slug] || "text-zinc-500"
            const accentBg = PAGE_ACCENT_BG[page.slug] || "bg-zinc-500/10"
            return (
              <Link
                key={page.id}
                href={`/admin/paginas/${page.slug}`}
                className={`grid grid-cols-[1fr_100px_100px_80px] gap-4 items-center px-5 py-3.5 hover:bg-zinc-800/30 transition-colors group ${
                  i < filtered.length - 1 ? "border-b border-zinc-800/30" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center flex-shrink-0`}>
                    <FileText size={14} className={accent} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">{page.title}</p>
                    <p className="text-[10px] text-zinc-600 font-mono">/{page.slug}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center w-fit px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                  page.status === "published"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}>
                  {page.status === "published" ? "Publicado" : "Borrador"}
                </span>
                <span className="text-xs text-zinc-600">{timeAgo(page.updatedAt)}</span>
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-1.5 text-zinc-500 hover:text-blue-400 rounded-lg hover:bg-zinc-700/50 transition-colors" title="Editar">
                    <Pencil size={13} />
                  </span>
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
            )
          })}
        </div>
      )}
    </div>
  )
}
