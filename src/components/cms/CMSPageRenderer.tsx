"use client"

import { useState, useEffect } from "react"
import type { CMSBlock } from "@/lib/cms-api"
import { motion } from "framer-motion"
import {
  Award, FlaskConical, Globe, Users, Heart, Shield, Leaf, Clock,
  ChevronDown, CheckCircle, Star, MessageCircle, ArrowRight,
  ShoppingBag, Smartphone, BarChart3, GraduationCap, Package,
  TrendingUp, DollarSign, FileCheck, Play,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════
// MAIN RENDERER
// ═══════════════════════════════════════════════════════════════

export function CMSPageRenderer({ blocks: initialBlocks }: { blocks: CMSBlock[] }) {
  const [blocks, setBlocks] = useState(initialBlocks)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "updateBlock") {
        const { blockId, content, styles } = event.data
        setBlocks(prev => prev.map(b => {
          if (b.id !== blockId) return b
          return {
            ...b,
            content: content ? { ...b.content, ...content } : b.content,
            styles: styles ? { ...b.styles, ...styles } : b.styles,
          }
        }))
      }
      if (event.data?.type === "update") {
        const { blockId, field, value } = event.data
        setBlocks(prev => prev.map(b => {
          if (b.id !== blockId) return b
          if (["bgColor", "paddingTop", "paddingBottom", "textColor", "overlayOpacity", "titleSize"].includes(field)) {
            return { ...b, styles: { ...b.styles, [field]: value } }
          }
          if (field.includes(".")) {
            const [parent, child] = field.split(".")
            return { ...b, content: { ...b.content, [parent]: { ...b.content[parent], [child]: value } } }
          }
          return { ...b, content: { ...b.content, [field]: value } }
        }))
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <div className="min-h-screen">
      {blocks.map(block => (
        <LiveBlock key={block.id} block={block} />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LIVE BLOCK
// ═══════════════════════════════════════════════════════════════

function LiveBlock({ block }: { block: CMSBlock }) {
  const style: React.CSSProperties = {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }
  if (block.styles?.paddingTop) style.paddingTop = `${block.styles.paddingTop}px`
  if (block.styles?.paddingBottom) style.paddingBottom = `${block.styles.paddingBottom}px`
  if (block.styles?.bgColor) style.backgroundColor = block.styles.bgColor

  const Component = RENDERERS[block.type]
  if (!Component) {
    return (
      <div data-block-id={block.id} data-block-type={block.type} className="py-16 text-center border-y border-dashed border-zinc-200">
        <p className="text-zinc-400 text-sm">Bloque: <strong>{block.type}</strong></p>
      </div>
    )
  }

  return (
    <div data-block-id={block.id} data-block-type={block.type} style={style}>
      <Component content={block.content} styles={block.styles} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// BLOCK RENDERERS — with data-cms-field for inline editing
// ═══════════════════════════════════════════════════════════════

type BlockRenderer = React.FC<{ content: Record<string, any>; styles: Record<string, any> }>

// ── Hero ──────────────────────────────────────────────────────
const HeroRenderer: BlockRenderer = ({ content, styles }) => {
  const slides = content.slides as any[] | undefined
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!slides?.length) return
    const interval = setInterval(() => setCurrentSlide(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(interval)
  }, [slides?.length])

  if (slides?.length) {
    return (
      <section className="relative w-full overflow-hidden" style={{ height: "clamp(400px, 50vw, 600px)" }}>
        {slides.map((slide, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === currentSlide ? 1 : 0 }}>
            <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {slide.href && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <a href={slide.href} className="px-6 py-2.5 bg-white/90 text-zinc-900 font-medium rounded-full text-sm hover:bg-white transition-colors">
                  Ver Producto
                </a>
              </div>
            )}
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#1a5c2e] via-[#2A7B3D] to-[#1a5c2e] overflow-hidden">
      {styles?.overlayOpacity && <div className="absolute inset-0 bg-black" style={{ opacity: (styles.overlayOpacity || 0) / 100 }} />}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
        {content.badge && <p data-cms-field="badge" className="text-emerald-300 font-semibold text-sm uppercase tracking-widest mb-4">{content.badge}</p>}
        <h1 data-cms-field="heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontSize: styles?.titleSize ? `${styles.titleSize}px` : undefined }}>
          {content.heading || "Titulo del Hero"}
        </h1>
        {content.subheading && <p data-cms-field="subheading" className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">{content.subheading}</p>}
        {content.cta?.label && (
          <a href={content.cta.url || "#"} className="inline-flex px-8 py-3.5 bg-white text-[#2A7B3D] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg">
            <span data-cms-field="cta.label">{content.cta.label}</span>
          </a>
        )}
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────
const StatsRenderer: BlockRenderer = ({ content }) => {
  const stats = content.stats as any[] || []
  return (
    <section className="py-16 bg-white border-y border-zinc-100">
      <div className="max-w-6xl mx-auto px-4">
        {content.title && <h2 data-cms-field="title" className="text-center text-sm font-bold text-zinc-400 uppercase tracking-widest mb-10">{content.title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="text-center p-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mb-1">
                {stat.isText ? stat.value : `${stat.value}${stat.suffix || ""}`}
              </p>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Banner ────────────────────────────────────────────────
const CTARenderer: BlockRenderer = ({ content, styles }) => {
  const isPrimary = styles?.bgType === "gradient" || styles?.bgColor
  return (
    <section className={`py-16 ${isPrimary ? "bg-gradient-to-r from-[#2A7B3D] to-[#1a5c2e]" : "bg-zinc-50"}`}>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 data-cms-field="heading" className={`text-2xl sm:text-3xl font-bold mb-4 ${isPrimary ? "text-white" : "text-zinc-900"}`}>{content.heading || "Call to Action"}</h2>
        {content.text && <p data-cms-field="text" className={`text-lg mb-8 ${isPrimary ? "text-white/70" : "text-zinc-600"}`}>{content.text}</p>}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {content.buttonLabel && (
            <a href={content.buttonUrl || "#"} className={`px-8 py-3.5 font-semibold rounded-lg text-sm uppercase tracking-wider transition-colors ${isPrimary ? "bg-white text-[#2A7B3D] hover:bg-white/90" : "bg-[#2A7B3D] text-white hover:bg-[#1a5c2e]"}`}>
              <span data-cms-field="buttonLabel">{content.buttonLabel}</span>
            </a>
          )}
          {content.buttons?.map((btn: any, i: number) => (
            <a key={i} href={btn.url || "#"} className={`px-8 py-3.5 font-semibold rounded-lg text-sm uppercase tracking-wider transition-colors ${btn.style === "secondary" ? "border-2 border-white/50 text-white hover:bg-white/10" : "bg-white text-[#2A7B3D] hover:bg-white/90"}`}>
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────
const HowItWorksRenderer: BlockRenderer = ({ content }) => {
  const steps = content.steps as any[] || []
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#2A7B3D]/10 text-[#2A7B3D] font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {step.number || i + 1}
              </div>
              <h3 className="font-bold text-lg mb-2 text-zinc-900">{step.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────
const FAQRenderer: BlockRenderer = ({ content }) => {
  const [open, setOpen] = useState<number | null>(null)
  const items = content.items as any[] || []
  return (
    <section className="py-16 bg-zinc-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 data-cms-field="title" className="text-2xl font-bold text-center mb-10 text-zinc-900">{content.title || "Preguntas Frecuentes"}</h2>
        <div className="space-y-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left font-medium text-zinc-900 hover:bg-zinc-50 transition-colors">
                {item.question}
                <ChevronDown className={`w-5 h-5 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <div className="px-4 pb-4 text-zinc-600 leading-relaxed">{item.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Join Section ──────────────────────────────────────────────
const JoinSectionRenderer: BlockRenderer = ({ content }) => {
  const benefits = content.benefits as any[] || []
  return (
    <section className="py-20 bg-gradient-to-br from-[#2A7B3D] to-[#1a5c2e] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white/15 rounded-full text-sm"><Users size={16} /> Oportunidad</div>
            <h2 data-cms-field="heading" className="text-3xl sm:text-4xl font-bold mb-4">{content.heading || content.titulo}</h2>
            <p data-cms-field="subtitle" className="text-lg text-white/80 mb-8">{content.subtitle || content.subtitulo}</p>
            <a href={content.cta?.url || "#"} className="px-8 py-3.5 bg-white text-[#2A7B3D] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg inline-block">
              {content.cta?.label || content.cta || "Unete"}
            </a>
          </div>
          <div className="space-y-4">
            {(Array.isArray(benefits[0]) || typeof benefits[0] === "string" ? benefits : benefits.map((b: any) => b.text || b)).map((b: any, i: number) => (
              <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle size={22} className="text-emerald-300 flex-shrink-0 mt-0.5" />
                <span className="text-white/90">{typeof b === "string" ? b : b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Team Grid ─────────────────────────────────────────────────
const TeamGridRenderer: BlockRenderer = ({ content }) => {
  const members = content.members as any[] || []
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {content.title && <h2 data-cms-field="title" className="text-center text-2xl font-bold text-zinc-900 mb-3">{content.title}</h2>}
        {content.subtitle && <p data-cms-field="subtitle" className="text-center text-zinc-500 mb-12">{content.subtitle}</p>}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((m: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#2A7B3D]/20 to-[#2A7B3D]/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2A7B3D]/60">{m.initials || m.name?.split(" ").map((n: string) => n[0]).join("")}</span>
              </div>
              <h3 className="font-bold text-zinc-900 text-sm">{m.name}</h3>
              <p className="text-xs text-zinc-500 mt-1">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Benefits Grid ─────────────────────────────────────────────
const BenefitsGridRenderer: BlockRenderer = ({ content }) => {
  const benefits = content.benefits as any[] || []
  return (
    <section className="py-16 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4">
        {content.title && <h2 data-cms-field="title" className="text-center text-2xl font-bold text-zinc-900 mb-3">{content.title}</h2>}
        {content.subtitle && <p data-cms-field="subtitle" className="text-center text-zinc-500 mb-12 max-w-xl mx-auto">{content.subtitle}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 bg-white rounded-xl p-5 border border-zinc-200">
              <CheckCircle size={20} className="text-[#2A7B3D] flex-shrink-0 mt-0.5" />
              <div>
                {b.title && <p className="font-medium text-zinc-900 text-sm mb-1">{b.title}</p>}
                <p className="text-sm text-zinc-600 leading-relaxed">{b.description || b.text || (typeof b === "string" ? b : "")}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
const TestimonialsRenderer: BlockRenderer = ({ content }) => {
  const testimonials = content.testimonials as any[] || []
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 data-cms-field="title" className="text-center text-2xl font-bold text-zinc-900 mb-10">{content.title || "Lo Que Dicen Nuestros Clientes"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating || 5 }).map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-zinc-700 text-sm leading-relaxed mb-4 italic">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2A7B3D]/10 flex items-center justify-center text-[#2A7B3D] font-bold text-sm">
                  {t.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-zinc-900 text-sm">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Featured Products Grid ────────────────────────────────────
const FeaturedGridRenderer: BlockRenderer = ({ content }) => {
  const products = content.products as any[] || []
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {content.title && <h2 data-cms-field="title" className="text-2xl font-bold text-zinc-900 mb-8">{content.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((p: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-zinc-50 relative overflow-hidden">
                {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />}
                {p.badge && <span className="absolute top-2 left-2 bg-[#2A7B3D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}
              </div>
              <div className="p-3">
                <p className="text-xs text-[#2A7B3D] font-medium mb-0.5">{p.category}</p>
                <h3 className="font-semibold text-sm text-zinc-900 mb-1 line-clamp-1">{p.name}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{p.shortDescription}</p>
                {p.price && <p className="font-bold text-zinc-900">${p.price?.toLocaleString()} MXN</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Categories Grid ───────────────────────────────────────────
const CategoriesRenderer: BlockRenderer = ({ content }) => {
  const categories = content.categories as any[] || []
  return (
    <section className="py-16 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 data-cms-field="title" className="text-2xl font-bold text-zinc-900 text-center mb-10">{content.title || "Categorias"}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-zinc-100 text-center hover:shadow-md transition-shadow cursor-pointer" style={{ borderTopColor: cat.color, borderTopWidth: 3 }}>
              {cat.image && <img src={cat.image} alt={cat.name} className="w-16 h-16 mx-auto mb-3 object-contain" />}
              <h3 className="font-semibold text-sm text-zinc-900">{cat.name}</h3>
              {cat.description && <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{cat.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Story Section (About) ─────────────────────────────────────
const StorySectionRenderer: BlockRenderer = ({ content }) => {
  const sections = content.sections as any[] || []
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-20">
        {sections.map((s: any, i: number) => (
          <div key={i} className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-10 lg:gap-16`}>
            <div className="w-full lg:w-1/2">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#2A7B3D]/10 to-[#2A7B3D]/5 flex items-center justify-center">
                <FlaskConical size={64} className="text-[#2A7B3D]/30" />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              {s.badge && <p className="text-[#2A7B3D] font-semibold text-sm uppercase tracking-widest mb-2">{s.badge}</p>}
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-4">{s.title}</h2>
              <p className="text-zinc-600 leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Pillars (Impact) ──────────────────────────────────────────
const PillarsRenderer: BlockRenderer = ({ content }) => {
  const sections = content.sections as any[] || []
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        {sections.map((s: any, i: number) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100">
            <h3 className="text-xl font-bold text-zinc-900 mb-3">{s.title}</h3>
            <p className="text-zinc-600 leading-relaxed mb-3">{s.description}</p>
            {s.detail && <p className="text-sm text-zinc-500 italic">{s.detail}</p>}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Quick Category Menu ───────────────────────────────────────
const QuickCategoryMenuRenderer: BlockRenderer = ({ content }) => {
  const categories = content.categories as any[] || []
  return (
    <section className="py-4 bg-white border-b border-zinc-100 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat: any, i: number) => (
            <button key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors hover:bg-zinc-50" style={{ borderColor: cat.color, color: cat.color }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Trust Marquee ─────────────────────────────────────────────
const TrustMarqueeRenderer: BlockRenderer = ({ content }) => {
  const items = content.items as any[] || ["FDA Registered", "cGMP Certified", "NSF Certified", "ISO 17025", "USDA Organic", "Non-GMO"]
  return (
    <section className="py-6 bg-zinc-900 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item: any, i: number) => (
          <span key={i} className="mx-8 text-sm text-zinc-400 font-medium">{typeof item === "string" ? item : item.text || item.name}</span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } .animate-marquee { animation: marquee 20s linear infinite; }`}</style>
    </section>
  )
}

// ── Placeholder for self-contained components ─────────────────
const SelfContainedRenderer: BlockRenderer = ({ content }) => {
  const label = content.title || content.heading || ""
  return (
    <section className="py-16 bg-gradient-to-b from-zinc-50 to-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#2A7B3D]/10 flex items-center justify-center mx-auto mb-4">
          <FlaskConical size={28} className="text-[#2A7B3D]" />
        </div>
        {label && <h2 data-cms-field="title" className="text-2xl font-bold text-zinc-900 mb-3">{label}</h2>}
        {content.description && <p data-cms-field="description" className="text-zinc-600 leading-relaxed max-w-2xl mx-auto">{content.description}</p>}
        {content.benefits && (
          <div className="grid grid-cols-2 gap-3 mt-8 max-w-lg mx-auto text-left">
            {(content.benefits as string[]).map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-700"><CheckCircle size={14} className="text-[#2A7B3D]" /> {b}</div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Product Catalog ───────────────────────────────────────────
const ProductCatalogRenderer: BlockRenderer = ({ content }) => {
  const products = content.products as any[] || []
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 12).map((p: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-zinc-50 relative">
                {p.imagen && <img src={p.imagen} alt={p.nombre} className="w-full h-full object-contain p-4" />}
                {p.badge && <span className="absolute top-2 left-2 bg-[#2A7B3D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-zinc-900 mb-1">{p.nombre}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{p.descripcionCorta}</p>
                <p className="font-bold text-zinc-900">${p.precio?.toLocaleString()} MXN</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// REGISTRY
// ═══════════════════════════════════════════════════════════════

const RENDERERS: Record<string, BlockRenderer> = {
  hero: HeroRenderer,
  stats: StatsRenderer,
  statsSection: StatsRenderer,
  ctaBanner: CTARenderer,
  howItWorks: HowItWorksRenderer,
  faq: FAQRenderer,
  joinSection: JoinSectionRenderer,
  teamGrid: TeamGridRenderer,
  benefitsGrid: BenefitsGridRenderer,
  testimonials: TestimonialsRenderer,
  featuredGrid: FeaturedGridRenderer,
  featuredProducts: FeaturedGridRenderer,
  categories: CategoriesRenderer,
  storySection: StorySectionRenderer,
  pillars: PillarsRenderer,
  quickCategoryMenu: QuickCategoryMenuRenderer,
  trustMarquee: TrustMarqueeRenderer,
  productCatalog: ProductCatalogRenderer,
  missionSection: SelfContainedRenderer,
  scienceSection: SelfContainedRenderer,
  glycansSection: SelfContainedRenderer,
  whyGlycansSection: SelfContainedRenderer,
  newsletter: SelfContainedRenderer,
  socialProof: StatsRenderer,
}
