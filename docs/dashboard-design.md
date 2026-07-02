# Mannatech Demo — Dashboards Design Document

## Overview
3 interfaces demo post-login para mostrar el tier Premium:
- **Dashboard Cliente** — experiencia post-login del comprador
- **Dashboard Socio MLM** — oficina virtual del asociado/distribuidor
- **Panel de Administracion** — gestion completa del marketplace

Todas son paginas estaticas con datos mock, sin backend real.

## Architecture Decision: Route Groups separados (Opcion A)

```
src/app/
  (landing)/     <- existente (publico)
  (shop)/        <- existente (tienda)
  (cliente)/     <- NUEVO — dashboard cliente
  (socio)/       <- NUEVO — oficina virtual socio
  (admin)/       <- NUEVO — panel admin
```

Cada rol tiene su propio layout con sidebar independiente.

## Layouts por Rol

| Aspecto | Cliente | Socio | Admin |
|---|---|---|---|
| Sidebar bg | Blanco/light | Blanco + acento teal | Zinc-900 oscuro |
| Logo | Mannatech color | Mannatech color | Mannatech blanco + "Admin" |
| Header | Nombre + avatar | + badge de rango | + indicadores sistema |
| Tono | Limpio, minimal | Motivacional, KPIs | Data-heavy, profesional |

## Rutas — Cliente

```
(cliente)/
  layout.tsx
  page.tsx                -> redirect a /mi-cuenta
  mi-cuenta/page.tsx      -> datos personales, direcciones
  pedidos/page.tsx        -> historial con tabla y filtros
  pedidos/[id]/page.tsx   -> detalle con timeline
  favoritos/page.tsx      -> grid de productos guardados
  autoenvio/page.tsx      -> suscripcion recurrente activa
  puntos/page.tsx         -> PV acumulados, nivel lealtad
  mi-asociado/page.tsx    -> perfil del distribuidor asignado
```

## Rutas — Socio MLM

```
(socio)/
  layout.tsx
  page.tsx                    -> redirect a /resumen
  resumen/page.tsx            -> KPIs, grafica ventas, actividad
  red/page.tsx                -> arbol genealogico visual
  clientes/page.tsx           -> tabla de clientes con compras
  clientes/[id]/page.tsx      -> detalle cliente individual
  comisiones/page.tsx         -> historial, desglose por bono
  pedidos/page.tsx            -> pedidos propios + de su red
  pedidos/[id]/page.tsx       -> detalle pedido
  herramientas/page.tsx       -> links, materiales, QR
  calendario/page.tsx         -> eventos, webinars
  rango/page.tsx              -> progreso hacia siguiente rango
  aprendizaje/page.tsx        -> cursos y videos con progreso
```

## Rutas — Admin

```
(admin)/
  layout.tsx
  page.tsx                          -> redirect a /dashboard
  dashboard/page.tsx                -> KPIs globales, graficas
  productos/page.tsx                -> tabla productos CRUD
  productos/[id]/page.tsx           -> detalle/edicion producto
  productos/categorias/page.tsx     -> gestion categorias
  inventario/page.tsx               -> stock, alertas bajo stock
  pedidos/page.tsx                  -> todos los pedidos
  pedidos/[id]/page.tsx             -> detalle + timeline
  usuarios/page.tsx                 -> clientes + socios + admins
  usuarios/[id]/page.tsx            -> perfil completo
  red-mlm/page.tsx                  -> vista global genealogia
  comisiones/page.tsx               -> calculo, aprobacion, pagos
  marketing/page.tsx                -> banners, cupones, promos
  marketing/cupones/page.tsx        -> CRUD cupones
  marketing/newsletter/page.tsx     -> campanas, suscriptores
  reportes/page.tsx                 -> ventas por periodo/region
  reportes/exportar/page.tsx        -> generador reportes
  configuracion/page.tsx            -> empresa, pagos, envios
  configuracion/envios/page.tsx     -> zonas, costos, carriers
  configuracion/pagos/page.tsx      -> metodos de pago
  soporte/page.tsx                  -> tickets por prioridad
  soporte/[id]/page.tsx             -> conversacion ticket
  auditoria/page.tsx                -> logs de acciones
```

## Componentes Compartidos

```
src/components/dashboard/
  DashboardSidebar.tsx      -> sidebar generico (items, tema, logo)
  DashboardHeader.tsx       -> avatar, nombre, notificaciones
  DashboardShell.tsx        -> wrapper: sidebar + header + content
  StatsCard.tsx             -> KPI con icono, valor, tendencia %
  DataTable.tsx             -> tabla con sorting, busqueda, paginacion
  StatusBadge.tsx           -> badge de estatus por colores
  TimelineTracker.tsx       -> timeline vertical para pedidos
  DateRangePicker.tsx       -> selector rango de fechas
  EmptyState.tsx            -> placeholder "sin datos"
  ChartCard.tsx             -> wrapper graficas recharts
  AvatarWithStatus.tsx      -> avatar con indicador online/offline
  NotificationDropdown.tsx  -> dropdown notificaciones
  ProgressRing.tsx          -> circulo de progreso
  SearchInput.tsx           -> input busqueda con debounce
```

## Mock Data

```
src/lib/mock-data/
  cliente.ts    -> perfil, pedidos, favoritos, autoenvio, puntos
  socio.ts      -> perfil, red, comisiones, clientes, cursos
  admin.ts      -> KPIs, pedidos, usuarios, productos, tickets
```

## Decision Log

| # | Decision | Reason |
|---|---|---|
| 1 | Paginas estaticas con datos mock | Demo de presentacion |
| 2 | Admin completo con sub-paginas | Mostrar alcance total Premium |
| 3 | Route Groups separados | Cada rol tiene UI muy distinta |
| 4 | Sidebar oscuro para Admin | Convencion visual de admin panels |
| 5 | Datos mock centralizados | Reutilizable y consistente |
| 6 | Componentes dashboard compartidos | Mismos patrones en los 3 roles |
| 7 | Login redirige sin validacion | Minima complejidad para demo |
