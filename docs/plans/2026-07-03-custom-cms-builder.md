# Custom CMS Builder — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a custom CMS with split-view editor, real-time preview with CSS transitions, and context-aware controls — integrated into the existing admin panel at `/admin`. Replace Payload CMS entirely.

**Architecture:** Fastify API service (:3002) + Drizzle ORM + PostgreSQL. Editor lives in the Next.js storefront admin panel. Preview via iframe with postMessage communication.

**Tech Stack:** Fastify 5, Drizzle ORM, PostgreSQL 16, Zod, @dnd-kit/sortable, React 19, Next.js 16

---

## Phase 1: API Foundation

### Task 1: Initialize Fastify project on VPS

**Step 1:** Create project structure
```
/opt/mannatech/cms-api/
├── src/
│   ├── server.ts
│   ├── config/env.ts
│   ├── plugins/auth.ts
│   ├── plugins/cors.ts
│   ├── plugins/error-handler.ts
│   ├── shared/db/client.ts
│   ├── shared/db/schema.ts
│   ├── shared/errors/index.ts
│   └── modules/ (empty for now)
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

**Step 2:** Install dependencies
```bash
npm init -y
npm i fastify @fastify/cors @fastify/jwt @fastify/multipart @fastify/static
npm i drizzle-orm postgres zod sharp uuid
npm i -D drizzle-kit typescript @types/node tsx
```

**Step 3:** Configure env.ts with Zod validation
```ts
// DATABASE_URL, JWT_SECRET, PORT=3002, UPLOAD_DIR, STOREFRONT_URL
```

**Step 4:** Configure server.ts — register plugins, health check at `/health`

**Step 5:** Create systemd service `mannatech-cms-api.service` on port 3002

**Step 6:** Add Traefik route for `api-cms.mannatech.dmlabs.mx` → 127.0.0.1:3002

**Verify:** `curl http://127.0.0.1:3002/health` returns `{ status: "ok" }`

---

### Task 2: Database schema + migrations

**Step 1:** Create database `cms` in PostgreSQL

**Step 2:** Define Drizzle schema (shared/db/schema.ts):
- `sites` — UUID PK, name, slug, domain, settings (JSONB)
- `users` — UUID PK, email, password_hash, name, role (enum 6 roles), site_id FK
- `pages` — UUID PK, site_id FK, title, slug, status (enum), seo fields, timestamps, created_by/updated_by
- `blocks` — UUID PK, page_id FK CASCADE, type, position (int), content (JSONB), styles (JSONB), visibility (JSONB)
- `media` — UUID PK, site_id FK, filename, original_name, mime_type, size, width, height, alt, folder, url, variants (JSONB), uploaded_by FK

**Step 3:** Run `drizzle-kit generate` + `drizzle-kit migrate`

**Step 4:** Seed default site (Mannatech MX) + superadmin user (admin@dmlabs.mx)

**Verify:** Connect to DB and query `SELECT * FROM sites`

---

### Task 3: Auth module

**Files:**
- `src/modules/auth/auth.controller.ts` — POST /auth/login, POST /auth/register, GET /auth/me
- `src/modules/auth/auth.service.ts` — login (verify password, issue JWT), register (hash password, create user)
- `src/modules/auth/auth.schema.ts` — Zod schemas for login/register input

**JWT payload:** `{ userId, role, siteId }`

**Auth plugin:** Fastify preHandler that verifies JWT and injects `request.user`

**Verify:** Login with admin@dmlabs.mx returns JWT token

---

### Task 4: Pages module (CRUD)

**Files:**
- `src/modules/pages/pages.controller.ts`
- `src/modules/pages/pages.service.ts`
- `src/modules/pages/pages.repository.ts`
- `src/modules/pages/pages.schema.ts`

**Endpoints:**
- `GET /pages` — list pages for site (filterable by status)
- `GET /pages/:slug` — get page with all blocks (ordered by position)
- `POST /pages` — create page
- `PATCH /pages/:id` — update page metadata
- `DELETE /pages/:id` — soft delete (status → archived)
- `POST /pages/:id/publish` — set status to published + publishedAt
- `POST /pages/:id/unpublish` — set status back to draft

**Verify:** CRUD operations via curl

---

### Task 5: Blocks module (CRUD + reorder)

**Endpoints:**
- `GET /pages/:pageId/blocks` — all blocks ordered by position
- `POST /pages/:pageId/blocks` — add block (auto-position at end)
- `PATCH /blocks/:id` — update content, styles, or visibility
- `DELETE /blocks/:id` — delete block + reorder remaining
- `PATCH /pages/:pageId/blocks/reorder` — body: `{ orderedIds: [uuid, uuid, ...] }`

**Block type validation:** Each block type has its own Zod schema for `content` and `styles`. The controller validates against the correct schema based on `type`.

**Verify:** Create page with 3 blocks, reorder them, update content

---

### Task 6: Media module (upload + manage)

**Endpoints:**
- `POST /media/upload` — multipart upload, generate variants with sharp (thumbnail 300px, card 600px, hero 1920px)
- `GET /media` — list media (filterable by folder, mime_type)
- `PATCH /media/:id` — update alt, folder
- `DELETE /media/:id` — delete file + variants from disk + DB

**Storage:** Files saved to `/opt/mannatech/cms-api/uploads/` organized by `site_slug/folder/`

**Verify:** Upload image, verify 3 variants generated

---

### Task 7: Migrate existing content to CMS database

**Script:** `src/seed/migrate-content.ts`

Read from storefront JSON files (shared-content/companies/mx/) and create:
- 1 Site (Mannatech MX)
- 5 Categories → stored as site settings
- 21 Products → page blocks data reference
- 3 Distributors → page blocks data reference
- 5 Pages (Home, Quiénes Somos, Únete, Impacto, Productos) with blocks matching the 22 existing components
- Each page gets blocks with `content` matching the hardcoded data from the current React components

**Verify:** `GET /pages/home` returns page with all blocks and content matching the current site

---

## Phase 2: Preview System

### Task 8: Create preview route in storefront

**File:** `src/app/(preview)/preview/[slug]/page.tsx`

- Server component that fetches page data from CMS API
- Renders using the same 22 landing components
- Each component wrapper adds `data-block-id={block.id}`
- Injects preview client script via `<Script>` tag

**File:** `src/app/(preview)/preview/[slug]/preview-client.tsx`

Client component that:
- Listens for `postMessage` from parent (editor)
- On `update` message: finds DOM node by `data-block-id`, applies value with CSS transition
- Uses `IntersectionObserver` to detect visible block, sends `blockInView` back to parent

**File:** `src/app/(preview)/layout.tsx`

Minimal layout — no Header/Footer, just the page content for clean preview

**Verify:** Open `/preview/home` shows the homepage content from CMS database

---

### Task 9: Create block renderers for preview

**File:** `src/components/cms/CMSBlockRenderer.tsx`

Maps block types to existing landing components:
```
hero → Hero component (adapted to accept props from CMS)
stats → StatsSection (adapted)
featuredProducts → FeaturedGrid (adapted)
testimonials → Testimonials (adapted)
cta → CTABanner (adapted)
faq → FAQ (adapted)
howItWorks → HowItWorks (adapted)
joinSection → JoinSection (adapted)
... all 22 types
```

Each wrapper:
1. Receives `block.content` and `block.styles`
2. Maps CMS data to existing component props
3. Wraps in `<section data-block-id={block.id} style={stylesFromCMS}>`
4. Applies custom styles (padding, colors, animation) as CSS variables

**Verify:** `/preview/home` renders identically to current homepage

---

## Phase 3: Editor UI

### Task 10: Editor page layout (split view)

**File:** `src/app/(admin)/admin/paginas/[slug]/page.tsx`

Split view layout:
- Left panel (380px): block tree + property controls
- Right panel (remaining): iframe pointing to `/preview/[slug]`
- Bottom bar: status, last edit, Preview/Publish buttons

State management with `useReducer`:
- `blocks[]` — ordered list of blocks
- `activeBlockId` — which block is selected
- `activeTab` — Contenido/Diseño/SEO/Avanzado
- `isDirty` — unsaved changes
- `isSaving` — loading state

**Verify:** Page loads with split view, iframe shows preview

---

### Task 11: Block tree + drag & drop reorder

**Component:** `src/components/admin/cms/BlockTree.tsx`

- Renders list of blocks with name + icons (visibility toggle, edit, delete)
- Active block highlighted with accent color
- `@dnd-kit/sortable` for drag & drop reorder
- On reorder: update local state + PATCH /pages/:id/blocks/reorder
- "Add Block" button opens modal with block type grid (icon + name for each of 22 types)

**Verify:** Can reorder blocks with drag & drop, changes reflect in preview

---

### Task 12: Property panels (Contenido + Diseño tabs)

**Component:** `src/components/admin/cms/PropertyPanel.tsx`

Renders different controls based on `activeTab` + `block.type`:

**Controls library** (reusable):
- `TextInput` — single line text
- `TextArea` — multiline
- `NumberSlider` — slider with value display
- `ColorPicker` — inline color picker with opacity
- `SelectDropdown` — styled select
- `ToggleSwitch` — boolean toggle
- `MediaPicker` — opens media manager modal
- `ArrayEditor` — add/remove/reorder items (for stats, FAQ items, etc.)

**Block property definitions** (`src/config/block-definitions.ts`):

Each block type defines its tabs:
```ts
{
  hero: {
    content: [
      { key: 'heading', type: 'text', label: 'Título' },
      { key: 'subheading', type: 'textarea', label: 'Subtítulo' },
      { key: 'cta.label', type: 'text', label: 'Texto del Botón' },
      { key: 'cta.url', type: 'text', label: 'URL del Botón' },
      { key: 'image', type: 'media', label: 'Imagen de Fondo' },
      { key: 'style', type: 'select', label: 'Estilo', options: ['centered','left','video'] },
    ],
    design: [
      { key: 'bgType', type: 'select', label: 'Tipo de Fondo', options: ['color','gradient','image'] },
      { key: 'bgColor', type: 'color', label: 'Color de Fondo' },
      { key: 'overlayOpacity', type: 'slider', label: 'Overlay', min: 0, max: 100 },
      { key: 'paddingTop', type: 'slider', label: 'Padding Superior', min: 0, max: 200 },
      { key: 'paddingBottom', type: 'slider', label: 'Padding Inferior', min: 0, max: 200 },
      { key: 'titleSize', type: 'slider', label: 'Tamaño Título', min: 24, max: 80 },
      { key: 'textColor', type: 'color', label: 'Color Texto' },
      { key: 'animation', type: 'select', label: 'Animación', options: ['none','fadeUp','fadeIn','slideLeft'] },
      { key: 'animationDuration', type: 'select', label: 'Duración', options: ['0.3s','0.6s','1s'] },
    ],
    advanced: [
      { key: 'cssId', type: 'text', label: 'ID CSS' },
      { key: 'cssClasses', type: 'text', label: 'Clases Extra' },
      { key: 'anchor', type: 'text', label: 'Anchor Link' },
    ],
    visibility: [
      { key: 'desktop', type: 'toggle', label: 'Desktop', default: true },
      { key: 'tablet', type: 'toggle', label: 'Tablet', default: true },
      { key: 'mobile', type: 'toggle', label: 'Móvil', default: true },
    ],
  },
  // ... 21 more block types
}
```

**On change:** Update local state → send postMessage to preview → auto-save debounced (1.5s)

**Verify:** Edit hero heading, see it update in preview with transition

---

### Task 13: Context-aware scroll sync

**In the editor (parent):**
- Listen for `blockInView` messages from iframe
- When received: set `activeBlockId`, scroll block tree to that item, animate property panel transition

**In the preview (iframe):**
- `IntersectionObserver` on all `[data-block-id]` elements
- Threshold 0.5 — block must be >50% visible
- Send `blockInView` message to parent

**In the block tree:**
- When user clicks a block in the tree → send `scrollToBlock` message to iframe
- Iframe receives → `element.scrollIntoView({ behavior: 'smooth' })`

**Transition animation for property panel:**
- When active block changes, property panel slides out (opacity 0, translateY 10px) and slides in with new content (opacity 1, translateY 0) — 200ms ease

**Verify:** Scroll in preview, controls follow. Click block in tree, preview scrolls.

---

### Task 14: Media manager modal

**Component:** `src/components/admin/cms/MediaManager.tsx`

Modal with:
- Grid view of uploaded images (thumbnails)
- Folder filter sidebar
- Upload dropzone (drag & drop files)
- Click image to select (returns to property panel)
- Edit alt text inline
- Delete with confirmation

**Uses:** POST/GET/DELETE /media API endpoints

**Verify:** Upload image, use it in a hero block, see it in preview

---

### Task 15: Responsive preview toggle

**Buttons in editor:** 📱 (375px) 💻 (768px) 🖥️ (1280px) + custom width input

- Changes iframe width with CSS transition (300ms)
- Preview content reflows naturally
- Block visibility respects the `visibility` settings per breakpoint

**Verify:** Toggle between breakpoints, iframe resizes smoothly

---

### Task 16: Pages list in admin

**File:** `src/app/(admin)/admin/paginas/page.tsx`

- Grid/list view of all CMS pages
- Shows: title, slug, status badge (draft/published), last updated, thumbnail
- Actions: Edit (→ editor), Duplicate, Delete, Publish/Unpublish
- "Create Page" button → modal with title + slug input → redirects to editor

**Verify:** See all pages, create new one, open editor

---

## Phase 4: Polish + Deploy

### Task 17: Storefront reads from CMS API

Update `src/lib/data.ts` to fetch page content from CMS API with fallback to JSON files.

Update landing components to accept optional CMS props — if present, use CMS data; if not, use existing hardcoded/i18n data.

**Verify:** Homepage renders from CMS data. Delete CMS data → falls back to JSON.

---

### Task 18: Add to infrastructure

- Add `cms` database to backup script
- Add health check for port 3002
- Create `/opt/mannatech/deploy-cms-api.sh`
- Update `mannatech-logs` with `cms-api` option
- Remove Payload CMS service + database + Traefik config

**Verify:** `mannatech-logs all` shows CMS API running

---

## Commit Strategy

- **Commit 1:** After Task 2 (API foundation + DB schema)
- **Commit 2:** After Task 6 (All API modules complete)
- **Commit 3:** After Task 7 (Content migrated)
- **Commit 4:** After Task 9 (Preview system working)
- **Commit 5:** After Task 13 (Editor with context-aware sync)
- **Commit 6:** After Task 16 (Full editor with media + pages list)
- **Commit 7:** After Task 18 (Deployed + infrastructure)
