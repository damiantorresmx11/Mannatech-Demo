# USA-Style Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rediseñar el demo Premium para replicar fielmente la estructura, layout y flujo visual de usa.mannatech.com, manteniendo contenido en español MX, dark mode, y efectos premium.

**Architecture:** Refactor in-place por componente en orden de dependencia. Primero globals.css y layout, luego Header, Hero, secciones del landing, Footer, y finalmente Shop/Cart/Checkout. Cada task es un componente autocontenido.

**Tech Stack:** Next.js 16 (App Router), Tailwind 4 (CSS-based), shadcn base-nova, framer-motion 12, zustand 5, next-intl

---

## Reference: usa.mannatech.com Structure

```
┌─────────────────────────────────────────────┐
│ ANNOUNCEMENT BAR (phone | mission | button) │  ← NEW
├─────────────────────────────────────────────┤
│ HEADER (logo left | nav center | icons right)│  ← REDESIGN
├─────────────────────────────────────────────┤
│ HERO CAROUSEL (full-bleed banner images)     │  ← REDESIGN
├─────────────────────────────────────────────┤
│ QUICK CATEGORY MENU (horizontal thumbnails)  │  ← NEW
├─────────────────────────────────────────────┤
│ PRODUCT SLIDER ("Multi-Glycan Heroes")       │  ← REDESIGN FeaturedGrid
├─────────────────────────────────────────────┤
│ INNOVATION STATS (patents numbers)           │  ← REDESIGN MissionSection
├─────────────────────────────────────────────┤
│ PRODUCT SPOTLIGHT (Ambrotose split layout)   │  ← REDESIGN ScienceSection
├─────────────────────────────────────────────┤
│ SHOP CATEGORIES (4 tiles grid)               │  ← REDESIGN Categories
├─────────────────────────────────────────────┤
│ BENEFITS STRIP (subscribe, shipping, etc.)   │  ← NEW (replace TrustMarquee)
├─────────────────────────────────────────────┤
│ TESTIMONIALS                                 │  ← RESTYLE
├─────────────────────────────────────────────┤
│ JOIN / OPPORTUNITY SECTION                   │  ← REDESIGN CTABanner
├─────────────────────────────────────────────┤
│ FOOTER (4 columns + social + newsletter)     │  ← REDESIGN
└─────────────────────────────────────────────┘
```

---

## Task 1: globals.css — Base Theme Update

**Files:**
- Modify: `src/app/globals.css`

**What changes:**
The USA site uses a clean white aesthetic with minimal dark backgrounds. Update CSS variables and remove dark-section-centric styles.

**Step 1: Update `:root` brand colors to match USA closer**

The USA header has a slightly warmer white feel. Keep current mannatech teal but update primary to use mannatech instead of near-black:

```css
:root {
  /* ... keep existing oklch background/foreground ... */
  --mannatech: #00897B;       /* keep — matches USA teal */
  --mannatech-light: #4DB6AC;
  --mannatech-dark: #00695C;
}
```

No color changes needed — the existing light mode palette already matches USA.

**Step 2: Add announcement bar height variable**

Add to `:root`:
```css
--announcement-bar-height: 40px;
```

**Step 3: Add marquee animation for announcement bar**

Add keyframes (keep existing marquee-slow if present, otherwise add):
```css
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee-scroll {
  animation: marquee-scroll 25s linear infinite;
}
```

**Step 4: Verify dark mode variables are unchanged** — no changes needed.

**Step 5: Commit**
```
feat: update globals.css with announcement bar support
```

---

## Task 2: AnnouncementBar — New Component

**Files:**
- Create: `src/components/shared/AnnouncementBar.tsx`

**What it does:** Thin bar above header showing "¡Cada compra ayuda a nutrir a un niño necesitado!" with phone number left and "Encuentra un Asociado" button right. Matches USA site's top bar exactly.

**Step 1: Create the component**

```tsx
"use client";

import { Phone } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="w-full bg-[#f5f5f5] dark:bg-zinc-900 border-b border-border text-xs h-[var(--announcement-bar-height)] flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left — phone */}
        <a
          href="tel:+528001234567"
          className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Phone size={12} />
          <span>800-123-4567</span>
        </a>

        {/* Center — mission message */}
        <p className="font-semibold uppercase tracking-wider text-foreground/80 text-center flex-1 sm:flex-none">
          ¡Cada compra ayuda a nutrir a un niño necesitado!
        </p>

        {/* Right — find associate */}
        <button className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
          Encuentra un Asociado →
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**
```
feat: add AnnouncementBar component matching USA layout
```

---

## Task 3: Header — Redesign to USA Layout

**Files:**
- Modify: `src/components/shared/Header.tsx`

**What changes:**
- Remove transparent-over-hero behavior
- Always white background (solid), dark border-b
- Logo LEFT, nav CENTER (uppercase: TIENDA, IMPACTO, CIENCIA, HISTORIA, ÚNETE), icons RIGHT (search, sign in, cart)
- No glassmorphism — clean solid white
- Integrate AnnouncementBar above
- Keep dark mode toggle, company selector, locale switcher in right side
- Cart button always visible (not just on shop pages)
- Height stays 72px but now below announcement bar
- Mobile: hamburger menu preserved

**Key structural changes:**

1. Import and render `AnnouncementBar` above the header
2. Change `headerBg` logic: always solid white/dark, no transparent state
3. Nav links: change to uppercase centered layout matching USA (TIENDA, IMPACTO, CIENCIA, HISTORIA, ÚNETE)
4. Update `landingLinkDefs` to match USA nav:
   ```ts
   const navLinkDefs: NavLink[] = [
     { href: "/productos", labelKey: "shop" },
     { href: "/#mision", labelKey: "impact" },
     { href: "/#ciencia", labelKey: "science" },
     { href: "/#historia", labelKey: "story" },
     { href: "/#unete", labelKey: "join" },
   ];
   ```
5. Remove variant prop — single nav for all pages
6. Always show CartButton (not conditional on variant)
7. Add search icon button
8. Layout: `justify-between` with logo, centered nav, right icons

**CSS class changes:**
- Header: `bg-white dark:bg-zinc-950 border-b border-border` (always)
- Nav links: `text-sm font-medium uppercase tracking-wider`
- Remove motion layoutId pill on active link — use simple underline or bold
- Active: `text-mannatech font-semibold` with bottom border

**Landing layout update needed:**
- Change `pt-[72px]` to `pt-[calc(72px+var(--announcement-bar-height))]`
- Remove `variant` prop from Header usage

**Step 3: Commit**
```
feat: redesign Header to match USA layout with announcement bar
```

---

## Task 4: Hero — Full-Bleed Banner Carousel

**Files:**
- Modify: `src/components/landing/Hero.tsx`

**What changes:**
The USA hero is a simple full-width image carousel. Banner images contain the text already (like the MX banners do). Remove the text overlay panel and make it pure image-based.

**Key changes:**
1. Remove `-mt-[72px]` (no longer overlapping header)
2. Remove `height: 100vh` — use aspect ratio or fixed height instead
3. Remove text overlay panel (headline, subtitle, CTA buttons)
4. Remove stats display from hero
5. Remove gradient overlays (from-black/90 etc.)
6. Keep carousel navigation (prev/next arrows, dots)
7. Keep progress bar at bottom
8. Keep pause-on-hover
9. Images become `<picture>` elements with mobile/desktop srcsets (like USA)
10. Add `<a>` wrapper linking each slide to its product page

**New structure:**
```tsx
<section className="relative w-full overflow-hidden bg-white dark:bg-zinc-950">
  {/* Prev button */}
  <button className="absolute left-4 top-1/2 -translate-y-1/2 z-10 ...">‹</button>

  {/* Slides */}
  <AnimatePresence mode="sync">
    <motion.div key={current} ...>
      <Link href={slide.href}>
        <picture>
          <source media="(max-width: 768px)" srcSet={slide.srcMobile} />
          <img src={slide.src} alt={slide.headline} className="w-full h-auto" />
        </picture>
      </Link>
    </motion.div>
  </AnimatePresence>

  {/* Next button */}
  <button className="absolute right-4 top-1/2 -translate-y-1/2 z-10 ...">›</button>

  {/* Progress bar */}
  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-border">
    <motion.div className="h-full bg-mannatech" ... />
  </div>
</section>
```

**Update SLIDES data:** Add `srcMobile` field. If no mobile variants exist, use same image. Remove `headline`, `subtitle`, `cta` text fields (images contain the text).

**Step 4: Commit**
```
feat: redesign Hero to full-bleed banner carousel matching USA
```

---

## Task 5: QuickCategoryMenu — New Component

**Files:**
- Create: `src/components/landing/QuickCategoryMenu.tsx`

**What it does:** Horizontal scrollable row of category thumbnails (small round/square images with labels below). Matches USA's quick-menu section below the hero.

**Categories to show:**
- Novedades, Más Vendidos, Nutrición + Bienestar, Fitness + Control de Peso, Cuidado Personal, Kits y Paquetes, Todos los Productos

Each links to `/productos?categoria=X`

**Step 1: Create component**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
  { name: "Novedades", href: "/productos?cat=novedades", image: "/images/cat-new.png" },
  { name: "Más Vendidos", href: "/productos?cat=bestsellers", image: "/images/cat-best.png" },
  { name: "Nutrición + Bienestar", href: "/productos?cat=nutricion", image: "/images/cat-nutrition.png" },
  { name: "Fitness + Control de Peso", href: "/productos?cat=fitness", image: "/images/cat-fitness.png" },
  { name: "Cuidado Personal", href: "/productos?cat=cuidado", image: "/images/cat-skincare.png" },
  { name: "Kits y Paquetes", href: "/productos?cat=kits", image: "/images/cat-kits.png" },
  { name: "Todos", href: "/productos", image: "/images/cat-all.png" },
];

export function QuickCategoryMenu() {
  return (
    <nav className="py-6 bg-white dark:bg-zinc-950 border-b border-border" aria-label="Menú rápido de categorías">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat, i) => (
            <motion.li
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0"
            >
              <Link
                href={cat.href}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#F2F0ED] dark:bg-zinc-800 group-hover:ring-2 ring-mannatech transition-all">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-foreground/70 group-hover:text-mannatech transition-colors text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
```

**Note:** Category thumbnail images will need to be added to `/public/images/`. Use product images from CDN as placeholders initially, or create simple category icons.

**Step 2: Commit**
```
feat: add QuickCategoryMenu matching USA quick-menu
```

---

## Task 6: FeaturedGrid → ProductSlider Redesign

**Files:**
- Modify: `src/components/landing/FeaturedGrid.tsx`

**What changes:**
Replace the current 2-large + 4-small grid with a horizontal product slider matching USA's "Shop Our Multi-Glycan Heroes" section.

**Key changes:**
1. Change section title: "Productos Destacados" → Keep title but change layout
2. Replace grid with horizontal scrollable slider
3. Product cards in slider: product image + name + price (simpler than full ProductCard)
4. Add prev/next arrow buttons
5. White background
6. Keep 3D tilt effect on hover (Product3DCard wrapper)
7. Keep add-to-cart quick button

**New layout structure:**
```
"Productos Destacados" heading
← [card] [card] [card] [card] [card] →
```

Each card: image on warm bg → name + price below

**Step 3: Commit**
```
feat: redesign FeaturedGrid as horizontal product slider
```

---

## Task 7: MissionSection → Innovation Stats

**Files:**
- Modify: `src/components/landing/MissionSection.tsx`

**What changes:**
Match USA's innovation stats section. Change from dark bg to light bg with centered layout.

**Key changes:**
1. Background: `bg-[#0A0A0A]` → `bg-white dark:bg-zinc-950`
2. Text colors: white → foreground
3. Layout: centered with mannatech color accent
4. Keep NumberTicker animation
5. Stats: "154 Patentes Otorgadas", "74 Patentes Activas", "2 Patentes Pendientes" (USA data, or keep MX data)
6. Add tagline above stats: "Liderando con Innovación en la industria nutricional y de salud."
7. Keep premium grain texture overlay if desired

**Step 4: Commit**
```
feat: redesign MissionSection as light innovation stats section
```

---

## Task 8: ScienceSection → Product Spotlight (Ambrotose)

**Files:**
- Modify: `src/components/landing/ScienceSection.tsx`

**What changes:**
Match USA's Ambrotose product spotlight — split layout with educational text left, product image right.

**Key changes:**
1. Remove dark background image → white/light bg
2. Split layout: text content LEFT (benefits list) + product image RIGHT
3. Add benefits icons (Cellular Communication, Cognition, Mood, Immunity, Gut Health)
4. "Watch Film" and "Shop Now" CTAs
5. Keep SpotlightCard effects for the product image area
6. Keep BlurFade scroll reveals
7. Product image: Ambrotose Complex from CDN

**Step 5: Commit**
```
feat: redesign ScienceSection as Ambrotose product spotlight
```

---

## Task 9: Categories → Shop Categories Grid

**Files:**
- Modify: `src/components/landing/Categories.tsx`

**What changes:**
Match USA's "Shop Categories" — 4 clean tiles with category images and labels.

**Key changes:**
1. White background instead of dark
2. 2x2 grid on desktop, stacked on mobile
3. Each tile: category image with overlay text
4. Categories: "Nutrición + Bienestar", "Fitness + Control de Peso", "Cuidado Personal", "Kits y Paquetes"
5. Keep hover animations (zoom-container effect)
6. Each tile links to filtered catalog

**Step 6: Commit**
```
feat: redesign Categories as clean 4-tile grid
```

---

## Task 10: TrustMarquee → Benefits Strip

**Files:**
- Modify: `src/components/landing/TrustMarquee.tsx`

**What changes:**
Replace dark trust badges marquee with USA-style benefits strip showing value props.

**Key changes:**
1. Background: dark → light warm (`bg-[#FAF9F7] dark:bg-zinc-900`)
2. Content: Replace badges with benefit messages:
   - "¡Cada compra ayuda a nutrir a un niño necesitado!"
   - "¡Suscríbete y ahorra 10% en tus productos favoritos!"
   - "Envío gratis en suscripciones de más de $2,999"
   - "¡Garantía de satisfacción de 180 días!"
3. Layout: horizontal strip with icons, or rotating single message
4. Keep marquee animation but lighter style

**Step 7: Commit**
```
feat: redesign TrustMarquee as benefits strip
```

---

## Task 11: Testimonials — Restyle to Light

**Files:**
- Modify: `src/components/landing/Testimonials.tsx`

**What changes:**
Keep structure but ensure light background and clean typography.

**Key changes:**
1. Verify `bg-[#FAFAF8]` is already light — ✓ (already light)
2. Ensure testimonial card has clean white bg with subtle shadow
3. Keep carousel behavior, keep premium animations
4. Minor: match USA's testimonial bubble image style if possible

**Step 8: Commit**
```
style: restyle Testimonials for light USA aesthetic
```

---

## Task 12: CTABanner → Join/Opportunity Section

**Files:**
- Modify: `src/components/landing/CTABanner.tsx`

**What changes:**
Match USA's "Earn money globally — The Ultimate Gig" section.

**Key changes:**
1. Simpler, cleaner layout
2. Can keep the teal gradient background (USA has a distinct styled section here too)
3. Change copy to match: "Gana dinero globalmente — La Oportunidad Definitiva"
4. Single "Conoce Más" CTA button
5. Keep framer-motion fade-up animation

**Step 9: Commit**
```
feat: redesign CTABanner as Join/Opportunity section
```

---

## Task 13: Footer — 4-Column USA Layout

**Files:**
- Modify: `src/components/shared/Footer.tsx`

**What changes:**
Complete redesign to match USA's detailed 4-column footer.

**New structure:**
```
┌──────────────────────────────────────────────────┐
│ Col 1: Acerca De    │ Col 2: Tienda              │
│ - Nuestra Historia  │ - Todos los Productos      │
│ - Nuestra Ciencia   │ - Novedades                │
│ - Nuestro Liderazgo │ - Más Vendidos             │
│ - Nuestra Ética     │ - Kits y Paquetes          │
│ - Misión 5 Millones │ - Categorías               │
│ - Eventos           │ - Nutrición y Bienestar    │
│ - Carreras          │ - Fitness y Control de Peso │
│                     │ - Cuidado Personal         │
├─────────────────────┼────────────────────────────┤
│ Col 3: Únete        │ Col 4: Ayuda               │
│ - Ser Asociado      │ - Rastrear Mi Pedido       │
│ - Beneficios        │ - L-V: 9:30am - 6pm CT    │
│ - Programa MAP      │ - 800-123-4567             │
│ - Encontrar Asociado│ - Contáctanos              │
│ - Iniciar Sesión    │                            │
│                     │ Consultas de Prensa        │
│ Afiliados           │ 972-471-6512               │
│ [DSA logos]         │                            │
├─────────────────────┴────────────────────────────┤
│         Social Icons  |  Newsletter Signup        │
├──────────────────────────────────────────────────┤
│ Disclaimer + Logo + Copyright + Legal links      │
└──────────────────────────────────────────────────┘
```

**Key changes:**
1. Light background (`bg-white dark:bg-zinc-950`) with gray border-t
2. 4-column grid (responsive: 2 cols on tablet, 1 on mobile with accordions)
3. Section headings: bold, uppercase-ish
4. Social icons row: Facebook, X, TikTok, YouTube, Instagram, LinkedIn
5. Newsletter form: email input + subscribe button
6. Bottom bar: Mannatech logo + copyright + Privacy Policy + Terms links
7. FDA disclaimer text
8. Keep mobile accordion behavior

**Step 10: Commit**
```
feat: redesign Footer to 4-column USA layout
```

---

## Task 14: Landing Page — Update Section Order

**Files:**
- Modify: `src/app/(landing)/page.tsx`
- Modify: `src/app/(landing)/layout.tsx`

**What changes:**
Reorder sections to match USA flow and update layout padding.

**New order:**
```tsx
<Hero />
<QuickCategoryMenu />
<FeaturedGrid productos={...} allProductos={...} />
<MissionSection />
<ScienceSection />
<Categories categorias={...} />
<TrustMarquee />  {/* now Benefits Strip */}
<Testimonials />
<CTABanner />
```

**Layout changes:**
1. Update padding-top to account for announcement bar
2. Remove `variant` prop from Header

**Step 11: Commit**
```
feat: reorder landing sections to match USA flow
```

---

## Task 15: Shop Catalog — Sidebar + Grid Redesign

**Files:**
- Modify: `src/app/(shop)/productos/CatalogoContent.tsx`

**What changes:**
Match USA's shop page: left sidebar filters + 3-column product grid.

**Key changes:**
1. Remove dark hero banner at top → simple "Todos los Productos" heading + breadcrumbs
2. Add full-width search bar below heading (like USA)
3. Replace horizontal tabs with LEFT SIDEBAR:
   - Category links (collapsible)
   - Health Needs filters (radio buttons)
4. Product grid: 3 columns on desktop (was 4), 2 on mobile
5. Add sort dropdown "A a Z" at top right
6. Add "NEW" and "MÁS VENDIDO" badges on applicable products
7. Keep search functionality
8. Keep stagger animations

**New layout structure:**
```tsx
<div className="max-w-7xl mx-auto px-4 py-8">
  <h1 className="text-2xl font-bold mb-4">Todos los Productos</h1>
  <p className="text-sm text-muted-foreground mb-6">Inicio / Tienda / Todos los Productos</p>

  {/* Search */}
  <div className="mb-8">
    <input ... placeholder="Buscar en la tienda" className="w-full ..." />
  </div>

  <div className="flex gap-8">
    {/* Sidebar */}
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-[calc(72px+var(--announcement-bar-height)+1rem)]">
        {/* Category links */}
        {/* Health Needs radios */}
      </div>
    </aside>

    {/* Grid */}
    <div className="flex-1">
      <div className="flex justify-between mb-4">
        <span>{count} productos</span>
        <select>A a Z</select>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map(...)}
      </div>
    </div>
  </div>
</div>
```

**Step 12: Commit**
```
feat: redesign catalog with sidebar filters and 3-col grid
```

---

## Task 16: ProductCard — Clean USA Style

**Files:**
- Modify: `src/components/shop/ProductCard.tsx`

**What changes:**
Match USA product cards: clean white card, image, title, short description, star rating, price with retail crossed out, ADD/OPTIONS button.

**Key changes:**
1. Keep Product3DCard wrapper (premium effect)
2. Card layout:
   - Image area: light bg (#F2F0ED), product image centered
   - Badge: "NUEVO" green, "MÁS VENDIDO" blue (like USA)
   - Below image: title, 1-2 line description, star rating row, price
   - Price: show sale price + strikethrough retail price
   - ADD button: green bg, full width at bottom OR right-aligned icon
3. Keep hover shadow and zoom effects
4. Cleaner border radius (rounded-xl → rounded-lg to match USA)

**Step 13: Commit**
```
feat: restyle ProductCard to match USA product cards
```

---

## Task 17: CartDrawer — Light Style Update

**Files:**
- Modify: `src/components/shop/cart/CartDrawer.tsx`

**What changes:**
Apply clean white styling consistent with new design.

**Key changes:**
1. Ensure white bg (already mostly white)
2. Clean up any dark-first styling
3. Keep all functionality (qty controls, free shipping bar, etc.)
4. Ensure dark mode still works with proper variants
5. CTA buttons: mannatech green

**Step 14: Commit**
```
style: update CartDrawer to clean light aesthetic
```

---

## Task 18: Checkout — Light Style Update

**Files:**
- Modify: `src/components/shop/CheckoutModal.tsx`
- Modify: `src/app/(shop)/checkout/` (if exists as full page)

**What changes:**
Ensure checkout flow matches clean white aesthetic.

**Key changes:**
1. Dialog/modal: white bg, clean borders
2. Keep SpeedingTruck, CardNumberInput, OrderConfirmation effects
3. Ensure all step indicators use mannatech green
4. Clean typography matching USA

**Step 15: Commit**
```
style: update Checkout to clean light aesthetic
```

---

## Task 19: Final Polish & Dark Mode Verification

**Files:**
- Multiple files — final pass

**What to verify:**
1. Toggle dark mode on every page — check all sections render correctly
2. Check mobile responsive on all sections
3. Verify cart + checkout flow works end-to-end
4. Check hero carousel auto-rotation
5. Verify all links/anchors work (scroll to sections)
6. Remove any unused imports or dead code
7. Clean up ref-usa-*.jpg files from project root

**Step 16: Commit**
```
chore: final polish and dark mode verification
```

---

## Decision Log

| Decision | Alternatives | Reason |
|----------|-------------|--------|
| Refactor in-place | Create new components + swap | Less file duplication, cleaner git history |
| Keep all premium effects | Remove to match USA simplicity | Client explicitly requested keeping them |
| Announcement bar as separate component | Embed in Header | Separation of concerns, easier to toggle |
| Sidebar filters for shop | Keep horizontal tabs | Matches USA reference exactly |
| Keep framer-motion animations | Remove for performance | Part of premium demo value prop |
| Spanish MX content | English like USA | Client requirement |
| Keep dark mode | Remove | Client requirement |

## Execution Order

Tasks 1-3 (CSS + AnnouncementBar + Header) must be done first — they affect every page.
Tasks 4-12 (landing sections) can be done in any order after 1-3.
Task 13 (Footer) can be done anytime after 1-3.
Task 14 (page reorder) should be done after all landing section tasks.
Tasks 15-18 (shop) can be done in parallel with landing tasks.
Task 19 (polish) must be last.
