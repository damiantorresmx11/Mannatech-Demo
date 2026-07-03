import { FeaturedProducts } from "@/components/landing/FeaturedProducts"
import { getProductosDestacados } from "@/lib/data"

interface FeaturedProductsBlockProps {
  count?: number
  filterBy?: "featured" | "newest" | "category"
}

export async function FeaturedProductsBlockWrapper({ count = 4 }: FeaturedProductsBlockProps) {
  const productos = getProductosDestacados("mx").slice(0, count)
  return <FeaturedProducts productos={productos} />
}
