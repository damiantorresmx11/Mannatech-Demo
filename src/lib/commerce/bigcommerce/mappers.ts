// ── BigCommerce → Internal Type Mappers ────────────────────────────────
// All BC-specific schema knowledge lives here. The rest of the app
// only sees our generic types from commerce/types.ts.

import type {
  Product,
  Variant,
  Order,
  OrderStatus,
  LineItem,
  Customer,
  Cart,
  CartItem,
  Promotion,
  ShippingZone,
  ShippingMethod,
  PaymentMethod,
} from "../types"

// ── BigCommerce raw types (partial, what we actually use) ──────────────

interface BCProduct {
  id: number
  name: string
  sku: string
  price: number
  sale_price?: number
  calculated_price?: number
  description: string
  is_visible: boolean
  is_featured: boolean
  custom_url?: { url: string }
  primary_image?: { url_zoom: string; url_standard: string }
  images?: { url_zoom: string; url_standard: string; is_thumbnail: boolean }[]
  categories?: number[]
  variants?: BCVariant[]
  inventory_level: number
  inventory_tracking: string
  availability: string
  custom_fields?: { name: string; value: string }[]
  meta_keywords?: string[]
  date_created: string
  date_modified: string
}

interface BCVariant {
  id: number
  product_id: number
  sku: string
  price?: number
  sale_price?: number
  calculated_price?: number
  inventory_level: number
  image_url?: string
  option_values?: { option_display_name: string; label: string }[]
}

interface BCMetafield {
  key: string
  value: string
  namespace: string
}

interface BCOrder {
  id: number
  status_id: number
  status: string
  subtotal_ex_tax: string
  subtotal_tax: string
  total_inc_tax: string
  total_tax: string
  shipping_cost_inc_tax: string
  discount_amount: string
  currency_code: string
  billing_address: { first_name: string; last_name: string; email: string }
  date_created: string
  date_modified: string
  products?: { url: string }
  items_total: number
  customer_id: number
}

interface BCOrderProduct {
  id: number
  product_id: number
  name: string
  sku: string
  quantity: number
  base_price: string
  total_inc_tax: string
  image_url?: string
}

interface BCCustomer {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  date_created: string
  orders_count?: number
  total_spent?: string
}

interface BCCartData {
  id: string
  line_items: {
    physical_items: BCCartLineItem[]
    digital_items: BCCartLineItem[]
  }
  base_amount: number
  tax_included: number
  discount_amount: number
  cart_amount: number
  currency: { code: string }
  redirect_urls?: {
    checkout_url: string
    cart_url: string
  }
}

interface BCCartLineItem {
  id: string
  product_id: number
  variant_id: number
  name: string
  sku: string
  quantity: number
  list_price: number
  sale_price: number
  extended_sale_price: number
  image_url?: string
}

// ── Status mapping ────────────────────────────────────────────────────

const BC_STATUS_MAP: Record<number, OrderStatus> = {
  0: "pending",       // Incomplete
  1: "pending",       // Pending
  2: "shipped",       // Shipped
  3: "processing",    // Partially Shipped
  4: "refunded",      // Refunded
  5: "cancelled",     // Cancelled
  6: "cancelled",     // Declined
  7: "processing",    // Awaiting Payment
  8: "processing",    // Awaiting Pickup
  9: "processing",    // Awaiting Shipment
  10: "completed",    // Completed
  11: "processing",   // Awaiting Fulfillment
  12: "processing",   // Manual Verification Required
  13: "processing",   // Disputed
  14: "refunded",     // Partially Refunded
}

// ── Product mappers ───────────────────────────────────────────────────

function getCustomField(fields: BCProduct["custom_fields"], name: string): string | undefined {
  return fields?.find((f) => f.name.toLowerCase() === name.toLowerCase())?.value
}

function parseJsonField<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function mapBCProduct(bc: BCProduct, metafields?: BCMetafield[], categoryNames?: Map<number, string>): Product {
  const slug = bc.custom_url?.url?.replace(/\//g, "") || String(bc.id)
  const mainImage = bc.primary_image?.url_zoom || bc.primary_image?.url_standard || ""
  const allImages = bc.images?.map((img) => img.url_zoom || img.url_standard) || []

  // Custom fields for extended product data
  const beneficiosRaw = getCustomField(bc.custom_fields, "beneficios")
  const ingredientes = getCustomField(bc.custom_fields, "ingredientes") || ""
  const badge = getCustomField(bc.custom_fields, "badge") || null
  const modoUso = getCustomField(bc.custom_fields, "modo_uso")
  const presentacion = getCustomField(bc.custom_fields, "presentacion") || ""
  const destacado = bc.is_featured || getCustomField(bc.custom_fields, "destacado") === "true"

  // Also check metafields if provided
  const meta = metafields?.reduce((acc, m) => ({ ...acc, [m.key]: m.value }), {} as Record<string, string>) || {}

  const catName = bc.categories?.[0] && categoryNames?.get(bc.categories[0])

  return {
    id: String(bc.id),
    slug,
    nombre: bc.name,
    sku: bc.sku || "",
    categoria: catName || meta.categoria || "General",
    precio: bc.calculated_price ?? bc.sale_price ?? bc.price,
    precioComparacion: bc.sale_price && bc.sale_price < bc.price ? bc.price : undefined,
    presentacion: presentacion || meta.presentacion || "",
    descripcionCorta: bc.description?.slice(0, 120).replace(/<[^>]*>/g, "") || "",
    descripcionLarga: bc.description || "",
    beneficios: parseJsonField<string[]>(beneficiosRaw || meta.beneficios, []),
    ingredientes: ingredientes || meta.ingredientes || "",
    imagen: mainImage,
    imagenes: allImages.length > 0 ? allImages : mainImage ? [mainImage] : [],
    destacado,
    badge: badge || meta.badge || null,
    modoUso: modoUso || meta.modo_uso,
    variantes: bc.variants?.map(mapBCVariant) || [],
    inventario: bc.inventory_level,
    estado: bc.is_visible ? "active" : "draft",
    metadata: { ...meta },
  }
}

function mapBCVariant(v: BCVariant): Variant {
  const opciones: Record<string, string> = {}
  v.option_values?.forEach((ov) => {
    opciones[ov.option_display_name] = ov.label
  })

  return {
    id: String(v.id),
    titulo: v.option_values?.map((ov) => ov.label).join(" / ") || String(v.id),
    sku: v.sku || "",
    precio: v.calculated_price ?? v.sale_price ?? v.price ?? 0,
    precioComparacion: v.sale_price && v.price && v.sale_price < v.price ? v.price : undefined,
    inventario: v.inventory_level,
    imagen: v.image_url,
    opciones,
  }
}

// ── Order mappers ─────────────────────────────────────────────────────

export function mapBCOrder(bc: BCOrder, lineItems?: BCOrderProduct[]): Order {
  const estado = BC_STATUS_MAP[bc.status_id] || "processing"

  return {
    id: String(bc.id),
    numero: String(bc.id),
    estado,
    estadoTexto: bc.status,
    total: parseFloat(bc.total_inc_tax),
    subtotal: parseFloat(bc.subtotal_ex_tax),
    impuestos: parseFloat(bc.total_tax),
    envio: parseFloat(bc.shipping_cost_inc_tax),
    descuento: parseFloat(bc.discount_amount),
    moneda: bc.currency_code || "MXN",
    cliente: {
      id: String(bc.customer_id),
      email: bc.billing_address?.email || "",
      nombre: bc.billing_address?.first_name || "",
      apellido: bc.billing_address?.last_name || "",
    },
    items: lineItems?.map(mapBCOrderProduct) || [],
    creadoEn: bc.date_created,
    actualizadoEn: bc.date_modified,
  }
}

function mapBCOrderProduct(item: BCOrderProduct): LineItem {
  return {
    id: String(item.id),
    productoId: String(item.product_id),
    nombre: item.name,
    sku: item.sku || "",
    cantidad: item.quantity,
    precioUnitario: parseFloat(item.base_price),
    total: parseFloat(item.total_inc_tax),
    imagen: item.image_url,
  }
}

// ── Customer mappers ──────────────────────────────────────────────────

export function mapBCCustomer(bc: BCCustomer): Customer {
  return {
    id: String(bc.id),
    email: bc.email,
    nombre: bc.first_name,
    apellido: bc.last_name,
    telefono: bc.phone,
    pedidos: bc.orders_count || 0,
    totalGastado: parseFloat(bc.total_spent || "0"),
    creadoEn: bc.date_created,
  }
}

// ── Cart mappers ──────────────────────────────────────────────────────

export function mapBCCart(bc: BCCartData): Cart {
  const physicalItems = bc.line_items?.physical_items || []
  const digitalItems = bc.line_items?.digital_items || []
  const allItems = [...physicalItems, ...digitalItems]

  return {
    id: bc.id,
    items: allItems.map(mapBCCartItem),
    subtotal: bc.base_amount,
    impuestos: bc.tax_included,
    envio: 0, // Calculated at checkout
    descuento: bc.discount_amount,
    total: bc.cart_amount,
    moneda: bc.currency?.code || "MXN",
    checkoutUrl: bc.redirect_urls?.checkout_url,
  }
}

function mapBCCartItem(item: BCCartLineItem): CartItem {
  return {
    id: item.id,
    productoId: String(item.product_id),
    varianteId: String(item.variant_id),
    nombre: item.name,
    sku: item.sku || "",
    cantidad: item.quantity,
    precioUnitario: item.sale_price || item.list_price,
    total: item.extended_sale_price,
    imagen: item.image_url,
  }
}

// ── Promotion / Shipping / Payment mappers ────────────────────────────

export function mapBCPromotion(bc: any): Promotion {
  return {
    id: String(bc.id),
    nombre: bc.name || "",
    codigo: bc.code || bc.coupon_code || "",
    tipo: bc.type === "percentage_discount" ? "percentage"
      : bc.type === "free_shipping" ? "free_shipping"
      : "fixed",
    valor: bc.amount || bc.discount?.fixed_amount || bc.discount?.percentage_amount || 0,
    activo: bc.enabled ?? (bc.status === "active" || true),
    fechaInicio: bc.start_date,
    fechaFin: bc.end_date || bc.expiration_date,
  }
}

export function mapBCShippingZone(zone: any, methods: any[]): ShippingZone {
  return {
    id: String(zone.id),
    nombre: zone.name,
    paises: zone.locations?.map((l: any) => l.country_iso2) || [],
    metodos: methods.map(mapBCShippingMethod),
  }
}

function mapBCShippingMethod(m: any): ShippingMethod {
  return {
    id: String(m.id),
    nombre: m.name,
    tipo: m.type || "flat_rate",
    precio: m.settings?.rate ?? m.fixed_surcharge ?? 0,
    activo: m.enabled ?? true,
  }
}

export function mapBCPaymentMethod(m: any): PaymentMethod {
  return {
    id: String(m.code || m.id),
    nombre: m.name || m.display_name || "",
    tipo: m.type || m.provider || "unknown",
    activo: m.enabled ?? (m.status === "active" || true),
  }
}
