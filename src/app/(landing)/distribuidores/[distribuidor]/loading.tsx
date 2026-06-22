export default function DistributorLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero skeleton */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 animate-pulse">
            {/* Photo skeleton */}
            <div className="flex-shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-slate-200" />
              <div className="mt-3 flex justify-center">
                <div className="h-6 w-24 rounded-full bg-slate-200" />
              </div>
            </div>

            {/* Info skeleton */}
            <div className="flex-1 space-y-4 w-full">
              <div className="h-9 w-64 rounded-lg bg-slate-200 mx-auto sm:mx-0" />
              <div className="h-4 w-40 rounded-full bg-slate-200 mx-auto sm:mx-0" />
              <div className="space-y-2 max-w-xl mx-auto sm:mx-0">
                <div className="h-4 w-full rounded-full bg-slate-200" />
                <div className="h-4 w-3/4 rounded-full bg-slate-200" />
              </div>
              <div className="flex gap-3 justify-center sm:justify-start">
                <div className="h-12 w-52 rounded-xl bg-slate-200" />
                <div className="h-12 w-36 rounded-xl bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products skeleton */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-6 w-56 rounded-lg bg-slate-200 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border overflow-hidden bg-white"
            >
              <div className="h-44 bg-slate-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded-full bg-slate-200" />
                <div className="h-5 w-20 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
