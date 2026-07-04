import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mannatech Mexico",
    short_name: "Mannatech",
    description: "Productos de bienestar y nutricion basados en ciencia real. Mannatech Mexico.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    theme_color: "#2A7B3D",
    background_color: "#ffffff",
    categories: ["health", "shopping", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
