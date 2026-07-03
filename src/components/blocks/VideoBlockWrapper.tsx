interface VideoBlockProps {
  url: string
  poster?: { url: string }
  autoplay?: boolean
}

export function VideoBlockWrapper({ url, poster, autoplay }: VideoBlockProps) {
  if (!url) return null

  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be")
  const youtubeId = isYoutube
    ? url.match(/(?:youtu\.be\/|v=)([^&]+)/)?.[1]
    : null

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {youtubeId ? (
          <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}${autoplay ? "?autoplay=1" : ""}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video
            src={url}
            poster={poster?.url}
            autoPlay={autoplay}
            controls
            className="w-full rounded-xl"
          />
        )}
      </div>
    </section>
  )
}
