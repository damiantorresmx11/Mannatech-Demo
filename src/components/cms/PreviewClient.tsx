"use client"

import { useEffect } from "react"

export function PreviewClient() {
  useEffect(() => {
    // Don't run if not in iframe
    if (window.self === window.top) return

    // ── Handle messages from editor ──────────────────────────────
    function handleMessage(event: MessageEvent) {
      const { type, blockId, field, value, action } = event.data || {}

      if (type === "update" && blockId) {
        const el = document.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement
        if (!el) return

        // Add smooth transition
        el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"

        // Apply style updates
        if (field === "bgColor") el.style.backgroundColor = value
        if (field === "paddingTop") el.style.paddingTop = `${value}px`
        if (field === "paddingBottom") el.style.paddingBottom = `${value}px`
        if (field === "textColor") el.style.color = value
        if (field === "opacity") el.style.opacity = value

        // Apply content updates — find text elements inside
        if (field === "heading") {
          const h = el.querySelector("h1, h2") as HTMLElement
          if (h) h.textContent = value
        }
        if (field === "subheading") {
          const p = el.querySelector("p") as HTMLElement
          if (p) p.textContent = value
        }

        // Clean transition after it completes
        setTimeout(() => { el.style.transition = "" }, 350)
      }

      if (type === "scrollToBlock" && blockId) {
        const el = document.querySelector(`[data-block-id="${blockId}"]`)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
      }

      if (type === "highlight" && blockId) {
        // Remove all existing highlights
        document.querySelectorAll("[data-block-id]").forEach((el) => {
          ;(el as HTMLElement).style.outline = ""
        })
        if (action !== "remove") {
          const el = document.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement
          if (el) el.style.outline = "2px solid #00A88F"
        }
      }
    }

    window.addEventListener("message", handleMessage)

    // ── Report visible blocks to editor ──────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const blockId = (entry.target as HTMLElement).dataset.blockId
            const blockType = (entry.target as HTMLElement).dataset.blockType
            if (blockId) {
              window.parent.postMessage(
                { type: "blockInView", blockId, blockType },
                "*"
              )
            }
          }
        }
      },
      { threshold: 0.4 }
    )

    document.querySelectorAll("[data-block-id]").forEach((el) => {
      observer.observe(el)
    })

    // ── Report ready to editor ───────────────────────────────────
    window.parent.postMessage({ type: "previewReady" }, "*")

    return () => {
      window.removeEventListener("message", handleMessage)
      observer.disconnect()
    }
  }, [])

  return null
}
