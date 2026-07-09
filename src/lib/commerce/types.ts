// ── Commerce Types ─────────────────────────────────────────────────────
// Platform-agnostic interfaces consumed by admin and storefront.
// The active adapter (BigCommerce, etc.) maps API responses to these types.

export interface Product {
  id: string
  slug: string
  nombre: string
  sku: string
  categoria: string
  precio: number
  precioComparacion?: number
  presentacion: string
  descripcionCorta: string
  descripcionLarga: string
  beneficios: string[]
  ingredientes: string
  imagen: string
  imagenes: string[]
  destacado: boolean
  badge: string | null
  modoUso?: string
  variantes: Variant[]
  inventario: number
  estado: "active" | "draft" | "archived"
  metadata: Record<string, unknown>
}

export interface Variant {
  id: string
  titulo: string
  sku: string
  precio: number
  precioComparacion?: number
  inventario: number
  imagen?: string
  opciones: Record<string, string>
}

export interface Order {
  id: string
  numero: string
  estado: OrderStatus
  estadoTexto: string
  total: number
  subtotal: number
  impuestos: number
  envio: number
  descuento: number
  moneda: string
  cliente: CustomerSummary
  items: LineItem[]
  creadoEn: string
  actualizadoEn: string
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"
  | "refunded"

export interface LineItem {
  id: string
  productoId: string
  nombre: string
  sku: string
  cantidad: number
  precioUnitario: number
  total: number
  imagen?: string
}

export interface Customer {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono?: string
  pedidos: number
  totalGastado: number
  creadoEn: string
}

export interface CustomerSummary {
  id: string
  email: string
  nombre: string
  apellido: string
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  impuestos: number
  envio: number
  descuento: number
  total: number
  moneda: string
  checkoutUrl?: string
}

export interface CartItem {
  id: string
  productoId: string
  varianteId: string
  nombre: string
  sku: string
  cantidad: number
  precioUnitario: number
  total: number
  imagen?: string
}

export interface Promotion {
  id: string
  nombre: string
  codigo: string
  tipo: "percentage" | "fixed" | "free_shipping"
  valor: number
  activo: boolean
  fechaInicio?: string
  fechaFin?: string
}

export interface ShippingZone {
  id: string
  nombre: string
  paises: string[]
  metodos: ShippingMethod[]
}

export interface ShippingMethod {
  id: string
  nombre: string
  tipo: string
  precio: number
  activo: boolean
}

export interface PaymentMethod {
  id: string
  nombre: string
  tipo: string
  activo: boolean
}

// ── Params for list queries ────────────────────────────────────────────

export interface ListParams {
  limit?: number
  page?: number
  sort?: string
  direction?: "asc" | "desc"
}

export interface ProductListParams extends ListParams {
  keyword?: string
  categoryId?: string
  isVisible?: boolean
  isFeatured?: boolean
}

export interface OrderListParams extends ListParams {
  status?: OrderStatus
  minDateCreated?: string
  maxDateCreated?: string
  customerId?: string
}
