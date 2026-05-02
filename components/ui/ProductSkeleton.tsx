"use client";

export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035]"
        >
          <div className="aspect-[4/5] animate-pulse bg-white/[0.06]" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-20 animate-pulse rounded-full bg-white/[0.07]" />
            <div className="h-5 w-4/5 animate-pulse rounded-full bg-white/[0.08]" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/[0.06]" />
            <div className="flex justify-between pt-3">
              <div className="h-4 w-24 animate-pulse rounded-full bg-white/[0.07]" />
              <div className="h-4 w-16 animate-pulse rounded-full bg-white/[0.07]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
