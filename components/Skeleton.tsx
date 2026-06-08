export function ProductCardSkeleton({ compact = false }: { compact?: boolean } = {}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
      <div className="aspect-[3/4] animate-pulse bg-white/[0.07]" />
      <div className={compact ? "space-y-2 p-3.5" : "space-y-3 p-4"}>
        <div className={`h-3 animate-pulse rounded-full bg-white/[0.08] ${compact ? "w-20" : "w-24"}`} />
        <div className={`animate-pulse rounded-full bg-white/[0.08] ${compact ? "h-[18px] w-2/3" : "h-5 w-3/4"}`} />
        <div className={`animate-pulse rounded-full bg-white/[0.08] ${compact ? "h-[18px] w-1/2" : "h-5 w-1/2"}`} />
        <div className={`${compact ? "h-10" : "h-11"} w-full animate-pulse rounded-full bg-white/[0.08]`} />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="h-16 w-14 animate-pulse rounded-xl bg-white/[0.08]" />
      <div className="flex-1 space-y-3">
        <div className="h-3 w-20 animate-pulse rounded-full bg-white/[0.08]" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/[0.08]" />
        <div className="h-3 w-32 animate-pulse rounded-full bg-white/[0.08]" />
      </div>
    </div>
  );
}
