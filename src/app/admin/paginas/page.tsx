"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, FileText, Eye, Pencil, Trash2, Globe, FileX } from "lucide-react"

interface PageItem {
  id: string
  title: string
  slug: string
  status: string
  updatedAt: string
}

const CMS_API = "/api/cms-proxy"

async function fetchPages(token: string): Promise<PageItem[]> {
  const res = await fetch(`${CMS_API}/pages?siteId=e1d8c609-d3ad-4a15-ab8c-18d031f10a09`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.pages || []
}

export default function PaginasPage() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newSlug, setNewSlug] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("cms-token") || localStorage.getItem("admin-token") || ""
    fetchPages(token).then(setPages).finally(() => setLoading(false))
  }, [])

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      published: "bg-emerald-500/20 text-emerald-400",
      draft: "bg-amber-500/20 text-amber-400",
      archived: "bg-zinc-500/20 text-zinc-400",
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.draft}`}>
        {status === "published" ? "Publicado" : status === "draft" ? "Borrador" : "Archivado"}
      </span>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Paginas</h1>
          <p className="text-sm text-zinc-400 mt-1">Administra las paginas de tu sitio</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nueva Pagina
        </button>
      </div>

      {showNew && (
        <div className="mb-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl space-y-3">
          <input
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value)
              setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
            }}
            placeholder="Titulo de la pagina"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="slug-de-la-pagina"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none font-mono"
            />
            <button
              onClick={() => {
                // TODO: create page via API
                setShowNew(false)
                setNewTitle("")
                setNewSlug("")
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg"
            >
              Crear
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <FileX size={48} className="mx-auto mb-4 opacity-50" />
          <p>No hay paginas creadas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pages.filter(p => p.status !== "archived").map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-4 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-zinc-500" />
                <div>
                  <p className="text-sm font-medium text-white">{page.title}</p>
                  <p className="text-xs text-zinc-500 font-mono">/{page.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {statusBadge(page.status)}
                <span className="text-xs text-zinc-600">
                  {new Date(page.updatedAt).toLocaleDateString("es-MX")}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/paginas/${page.slug}`}
                    className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </Link>
                  <a
                    href={`/preview/${page.slug}`}
                    target="_blank"
                    className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-zinc-700 rounded-lg transition-colors"
                    title="Vista previa"
                  >
                    <Eye size={14} />
                  </a>
                  {page.status === "published" && (
                    <a
                      href={`/${page.slug === "home" ? "" : page.slug}`}
                      target="_blank"
                      className="p-1.5 text-zinc-400 hover:text-green-400 hover:bg-zinc-700 rounded-lg transition-colors"
                      title="Ver en sitio"
                    >
                      <Globe size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
