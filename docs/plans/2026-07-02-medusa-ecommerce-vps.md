# Medusa.js Ecommerce + VPS Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy Medusa.js v2 as headless ecommerce backend + existing Next.js 16 frontend on VPS 2.24.106.244 with PostgreSQL, Redis, and Traefik reverse proxy.

**Architecture:** 4 Docker containers (PostgreSQL, Redis, Medusa backend, Next.js storefront) orchestrated via docker-compose. Traefik (already running) handles SSL termination and routing. Frontend keeps its premium design and connects to Medusa API via `@medusajs/js-sdk`.

**Tech Stack:** Medusa.js v2, Next.js 16, PostgreSQL 16, Redis 7, Docker Compose, Traefik, TypeScript

---

## Phase 1: VPS Infrastructure Setup

### Task 1: Clean up old Traefik configs

**Server:** VPS root@2.24.106.244

**Step 1: Remove obsolete mundial.yml from Traefik dynamic config**

```bash
ssh root@2.24.106.244 "rm /docker/traefik/dynamic/mundial.yml"
```

Expected: File removed, Traefik auto-reloads (watches directory).

**Step 2: Verify Traefik still works**

```bash
ssh root@2.24.106.244 "curl -s -o /dev/null -w '%{http_code}' https://claw.dmlabs.mx || echo 'openclaw still routed'"
```

**Step 3: Clean up orphan Docker networks**

```bash
ssh root@2.24.106.244 "docker network rm mundial-shared 2>/dev/null; docker network rm librechat-g1rn_default 2>/dev/null; docker network prune -f"
```

---

### Task 2: Create Medusa project directory structure on VPS

**Step 1: Create directory tree**

```bash
ssh root@2.24.106.244 "mkdir -p /opt/mannatech/{medusa,storefront}"
```

**Step 2: Verify**

```bash
ssh root@2.24.106.244 "ls -la /opt/mannatech/"
```

Expected: `medusa/` and `storefront/` directories exist.

---

### Task 3: Create docker-compose.yml for the full stack

**Files:**
- Create: `/opt/mannatech/docker-compose.yml`
- Create: `/opt/mannatech/.env`

**Step 1: Write docker-compose.yml**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: mannatech-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: medusa-store
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "127.0.0.1:5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U medusa -d medusa-store"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - mannatech

  redis:
    image: redis:7-alpine
    container_name: mannatech-redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - mannatech

  medusa:
    build:
      context: ./medusa
      dockerfile: Dockerfile
    container_name: mannatech-medusa
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgres://medusa:${POSTGRES_PASSWORD}@postgres:5432/medusa-store
      - REDIS_URL=redis://redis:6379
      - MEDUSA_ADMIN_ONBOARDING_TYPE=default
      - STORE_CORS=${STORE_CORS}
      - ADMIN_CORS=${ADMIN_CORS}
      - AUTH_CORS=${AUTH_CORS}
      - COOKIE_SECRET=${COOKIE_SECRET}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    ports:
      - "127.0.0.1:9000:9000"
    networks:
      - mannatech

  storefront:
    build:
      context: ./storefront
      dockerfile: Dockerfile
    container_name: mannatech-storefront
    restart: unless-stopped
    depends_on:
      - medusa
    environment:
      - MEDUSA_BACKEND_URL=http://medusa:9000
      - NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.mannatech.dmlabs.mx
      - NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${MEDUSA_PUBLISHABLE_KEY}
      - NODE_ENV=production
    ports:
      - "127.0.0.1:3000:3000"
    networks:
      - mannatech

volumes:
  pgdata:

networks:
  mannatech:
    driver: bridge
```

**Step 2: Write .env file**

```bash
# Generate secrets
POSTGRES_PASSWORD=<generate-random-32-char>
COOKIE_SECRET=<generate-random-32-char>
JWT_SECRET=<generate-random-32-char>
STORE_CORS=https://mannatech.dmlabs.mx
ADMIN_CORS=https://api.mannatech.dmlabs.mx
AUTH_CORS=https://mannatech.dmlabs.mx,https://api.mannatech.dmlabs.mx
MEDUSA_PUBLISHABLE_KEY=pk_placeholder_will_update_after_setup
```

Use `openssl rand -hex 16` to generate each secret.

---

### Task 4: Create Traefik dynamic config for mannatech

**Files:**
- Create: `/docker/traefik/dynamic/mannatech.yml`

**Step 1: Write Traefik routing config**

```yaml
http:
  routers:
    mannatech-storefront:
      rule: "Host(`mannatech.dmlabs.mx`)"
      entryPoints:
        - websecure
      service: storefront-svc
      tls:
        certResolver: letsencrypt

    mannatech-api:
      rule: "Host(`api.mannatech.dmlabs.mx`)"
      entryPoints:
        - websecure
      service: medusa-svc
      tls:
        certResolver: letsencrypt

  services:
    storefront-svc:
      loadBalancer:
        servers:
          - url: "http://127.0.0.1:3000"
        passHostHeader: true

    medusa-svc:
      loadBalancer:
        servers:
          - url: "http://127.0.0.1:9000"
        passHostHeader: true
```

**Step 2: Verify Traefik picks it up**

```bash
ssh root@2.24.106.244 "docker logs traefik-traefik-1 --tail 5"
```

Expected: No errors about the new config file.

---

## Phase 2: Medusa Backend Setup

### Task 5: Initialize Medusa v2 project on VPS

**Step 1: Install Medusa app into /opt/mannatech/medusa**

```bash
ssh root@2.24.106.244 "cd /opt/mannatech && npx create-medusa-app@latest medusa --skip-db --no-browser"
```

Follow prompts: select default options. This creates the Medusa v2 project structure.

**Step 2: Verify project structure**

```bash
ssh root@2.24.106.244 "ls /opt/mannatech/medusa/src && cat /opt/mannatech/medusa/package.json | head -20"
```

Expected: Standard Medusa v2 project with `src/`, `medusa-config.ts`, `package.json`.

---

### Task 6: Configure Medusa for production

**Files:**
- Modify: `/opt/mannatech/medusa/medusa-config.ts`
- Modify: `/opt/mannatech/medusa/.env`

**Step 1: Update medusa-config.ts to use env vars**

Ensure it reads `DATABASE_URL`, `REDIS_URL`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, `COOKIE_SECRET`, `JWT_SECRET` from environment.

```ts
import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "https://api.mannatech.dmlabs.mx",
  },
})
```

---

### Task 7: Create Medusa Dockerfile

**Files:**
- Create: `/opt/mannatech/medusa/Dockerfile`

**Step 1: Write Dockerfile**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --omit=dev

COPY . .
RUN npx medusa build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.medusa .medusa
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/medusa-config.ts medusa-config.ts

EXPOSE 9000

CMD ["npx", "medusa", "start"]
```

Note: The `medusa start` command runs DB migrations automatically on first boot and starts both the API server and admin dashboard.

---

### Task 8: Start PostgreSQL + Redis, then build and run Medusa

**Step 1: Start database and cache first**

```bash
ssh root@2.24.106.244 "cd /opt/mannatech && docker compose up -d postgres redis"
```

Wait for healthy status.

**Step 2: Build and start Medusa**

```bash
ssh root@2.24.106.244 "cd /opt/mannatech && docker compose up -d --build medusa"
```

**Step 3: Check logs for successful boot**

```bash
ssh root@2.24.106.244 "docker logs mannatech-medusa --tail 30"
```

Expected: "Medusa server is ready" or similar success message.

**Step 4: Create admin user**

```bash
ssh root@2.24.106.244 "docker exec mannatech-medusa npx medusa user -e admin@dmlabs.mx -p <secure-password>"
```

**Step 5: Test API**

```bash
ssh root@2.24.106.244 "curl -s http://127.0.0.1:9000/health"
```

Expected: `{"status":"ok"}` or `200 OK`.

---

### Task 9: Get publishable API key and update .env

**Step 1: Retrieve publishable key from Medusa**

Log into Medusa Admin at `https://api.mannatech.dmlabs.mx/app` with the admin user. Go to Settings > Publishable API Keys. Copy the key.

Or via API:

```bash
ssh root@2.24.106.244 "docker exec mannatech-medusa npx medusa exec -c 'const key = await query.graph({ entity: \"api_key\", fields: [\"token\"] }); console.log(key)'"
```

**Step 2: Update .env with real key**

```bash
ssh root@2.24.106.244 "sed -i 's/MEDUSA_PUBLISHABLE_KEY=.*/MEDUSA_PUBLISHABLE_KEY=pk_REAL_KEY_HERE/' /opt/mannatech/.env"
```

---

## Phase 3: Storefront Dockerization

### Task 10: Create Dockerfile for the Next.js frontend

**Files:**
- Create: `A:\DMLABS - Empresa\Demos\Mannatech\demo-premium\Dockerfile`

**Step 1: Write Dockerfile**

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/shared-content ./shared-content

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

---

### Task 11: Update next.config.ts for standalone output

**Files:**
- Modify: `A:\DMLABS - Empresa\Demos\Mannatech\demo-premium\next.config.ts`

**Step 1: Add output: "standalone" to Next.js config**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {},
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mx.mannatech.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);
```

---

### Task 12: Add .dockerignore

**Files:**
- Create: `A:\DMLABS - Empresa\Demos\Mannatech\demo-premium\.dockerignore`

**Step 1: Write .dockerignore**

```
node_modules
.next
.git
.vercel
docs
*.md
.env*
```

---

### Task 13: Deploy storefront to VPS

**Step 1: Copy project files to VPS**

```bash
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='.vercel' -e "ssh -i ~/.ssh/id_ed25519" . root@2.24.106.244:/opt/mannatech/storefront/
```

Run from project root `A:\DMLABS - Empresa\Demos\Mannatech\demo-premium\`.

**Step 2: Build and start storefront**

```bash
ssh root@2.24.106.244 "cd /opt/mannatech && docker compose up -d --build storefront"
```

**Step 3: Check logs**

```bash
ssh root@2.24.106.244 "docker logs mannatech-storefront --tail 20"
```

Expected: "Ready on http://0.0.0.0:3000"

**Step 4: Test locally**

```bash
ssh root@2.24.106.244 "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000"
```

Expected: `200`

---

## Phase 4: DNS & Go Live

### Task 14: DNS change instructions

**Action required by user (Damian):**

Change the DNS for `mannatech.dmlabs.mx`:
- **Type:** A record
- **Value:** 2.24.106.244
- **TTL:** 300 (5 min for fast propagation)

Add new DNS record:
- **Type:** A record
- **Host:** api.mannatech.dmlabs.mx
- **Value:** 2.24.106.244
- **TTL:** 300

**Step 1: Verify DNS propagation**

```bash
nslookup mannatech.dmlabs.mx
nslookup api.mannatech.dmlabs.mx
```

Both should resolve to `2.24.106.244`.

**Step 2: Test HTTPS**

```bash
curl -s -o /dev/null -w '%{http_code}' https://mannatech.dmlabs.mx
curl -s -o /dev/null -w '%{http_code}' https://api.mannatech.dmlabs.mx/health
```

Expected: `200` for both. Traefik auto-provisions SSL certificates via Let's Encrypt.

---

## Phase 5: Connect Frontend to Medusa API (Future)

### Task 15: Install Medusa JS SDK in frontend

**Files:**
- Modify: `package.json`
- Create: `src/lib/medusa-client.ts`

**Step 1: Install SDK**

```bash
npm install @medusajs/js-sdk
```

**Step 2: Create Medusa client**

```ts
// src/lib/medusa-client.ts
import Medusa from "@medusajs/js-sdk"

export const medusa = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || "https://api.mannatech.dmlabs.mx",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

**Step 3: Gradually replace data.ts functions**

Replace `getProductos()` with:
```ts
export async function getProductos() {
  const { products } = await medusa.store.product.list()
  return products.map(mapMedusaProductToProducto)
}
```

This task is deferred - first get everything running, then wire up the API.

---

## Commit Strategy

- **Commit 1:** After Task 10-12 (Dockerfile, next.config standalone, .dockerignore)
- **Commit 2:** After Task 15 (Medusa SDK integration - when implemented)

Server-side files (docker-compose, Traefik config, Medusa setup) live on the VPS, not in this repo.

---

## DNS Records Summary (for Damian)

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | mannatech.dmlabs.mx | 2.24.106.244 | 300 |
| A | api.mannatech.dmlabs.mx | 2.24.106.244 | 300 |
