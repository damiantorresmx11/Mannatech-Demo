export default function PanelLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-lg bg-slate-200" />
            <div className="h-4 w-40 rounded-full bg-slate-200" />
          </div>
          <div className="h-11 w-72 rounded-xl bg-slate-200" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-200 mb-3" />
              <div className="h-3 w-20 rounded-full bg-slate-200 mb-2" />
              <div className="h-6 w-28 rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>

        {/* Progress bar skeleton */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="space-y-1">
              <div className="h-5 w-48 rounded-lg bg-slate-200" />
              <div className="h-4 w-36 rounded-full bg-slate-200" />
            </div>
            <div className="h-8 w-14 rounded-lg bg-slate-200" />
          </div>
          <div className="h-3 w-full rounded-full bg-slate-200" />
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border p-6"
            >
              <div className="h-5 w-40 rounded-lg bg-slate-200 mb-1" />
              <div className="h-3 w-32 rounded-full bg-slate-200 mb-5" />
              {/* Chart area placeholder */}
              <div className="h-[240px] rounded-xl bg-slate-100 flex items-end justify-around p-4 gap-2">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div
                    key={j}
                    className="bg-slate-200 rounded-t-md flex-1"
                    style={{ height: `${30 + Math.random() * 60}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
