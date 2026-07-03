"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  GripVertical, Eye, Trash2, Plus, ChevronLeft, Save, Globe,
  Monitor, Tablet, Smartphone, Loader2, Layers, Search,
  PanelRightClose, PanelRight, Sparkles, BarChart3, MousePointerClick,
  Package, MessageSquareQuote, HelpCircle, ListChecks, UserPlus,
  Users, Grid3x3, Award, Layout, Type, ImageIcon, Undo2, Redo2,
  Copy, X, ChevronDown, ChevronUp,
} from "lucide-react"
import { blockDefMap, type FieldDef } from "@/config/block-definitions"
import { blockDefinitions } from "@/config/block-definitions"
import { ICON_LIBRARY, ICON_MAP, ICON_CATEGORIES } from "@/config/icon-library"
import { ANIMATION_PRESETS, ANIMATION_CATEGORIES, type AnimationPreset } from "@/config/animation-presets"

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

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

const CMS_API = "/api/cms-proxy"
const SITE_ID = "e1d8c609-d3ad-4a15-ab8c-18d031f10a09"

// ═══════════════════════════════════════════════════════════════
// BLOCK CATALOG DATA
// ═══════════════════════════════════════════════════════════════

const BLOCK_ICON_MAP: Record<string, any> = {
  Sparkles, BarChart3, MousePointerClick, Package, MessageSquareQuote,
  HelpCircle, ListChecks, UserPlus, Users, Grid3x3, Award, Layout,
  Type, ImageIcon,
}

const BLOCK_CATEGORIES = [
  {
    name: "Principal",
    color: "#3b82f6",
    items: ["hero", "ctaBanner"],
  },
  {
    name: "Contenido",
    color: "#10b981",
    items: ["stats", "howItWorks", "faq", "benefitsGrid", "joinSection"],
  },
  {
    name: "Productos",
    color: "#f59e0b",
    items: ["featuredGrid", "categories"],
  },
  {
    name: "Social",
    color: "#8b5cf6",
    items: ["testimonials", "teamGrid", "trustMarquee", "socialProof"],
  },
  {
    name: "Ciencia",
    color: "#06b6d4",
    items: ["scienceSection", "glycansSection", "whyGlycansSection", "missionSection"],
  },
  {
    name: "Otros",
    color: "#6b7280",
    items: ["newsletter", "quickCategoryMenu"],
  },
]

// ═══════════════════════════════════════════════════════════════
// EDITOR PAGE
// ═══════════════════════════════════════════════════════════════

export default function EditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("")
  const [page, setPage] = useState<PageData | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"content" | "design" | "advanced">("content")
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewWidth, setPreviewWidth] = useState<number | "full">("full")
  const [previewReady, setPreviewReady] = useState(false)

  // UI panels
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [leftPanel, setLeftPanel] = useState<"none" | "layers" | "catalog">("none")
  const [catalogSearch, setCatalogSearch] = useState("")
  const [addAtPosition, setAddAtPosition] = useState<number | null>(null)

  // History for undo/redo
  const [history, setHistory] = useState<Block[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

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
        const b = data.blocks || []
        setBlocks(b)
        setHistory([b])
        setHistoryIndex(0)
      })
      .catch(console.error)
  }, [slug])

  // Push to history
  const pushHistory = useCallback((newBlocks: Block[]) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1)
      return [...trimmed, newBlocks].slice(-30)
    })
    setHistoryIndex(prev => Math.min(prev + 1, 29))
  }, [historyIndex])

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    setBlocks(history[newIndex])
    setIsDirty(true)
    reloadPreview()
  }, [historyIndex, history])

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    setBlocks(history[newIndex])
    setIsDirty(true)
    reloadPreview()
  }, [historyIndex, history])

  // Reload preview iframe
  const reloadPreview = useCallback(() => {
    setPreviewReady(false)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }, [])

  // Listen for preview messages
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data
      if (!data?.type) return

      switch (data.type) {
        case "previewReady":
          setPreviewReady(true)
          break

        case "blockSelected":
          setActiveBlockId(data.blockId)
          setRightPanelOpen(true)
          setActiveTab("content")
          break

        case "blockDeselected":
          setActiveBlockId(null)
          break

        case "blockHovered":
          // Could highlight in layers panel
          break

        case "inlineEditStart":
          setActiveBlockId(data.blockId)
          setActiveTab("content")
          break

        case "inlineEdit":
          // Update block content from inline editing
          setBlocks(prev => {
            const updated = prev.map(b => {
              if (b.id !== data.blockId) return b
              if (data.field.includes(".")) {
                const [parent, child] = data.field.split(".")
                return { ...b, content: { ...b.content, [parent]: { ...b.content[parent], [child]: data.value } } }
              }
              return { ...b, content: { ...b.content, [data.field]: data.value } }
            })
            return updated
          })
          scheduleAutosave()
          break

        case "toolbarAction":
          handleToolbarAction(data.action, data.blockId)
          break

        case "requestAddBlock":
          setAddAtPosition(data.position)
          setLeftPanel("catalog")
          break

        case "blockReordered":
          handleBlockReorder(data.blockId, data.newPosition)
          break
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [blocks])

  // Handle toolbar actions from preview
  const handleToolbarAction = useCallback((action: string, blockId: string) => {
    switch (action) {
      case "moveUp": {
        const idx = blocks.findIndex(b => b.id === blockId)
        if (idx <= 0) return
        const newBlocks = [...blocks]
        ;[newBlocks[idx - 1], newBlocks[idx]] = [newBlocks[idx], newBlocks[idx - 1]]
        newBlocks.forEach((b, i) => b.position = i)
        setBlocks(newBlocks)
        pushHistory(newBlocks)
        scheduleAutosave()
        reloadPreview()
        break
      }
      case "moveDown": {
        const idx = blocks.findIndex(b => b.id === blockId)
        if (idx < 0 || idx >= blocks.length - 1) return
        const newBlocks = [...blocks]
        ;[newBlocks[idx], newBlocks[idx + 1]] = [newBlocks[idx + 1], newBlocks[idx]]
        newBlocks.forEach((b, i) => b.position = i)
        setBlocks(newBlocks)
        pushHistory(newBlocks)
        scheduleAutosave()
        reloadPreview()
        break
      }
      case "duplicate":
        handleDuplicateBlock(blockId)
        break
      case "delete":
        handleDeleteBlock(blockId)
        break
      case "settings":
        setActiveBlockId(blockId)
        setRightPanelOpen(true)
        break
    }
  }, [blocks])

  // Block reorder from drag
  const handleBlockReorder = useCallback(async (blockId: string, newPosition: number) => {
    const idx = blocks.findIndex(b => b.id === blockId)
    if (idx < 0) return

    const newBlocks = [...blocks]
    const [moved] = newBlocks.splice(idx, 1)
    const insertAt = newPosition > idx ? newPosition - 1 : newPosition
    newBlocks.splice(insertAt, 0, moved)
    newBlocks.forEach((b, i) => b.position = i)

    setBlocks(newBlocks)
    pushHistory(newBlocks)
    scheduleAutosave()
    reloadPreview()
  }, [blocks])

  // Auto-save debounced
  const scheduleAutosave = useCallback(() => {
    setIsDirty(true)
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => handleSave(), 2000)
  }, [])

  // Send update to preview
  const sendToPreview = useCallback((blockId: string, field: string, value: any) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "update", blockId, field, value },
      "*"
    )
  }, [])

  // Handle field change
  const handleFieldChange = useCallback((blockId: string, field: string, value: any) => {
    setBlocks(prev =>
      prev.map(b => {
        if (b.id !== blockId) return b
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
    setBlocks(prev =>
      prev.map(b => b.id !== blockId ? b : { ...b, styles: { ...b.styles, [field]: value } })
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
          body: JSON.stringify({ content: block.content, styles: block.styles, position: block.position }),
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
    await handleSave()
    const token = localStorage.getItem("cms-token") || ""
    await fetch(`${CMS_API}/pages/${page.id}/publish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    setPage(p => p ? { ...p, status: "published" } : p)
  }, [page, handleSave])

  // Select block from layers
  const selectBlock = useCallback((blockId: string) => {
    setActiveBlockId(blockId)
    iframeRef.current?.contentWindow?.postMessage({ type: "selectBlock", blockId }, "*")
  }, [])

  // Delete block
  const handleDeleteBlock = useCallback(async (blockId: string) => {
    const token = localStorage.getItem("cms-token") || ""
    await fetch(`${CMS_API}/blocks/${blockId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    const newBlocks = blocks.filter(b => b.id !== blockId)
    setBlocks(newBlocks)
    pushHistory(newBlocks)
    if (activeBlockId === blockId) setActiveBlockId(null)
    reloadPreview()
  }, [activeBlockId, blocks])

  // Duplicate block
  const handleDuplicateBlock = useCallback(async (blockId: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block || !page) return
    const token = localStorage.getItem("cms-token") || ""
    const res = await fetch(`${CMS_API}/blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        pageId: page.id,
        type: block.type,
        content: block.content,
        styles: block.styles,
        position: block.position + 1,
      }),
    })
    const newBlock = await res.json()
    const newBlocks = [...blocks]
    const idx = newBlocks.findIndex(b => b.id === blockId)
    newBlocks.splice(idx + 1, 0, newBlock)
    newBlocks.forEach((b, i) => b.position = i)
    setBlocks(newBlocks)
    pushHistory(newBlocks)
    setActiveBlockId(newBlock.id)
    reloadPreview()
  }, [blocks, page])

  // Add block
  const handleAddBlock = useCallback(async (type: string) => {
    if (!page) return
    const token = localStorage.getItem("cms-token") || ""
    const position = addAtPosition ?? blocks.length
    const res = await fetch(`${CMS_API}/blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pageId: page.id, type, content: {}, styles: {}, position }),
    })
    const block = await res.json()
    const newBlocks = [...blocks]
    newBlocks.splice(position, 0, block)
    newBlocks.forEach((b, i) => b.position = i)
    setBlocks(newBlocks)
    pushHistory(newBlocks)
    setActiveBlockId(block.id)
    setLeftPanel("none")
    setAddAtPosition(null)
    reloadPreview()
  }, [page, blocks, addAtPosition])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); handleUndo() }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) { e.preventDefault(); handleRedo() }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); handleSave() }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleUndo, handleRedo, handleSave])

  const activeBlock = blocks.find(b => b.id === activeBlockId)
  const activeBlockDef = activeBlock ? blockDefMap[activeBlock.type] : null

  if (!page) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-500" size={28} />
          <p className="text-xs text-zinc-500">Cargando editor...</p>
        </div>
      </div>
    )
  }

  const filteredCatalog = BLOCK_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(type => {
      if (!catalogSearch) return true
      const def = blockDefMap[type]
      return def?.label.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        type.toLowerCase().includes(catalogSearch.toLowerCase())
    }),
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden select-none">
      {/* ══════════════════════════════════════════════════════════
          TOP BAR
      ═══════════════════════════════════════════════════════════ */}
      <div className="h-12 border-b border-zinc-800/80 flex items-center justify-between px-3 bg-zinc-900/60 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center gap-3">
          <a href="/admin/paginas" className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs">
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Paginas</span>
          </a>
          <div className="w-px h-5 bg-zinc-800" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{page.title}</span>
            <span className="text-[10px] text-zinc-500 font-mono bg-zinc-800/50 px-1.5 py-0.5 rounded">/{page.slug}</span>
          </div>
          {isDirty && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] text-amber-500/80">Sin guardar</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Undo/Redo */}
          <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors" title="Deshacer (Ctrl+Z)">
            <Undo2 size={14} />
          </button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors" title="Rehacer (Ctrl+Shift+Z)">
            <Redo2 size={14} />
          </button>

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          {/* Responsive toggles */}
          <div className="flex items-center bg-zinc-800/40 rounded-lg p-0.5">
            {([
              { width: "full" as const, icon: Monitor, label: "Desktop" },
              { width: 768 as const, icon: Tablet, label: "Tablet" },
              { width: 375 as const, icon: Smartphone, label: "Movil" },
            ] as const).map(({ width, icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setPreviewWidth(width)}
                className={`p-1.5 rounded-md transition-all ${previewWidth === width ? "text-blue-400 bg-zinc-700/50" : "text-zinc-500 hover:text-zinc-300"}`}
                title={label}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          {/* Save & Publish */}
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-30 transition-all"
          >
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Guardar
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-600/20"
          >
            <Globe size={12} />
            Publicar
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MAIN EDITOR AREA
      ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT SIDEBAR (Tools) ─────────────────────────────── */}
        <div className="w-12 shrink-0 border-r border-zinc-800/60 bg-zinc-900/40 flex flex-col items-center py-2 gap-1">
          <button
            onClick={() => setLeftPanel(leftPanel === "layers" ? "none" : "layers")}
            className={`p-2 rounded-lg transition-all ${leftPanel === "layers" ? "bg-blue-600/20 text-blue-400" : "text-zinc-500 hover:text-white hover:bg-zinc-800"}`}
            title="Capas"
          >
            <Layers size={18} />
          </button>
          <button
            onClick={() => { setLeftPanel(leftPanel === "catalog" ? "none" : "catalog"); setAddAtPosition(null) }}
            className={`p-2 rounded-lg transition-all ${leftPanel === "catalog" ? "bg-blue-600/20 text-blue-400" : "text-zinc-500 hover:text-white hover:bg-zinc-800"}`}
            title="Agregar bloque"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* ── LEFT PANEL (Layers/Catalog) ──────────────────────── */}
        {leftPanel !== "none" && (
          <div className="w-[280px] shrink-0 border-r border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl flex flex-col overflow-hidden animate-in slide-in-from-left-2 duration-200">
            {/* Panel header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-800/60">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                {leftPanel === "layers" ? "Capas" : "Agregar Bloque"}
              </span>
              <button onClick={() => setLeftPanel("none")} className="p-1 text-zinc-500 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* ── LAYERS PANEL ── */}
            {leftPanel === "layers" && (
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {blocks.map((block, index) => {
                  const def = blockDefMap[block.type]
                  const isActive = block.id === activeBlockId
                  const IconComp = BLOCK_ICON_MAP[def?.icon || ""] || Layout
                  return (
                    <button
                      key={block.id}
                      onClick={() => selectBlock(block.id)}
                      className={`group w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${
                        isActive
                          ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30"
                          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                      }`}
                    >
                      <GripVertical size={11} className="text-zinc-600 shrink-0 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity" />
                      <IconComp size={14} className={`shrink-0 ${isActive ? "text-blue-400" : "text-zinc-500"}`} />
                      <span className="truncate flex-1 text-xs font-medium">{def?.label || block.type}</span>
                      <span className="text-[9px] text-zinc-600 font-mono">{index + 1}</span>
                    </button>
                  )
                })}
                <button
                  onClick={() => { setLeftPanel("catalog"); setAddAtPosition(null) }}
                  className="w-full flex items-center justify-center gap-1.5 mt-2 px-3 py-2.5 text-xs text-zinc-500 hover:text-blue-400 border border-dashed border-zinc-800 hover:border-blue-500/40 rounded-lg transition-all"
                >
                  <Plus size={12} /> Agregar bloque
                </button>
              </div>
            )}

            {/* ── BLOCK CATALOG ── */}
            {leftPanel === "catalog" && (
              <div className="flex-1 overflow-y-auto">
                {/* Search */}
                <div className="p-2 border-b border-zinc-800/60">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={e => setCatalogSearch(e.target.value)}
                      placeholder="Buscar bloques..."
                      className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                  {addAtPosition !== null && (
                    <p className="text-[10px] text-blue-400 mt-1.5 px-1">
                      Se insertara en posicion {addAtPosition + 1}
                    </p>
                  )}
                </div>

                {/* Categories */}
                <div className="p-2 space-y-3">
                  {filteredCatalog.map(cat => (
                    <div key={cat.name}>
                      <div className="flex items-center gap-2 px-1 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{cat.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {cat.items.map(type => {
                          const def = blockDefMap[type]
                          if (!def) return null
                          const IconComp = BLOCK_ICON_MAP[def.icon] || Layout
                          return (
                            <button
                              key={type}
                              onClick={() => handleAddBlock(type)}
                              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-zinc-800/60 hover:border-blue-500/40 hover:bg-blue-500/5 text-zinc-400 hover:text-blue-400 transition-all group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-zinc-800/60 group-hover:bg-blue-500/10 flex items-center justify-center transition-colors">
                                <IconComp size={16} />
                              </div>
                              <span className="text-[10px] font-medium text-center leading-tight">{def.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            CANVAS AREA
        ═══════════════════════════════════════════════════════ */}
        <div className="flex-1 bg-zinc-950 flex items-start justify-center overflow-auto relative">
          {/* Canvas background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />

          <div
            className="relative bg-white shadow-2xl overflow-hidden transition-all duration-500 ease-out mx-auto my-4"
            style={{
              width: previewWidth === "full" ? "100%" : `${previewWidth}px`,
              maxWidth: "100%",
              height: previewWidth === "full" ? "calc(100vh - 96px)" : "calc(100vh - 110px)",
              borderRadius: previewWidth === "full" ? 0 : "12px",
              margin: previewWidth === "full" ? 0 : undefined,
            }}
          >
            {/* Loading overlay */}
            {!previewReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-10 gap-3">
                <Loader2 className="animate-spin text-blue-500" size={24} />
                <p className="text-xs text-zinc-500">Cargando preview...</p>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={`/preview/${slug}`}
              className="w-full h-full border-0 bg-white"
              title="Preview"
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            RIGHT PANEL (Properties)
        ═══════════════════════════════════════════════════════ */}
        {rightPanelOpen && (
          <div className="w-[320px] shrink-0 border-l border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-800/60 shrink-0">
              {activeBlock && activeBlockDef ? (
                <div className="flex items-center gap-2">
                  {(() => {
                    const IconComp = BLOCK_ICON_MAP[activeBlockDef.icon] || Layout
                    return <IconComp size={14} className="text-blue-400" />
                  })()}
                  <span className="text-xs font-semibold text-zinc-300">{activeBlockDef.label}</span>
                </div>
              ) : (
                <span className="text-xs text-zinc-500">Selecciona un bloque</span>
              )}
              <button onClick={() => setRightPanelOpen(false)} className="p-1 text-zinc-500 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
                <PanelRightClose size={14} />
              </button>
            </div>

            {activeBlock && activeBlockDef ? (
              <>
                {/* Tabs */}
                <div className="flex border-b border-zinc-800/60 shrink-0">
                  {(["content", "design", "advanced"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-all ${
                        activeTab === tab
                          ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {tab === "content" ? "Contenido" : tab === "design" ? "Diseno" : "Avanzado"}
                    </button>
                  ))}
                </div>

                {/* Fields */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-3 space-y-3">
                    {(activeTab === "content" ? activeBlockDef.content : activeTab === "design" ? activeBlockDef.design : activeBlockDef.advanced).map(field => (
                      <FieldControl
                        key={field.key}
                        field={field}
                        value={activeTab === "design" ? activeBlock.styles[field.key] : getNestedValue(activeBlock.content, field.key)}
                        onChange={value => {
                          if (activeTab === "design") {
                            handleStyleChange(activeBlock.id, field.key, value)
                          } else {
                            handleFieldChange(activeBlock.id, field.key, value)
                          }
                        }}
                      />
                    ))}
                    {(activeTab === "content" ? activeBlockDef.content : activeTab === "design" ? activeBlockDef.design : activeBlockDef.advanced).length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-xs text-zinc-600">Sin propiedades editables</p>
                      </div>
                    )}
                  </div>

                  {/* Visibility controls in design tab */}
                  {activeTab === "design" && (
                    <div className="p-3 border-t border-zinc-800/60">
                      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Visibilidad</p>
                      <div className="flex gap-3">
                        {(["desktop", "tablet", "mobile"] as const).map(device => (
                          <label key={device} className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={activeBlock.visibility?.[device] ?? true}
                              onChange={e => {
                                setBlocks(prev =>
                                  prev.map(b =>
                                    b.id !== activeBlock.id ? b : { ...b, visibility: { ...b.visibility, [device]: e.target.checked } }
                                  )
                                )
                                scheduleAutosave()
                              }}
                              className="accent-blue-500 rounded"
                            />
                            {device === "desktop" ? "Desktop" : device === "tablet" ? "Tablet" : "Movil"}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/40 flex items-center justify-center">
                  <MousePointerClick size={24} className="text-zinc-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-1">Selecciona un bloque</p>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Haz clic en cualquier bloque del canvas para editar sus propiedades.
                    Doble clic para edicion inline.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toggle right panel button */}
        {!rightPanelOpen && (
          <button
            onClick={() => setRightPanelOpen(true)}
            className="absolute right-0 top-20 z-10 p-2 bg-zinc-800/80 backdrop-blur border border-zinc-700/60 rounded-l-lg text-zinc-400 hover:text-white transition-colors"
          >
            <PanelRight size={14} />
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          STATUS BAR
      ═══════════════════════════════════════════════════════════ */}
      <div className="h-8 border-t border-zinc-800/60 flex items-center justify-between px-4 bg-zinc-900/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${page.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className="text-[10px] text-zinc-500 font-medium">
              {page.status === "published" ? "Publicado" : "Borrador"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-zinc-600">
          <span>{blocks.length} bloques</span>
          <span>Doble clic = edicion inline</span>
          <span>Ctrl+Z = deshacer</span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// FIELD CONTROL
// ═══════════════════════════════════════════════════════════════

function FieldControl({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  switch (field.type) {
    case "text":
      return (
        <div>
          <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{field.label}</label>
          <input
            type="text"
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>
      )

    case "textarea":
      return (
        <div>
          <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{field.label}</label>
          <textarea
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            rows={3}
            className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 resize-none transition-all"
          />
        </div>
      )

    case "number":
      return (
        <div>
          <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{field.label}</label>
          <input
            type="number"
            value={value ?? field.defaultValue ?? ""}
            onChange={e => onChange(Number(e.target.value))}
            min={field.min}
            max={field.max}
            className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-2.5 py-2 text-xs text-white focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>
      )

    case "slider":
      return (
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{field.label}</label>
            <span className="text-[10px] text-zinc-400 font-mono bg-zinc-800 px-1.5 py-0.5 rounded">{value ?? field.defaultValue ?? 0}px</span>
          </div>
          <input
            type="range"
            value={value ?? field.defaultValue ?? 0}
            onChange={e => onChange(Number(e.target.value))}
            min={field.min ?? 0}
            max={field.max ?? 100}
            className="w-full accent-blue-500 h-1.5 rounded-full"
          />
        </div>
      )

    case "color":
      return (
        <div>
          <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{field.label}</label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                value={value || "#000000"}
                onChange={e => onChange(e.target.value)}
                className="w-9 h-9 rounded-lg border border-zinc-700/60 cursor-pointer bg-transparent"
              />
            </div>
            <input
              type="text"
              value={value || ""}
              onChange={e => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-2.5 py-2 text-xs text-white font-mono focus:border-blue-500/50 focus:outline-none transition-all"
            />
          </div>
        </div>
      )

    case "select":
      return (
        <div>
          <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{field.label}</label>
          <select
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-2.5 py-2 text-xs text-white focus:border-blue-500/50 focus:outline-none transition-all"
          >
            <option value="">Seleccionar...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )

    case "toggle":
      return (
        <label className="flex items-center justify-between py-1.5 cursor-pointer group">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">{field.label}</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={value ?? field.defaultValue ?? false}
              onChange={e => onChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-zinc-700 rounded-full peer-checked:bg-blue-600 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow peer-checked:translate-x-3.5 transition-transform" />
          </div>
        </label>
      )

    case "icon":
      return <IconPickerControl field={field} value={value} onChange={onChange} />

    case "animation":
      return <AnimationPickerControl field={field} value={value} onChange={onChange} />

    case "media":
      return <MediaFieldControl field={field} value={value} onChange={onChange} />

    case "array":
      return <ArrayFieldControl field={field} value={value} onChange={onChange} />

    default:
      return null
  }
}

// ═══════════════════════════════════════════════════════════════
// MEDIA FIELD CONTROL (Upload + Gallery)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// ANIMATION PICKER — Visual preview with CSS animations
// ═══════════════════════════════════════════════════════════════

const CSS_PREVIEW_ANIMATIONS: Record<string, string> = {
  fadeUp: "cms-anim-fadeUp",
  fadeDown: "cms-anim-fadeDown",
  slideLeft: "cms-anim-slideLeft",
  slideRight: "cms-anim-slideRight",
  scaleIn: "cms-anim-scaleIn",
  flipIn: "cms-anim-flipIn",
  bounceIn: "cms-anim-bounceIn",
  rotateIn: "cms-anim-rotateIn",
  blurIn: "cms-anim-blurIn",
  typewriter: "cms-anim-typewriter",
  staggerChildren: "cms-anim-fadeUp",
  parallaxSlow: "cms-anim-fadeUp",
  hoverLift: "cms-anim-hoverLift",
  hoverGlow: "cms-anim-hoverGlow",
}

const ANIM_STYLES = `
@keyframes cms-fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
@keyframes cms-fadeDown { from { opacity:0; transform:translateY(-20px) } to { opacity:1; transform:translateY(0) } }
@keyframes cms-slideLeft { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }
@keyframes cms-slideRight { from { opacity:0; transform:translateX(-30px) } to { opacity:1; transform:translateX(0) } }
@keyframes cms-scaleIn { from { opacity:0; transform:scale(0.5) } to { opacity:1; transform:scale(1) } }
@keyframes cms-flipIn { from { opacity:0; transform:rotateX(-90deg) } to { opacity:1; transform:rotateX(0) } }
@keyframes cms-bounceIn { 0% { opacity:0; transform:scale(0.3) } 50% { transform:scale(1.1) } 70% { transform:scale(0.9) } 100% { opacity:1; transform:scale(1) } }
@keyframes cms-rotateIn { from { opacity:0; transform:rotate(-15deg) scale(0.8) } to { opacity:1; transform:rotate(0) scale(1) } }
@keyframes cms-blurIn { from { opacity:0; filter:blur(8px) } to { opacity:1; filter:blur(0) } }
@keyframes cms-typewriter { from { width:0 } to { width:100% } }
.cms-anim-fadeUp { animation: cms-fadeUp 0.6s ease-out both }
.cms-anim-fadeDown { animation: cms-fadeDown 0.6s ease-out both }
.cms-anim-slideLeft { animation: cms-slideLeft 0.6s ease-out both }
.cms-anim-slideRight { animation: cms-slideRight 0.6s ease-out both }
.cms-anim-scaleIn { animation: cms-scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both }
.cms-anim-flipIn { animation: cms-flipIn 0.7s ease-out both; perspective:400px }
.cms-anim-bounceIn { animation: cms-bounceIn 0.8s ease-out both }
.cms-anim-rotateIn { animation: cms-rotateIn 0.7s ease-out both }
.cms-anim-blurIn { animation: cms-blurIn 0.7s ease-out both }
.cms-anim-typewriter { animation: cms-typewriter 1.5s steps(20) both; overflow:hidden; white-space:nowrap }
.cms-anim-hoverLift:hover { transform:translateY(-6px) scale(1.03); box-shadow:0 12px 24px rgba(59,130,246,0.3) }
.cms-anim-hoverGlow:hover { transform:scale(1.05); box-shadow:0 0 20px rgba(59,130,246,0.4) }
`

function AnimationPickerControl({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [replayKey, setReplayKey] = useState(0)

  const current = ANIMATION_PRESETS.find(p => p.id === value)
  const filtered = activeCategory
    ? ANIMATION_PRESETS.filter(p => p.category === activeCategory)
    : ANIMATION_PRESETS

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{field.label}</label>

      {/* Current selection */}
      <button
        onClick={() => { setOpen(!open); setReplayKey(k => k + 1) }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-zinc-800/60 border border-zinc-700/40 rounded-lg text-xs text-white hover:border-blue-500/50 transition-all"
      >
        {current ? (
          <>
            <div
              key={`sel-${replayKey}`}
              className={`w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 ${CSS_PREVIEW_ANIMATIONS[current.id] || ""}`}
            />
            <div className="flex-1 text-left">
              <span className="font-medium">{current.name}</span>
              <span className="text-zinc-500 ml-1.5 text-[10px] capitalize">{current.category}</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-lg bg-zinc-700/50 flex-shrink-0" />
            <span className="flex-1 text-left text-zinc-500">Sin animacion</span>
          </>
        )}
        <ChevronDown size={12} className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Picker dropdown */}
      {open && (
        <div className="mt-1.5 border border-zinc-700/60 rounded-xl bg-zinc-900 overflow-hidden shadow-xl">
          {/* None option */}
          <button
            onClick={() => { onChange("none"); setOpen(false) }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs border-b border-zinc-800/60 transition-colors ${!value || value === "none" ? "text-blue-400 bg-blue-500/5" : "text-zinc-400 hover:bg-zinc-800"}`}
          >
            <div className="w-5 h-5 rounded bg-zinc-700/50" />
            <span>Sin animacion</span>
          </button>

          {/* Category filter + replay */}
          <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-800/60">
            <button onClick={() => { setActiveCategory(null); setReplayKey(k => k + 1) }} className={`px-2 py-1 rounded-md text-[9px] font-semibold uppercase tracking-wider ${!activeCategory ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}>Todos</button>
            {ANIMATION_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setReplayKey(k => k + 1) }} className={`px-2 py-1 rounded-md text-[9px] font-semibold uppercase tracking-wider capitalize ${activeCategory === cat ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}>{cat}</button>
            ))}
            <button onClick={() => setReplayKey(k => k + 1)} className="ml-auto px-2 py-1 text-[9px] text-zinc-500 hover:text-blue-400" title="Repetir animaciones"><Redo2 size={10} /></button>
          </div>

          {/* Grid with CSS-animated previews */}
          <div className="grid grid-cols-2 gap-2 p-2 max-h-[360px] overflow-y-auto">
            {filtered.map((preset, idx) => {
              const isSelected = value === preset.id
              const cssClass = CSS_PREVIEW_ANIMATIONS[preset.id] || ""
              return (
                <button
                  key={preset.id}
                  onClick={() => { onChange(preset.id); setOpen(false) }}
                  className={`relative flex flex-col items-center rounded-xl p-3 text-left transition-all ${isSelected ? "bg-blue-500/10 ring-1 ring-blue-500/40" : "bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800/40 hover:border-zinc-700"}`}
                >
                  {/* Preview area */}
                  <div className="w-full h-16 rounded-lg bg-zinc-950 flex items-center justify-center overflow-hidden mb-2 relative">
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #fff 0.5px, transparent 0.5px)", backgroundSize: "8px 8px" }} />
                    <div
                      key={`${preset.id}-${replayKey}`}
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 relative z-10 transition-all duration-300 ${cssClass}`}
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold ${isSelected ? "text-blue-400" : "text-zinc-300"}`}>{preset.name}</span>
                  <span className="text-[8px] text-zinc-500 mt-0.5 text-center">{preset.description}</span>
                  <span className={`absolute top-1.5 right-1.5 text-[7px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${
                    preset.category === "entrada" ? "bg-emerald-500/10 text-emerald-400" :
                    preset.category === "scroll" ? "bg-purple-500/10 text-purple-400" :
                    preset.category === "hover" ? "bg-amber-500/10 text-amber-400" :
                    "bg-rose-500/10 text-rose-400"
                  }`}>{preset.category}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ICON PICKER CONTROL — Lucide (90+) + Iconify API (275k+)
// ═══════════════════════════════════════════════════════════════

function IconPreview({ name, size = 20 }: { name: string; size?: number }) {
  if (!name) return null
  // Iconify format: "prefix:icon-name"
  if (name.includes(":")) {
    return <img src={`https://api.iconify.design/${name.replace(":", "/")}.svg?color=%2360a5fa`} alt={name} width={size} height={size} className="inline-block" />
  }
  // Lucide format
  const LucideIcon = ICON_MAP[name]
  if (LucideIcon) return <LucideIcon size={size} />
  return <span className="text-[8px]">{name}</span>
}

function IconPickerControl({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"lucide" | "iconify">("lucide")
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [iconifyResults, setIconifyResults] = useState<any[]>([])
  const [iconifyLoading, setIconifyLoading] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Lucide filtered
  const filtered = ICON_LIBRARY.filter(icon => {
    if (search && tab === "lucide") return icon.name.toLowerCase().includes(search.toLowerCase())
    if (activeCategory) return icon.category === activeCategory
    return true
  })

  // Iconify search
  const searchIconify = useCallback((query: string) => {
    if (!query || query.length < 2) { setIconifyResults([]); return }
    setIconifyLoading(true)
    fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=60`)
      .then(r => r.json())
      .then(data => {
        setIconifyResults(data.icons || [])
        setIconifyLoading(false)
      })
      .catch(() => setIconifyLoading(false))
  }, [])

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setActiveCategory(null)
    if (tab === "iconify") {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
      searchTimeout.current = setTimeout(() => searchIconify(val), 400)
    }
  }

  const selectIcon = (name: string) => {
    onChange(name)
    setOpen(false)
    setSearch("")
    setIconifyResults([])
  }

  return (
    <div>
      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{field.label}</label>

      {/* Current selection */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-zinc-800/60 border border-zinc-700/40 rounded-lg text-xs text-white hover:border-blue-500/50 transition-all"
      >
        {value ? (
          <>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <IconPreview name={value} size={16} />
            </div>
            <span className="flex-1 text-left truncate">{value}</span>
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-lg bg-zinc-700/50 flex items-center justify-center">
              <Search size={14} className="text-zinc-500" />
            </div>
            <span className="flex-1 text-left text-zinc-500">Elegir icono...</span>
          </>
        )}
        <ChevronDown size={12} className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Picker dropdown */}
      {open && (
        <div className="mt-1.5 border border-zinc-700/60 rounded-xl bg-zinc-900 overflow-hidden shadow-xl">
          {/* Tabs: Lucide / Iconify */}
          <div className="flex border-b border-zinc-800/60">
            <button
              onClick={() => { setTab("lucide"); setSearch(""); setIconifyResults([]) }}
              className={`flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${tab === "lucide" ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Lucide (90+)
            </button>
            <button
              onClick={() => { setTab("iconify"); setSearch("") }}
              className={`flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${tab === "iconify" ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Iconify (275k+)
            </button>
          </div>

          {/* Search */}
          <div className="p-2 border-b border-zinc-800/60">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder={tab === "lucide" ? "Buscar icono..." : "Buscar en 275,000+ iconos..."}
                className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* ── LUCIDE TAB ── */}
          {tab === "lucide" && (
            <>
              {/* Category tabs */}
              {!search && (
                <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-800/60">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-2 py-1 rounded-md text-[9px] font-semibold uppercase tracking-wider transition-colors ${!activeCategory ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    Todos
                  </button>
                  {ICON_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2 py-1 rounded-md text-[9px] font-semibold uppercase tracking-wider transition-colors ${activeCategory === cat ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-6 gap-1 p-2 max-h-[240px] overflow-y-auto">
                {filtered.map(icon => {
                  const Icon = icon.component
                  const isSelected = value === icon.name
                  return (
                    <button
                      key={icon.name}
                      onClick={() => selectIcon(icon.name)}
                      title={icon.name}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${isSelected ? "bg-blue-500/20 ring-1 ring-blue-500/40 text-blue-400" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
                    >
                      <Icon size={18} />
                      <span className="text-[7px] leading-tight truncate w-full text-center">{icon.name}</span>
                    </button>
                  )
                })}
              </div>
              {filtered.length === 0 && <p className="text-xs text-zinc-600 text-center py-4">No se encontraron iconos</p>}
            </>
          )}

          {/* ── ICONIFY TAB ── */}
          {tab === "iconify" && (
            <div className="max-h-[300px] overflow-y-auto">
              {!search && (
                <div className="p-4 text-center">
                  <p className="text-xs text-zinc-500 mb-1">Escribe para buscar en 275,000+ iconos</p>
                  <p className="text-[10px] text-zinc-600">Prueba: heart, arrow, user, check, star, home...</p>
                </div>
              )}
              {iconifyLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 size={16} className="animate-spin text-blue-400" />
                  <span className="text-xs text-zinc-500 ml-2">Buscando...</span>
                </div>
              )}
              {!iconifyLoading && iconifyResults.length > 0 && (
                <div className="grid grid-cols-5 gap-1 p-2">
                  {iconifyResults.map((iconName: string) => {
                    const isSelected = value === iconName
                    return (
                      <button
                        key={iconName}
                        onClick={() => selectIcon(iconName)}
                        title={iconName}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all ${isSelected ? "bg-blue-500/20 ring-1 ring-blue-500/40" : "hover:bg-zinc-800"}`}
                      >
                        <img
                          src={`https://api.iconify.design/${iconName.replace(":", "/")}.svg?color=%23a1a1aa`}
                          alt={iconName}
                          width={22}
                          height={22}
                          className="inline-block"
                          loading="lazy"
                          onMouseOver={e => (e.currentTarget.src = `https://api.iconify.design/${iconName.replace(":", "/")}.svg?color=%2360a5fa`)}
                          onMouseOut={e => (e.currentTarget.src = `https://api.iconify.design/${iconName.replace(":", "/")}.svg?color=%23a1a1aa`)}
                        />
                        <span className="text-[7px] text-zinc-500 leading-tight truncate w-full text-center">{iconName.split(":")[1]}</span>
                      </button>
                    )
                  })}
                </div>
              )}
              {!iconifyLoading && search.length >= 2 && iconifyResults.length === 0 && (
                <p className="text-xs text-zinc-600 text-center py-4">Sin resultados para &quot;{search}&quot;</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MEDIA FIELD CONTROL (Upload + Gallery)
// ═══════════════════════════════════════════════════════════════

function MediaFieldControl({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const [uploading, setUploading] = useState(false)
  const [gallery, setGallery] = useState<any[]>([])
  const [showGallery, setShowGallery] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const CMS_MEDIA_URL = "/api/cms-proxy"
  const cmsBaseUrl = typeof window !== "undefined" ? "" : ""

  // Load gallery
  const loadGallery = useCallback(async () => {
    const token = localStorage.getItem("cms-token") || ""
    const res = await fetch(`${CMS_MEDIA_URL}/media?siteId=${SITE_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setGallery(data.media || [])
    }
    setShowGallery(true)
  }, [])

  // Upload file
  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const token = localStorage.getItem("cms-token") || ""
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${CMS_MEDIA_URL}/media/upload?siteId=${SITE_ID}&folder=banners`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (res.ok) {
        const item = await res.json()
        // Use the CMS API URL for the image
        const imageUrl = `/api/cms-proxy/media${item.url}`
        onChange(imageUrl)
      }
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }, [onChange])

  const selectFromGallery = (item: any) => {
    const imageUrl = `/api/cms-proxy/media${item.url}`
    onChange(imageUrl)
    setShowGallery(false)
  }

  return (
    <div>
      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{field.label}</label>

      {/* Preview */}
      {value && (
        <div className="relative mb-2 rounded-lg overflow-hidden border border-zinc-700/40 bg-zinc-800/30">
          <img src={value} alt="" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
          <button
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center text-xs hover:bg-red-500"
          >
            ×
          </button>
        </div>
      )}

      {/* URL input */}
      <input
        type="text"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder="URL de imagen o sube un archivo"
        className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none mb-2"
      />

      {/* Actions */}
      <div className="flex gap-2">
        <label className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-dashed border-zinc-700 hover:border-blue-500/40 text-zinc-400 hover:text-blue-400 cursor-pointer transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          <ImageIcon size={12} />
          {uploading ? "Subiendo..." : "Subir Imagen"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
        <button
          onClick={loadGallery}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-blue-400 hover:border-blue-500/40 transition-all"
        >
          <Layout size={12} />
          Galeria
        </button>
      </div>

      {/* Gallery modal */}
      {showGallery && (
        <div className="mt-2 border border-zinc-700/60 rounded-lg bg-zinc-900 p-2 max-h-[300px] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-zinc-400">Galeria de Medios</span>
            <button onClick={() => setShowGallery(false)} className="text-zinc-500 hover:text-white text-xs">✕</button>
          </div>
          {gallery.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-4">No hay imagenes. Sube una primero.</p>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {gallery.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => selectFromGallery(item)}
                  className="relative aspect-square rounded-md overflow-hidden border border-zinc-800 hover:border-blue-500 transition-colors group"
                >
                  <img src={`/api/cms-proxy/media${item.variants?.thumbnail || item.url}`} alt={item.alt || item.originalName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 transition-colors" />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white px-1 py-0.5 truncate">{item.originalName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ARRAY FIELD CONTROL
// ═══════════════════════════════════════════════════════════════

function ArrayFieldControl({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const items = Array.isArray(value) ? value : []
  const [expanded, setExpanded] = useState<number | null>(null)

  const addItem = () => {
    const newItem: Record<string, any> = {}
    field.arrayFields?.forEach(f => { newItem[f.key] = "" })
    onChange([...items, newItem])
    setExpanded(items.length)
  }

  const updateItem = (index: number, key: string, val: any) => {
    const updated = items.map((item: any, i: number) =>
      i === index ? { ...item, [key]: val } : item
    )
    onChange(updated)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_: any, i: number) => i !== index))
    if (expanded === index) setExpanded(null)
  }

  return (
    <div>
      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">{field.label}</label>
      <div className="space-y-1">
        {items.map((item: any, i: number) => {
          const isOpen = expanded === i
          const preview = Object.values(item).find(v => typeof v === "string" && v.length > 0) as string || `Item ${i + 1}`
          return (
            <div key={i} className="rounded-lg border border-zinc-800/60 overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 transition-all"
              >
                <span className="truncate flex-1 text-left">{typeof preview === "string" ? preview.slice(0, 40) : `Item ${i + 1}`}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={e => { e.stopPropagation(); removeItem(i) }}
                    className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                  {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </div>
              </button>
              {isOpen && (
                <div className="px-2.5 pb-2.5 space-y-2 border-t border-zinc-800/40 mt-2">
                  {field.arrayFields?.map(subField => (
                    <FieldControl
                      key={subField.key}
                      field={subField}
                      value={item[subField.key]}
                      onChange={(val) => updateItem(i, subField.key, val)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button onClick={addItem} className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 py-2 border border-dashed border-zinc-800 hover:border-blue-500/40 rounded-lg transition-all">
        <Plus size={12} /> Agregar
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
