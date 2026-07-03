# Payload CMS Integration - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate Payload CMS 3.x as a full headless CMS with page builder, replacing JSON-based content management with a visual admin panel at cms.mannatech.dmlabs.mx.

**Architecture:** Payload CMS runs as a separate Next.js 15 project on the VPS (:3001), with its own database (`payload-cms`) in the existing PostgreSQL instance. The storefront (Next.js 16, :3000) consumes Payload's REST API. Existing landing components become block renderers. Medusa stays for ecommerce engine (orders/cart/payments).

**Tech Stack:** Payload CMS 3.x, Next.js 15, PostgreSQL 16 (shared instance), @payloadcms/db-postgres, @payloadcms/richtext-lexical, Traefik reverse proxy

---

## Phase 1: Payload Project Setup on VPS

### Task 1: Create PostgreSQL database for Payload

**Step 1: Create the database**
```bash
ssh root@2.24.106.244 "docker exec mannatech-db psql -U medusa -c 'CREATE DATABASE \"payload-cms\";'"
```

**Step 2: Verify**
```bash
ssh root@2.24.106.244 "docker exec mannatech-db psql -U medusa -d payload-cms -c '\conninfo'"
```
Expected: Connected to database "payload-cms"

---

### Task 2: Initialize Payload CMS project

**Step 1: Create project on VPS**
```bash
ssh root@2.24.106.244 "cd /opt/mannatech && npx create-payload-app@latest cms --db postgres --no-deps"
```
Select "blank" template when prompted.

**Step 2: Install dependencies**
```bash
ssh root@2.24.106.244 "cd /opt/mannatech/cms && npm install"
```

**Step 3: Configure .env**
```bash
# /opt/mannatech/cms/.env
DATABASE_URL=postgres://medusa:<PASSWORD>@127.0.0.1:5433/payload-cms
PAYLOAD_SECRET=<generate-random-32-char>
NEXT_PUBLIC_SERVER_URL=https://cms.mannatech.dmlabs.mx
```

---

### Task 3: Configure Payload for production

**Files:**
- Modify: `/opt/mannatech/cms/src/payload.config.ts`

Configure: PostgreSQL adapter, Lexical rich text editor, media uploads, CORS for storefront, admin meta (logo, title).

Key config:
```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'https://cms.mannatech.dmlabs.mx',
  admin: {
    meta: { titleSuffix: '— Mannatech CMS' },
  },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } }),
  editor: lexicalEditor(),
  collections: [Pages, Media, Products, Categories, Distributors, Testimonials],
  globals: [SiteConfig, Header, Footer, Navigation],
  cors: ['https://mannatech.dmlabs.mx', 'https://cms.mannatech.dmlabs.mx'],
  upload: { limits: { fileSize: 10000000 } }, // 10MB
})
```

---

## Phase 2: Content Types (Collections + Globals)

### Task 4: Create Media collection

**File:** `/opt/mannatech/cms/src/collections/Media.ts`

Standard media collection with image optimization, alt text, folders.

---

### Task 5: Create Page Blocks

**File:** `/opt/mannatech/cms/src/blocks/`

Create all block types:

| Block | Key fields |
|---|---|
| HeroBlock | heading, subheading, image, cta{label,url}, style(centered/left/video) |
| RichTextBlock | content (Lexical rich text) |
| ImageBlock | image, caption, size(full/medium/small) |
| GalleryBlock | images[], columns(2/3/4) |
| VideoBlock | url, poster, autoplay |
| CTABlock | heading, text, buttonLabel, buttonUrl, style(primary/secondary) |
| ProductGridBlock | products(relationship to Products[]), columns |
| ProductShowcaseBlock | product(relationship), layout(left/right) |
| CategoryGridBlock | categories(relationship to Categories[]) |
| FeaturedProductsBlock | count, filterBy(featured/newest/category) |
| TestimonialsBlock | testimonials(relationship to Testimonials[]) |
| TeamGridBlock | members[]{name, role, photo, bio} |
| StatsBlock | stats[]{number, label, icon} |
| FAQBlock | items[]{question, answer} |
| HowItWorksBlock | steps[]{title, description, icon} |
| ColumnsBlock | columns[]{width, content(blocks)} |
| SpacerBlock | height(sm/md/lg/xl) |
| MarqueeBlock | items[]{text, icon} |
| NewsletterBlock | heading, description, buttonLabel |
| FormBlock | fields[]{type, label, required}, submitLabel, email |
| JoinSectionBlock | heading, subtitle, benefits[], cta |
| TrustMarqueeBlock | logos[]{image, name} |
| SocialProofBlock | stats[]{number, label}, style |
| CodeBlock | code, language |

---

### Task 6: Create Pages collection

**File:** `/opt/mannatech/cms/src/collections/Pages.ts`

```ts
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    livePreview: { url: ({data}) => `https://mannatech.dmlabs.mx/${data.slug === 'home' ? '' : data.slug}` },
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'layout', type: 'blocks', blocks: [/* all blocks */] },
    { name: 'meta', type: 'group', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ]},
    { name: 'status', type: 'select', options: ['draft','published'], defaultValue: 'draft', admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}
```

---

### Task 7: Create Products, Categories, Distributors, Testimonials collections

**Files:**
- `/opt/mannatech/cms/src/collections/Products.ts`
- `/opt/mannatech/cms/src/collections/Categories.ts`
- `/opt/mannatech/cms/src/collections/Distributors.ts`
- `/opt/mannatech/cms/src/collections/Testimonials.ts`

Products fields: title, slug, sku, price, description(richText), shortDescription, benefits[], ingredients, images[], category(relationship), badge, featured, status.

Categories fields: name, slug, color, secondaryColor, description, icon, image.

Distributors fields: name, slug, location, whatsapp, bio(richText), photo, level, favoriteProducts(relationship), stats{}.

Testimonials fields: name, role, quote, photo, rating(1-5).

---

### Task 8: Create Globals (SiteConfig, Header, Footer, Navigation)

**Files:**
- `/opt/mannatech/cms/src/globals/SiteConfig.ts` — brandName, tagline, logo, colors, socialLinks
- `/opt/mannatech/cms/src/globals/Header.ts` — logo, announcementBar{text, color, active}, nav items
- `/opt/mannatech/cms/src/globals/Footer.ts` — disclaimer, links[], dmlabsBadge, copyright
- `/opt/mannatech/cms/src/globals/Navigation.ts` — mainMenu[]{label, link, children[]}, footerMenu[]

---

## Phase 3: Deploy Payload on VPS

### Task 9: Build and start Payload as systemd service

**Step 1: Build**
```bash
ssh root@2.24.106.244 "cd /opt/mannatech/cms && npm run build"
```

**Step 2: Create systemd service**
```bash
# /etc/systemd/system/mannatech-cms.service
[Unit]
Description=Mannatech Payload CMS
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/mannatech/cms
Environment=NODE_ENV=production
EnvironmentFile=/opt/mannatech/cms/.env
ExecStart=/usr/bin/node .next/standalone/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Step 3: Traefik config**
Create `/docker/traefik/dynamic/cms.yml`:
```yaml
http:
  routers:
    cms:
      rule: "Host(`cms.mannatech.dmlabs.mx`)"
      entryPoints: [websecure]
      service: cms-svc
      tls:
        certResolver: letsencrypt
  services:
    cms-svc:
      loadBalancer:
        servers:
          - url: "http://127.0.0.1:3001"
```

**Step 4: DNS**
Add A record: `cms.mannatech.dmlabs.mx` → `2.24.106.244`

**Step 5: Create admin user, verify health**

---

## Phase 4: Seed Content

### Task 10: Create seed script to migrate JSON data to Payload

**File:** `/opt/mannatech/cms/src/seed.ts`

Read from `shared-content/companies/mx/` JSON files and create:
- 5 Categories
- 25 Products
- 3 Distributors
- 6 Pages (Home, Quiénes Somos, Únete, Impacto, Productos, Checkout) with appropriate blocks
- Globals (SiteConfig, Header, Footer, Navigation) from textos.json

Run: `npx payload seed` or custom script.

---

## Phase 5: Connect Storefront to Payload

### Task 11: Create Payload API client in storefront

**File:** `src/lib/payload.ts`

```ts
const CMS_URL = process.env.PAYLOAD_CMS_URL || 'https://cms.mannatech.dmlabs.mx'

export async function getPage(slug: string) {
  const res = await fetch(`${CMS_URL}/api/pages?where[slug][equals]=${slug}&depth=2`, { next: { revalidate: 60 } })
  const data = await res.json()
  return data.docs?.[0] || null
}

export async function getGlobal(slug: string) { ... }
export async function getProducts() { ... }
export async function getCategories() { ... }
```

---

### Task 12: Create Block Renderer component

**File:** `src/components/blocks/BlockRenderer.tsx`

Maps Payload block slugs to existing React components:

```tsx
const BLOCK_MAP = {
  hero: HeroBlock,
  richText: RichTextBlock,
  image: ImageBlock,
  productGrid: ProductGridBlock,
  testimonials: TestimonialsBlock,
  // ... all 24 blocks
}

export function BlockRenderer({ blocks }) {
  return blocks.map((block, i) => {
    const Component = BLOCK_MAP[block.blockType]
    return Component ? <Component key={i} {...block} /> : null
  })
}
```

---

### Task 13: Create block wrapper components

**File:** `src/components/blocks/*.tsx`

Each block wrapper adapts Payload data to existing landing component props:

```tsx
// src/components/blocks/HeroBlock.tsx
export function HeroBlock({ heading, subheading, image, cta }) {
  // Map Payload fields to existing Hero component props
  return <Hero titulo={heading} subtitulo={subheading} ... />
}
```

Reuses existing 22 landing components — just maps data.

---

### Task 14: Update storefront pages to use Payload

**Files:**
- Modify: `src/app/(landing)/page.tsx` — fetch page from Payload, render blocks
- Modify: `src/app/(landing)/quienes-somos/page.tsx` — same pattern
- Modify: `src/app/(landing)/unete/page.tsx`
- Modify: `src/app/(landing)/impacto/page.tsx`
- Create: `src/app/(landing)/[...slug]/page.tsx` — catch-all for custom CMS pages

Pattern:
```tsx
export default async function Page() {
  const page = await getPage('home')
  if (!page) return notFound()
  return <BlockRenderer blocks={page.layout} />
}
```

Dynamic catch-all for any CMS page:
```tsx
// src/app/(landing)/[...slug]/page.tsx
export default async function DynamicPage({ params }) {
  const slug = params.slug.join('/')
  const page = await getPage(slug)
  if (!page) return notFound()
  return <BlockRenderer blocks={page.layout} />
}
```

---

### Task 15: Update Header/Footer to use Payload globals

**Files:**
- Modify: `src/components/shared/Header.tsx` — fetch Navigation global
- Modify: `src/components/shared/Footer.tsx` — fetch Footer global

---

## Phase 6: Update Infrastructure

### Task 16: Update backups, health checks, deploy scripts

- Add `payload-cms` to backup script
- Add health check for port 3001
- Create `/opt/mannatech/deploy-cms.sh`
- Update `mannatech-logs` command with `cms` option

---

## Commit Strategy

- **Commit 1:** After Task 3 (Payload project + config)
- **Commit 2:** After Task 8 (All collections + globals + blocks)
- **Commit 3:** After Task 9 (Deploy on VPS)
- **Commit 4:** After Task 10 (Seed data)
- **Commit 5:** After Task 14 (Storefront connected)
- **Commit 6:** After Task 16 (Infrastructure updates)
