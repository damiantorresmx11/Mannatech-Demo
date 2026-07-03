interface ImageBlockProps {
  image: { url: string; alt?: string }
  caption?: string
  size?: "full" | "medium" | "small"
}

const SIZES: Record<string, string> = {
  full: "max-w-6xl",
  medium: "max-w-3xl",
  small: "max-w-xl",
}

export function ImageBlockWrapper({ image, caption, size = "full" }: ImageBlockProps) {
  if (!image?.url) return null

  return (
    <figure className={`${SIZES[size] || SIZES.full} mx-auto px-4 py-8`}>
      <img
        src={image.url}
        alt={image.alt || ""}
        className="w-full rounded-xl"
      />
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
