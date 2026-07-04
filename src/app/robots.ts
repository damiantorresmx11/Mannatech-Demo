import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mannatech.dmlabs.mx"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/preview", "/api", "/socio", "/cuenta"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
