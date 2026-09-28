export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-label="Loading products" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ border: "1px solid rgba(123,103,82,0.15)", background: "rgba(255,255,255,0.5)" }}>
          <div className="aspect-[3/4]" style={{ background: "linear-gradient(135deg, #EAE1D3, #F5F1E8)" }} />
          <div className="p-4 space-y-2">
            <div className="h-4 rounded" style={{ background: "#EAE1D3" }} />
            <div className="h-3 w-2/3 rounded" style={{ background: "#EAE1D3" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-pulse" aria-label="Loading product" aria-busy="true">
      <div className="aspect-[3/4] rounded-2xl" style={{ background: "linear-gradient(135deg, #EAE1D3, #F5F1E8)" }} />
      <div className="space-y-4">
        <div className="h-8 w-3/4 rounded" style={{ background: "#EAE1D3" }} />
        <div className="h-4 w-1/3 rounded" style={{ background: "#EAE1D3" }} />
        <div className="h-4 w-full rounded" style={{ background: "#EAE1D3" }} />
        <div className="h-4 w-full rounded" style={{ background: "#EAE1D3" }} />
        <div className="h-12 w-48 rounded-xl" style={{ background: "#EAE1D3" }} />
      </div>
    </div>
  );
}
