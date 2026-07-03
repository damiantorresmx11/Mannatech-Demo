"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  GripVertical, Eye, EyeOff, Trash2, Plus, ChevronLeft,
  Save, Globe, Monitor, Tablet, Smartphone, Undo2,
  PanelLeftClose, PanelLeft, Loader2,
} from "lucide-react"
import { blockDefMap, type FieldDef } from "@/config/block-definitions"
import { blockDefinitions } from "@/config/block-definitions"

interface Block {
  id: string
  type: string
  position: number
  content: Record<string, any>
  styles: Record<string, any>
  visibility: { desktop: boolean; tablet: boolean; mobile: boolean }
}

interface PageData {
  id: string
  title: string
  slug: string
  status: string
  seoTitle: string | null
  seoDescription: string | null
  blocks: Block[]
}

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:3002"
const SITE_ID = "e1d8c609-d3ad-4a15-ab8c-18d031f10a09"

// ═══════════════════════════════════════════════════════════════
// EDITOR PAGE
// ═══════════════════════════════════════════════════════════════

export default function EditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("")
  const [page, setPage] = useState<PageData | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"content" | "design" | "seo" | "advanced">("content")
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewWidth, setPreviewWidth] = useState<number | "full">("full")
  const [panelOpen, setPanelOpen] = useState(true)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [previewReady, setPreviewReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Load params
  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  // Load page data
  useEffect(() => {
    if (!slug) return
    fetch(`${CMS_API}/pages/by-slug/${SITE_ID}/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPage(data)
        setBlocks(data.blocks || [])
        if (data.blocks?.length) setActiveBlockId(data.blocks[0].id)
      })
      .catch(console.error)
  }, [slug])

  // Listen for preview messages
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "blockInView") {
        setActiveBlockId(event.data.blockId)
      }
      if (event.data?.type === "previewReady") {
        setPreviewReady(true)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Send update to preview iframe
  const sendToPreview = useCallback((blockId: string, field: string, value: any) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "update", blockId, field, value },
      "*"
    )
  }, [])

  // Auto-save debounced
  const scheduleAutosave = useCallback(() => {
    setIsDirty(true)
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      handleSave()
    }, 2000)
  }, [])

  // Handle field change
  const handleFieldChange = useCallback((blockId: string, field: string, value: any) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b
        // Handle nested keys like "cta.label"
        if (field.includes(".")) {
          const [parent, child] = field.split(".")
          return { ...b, content: { ...b.content, [parent]: { ...b.content[parent], [child]: value } } }
        }
        return { ...b, content: { ...b.content, [field]: value } }
      })
    )
    sendToPreview(blockId, field, value)
    scheduleAutosave()
  }, [sendToPreview, scheduleAutosave])

  // Handle style change
  const handleStyleChange = useCallback((blockId: string, field: string, value: any) => {
    setBlocks((prev) =>
      prev.map((b) => b.id !== blockId ? b : { ...b, styles: { ...b.styles, [field]: value } })
    )
    sendToPreview(blockId, field, value)
    scheduleAutosave()
  }, [sendToPreview, scheduleAutosave])

  // Save to API
  const handleSave = useCallback(async () => {
    if (!page) return
    setIsSaving(true)
    try {
      const token = localStorage.getItem("cms-token") || ""
      for (const block of blocks) {
        await fetch(`${CMS_API}/blocks/${block.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content: block.content, styles: block.styles }),
        })
      }
      setIsDirty(false)
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setIsSaving(false)
    }
  }, [page, blocks])

  // Publish
  const handlePublish = useCallback(async () => {
    if (!page) return
    const token = localStorage.getItem("cms-token") || ""
    await fetch(`${CMS_API}/pages/${page.id}/publish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    setPage((p) => p ? { ...p, status: "published" } : p)
  }, [page])

  // Scroll to block in preview
  const scrollToBlock = useCallback((blockId: string) => {
    setActiveBlockId(blockId)
    iframeRef.current?.contentWindow?.postMessage(
      { type: "scrollToBlock", blockId },
      "*"
    )
    iframeRef.current?.contentWindow?.postMessage(
      { type: "highlight", blockId },
      "*"
    )
  }, [])

  // Delete block
  const handleDeleteBlock = useCallback(async (blockId: string) => {
    const token = localStorage.getItem("cms-token") || ""
    await fetch(`${CMS_API}/blocks/${blockId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    setBlocks((prev) => prev.filter((b) => b.id !== blockId))
    if (activeBlockId === blockId) setActiveBlockId(blocks[0]?.id || null)
  }, [activeBlockId, blocks])

  // Add block
  const handleAddBlock = useCallback(async (type: string) => {
    if (!page) return
    const token = localStorage.getItem("cms-token") || ""
    const res = await fetch(`${CMS_API}/blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pageId: page.id, type, content: {}, styles: {} }),
    })
    const block = await res.json()
    setBlocks((prev) => [...prev, block])
    setActiveBlockId(block.id)
    setShowAddBlock(false)
    // Reload preview
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src
  }, [page])

  const activeBlock = blocks.find((b) => b.id === activeBlockId)
  const activeBlockDef = activeBlock ? blockDefMap[activeBlock.type] : null

  if (!page) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  const previewWidthPx = previewWidth === "full" ? "100%" : `${previewWidth}px`

  return (
    <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden">
      {/* ── Top Bar ──────────────────────────────────────────────── */}
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50 shrink-0">
        <div className="flex items-center gap-3">
          <a href="/admin/paginas" className="text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </a>
          <span className="text-sm font-medium text-white">{page.title}</span>
          <span className="text-xs text-zinc-500 font-mono">/{page.slug}</span>
          {isDirty && <span className="w-2 h-2 rounded-full bg-amber-500" title="Cambios sin guardar" />}
        </div>
        <div className="flex items-center gap-2">
          {/* Responsive toggles */}
          <div className="flex items-center gap-1 mr-2 border-r border-zinc-800 pr-3">
            <button onClick={() => setPreviewWidth("full")} className={`p-1.5 rounded ${previewWidth === "full" ? "text-emerald-400 bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Monitor size={14} />
            </button>
            <button onClick={() => setPreviewWidth(768)} className={`p-1.5 rounded ${previewWidth === 768 ? "text-emerald-400 bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Tablet size={14} />
            </button>
            <button onClick={() => setPreviewWidth(375)} className={`p-1.5 rounded ${previewWidth === 375 ? "text-emerald-400 bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Smartphone size={14} />
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 transition-colors"
          >
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Guardar
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <Globe size={12} />
            Publicar
          </button>
        </div>
      </div>

      {/* ── Main Editor Area ─────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel ──────────────────────────────────────────── */}
        {panelOpen && (
          <div className="w-[380px] shrink-0 border-r border-zinc-800 flex flex-col bg-zinc-900/30 overflow-hidden">
            {/* Block Tree */}
            <div className="border-b border-zinc-800 p-3 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Bloques</span>
                <button onClick={() => setPanelOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <PanelLeftClose size={14} />
                </button>
              </div>
              <div className="space-y-1 max-h-[240px] overflow-y-auto">
                {blocks.map((block) => {
                  const def = blockDefMap[block.type]
                  const isActive = block.id === activeBlockId
                  return (
                    <button
                      key={block.id}
                      onClick={() => scrollToBlock(block.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-all ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "text-zinc-400 hover:bg-zinc-800 border border-transparent"
                      }`}
                    >
                      <GripVertical size={12} className="text-zinc-600 shrink-0 cursor-grab" />
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-emerald-400" : "bg-zinc-600"}`} />
                      <span className="truncate flex-1">{def?.label || block.type}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id) }}
                        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400"
                      >
                        <Trash2 size={11} />
                      </button>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setShowAddBlock(true)}
                className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-zinc-400 hover:text-emerald-400 border border-dashed border-zinc-700 hover:border-emerald-500/50 rounded-lg transition-colors"
              >
                <Plus size={12} /> Agregar Bloque
              </button>
            </div>

            {/* Add Block Modal */}
            {showAddBlock && (
              <div className="border-b border-zinc-800 p-3 shrink-0 bg-zinc-900">
                <p className="text-xs font-semibold text-zinc-400 mb-2">Selecciona un tipo de bloque</p>
                <div className="grid grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto">
                  {blockDefinitions.map((def) => (
                    <button
                      key={def.type}
                      onClick={() => handleAddBlock(def.type)}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors"
                    >
                      <span className="text-[10px] text-center leading-tight">{def.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAddBlock(false)} className="w-full mt-2 text-xs text-zinc-500 hover:text-zinc-300 py-1">
                  Cancelar
                </button>
              </div>
            )}

            {/* Property Panel */}
            {activeBlock && activeBlockDef && (
              <div className="flex-1 overflow-y-auto">
                {/* Tabs */}
                <div className="flex border-b border-zinc-800 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10">
                  {(["content", "design", "advanced"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                        activeTab === tab
                          ? "text-emerald-400 border-b-2 border-emerald-400"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {tab === "content" ? "Contenido" : tab === "design" ? "Diseno" : "Avanzado"}
                    </button>
                  ))}
                </div>

                {/* Fields */}
                <div className="p-3 space-y-3">
                  {(activeTab === "content" ? activeBlockDef.content : activeTab === "design" ? activeBlockDef.design : activeBlockDef.advanced).map((field) => (
                    <FieldControl
                      key={field.key}
                      field={field}
                      value={activeTab === "design" ? activeBlock.styles[field.key] : getNestedValue(activeBlock.content, field.key)}
                      onChange={(value) => {
                        if (activeTab === "design") {
                          handleStyleChange(activeBlock.id, field.key, value)
                        } else {
                          handleFieldChange(activeBlock.id, field.key, value)
                        }
                      }}
                    />
                  ))}
                  {((activeTab === "content" ? activeBlockDef.content : activeTab === "design" ? activeBlockDef.design : activeBlockDef.advanced).length === 0) && (
                    <p className="text-xs text-zinc-600 text-center py-8">
                      Este bloque no tiene propiedades editables en esta seccion
                    </p>
                  )}
                </div>

                {/* Visibility */}
                {activeTab === "design" && (
                  <div className="p-3 border-t border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-400 mb-2">Visibilidad</p>
                    <div className="flex gap-3">
                      {(["desktop", "tablet", "mobile"] as const).map((device) => (
                        <label key={device} className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <input
                            type="checkbox"
                            checked={activeBlock.visibility[device]}
                            onChange={(e) => {
                              setBlocks((prev) =>
                                prev.map((b) =>
                                  b.id !== activeBlock.id ? b : { ...b, visibility: { ...b.visibility, [device]: e.target.checked } }
                                )
                              )
                              scheduleAutosave()
                            }}
                            className="accent-emerald-500"
                          />
                          {device === "desktop" ? "Desktop" : device === "tablet" ? "Tablet" : "Movil"}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Toggle Panel Button ─────────────────────────────────── */}
        {!panelOpen && (
          <button
            onClick={() => setPanelOpen(true)}
            className="absolute left-0 top-16 z-10 p-2 bg-zinc-800 border border-zinc-700 rounded-r-lg text-zinc-400 hover:text-white"
          >
            <PanelLeft size={14} />
          </button>
        )}

        {/* ── Preview (Right Panel) ───────────────────────────────── */}
        <div className="flex-1 bg-zinc-950 flex items-start justify-center overflow-hidden p-4">
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
            style={{ width: previewWidthPx, height: "calc(100vh - 80px)" }}
          >
            {!previewReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-10">
                <Loader2 className="animate-spin text-emerald-500" size={24} />
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={`/preview/${slug}`}
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────────── */}
      <div className="h-10 border-t border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50 shrink-0">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${page.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
          <span className="text-xs text-zinc-400">
            {page.status === "published" ? "Publicado" : "Borrador"}
          </span>
        </div>
        <div className="text-xs text-zinc-600">
          {blocks.length} bloques
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// FIELD CONTROL COMPONENT
// ═══════════════════════════════════════════════════════════════

function FieldControl({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  switch (field.type) {
    case "text":
      return (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">{field.label}</label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )

    case "textarea":
      return (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">{field.label}</label>
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none resize-none"
          />
        </div>
      )

    case "number":
      return (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">{field.label}</label>
          <input
            type="number"
            value={value ?? field.defaultValue ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
            min={field.min}
            max={field.max}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )

    case "slider":
      return (
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-zinc-400">{field.label}</label>
            <span className="text-xs text-zinc-500">{value ?? field.defaultValue ?? 0}px</span>
          </div>
          <input
            type="range"
            value={value ?? field.defaultValue ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={field.min ?? 0}
            max={field.max ?? 100}
            className="w-full accent-emerald-500 h-1"
          />
        </div>
      )

    case "color":
      return (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">{field.label}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      )

    case "select":
      return (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">{field.label}</label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )

    case "toggle":
      return (
        <label className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-zinc-400">{field.label}</span>
          <input
            type="checkbox"
            checked={value ?? field.defaultValue ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="accent-emerald-500"
          />
        </label>
      )

    case "array":
      return <ArrayFieldControl field={field} value={value} onChange={onChange} />

    default:
      return null
  }
}

// ═══════════════════════════════════════════════════════════════
// ARRAY FIELD CONTROL
// ═══════════════════════════════════════════════════════════════

function ArrayFieldControl({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const items = Array.isArray(value) ? value : []

  const addItem = () => {
    const newItem: Record<string, any> = {}
    field.arrayFields?.forEach((f) => { newItem[f.key] = "" })
    onChange([...items, newItem])
  }

  const updateItem = (index: number, key: string, val: any) => {
    const updated = items.map((item: any, i: number) =>
      i === index ? { ...item, [key]: val } : item
    )
    onChange(updated)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_: any, i: number) => i !== index))
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 mb-2">{field.label}</label>
      <div className="space-y-2">
        {items.map((item: any, i: number) => (
          <div key={i} className="p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50 space-y-1.5">
            {field.arrayFields?.map((subField) => (
              <div key={subField.key}>
                <label className="block text-[10px] text-zinc-500 mb-0.5">{subField.label}</label>
                {subField.type === "textarea" ? (
                  <textarea
                    value={item[subField.key] || ""}
                    onChange={(e) => updateItem(i, subField.key, e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:border-emerald-500 focus:outline-none resize-none"
                  />
                ) : (
                  <input
                    type={subField.type === "number" ? "number" : "text"}
                    value={item[subField.key] || ""}
                    onChange={(e) => updateItem(i, subField.key, subField.type === "number" ? Number(e.target.value) : e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
            <button onClick={() => removeItem(i)} className="text-[10px] text-red-400 hover:text-red-300">
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <button onClick={addItem} className="mt-1.5 text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
        <Plus size={10} /> Agregar {field.label.toLowerCase().replace(/s$/, "")}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj)
}
