"use client"

import { useEffect } from "react"

const BLOCK_LABELS: Record<string, string> = {
  hero: "Hero",
  stats: "Estadisticas",
  statsSection: "Estadisticas",
  ctaBanner: "Call to Action",
  howItWorks: "Como Funciona",
  faq: "Preguntas Frecuentes",
  joinSection: "Seccion Unete",
  teamGrid: "Equipo",
  benefitsGrid: "Beneficios",
  testimonials: "Testimonios",
  featuredGrid: "Productos Destacados",
  featuredProducts: "Productos Destacados",
  categories: "Categorias",
  storySection: "Historia",
  pillars: "Pilares",
  quickCategoryMenu: "Menu Categorias",
  trustMarquee: "Trust Marquee",
  productCatalog: "Catalogo",
  missionSection: "Mision",
  scienceSection: "Ciencia",
  glycansSection: "Glycans",
  whyGlycansSection: "Por Que Glycans",
  newsletter: "Newsletter",
  socialProof: "Prueba Social",
}

const GRIP_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>`

export function PreviewClient() {
  useEffect(() => {
    // Only activate inside iframe (editor preview)
    const isInIframe = window.self !== window.top
    if (!isInIframe) return

    console.log("[CMS Editor] PreviewClient initializing...")

    // ═══════ VISIBLE DEBUG BADGE ═══════
    const badge = document.createElement("div")
    badge.id = "cms-active-badge"
    badge.textContent = "Editor Activo"
    badge.style.cssText = "position:fixed;bottom:12px;right:12px;z-index:999999;background:#3b82f6;color:white;font-size:11px;font-weight:600;padding:6px 14px;border-radius:20px;font-family:system-ui;box-shadow:0 4px 12px rgba(59,130,246,0.4);pointer-events:none;opacity:0.9;"
    document.body.appendChild(badge)

    // Count blocks found
    const blockCount = document.querySelectorAll("[data-block-id]").length
    console.log("[CMS Editor] Found", blockCount, "blocks")
    badge.textContent = `Editor Activo · ${blockCount} bloques`

    // ═══════ STATE ═══════
    let selectedId: string | null = null
    let hoveredId: string | null = null
    let editingField: { blockId: string; field: string; element: HTMLElement } | null = null
    let isDragging = false
    let addZonesCreated = false

    // ═══════ INJECT CSS ═══════
    const styleEl = document.createElement("style")
    styleEl.id = "cms-visual-editor"
    styleEl.textContent = `
      #cms-overlay {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      /* Selection & hover frames */
      .cms-frame {
        position: fixed;
        pointer-events: none;
        display: none;
      }
      .cms-frame-hover {
        border: 1.5px dashed rgba(96, 165, 250, 0.7);
        background: rgba(59, 130, 246, 0.03);
      }
      .cms-frame-select {
        border: 2px solid #3b82f6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      }

      /* Block label badge */
      .cms-label {
        position: fixed;
        pointer-events: auto;
        background: #3b82f6;
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 3px 10px 3px 6px;
        border-radius: 0 0 8px 0;
        white-space: nowrap;
        cursor: grab;
        user-select: none;
        gap: 5px;
        letter-spacing: 0.02em;
        z-index: 100001;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        display: none;
        align-items: center;
      }
      .cms-label svg { opacity: 0.7; }
      .cms-label:active { cursor: grabbing; }
      .cms-label.visible { display: flex; }

      /* Hover label (smaller) */
      .cms-hover-label {
        position: fixed;
        pointer-events: none;
        background: rgba(96, 165, 250, 0.9);
        color: white;
        font-size: 10px;
        font-weight: 600;
        padding: 2px 7px;
        border-radius: 4px;
        white-space: nowrap;
        z-index: 100000;
        letter-spacing: 0.02em;
        backdrop-filter: blur(8px);
        display: none;
      }
      .cms-hover-label.visible { display: block; }

      /* Floating toolbar */
      .cms-toolbar {
        position: fixed;
        pointer-events: auto;
        background: #09090b;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        padding: 4px;
        gap: 2px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03);
        z-index: 100002;
        align-items: center;
        backdrop-filter: blur(20px);
        display: none;
      }
      .cms-toolbar.visible { display: flex; }
      .cms-toolbar button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border: none;
        background: transparent;
        color: #a1a1aa;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.12s;
        padding: 0;
      }
      .cms-toolbar button:hover {
        background: rgba(255,255,255,0.08);
        color: white;
      }
      .cms-toolbar button.danger:hover {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
      }
      .cms-toolbar button svg { width: 15px; height: 15px; }
      .cms-toolbar .sep {
        width: 1px;
        height: 22px;
        background: rgba(255,255,255,0.06);
        margin: 0 2px;
      }

      /* Add zones between blocks */
      .cms-add-zone {
        position: relative;
        height: 0;
        transition: height 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: visible;
        z-index: 50;
      }
      .cms-add-zone .cms-add-line {
        position: absolute;
        left: 10%;
        right: 10%;
        top: 50%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #3b82f6, transparent);
        border-radius: 1px;
        opacity: 0;
        transition: opacity 0.2s;
        transform: translateY(-50%);
        pointer-events: none;
      }
      .cms-add-zone .cms-add-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #3b82f6;
        color: white;
        border: 2px solid white;
        font-size: 16px;
        font-weight: 300;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s;
        box-shadow: 0 2px 12px rgba(59,130,246,0.4);
        line-height: 1;
      }
      .cms-add-zone:hover {
        height: 32px;
      }
      .cms-add-zone:hover .cms-add-btn {
        opacity: 1;
        pointer-events: auto;
      }
      .cms-add-zone:hover .cms-add-line {
        opacity: 0.6;
      }
      .cms-add-zone.drag-over {
        height: 56px;
        background: rgba(59, 130, 246, 0.04);
      }
      .cms-add-zone.drag-over .cms-add-line {
        opacity: 1;
        height: 3px;
        left: 5%;
        right: 5%;
        background: #3b82f6;
      }

      /* Inline editing hint */
      [data-cms-field] {
        transition: box-shadow 0.12s;
        border-radius: 2px;
      }
      [data-cms-field]:hover {
        box-shadow: inset 0 0 0 1.5px rgba(59, 130, 246, 0.3);
        cursor: pointer;
      }
      [data-cms-field][contenteditable="true"] {
        outline: none !important;
        box-shadow: inset 0 0 0 2px #3b82f6 !important;
        border-radius: 4px;
        padding: 2px 4px;
        margin: -2px -4px;
        min-width: 20px;
        cursor: text;
        background: rgba(59, 130, 246, 0.05);
      }
      [data-cms-field][contenteditable="true"]::selection {
        background: rgba(59, 130, 246, 0.2);
      }

      /* Drag state */
      [data-block-id].cms-dragging {
        opacity: 0.25;
        transition: opacity 0.2s;
      }

      /* Edit hint tooltip */
      .cms-edit-hint {
        position: fixed;
        pointer-events: none;
        background: #09090b;
        color: #e4e4e7;
        font-size: 10px;
        font-weight: 500;
        padding: 4px 8px;
        border-radius: 6px;
        white-space: nowrap;
        z-index: 100003;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: none;
        opacity: 0;
        transition: opacity 0.15s;
      }
      .cms-edit-hint.visible {
        display: block;
        opacity: 1;
      }
    `
    document.head.appendChild(styleEl)

    // ═══════ CREATE OVERLAY DOM ═══════
    const overlay = document.createElement("div")
    overlay.id = "cms-overlay"
    document.body.appendChild(overlay)

    const hoverFrame = document.createElement("div")
    hoverFrame.className = "cms-frame cms-frame-hover"
    overlay.appendChild(hoverFrame)

    const hoverLabel = document.createElement("div")
    hoverLabel.className = "cms-hover-label"
    overlay.appendChild(hoverLabel)

    const selectFrame = document.createElement("div")
    selectFrame.className = "cms-frame cms-frame-select"
    overlay.appendChild(selectFrame)

    const label = document.createElement("div")
    label.className = "cms-label"
    overlay.appendChild(label)

    const toolbar = document.createElement("div")
    toolbar.className = "cms-toolbar"
    toolbar.innerHTML = `
      <button data-action="drag" title="Arrastrar para mover" style="cursor:grab">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </button>
      <div class="sep"></div>
      <button data-action="moveUp" title="Mover arriba">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
      <button data-action="moveDown" title="Mover abajo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="sep"></div>
      <button data-action="duplicate" title="Duplicar bloque">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      </button>
      <button data-action="settings" title="Propiedades">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
      <div class="sep"></div>
      <button data-action="delete" class="danger" title="Eliminar bloque">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    `
    overlay.appendChild(toolbar)

    const editHint = document.createElement("div")
    editHint.className = "cms-edit-hint"
    editHint.textContent = "Doble clic para editar"
    overlay.appendChild(editHint)

    // ═══════ ADD ZONES ═══════
    function createAddZones() {
      if (addZonesCreated) return
      addZonesCreated = true

      document.querySelectorAll(".cms-add-zone").forEach(z => z.remove())

      const blocks = getBlocks()
      if (blocks.length === 0) return

      const createZone = (position: number) => {
        const zone = document.createElement("div")
        zone.className = "cms-add-zone"
        zone.dataset.position = String(position)
        zone.innerHTML = `<div class="cms-add-line"></div><button class="cms-add-btn" type="button">+</button>`

        zone.querySelector(".cms-add-btn")!.addEventListener("click", (e) => {
          e.stopPropagation()
          e.preventDefault()
          window.parent.postMessage({ type: "requestAddBlock", position }, "*")
        })

        zone.addEventListener("dragover", (e) => {
          e.preventDefault()
          if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
          zone.classList.add("drag-over")
        })
        zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"))
        zone.addEventListener("drop", (e) => {
          e.preventDefault()
          zone.classList.remove("drag-over")
          const blockId = e.dataTransfer?.getData("text/plain")
          if (blockId) {
            window.parent.postMessage({ type: "blockReordered", blockId, newPosition: position }, "*")
          }
        })

        return zone
      }

      blocks.forEach((block, i) => {
        block.parentNode?.insertBefore(createZone(i), block)
      })
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock?.parentNode) {
        lastBlock.parentNode.insertBefore(createZone(blocks.length), lastBlock.nextSibling)
      }

      console.log("[CMS Editor] Add zones created for", blocks.length, "blocks")
    }

    // ═══════ UTILITIES ═══════
    function getBlocks(): HTMLElement[] {
      return Array.from(document.querySelectorAll("[data-block-id]"))
    }

    function getBlockLabel(type: string): string {
      return BLOCK_LABELS[type] || type.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()).trim()
    }

    // ═══════ SHOW/HIDE HELPERS ═══════
    function showEl(el: HTMLElement) { el.classList.add("visible") }
    function hideEl(el: HTMLElement) { el.classList.remove("visible") }
    function posFrame(el: HTMLElement, r: DOMRect) {
      el.style.left = `${r.left}px`
      el.style.top = `${r.top}px`
      el.style.width = `${r.width}px`
      el.style.height = `${r.height}px`
      el.style.display = "block"
    }

    // ═══════ UPDATE LOOP ═══════
    let rafId: number
    function updateOverlays() {
      // HOVER
      if (hoveredId && hoveredId !== selectedId && !isDragging) {
        const el = document.querySelector(`[data-block-id="${hoveredId}"]`) as HTMLElement
        if (el) {
          const r = el.getBoundingClientRect()
          posFrame(hoverFrame, r)
          const blockType = el.dataset.blockType || ""
          hoverLabel.textContent = getBlockLabel(blockType)
          hoverLabel.style.left = `${r.left + 8}px`
          hoverLabel.style.top = `${Math.max(0, r.top - 22)}px`
          showEl(hoverLabel)
        }
      } else {
        hoverFrame.style.display = "none"
        hideEl(hoverLabel)
      }

      // SELECTION
      if (selectedId && !editingField) {
        const el = document.querySelector(`[data-block-id="${selectedId}"]`) as HTMLElement
        if (el) {
          const r = el.getBoundingClientRect()
          posFrame(selectFrame, r)

          const blockType = el.dataset.blockType || ""
          label.innerHTML = `${GRIP_SVG} ${getBlockLabel(blockType)}`
          label.style.left = `${r.left}px`
          label.style.top = `${r.top}px`
          showEl(label)

          const tw = 230
          const toolbarLeft = Math.max(8, Math.min(r.left + r.width / 2 - tw / 2, window.innerWidth - tw - 8))
          const toolbarTop = r.top > 52 ? r.top - 46 : r.bottom + 8
          toolbar.style.left = `${toolbarLeft}px`
          toolbar.style.top = `${toolbarTop}px`
          showEl(toolbar)
        }
      } else {
        selectFrame.style.display = "none"
        hideEl(label)
        hideEl(toolbar)
      }

      rafId = requestAnimationFrame(updateOverlays)
    }
    rafId = requestAnimationFrame(updateOverlays)

    // ═══════ MOUSE EVENTS ═══════
    let editHintTimeout: ReturnType<typeof setTimeout> | null = null

    function handleMouseMove(e: MouseEvent) {
      if (isDragging) return
      const target = e.target as HTMLElement

      // Track hovered block
      const block = target.closest("[data-block-id]") as HTMLElement | null
      hoveredId = block?.dataset.blockId || null

      // Show edit hint on cms-field elements
      const fieldEl = target.closest("[data-cms-field]") as HTMLElement | null
      if (fieldEl && !editingField) {
        if (editHintTimeout) clearTimeout(editHintTimeout)
        editHintTimeout = setTimeout(() => {
          const fr = fieldEl.getBoundingClientRect()
          editHint.style.left = `${fr.left + fr.width / 2 - 60}px`
          editHint.style.top = `${fr.top - 28}px`
          showEl(editHint)
        }, 800)
      } else {
        if (editHintTimeout) { clearTimeout(editHintTimeout); editHintTimeout = null }
        hideEl(editHint)
      }
    }

    function handleMouseLeave() {
      hoveredId = null
      if (editHintTimeout) { clearTimeout(editHintTimeout); editHintTimeout = null }
      hideEl(editHint)
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement

      // Ignore clicks on overlay UI
      if (target.closest(".cms-toolbar, .cms-add-zone")) return

      // If currently editing, let the browser handle it
      if (editingField) return

      // Hide edit hint
      hideEl(editHint)
      if (editHintTimeout) { clearTimeout(editHintTimeout); editHintTimeout = null }

      const block = target.closest("[data-block-id]") as HTMLElement | null
      const newId = block?.dataset.blockId || null

      if (newId !== selectedId) {
        selectedId = newId
        console.log("[CMS Editor] Block selected:", newId)
        if (newId) {
          window.parent.postMessage({
            type: "blockSelected",
            blockId: newId,
            blockType: block?.dataset.blockType,
          }, "*")
        } else {
          window.parent.postMessage({ type: "blockDeselected" }, "*")
        }
      }
    }

    function handleDblClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const fieldEl = target.closest("[data-cms-field]") as HTMLElement | null
      if (!fieldEl) return
      const blockEl = fieldEl.closest("[data-block-id]") as HTMLElement | null
      if (!blockEl) return

      e.preventDefault()
      e.stopPropagation()

      const blockId = blockEl.dataset.blockId!
      const field = fieldEl.dataset.cmsField!

      console.log("[CMS Editor] Inline edit:", blockId, field)

      editingField = { blockId, field, element: fieldEl }
      selectedId = blockId
      fieldEl.contentEditable = "true"
      fieldEl.focus()

      // Select all text
      const range = document.createRange()
      range.selectNodeContents(fieldEl)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)

      // Hide overlays while editing
      selectFrame.style.display = "none"
      hideEl(toolbar)
      hideEl(label)
      hideEl(editHint)

      window.parent.postMessage({ type: "inlineEditStart", blockId, field }, "*")
    }

    function handleFocusOut(e: FocusEvent) {
      if (!editingField) return
      const target = e.target as HTMLElement
      if (target !== editingField.element) return

      console.log("[CMS Editor] Inline edit done")

      target.contentEditable = "false"
      const newValue = target.textContent || ""

      window.parent.postMessage({
        type: "inlineEdit",
        blockId: editingField.blockId,
        field: editingField.field,
        value: newValue,
      }, "*")

      editingField = null
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (editingField) {
        if (e.key === "Escape") {
          e.preventDefault()
          editingField.element.blur()
        }
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          editingField.element.blur()
        }
        return // Don't process other shortcuts while editing
      }

      if (!selectedId) return

      if (e.key === "Delete" || e.key === "Backspace") {
        const active = document.activeElement
        if (!active || (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA" && !active.hasAttribute("contenteditable"))) {
          e.preventDefault()
          window.parent.postMessage({ type: "toolbarAction", action: "delete", blockId: selectedId }, "*")
        }
      }
      if (e.key === "Escape") {
        selectedId = null
        window.parent.postMessage({ type: "blockDeselected" }, "*")
      }
      if (e.key === "ArrowUp" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        window.parent.postMessage({ type: "toolbarAction", action: "moveUp", blockId: selectedId }, "*")
      }
      if (e.key === "ArrowDown" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        window.parent.postMessage({ type: "toolbarAction", action: "moveDown", blockId: selectedId }, "*")
      }
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        window.parent.postMessage({ type: "toolbarAction", action: "duplicate", blockId: selectedId }, "*")
      }
    }

    // ═══════ TOOLBAR ACTIONS ═══════
    toolbar.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button[data-action]") as HTMLElement | null
      if (!btn || !selectedId) return
      e.stopPropagation()
      const action = btn.dataset.action
      console.log("[CMS Editor] Toolbar action:", action, selectedId)
      if (action) {
        window.parent.postMessage({ type: "toolbarAction", action, blockId: selectedId }, "*")
      }
    })

    // ═══════ DRAG & DROP ═══════
    label.draggable = true
    label.addEventListener("dragstart", (e) => {
      if (!selectedId) return
      e.dataTransfer!.setData("text/plain", selectedId)
      e.dataTransfer!.effectAllowed = "move"
      isDragging = true

      const block = document.querySelector(`[data-block-id="${selectedId}"]`) as HTMLElement
      if (block) block.classList.add("cms-dragging")

      selectFrame.style.display = "none"
      hideEl(toolbar)
      label.style.opacity = "0.5"
    })

    document.addEventListener("dragend", () => {
      if (!isDragging) return
      isDragging = false
      document.querySelectorAll(".cms-dragging").forEach(el => (el as HTMLElement).classList.remove("cms-dragging"))
      document.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"))
      label.style.opacity = "1"
    })

    // ═══════ POSTMESSAGE FROM EDITOR ═══════
    function handleMessage(event: MessageEvent) {
      const data = event.data
      if (!data?.type) return

      switch (data.type) {
        case "scrollToBlock": {
          const el = document.querySelector(`[data-block-id="${data.blockId}"]`)
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
          break
        }
        case "selectBlock": {
          selectedId = data.blockId
          const el = document.querySelector(`[data-block-id="${data.blockId}"]`)
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
          window.parent.postMessage({ type: "blockSelected", blockId: data.blockId, blockType: (el as HTMLElement)?.dataset.blockType }, "*")
          break
        }
        case "highlight": {
          if (data.action === "remove") {
            selectedId = null
          } else {
            selectedId = data.blockId
          }
          break
        }
        case "deselectAll": {
          selectedId = null
          break
        }
        case "refreshZones": {
          addZonesCreated = false
          setTimeout(createAddZones, 300)
          break
        }
      }
    }

    // ═══════ ATTACH ALL EVENT LISTENERS ═══════
    // Use capture phase to intercept before landing component handlers
    document.addEventListener("mousemove", handleMouseMove, { passive: true, capture: true })
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("click", handleClick, { capture: true })
    document.addEventListener("dblclick", handleDblClick, { capture: true })
    document.addEventListener("focusout", handleFocusOut)
    document.addEventListener("keydown", handleKeyDown, { capture: true })
    window.addEventListener("message", handleMessage)

    // Prevent links from navigating in editor mode
    document.addEventListener("click", (e) => {
      const link = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null
      if (link && !link.closest(".cms-toolbar, .cms-add-zone")) {
        e.preventDefault()
        e.stopPropagation()
        console.log("[CMS Editor] Blocked navigation to:", link.href)
      }
    }, { capture: true })

    // Create add zones once blocks have rendered
    const zoneTimer1 = setTimeout(createAddZones, 800)
    const zoneTimer2 = setTimeout(() => { addZonesCreated = false; createAddZones() }, 3000)

    // Signal ready to parent
    window.parent.postMessage({ type: "previewReady" }, "*")
    console.log("[CMS Editor] PreviewClient ready")

    // ═══════ CLEANUP ═══════
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(zoneTimer1)
      clearTimeout(zoneTimer2)
      if (editHintTimeout) clearTimeout(editHintTimeout)
      document.removeEventListener("mousemove", handleMouseMove, { capture: true } as EventListenerOptions)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("click", handleClick, { capture: true } as EventListenerOptions)
      document.removeEventListener("dblclick", handleDblClick, { capture: true } as EventListenerOptions)
      document.removeEventListener("focusout", handleFocusOut)
      document.removeEventListener("keydown", handleKeyDown, { capture: true } as EventListenerOptions)
      window.removeEventListener("message", handleMessage)
      overlay.remove()
      styleEl.remove()
      badge.remove()
      document.querySelectorAll(".cms-add-zone").forEach(z => z.remove())
    }
  }, [])

  return null
}
