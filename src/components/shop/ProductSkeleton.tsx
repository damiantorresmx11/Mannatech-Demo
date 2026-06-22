"use client";

function ProductSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Image placeholder */}
      <div className="h-56 bg-slate-200/80" />

      {/* Content placeholder */}
      <div className="p-5 space-y-3">
        {/* Category */}
        <div className="h-3 w-20 rounded-full bg-slate-200/80" />
        {/* Title */}
        <div className="h-4 w-3/4 rounded-full bg-slate-200/80" />
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-slate-200/60" />
          <div className="h-3 w-2/3 rounded-full bg-slate-200/60" />
        </div>
        {/* Price */}
        <div className="h-6 w-24 rounded-full bg-slate-200/80 mt-2" />
        {/* Button */}
        <div className="h-10 w-full rounded-xl bg-slate-200/60 mt-3" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header skeleton */}
      <div className="mb-10 space-y-3">
        <div className="h-8 w-64 rounded-lg bg-slate-200/80" />
        <div className="h-4 w-40 rounded-full bg-slate-200/60" />
      </div>

      {/* Filter skeletons */}
      <div className="mb-8 space-y-4">
        <div className="h-12 w-full max-w-md rounded-xl bg-slate-200/60" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-20 rounded-full bg-slate-200/60"
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { ProductSkeleton };
