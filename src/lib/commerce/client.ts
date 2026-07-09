// ── Commerce Client ────────────────────────────────────────────────────
// Re-exports the active commerce adapter.
// Currently: BigCommerce. If the platform changes, swap the imports here.

// Admin operations (CRUD)
export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  setProductMetafield,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  createFulfillment,
  getCustomers,
  getCustomer,
  updateInventory,
  getPromotions,
  getCoupons,
  getShippingZones,
  getPaymentMethods,
} from "./bigcommerce/admin"

// Storefront operations (public catalog, cart, checkout)
export {
  getPublicProducts,
  getProductBySlug,
  searchProducts,
  getFeaturedProducts,
  createCart,
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  getCheckoutUrl,
  getEmbeddedCheckoutUrl,
} from "./bigcommerce/storefront"

// Cache utilities
export { withCache, invalidateCache, invalidateAllCache } from "./cache"

// Check if the commerce backend is configured
export { isConfigured } from "./bigcommerce/client"

// Types
export type * from "./types"
